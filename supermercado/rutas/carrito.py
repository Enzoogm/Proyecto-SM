from flask import Blueprint, jsonify, request, session

carrito_bp = Blueprint('carrito', __name__, url_prefix='/carrito')

# Inicializar sesión para carrito
@carrito_bp.before_request
def before_request():
    if 'carrito' not in session:
        session['carrito'] = {}

@carrito_bp.route('/')
def mostrar_carrito():
    carrito = session.get('carrito', {})
    return jsonify(carrito)

@carrito_bp.route('/agregar/<int:id_producto>', methods=['POST'])
def agregar_producto(id_producto):
    cantidad = int(request.json.get('cantidad', 1))  # <-- ahora espera JSON
    carrito = session.get('carrito', {})

    if str(id_producto) in carrito:
        carrito[str(id_producto)] += cantidad
    else:
        carrito[str(id_producto)] = cantidad

    session['carrito'] = carrito
    return jsonify(carrito)

@carrito_bp.route('/eliminar/<int:id_producto>', methods=['POST'])
def eliminar_producto(id_producto):
    carrito = session.get('carrito', {})
    carrito.pop(str(id_producto), None)
    session['carrito'] = carrito
    return jsonify(carrito)

@carrito_bp.route('/vaciar', methods=['POST'])
def vaciar_carrito():
    session['carrito'] = {}
    return jsonify(session['carrito'])
