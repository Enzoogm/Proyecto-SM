# supermercado/rutas/carrito.py
from flask import Blueprint, jsonify, request, session
# 👇 Importá el módulo, no la función
import supermercado.rutas.productos as productos_rutas

carrito_bp = Blueprint("carrito", __name__)

# -------- helpers --------
def _ensure_cart():
    if "carrito" not in session or not isinstance(session["carrito"], dict):
        session["carrito"] = {}

def _as_int(v, default=0):
    try:
        return int(v)
    except (TypeError, ValueError):
        return default

@carrito_bp.before_app_request
def _before_any_request():
    _ensure_cart()

# ==================== ENDPOINTS ====================

# GET /api/carrito
@carrito_bp.route("", methods=["GET"])  # ruta vacía => /api/carrito
def ver_carrito():
    return jsonify(session.get("carrito", {})), 200

# POST /api/carrito
@carrito_bp.route("", methods=["POST"])
def agregar_al_carrito():
    """
    JSON: { "id_producto": int, "cantidad": int>=1 }
    Reglas:
      - 404 si el producto no existe
      - 400 si stock <= 0
      - 200 si OK, devuelve el dict del carrito
    """
    data = request.get_json(silent=True) or {}
    id_producto = _as_int(data.get("id_producto"))
    cantidad = max(1, _as_int(data.get("cantidad"), 1))

    if id_producto <= 0:
        return jsonify({"error": "id_producto es requerido"}), 400

    # 👇 Llamá vía el módulo para que el patch funcione
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
    data = request.get_json(silent=True) or {}
    id_producto = _as_int(data.get("id_producto"))
    cantidad = _as_int(data.get("cantidad"), 0)

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

# POST /api/carrito/eliminar/123
@carrito_bp.route("/eliminar/<int:id_producto>", methods=["POST"])
def eliminar_producto(id_producto: int):
    carrito = session.get("carrito", {})
    carrito.pop(str(id_producto), None)
    session["carrito"] = carrito
    return jsonify(carrito), 200

# POST /api/carrito/vaciar
@carrito_bp.route("/vaciar", methods=["POST"])
def vaciar_carrito():
    session["carrito"] = {}
    return jsonify(session["carrito"]), 200
