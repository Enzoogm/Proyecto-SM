from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from supermercado.db import conectar

auth_bp = Blueprint('auth', __name__)

# -------------------
# REGISTRO
# -------------------
@auth_bp.route('/registro', methods=['POST'])
def registro():
    data = request.get_json()
    nombre = data.get('nombre')
    email = data.get('email')
    password = data.get('password')

    if not nombre or not email or not password:
        return jsonify({'error': 'Faltan datos'}), 400

    db = conectar()
    cursor = db.cursor()

    hashed_password = generate_password_hash(password)

    try:
        # 👇 siempre asigna rol cliente al registrarse
        cursor.execute("""
            INSERT INTO Usuarios (nombre, email, password, rol)
            VALUES (%s, %s, %s, %s)
        """, (nombre, email, hashed_password, "cliente"))
        db.commit()
        user_id = cursor.lastrowid

        return jsonify({
            'message': 'Registro exitoso',
            'usuario': {
                'id': user_id,
                'nombre': nombre,
                'email': email,
                'rol': "cliente"
            }
        }), 201
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        db.close()

# -------------------
# LOGIN
# -------------------
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Faltan datos'}), 400

    db = conectar()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM Usuarios WHERE email = %s", (email,))
    usuario = cursor.fetchone()

    cursor.close()
    db.close()

    if usuario and check_password_hash(usuario['password'], password):
        return jsonify({
            'message': 'Login exitoso',
            'usuario': {
                'id': usuario['id_usuario'],
                'nombre': usuario['nombre'],
                'email': usuario['email'],
                'rol': usuario['rol']  # 👈 devolvemos el rol que tiene en la DB
            }
        }), 200
    else:
        return jsonify({'error': 'Email o contraseña incorrectos'}), 401

# -------------------
# LOGOUT
# -------------------
@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Logout exitoso'})
