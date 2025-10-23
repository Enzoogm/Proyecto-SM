# supermercado/rutas/auth.py
import os
import datetime as dt
import jwt
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify, make_response, current_app, g
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from supermercado.db import conectar

load_dotenv()

auth_bp = Blueprint("auth", __name__)

# --- Config JWT
def _secret():
    # usa SECRET_KEY de Flask si no hay var dedicada
    return os.getenv("SECRET_KEY_SUPER") or current_app.config.get("SECRET_KEY") or "dev-secret"

JWT_EXP_SECONDS = int(os.getenv("JWT_EXP_SECONDS", "3600"))  # 1 hora

def _gen_token(user_id: int) -> str:
    payload = {
        "sub": int(user_id),
        "iat": dt.datetime.utcnow(),
        "exp": dt.datetime.utcnow() + dt.timedelta(seconds=JWT_EXP_SECONDS),
    }
    token = jwt.encode(payload, _secret(), algorithm="HS256")
    if isinstance(token, bytes):
        token = token.decode()
    return token

def require_jwt(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        token = request.cookies.get("access_token")
        if not token:
            # fallback header Authorization: Bearer xxx (opcional)
            auth = request.headers.get("Authorization", "")
            if auth.startswith("Bearer "):
                token = auth.split(" ", 1)[1]
        if not token:
            return jsonify({"error": "token requerido"}), 401
        try:
            payload = jwt.decode(token, _secret(), algorithms=["HS256"])
            g.user_id = int(payload.get("sub"))
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "token expirado"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "token inválido"}), 401
        return fn(*args, **kwargs)
    return wrapper

# -------------------
# REGISTRO (crea usuario y loguea con cookie httpOnly)
# -------------------
@auth_bp.post("/registro")
def registro():
    data = request.get_json() or {}
    nombre = (data.get("nombre") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password")

    if not nombre or not email or not password:
        return jsonify({"error": "Faltan datos"}), 400

    db = conectar()
    cur = db.cursor()
    try:
        cur.execute("SELECT 1 FROM Usuarios WHERE email=%s", (email,))
        if cur.fetchone():
            return jsonify({"error": "Email ya registrado"}), 409

        hashed = generate_password_hash(password)
        # siempre rol 'cliente' al registrarse
        cur.execute("""
            INSERT INTO Usuarios (nombre, email, password, rol)
            VALUES (%s, %s, %s, %s)
        """, (nombre, email, hashed, "cliente"))
        db.commit()
        user_id = cur.lastrowid

        token = _gen_token(user_id)
        resp = make_response(jsonify({"ok": True}))
        resp.set_cookie(
            "access_token",
            token,
            httponly=True,
            samesite="Lax",
            secure=False,  # en prod => True (HTTPS)
            max_age=JWT_EXP_SECONDS,
        )
        return resp, 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        db.close()

# -------------------
# LOGIN (setea cookie httpOnly)
# -------------------
@auth_bp.post("/login")
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Faltan datos"}), 400

    db = conectar()
    cur = db.cursor(dictionary=True)
    try:
        cur.execute("SELECT * FROM Usuarios WHERE email=%s", (email,))
        u = cur.fetchone()
    finally:
        cur.close()
        db.close()

    if not u or not check_password_hash(u["password"], password):
        return jsonify({"error": "Email o contraseña incorrectos"}), 401

    token = _gen_token(int(u["id_usuario"]))
    resp = make_response(jsonify({"ok": True}))
    resp.set_cookie(
        "access_token",
        token,
        httponly=True,
        samesite="Lax",
        secure=False,  # prod => True
        max_age=JWT_EXP_SECONDS,
    )
    return resp, 200

# -------------------
# ME (devuelve lo mínimo, sin filtrar info sensible)
# -------------------
@auth_bp.get("/me")
@require_jwt
def me():
    # devolvé lo mínimo necesario para la UI
    db = conectar()
    cur = db.cursor(dictionary=True)
    try:
        cur.execute("SELECT id_usuario, nombre, rol FROM Usuarios WHERE id_usuario=%s", (g.user_id,))
        u = cur.fetchone()
        if not u:
            return jsonify({"error": "usuario no encontrado"}), 404

        # Si querés NO exponer nombre/rol, devolvé solo flags/permiso:
        # return jsonify({"id": u["id_usuario"], "canAccessAdmin": u["rol"] == "admin"}), 200

        # Versión mixta: id + permiso (sin email)
        return jsonify({
            "id": u["id_usuario"],
            "nombre": u["nombre"],                # quitalo si NO lo querés en el cliente
            "canAccessAdmin": u["rol"] == "admin" # flag en vez de 'rol'
        }), 200
    finally:
        cur.close()
        db.close()

# -------------------
# LOGOUT (borra cookie)
# -------------------
@auth_bp.post("/logout")
def logout():
    resp = make_response(jsonify({"ok": True}))
    resp.set_cookie("access_token", "", expires=0)
    return resp, 200
