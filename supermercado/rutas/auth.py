from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from supermercado.db import conectar  

auth_bp = Blueprint('auth', __name__)

# Página de registro
@auth_bp.route('/registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        usuario = request.form['usuario']
        contraseña = request.form['contraseña']
        db = conectar()
        cursor = db.cursor()
        # Verificar si el usuario ya existe
        cursor.execute("SELECT * FROM usuarios WHERE usuario = %s", (usuario,))
        if cursor.fetchone():
            flash("El usuario ya existe.")
            return redirect(url_for('auth.registro'))
        # Insertar nuevo usuario
        cursor.execute("INSERT INTO usuarios (usuario, contraseña) VALUES (%s, %s)", (usuario, contraseña))
        db.commit()
        flash("Usuario registrado correctamente. Ya puedes iniciar sesión.")
        return redirect(url_for('auth.login'))
    return render_template('registro.html')

# Página de login
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form['usuario']
        contraseña = request.form['contraseña']
        db = conectar()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM usuarios WHERE usuario = %s AND contraseña = %s", (usuario, contraseña))
        user = cursor.fetchone()
        if user:
            session['usuario'] = usuario
            flash("Inicio de sesión exitoso.")
            return redirect(url_for('productos.mostrar_productos'))  # O la página del carrito
        else:
            flash("Usuario o contraseña incorrectos.")
            return redirect(url_for('auth.login'))
    return render_template('login.html')

# Logout
@auth_bp.route('/logout')
def logout():
    session.pop('usuario', None)
    flash("Has cerrado sesión.")
    return redirect(url_for('auth.login'))
