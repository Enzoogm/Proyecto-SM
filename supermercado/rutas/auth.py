from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from supermercado.db import conectar

auth_bp = Blueprint('auth', __name__)

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
        cursor.execute("""
            INSERT INTO Usuarios (nombre, email, password)
            VALUES (%s, %s, %s)
        """, (nombre, email, hashed_password))
        db.commit()
        return jsonify({'message': 'Registro exitoso'}), 201
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        db.close()

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
        # Aquí puedes usar JWT o session, según prefieras
        # Para ejemplo simple, devolvemos info usuario
        return jsonify({'message': 'Login exitoso', 'usuario': {'id': usuario['id_usuario'], 'nombre': usuario['nombre']}})
    else:
        return jsonify({'error': 'Email o contraseña incorrectos'}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    # Si usas session, aquí la limpiarías
    # Si usas JWT, el frontend solo elimina el token
    return jsonify({'message': 'Logout exitoso'})