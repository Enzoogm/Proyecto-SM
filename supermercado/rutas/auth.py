import os
import datetime as dt
import jwt
from flask import Blueprint, request, jsonify, make_response, current_app, g, session
from werkzeug.security import generate_password_hash, check_password_hash
from supermercado.db import conectar

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

JWT_EXP_SECONDS = int(os.getenv("JWT_EXP_SECONDS", "3600"))  # 1 hora

def _secret():
  return (
    os.getenv("SECRET_KEY_SUPER")
    or current_app.config.get("SECRET_KEY_SUPER")
    or current_app.config.get("SECRET_KEY")
    or "dev-secret"
  )

def _gen_token(user_id):
  payload = {
    "sub": str(user_id),
    "iat": dt.datetime.utcnow(),
    "exp": dt.datetime.utcnow() + dt.timedelta(seconds=JWT_EXP_SECONDS),
  }
  token = jwt.encode(payload, _secret(), algorithm="HS256")
  return token

def require_jwt(fn):
  from functools import wraps
  @wraps(fn)
  def wrapper(*args, **kwargs):
    auth = request.headers.get("Authorization", "")
    token = None
    if auth.startswith("Bearer "):
      token = auth.split(" ", 1)[1]
    if not token:
      token = request.cookies.get("access_token")
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

# Decorador para requerir usuario admin
def admin_required(fn):
  from functools import wraps
  @require_jwt
  @wraps(fn)
  def wrapper(*args, **kwargs):
    user = _get_user_from_session()
    if not user:
      return jsonify({"error": "No autenticado"}), 401
    if user.get("rol") != "admin":
      return jsonify({"error": "Solo para administradores"}), 403
    return fn(*args, **kwargs)
  return wrapper

def _get_user_from_session():
  user_id = getattr(g, "user_id", None)
  if not user_id:
    return None
  db = conectar()
  cur = db.cursor(dictionary=True)
  cur.execute("SELECT id_usuario, nombre, email, rol FROM Usuarios WHERE id_usuario=%s", (user_id,))
  user = cur.fetchone()
  cur.close()
  db.close()
  return user

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
    cur.execute("""
      INSERT INTO Usuarios (nombre, email, password, rol)
      VALUES (%s, %s, %s, %s)
    """, (nombre, email, hashed, "cliente"))
    db.commit()
    user_id = cur.lastrowid
    token = _gen_token(user_id)
    resp = make_response(jsonify({"ok": True, "token": token}))
    resp.set_cookie(
      "access_token",
      token,
      httponly=True,
      samesite="Lax",
      secure=False,
      max_age=JWT_EXP_SECONDS,
      path="/",
    )
    return resp, 201
  except Exception as e:
    db.rollback()
    return jsonify({"error": str(e)}), 400
  finally:
    cur.close()
    db.close()

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
  resp = make_response(jsonify({"ok": True, "token": token}))
  resp.set_cookie(
    "access_token",
    token,
    httponly=True,
    samesite="Lax",
    secure=False,
    max_age=JWT_EXP_SECONDS,
    path="/",
  )
  return resp, 200

@auth_bp.get("/me")
@require_jwt
def me():
  user = _get_user_from_session()
  return jsonify({"user": user}), 200

@auth_bp.post("/logout")
def logout():
  resp = make_response(jsonify({"ok": True}))
  resp.set_cookie("access_token", "", expires=0, path="/")
  return resp, 200