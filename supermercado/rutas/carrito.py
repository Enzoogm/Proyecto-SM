# supermercado/rutas/carrito.py
from flask import Blueprint, jsonify, request, session
from supermercado.rutas.productos import obtener_producto

carrito_bp = Blueprint("carrito", __name__)

# Asegurar estructura en sesión
@carrito_bp.before_app_request
def ensure_session_cart():
    if "carrito" not in session:
        session["carrito"] = {}

@carrito_bp.get("/")
def ver_carrito():
    return jsonify(session.get("carrito", {}))

@carrito_bp.post("/")
def agregar_al_carrito():
    """
    Espera JSON: { "id_producto": int, "cantidad": int }
    Reglas:
      - Si producto no existe => 404
      - Si stock <= 0       => 400
      - Si ok, suma a sesión y devuelve el carrito como dict { "<id>": cantidad }
    """
    data = request.get_json(silent=True) or {}
    id_producto = data.get("id_producto")
    cantidad = int(data.get("cantidad") or 1)

    if not id_producto:
        return jsonify({"error": "id_producto es requerido"}), 400

    prod = obtener_producto(int(id_producto))
    if not prod:
        return jsonify({"error": "Producto no encontrado"}), 404
    if prod["stock"] <= 0:
        return jsonify({"error": "Sin stock"}), 400

    carrito = session.get("carrito", {})
    key = str(id_producto)
    carrito[key] = carrito.get(key, 0) + max(1, cantidad)
    session["carrito"] = carrito
    return jsonify(carrito), 200

# Utilidades opcionales para depurar a mano
@carrito_bp.post("/vaciar")
def vaciar_carrito():
    session["carrito"] = {}
    return jsonify(session["carrito"])

@carrito_bp.post("/eliminar/<int:id_producto>")
def eliminar_producto(id_producto: int):
    carrito = session.get("carrito", {})
    carrito.pop(str(id_producto), None)
    session["carrito"] = carrito
    return jsonify(carrito)
