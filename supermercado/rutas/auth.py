from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from supermercado.db import conectar
from werkzeug.security import generate_password_hash, check_password_hash  

auth_bp = Blueprint('auth', __name__)

# Registro
@auth_bp.route('/registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        nombre = request.form.get('usuario')  # coincide con HTML
        email = request.form.get('email')
        password = request.form.get('contraseña')

        if not nombre or not email or not password:
            flash("Por favor completa todos los campos.")
            return redirect(url_for('auth.registro'))

        db = conectar()
        cursor = db.cursor()

        # Verificar si el usuario ya existe
        cursor.execute("SELECT * FROM usuarios WHERE nombre = %s", (nombre,))
        if cursor.fetchone():
            flash("El usuario ya existe.")
            return redirect(url_for('auth.registro'))

        hash_pass = generate_password_hash(password)

        # Insertar en la base de datos con rol por defecto 'usuario' y fecha actual
        cursor.execute(
            "INSERT INTO usuarios (nombre, email, password, rol, fecha_registro) VALUES (%s, %s, %s, %s, NOW())",
            (nombre, email, hash_pass, 'usuario')
        )
        db.commit()
        flash("Usuario registrado correctamente. Ya puedes iniciar sesión.")
        return redirect(url_for('auth.login'))

    return render_template('registro.html')

# Login
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form.get('usuario')  # o email si prefieres login con email
        contraseña = request.form.get('contraseña')

        if not usuario or not contraseña:
            flash("Por favor completa todos los campos.")
            return redirect(url_for('auth.login'))

        db = conectar()
        cursor = db.cursor()

        cursor.execute("SELECT id_usuario, usuario, contraseña FROM usuarios WHERE usuario = %s", (usuario,))
        user = cursor.fetchone()

        if user and check_password_hash(user[2], contraseña):
            session['usuario_id'] = user[0]
            session['usuario'] = user[1]
            flash("Inicio de sesión exitoso.")
            return redirect(url_for('productos.mostrar_categorias'))
        else:
            flash("Usuario o contraseña incorrectos.")
            return redirect(url_for('auth.login'))

    return render_template('login.html')

# Logout
@auth_bp.route('/logout')
def logout():
    session.clear()
    flash("Has cerrado sesión.")
    return redirect(url_for('auth.login'))
