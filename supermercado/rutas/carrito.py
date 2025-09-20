from flask import Blueprint, render_template, request, redirect, session

carrito_bp = Blueprint('carrito', __name__, url_prefix='/carrito')

# Inicializar sesión para carrito (asegúrate de configurar secret_key en app principal)
@carrito_bp.before_request
def before_request():
    if 'carrito' not in session:
        session['carrito'] = {}

@carrito_bp.route('/')
def mostrar_carrito():
    carrito = session.get('carrito', {})
    return render_template('carrito.jsx', carrito=carrito)

@carrito_bp.route('/agregar/<int:id_producto>', methods=['POST'])
def agregar_producto(id_producto):
    cantidad = int(request.form.get('cantidad', 1))
    carrito = session.get('carrito', {})

    if str(id_producto) in carrito:
        carrito[str(id_producto)] += cantidad
    else:
        carrito[str(id_producto)] = cantidad

    session['carrito'] = carrito
    return redirect('/carrito')

@carrito_bp.route('/eliminar/<int:id_producto>', methods=['POST'])
def eliminar_producto(id_producto):
    carrito = session.get('carrito', {})
    carrito.pop(str(id_producto), None)
    session['carrito'] = carrito
    return redirect('/carrito')

@carrito_bp.route('/vaciar', methods=['POST'])
def vaciar_carrito():
    session['carrito'] = {}
    return redirect('/carrito')
