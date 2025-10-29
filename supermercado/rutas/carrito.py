# supermercado/rutas/carrito.py
from flask import Blueprint, jsonify, request, session
# Importá el módulo (no la función) para que el mock funcione cuando lo uses
import supermercado.rutas.productos as productos_rutas

carrito_bp = Blueprint("carrito", __name__)

# ========================= Helpers =========================

def _ensure_cart():
    """Asegura que exista un dict 'carrito' en la sesión."""
    if "carrito" not in session or not isinstance(session["carrito"], dict):
        session["carrito"] = {}

def _as_int(v, default=0):
    try:
        return int(v)
    except (TypeError, ValueError):
        return default

@carrito_bp.before_app_request
def _before_any_request():
    # Garantiza que siempre tengamos el carrito en sesión
    _ensure_cart()

# ========================= Rutas ===========================

# GET /api/carrito  y  GET /api/carrito/
@carrito_bp.route("", methods=["GET"])
@carrito_bp.route("/", methods=["GET"])
def ver_carrito():
    """Devuelve el carrito completo (dict {id_producto: cantidad})."""
    return jsonify(session.get("carrito", {})), 200

# POST /api/carrito  y  POST /api/carrito/
@carrito_bp.route("", methods=["POST"])
@carrito_bp.route("/", methods=["POST"])
def agregar_al_carrito():
    """
    Agrega al carrito.
    JSON: { "id_producto": int (>0), "cantidad": int (>=1) }

    Respuestas:
      - 400 si id inválido o stock <= 0
      - 404 si el producto no existe
      - 200 si OK (devuelve el carrito actualizado)
    """
    data = request.get_json(silent=True) or {}
    id_producto = _as_int(data.get("id_producto"))
    cantidad = max(1, _as_int(data.get("cantidad"), 1))

    if id_producto <= 0:
        return jsonify({"error": "id_producto es requerido"}), 400

    # Consultar producto real (o mockeado en tests) desde el módulo
    prod = productos_rutas.obtener_producto(id_producto)
    if not prod:
        return jsonify({"error": "Producto no encontrado"}), 404

    if _as_int(prod.get("stock")) <= 0:
        return jsonify({"error": "Sin stock"}), 400

    carrito = session.get("carrito", {})
    key = str(id_producto)
    carrito[key] = carrito.get(key, 0) + cantidad
    session["carrito"] = carrito

    return jsonify(carrito), 200

# POST /api/carrito/cantidad
@carrito_bp.route("/cantidad", methods=["POST"])
def actualizar_cantidad():
    """
    Actualiza la cantidad exacta de un producto.
    JSON: { "id_producto": int, "cantidad": int (>=0) }
      - cantidad == 0 => elimina el producto.
    """
    data = request.get_json(silent=True) or {}
    id_producto = _as_int(data.get("id_producto"))
    cantidad = _as_int(data.get("cantidad"), -1)

    if id_producto <= 0:
        return jsonify({"error": "id_producto es requerido"}), 400
    if cantidad < 0:
        return jsonify({"error": "cantidad inválida"}), 400

    carrito = session.get("carrito", {})
    key = str(id_producto)
    if cantidad == 0:
        carrito.pop(key, None)
    else:
        carrito[key] = cantidad
    session["carrito"] = carrito

    return jsonify(carrito), 200

# POST /api/carrito/eliminar/<id>
@carrito_bp.route("/eliminar/<int:id_producto>", methods=["POST"])
def eliminar_producto(id_producto: int):
    """Elimina un producto del carrito."""
    carrito = session.get("carrito", {})
    carrito.pop(str(id_producto), None)
    session["carrito"] = carrito
    return jsonify(carrito), 200

# POST /api/carrito/vaciar
@carrito_bp.route("/vaciar", methods=["POST"])
def vaciar_carrito():
    """Vacía por completo el carrito."""
    session["carrito"] = {}
    return jsonify(session["carrito"]), 200
