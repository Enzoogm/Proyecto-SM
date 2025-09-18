from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from flask import Blueprint, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from supermercado.db import conectar   # tu función de conexión a MySQL

auth_bp = Blueprint('auth', __name__)
# -------------------
# REGISTRO
# -------------------
@auth_bp.route('/registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        nombre = request.form['nombre']
        email = request.form['email']
        password = request.form['password']

        db = conectar()
        cursor = db.cursor()

        hashed_password = generate_password_hash(password)

        try:
            cursor.execute("""
                INSERT INTO Usuarios (nombre, email, password)
                VALUES (%s, %s, %s)
            """, (nombre, email, hashed_password))
            db.commit()
            flash('Registro exitoso. Ahora puedes iniciar sesión.', 'success')
            return redirect(url_for('auth.login'))
        except Exception as e:
            db.rollback()
            flash(f'Error: {e}', 'danger')
        finally:
            cursor.close()
            db.close()

    return render_template('registro.html')


# -------------------
# LOGIN
# -------------------
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        db = conectar()
        cursor = db.cursor(dictionary=True)

        cursor.execute("SELECT * FROM Usuarios WHERE email = %s", (email,))
        usuario = cursor.fetchone()

        cursor.close()
        db.close()

        if usuario and check_password_hash(usuario['password'], password):
            session['usuario_id'] = usuario['id_usuario']
            session['usuario_nombre'] = usuario['nombre']
            flash('Bienvenido ' + usuario['nombre'], 'success')
            return redirect(url_for('index'))  # redirige al inicio
        else:
            flash('Email o contraseña incorrectos', 'danger')

    return render_template('login.html')


# -------------------
# LOGOUT
# -------------------
@auth_bp.route('/logout')
def logout():
    session.clear()
    flash('Sesión cerrada correctamente.', 'info')
    return redirect(url_for('auth.login'))

