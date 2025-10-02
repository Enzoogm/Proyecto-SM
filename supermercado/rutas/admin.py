from flask import Blueprint, request, jsonify
from supermercado.db import conectar

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

# ----------------------------
# PRODUCTOS
# ----------------------------
@admin_bp.route("/productos", methods=["GET"])
def obtener_productos():
    db = conectar()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT p.id_producto, p.nombre_prod, p.descripcion, p.precio, p.stock,
               c.nombre_cat AS categoria, p.id_categoria
        FROM Productos p
        LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
    """)
    productos = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(productos)

@admin_bp.route("/productos", methods=["POST"])
def crear_producto():
    data = request.get_json()
    nombre = data.get("nombre_prod")
    descripcion = data.get("descripcion", "")
    precio = data.get("precio")
    stock = data.get("stock", 0)
    id_categoria = data.get("id_categoria")

    if not nombre or precio is None or not id_categoria:
        return jsonify({"error": "Faltan datos"}), 400

    db = conectar()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO Productos (nombre_prod, descripcion, precio, stock, id_categoria)
        VALUES (%s, %s, %s, %s, %s)
    """, (nombre, descripcion, precio, stock, id_categoria))
    db.commit()
    nuevo_id = cursor.lastrowid
    cursor.close()
    db.close()

    return jsonify({"message": "Producto creado", "id": nuevo_id}), 201

@admin_bp.route("/productos/<int:id>/stock", methods=["PUT"])
def actualizar_stock(id):
    data = request.get_json()
    nuevo_stock = data.get("stock")

    db = conectar()
    cursor = db.cursor()
    cursor.execute("UPDATE Productos SET stock = %s WHERE id_producto = %s", (nuevo_stock, id))
    db.commit()
    cursor.close()
    db.close()
    return jsonify({"message": "Stock actualizado"})

@admin_bp.route("/productos/<int:id>", methods=["DELETE"])
def eliminar_producto(id):
    db = conectar()
    cursor = db.cursor()
    cursor.execute("DELETE FROM Productos WHERE id_producto = %s", (id,))
    db.commit()
    cursor.close()
    db.close()
    return jsonify({"message": "Producto eliminado"})

# ----------------------------
# CATEGORÍAS
# ----------------------------
@admin_bp.route("/categorias", methods=["GET"])
def obtener_categorias():
    db = conectar()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Categorias")
    categorias = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(categorias)

@admin_bp.route("/categorias", methods=["POST"])
def crear_categoria():
    data = request.get_json()
    nombre = data.get("nombre")

    if not nombre:
        return jsonify({"error": "Falta nombre"}), 400

    db = conectar()
    cursor = db.cursor()
    cursor.execute("INSERT INTO Categorias (nombre_cat) VALUES (%s)", (nombre,))
    db.commit()
    cursor.close()
    db.close()
    return jsonify({"message": "Categoría creada"}), 201

@admin_bp.route("/categorias/<int:id>", methods=["DELETE"])
def eliminar_categoria(id):
    db = conectar()
    cursor = db.cursor()
    cursor.execute("DELETE FROM Categorias WHERE id_categoria = %s", (id,))
    db.commit()
    cursor.close()
    db.close()
    return jsonify({"message": "Categoría eliminada"})

# ----------------------------
# VENTAS
# ----------------------------
@admin_bp.route("/ventas", methods=["GET"])
def obtener_ventas():
    db = conectar()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT v.id_venta, v.fecha, v.total, u.nombre AS cliente
        FROM Ventas v
        LEFT JOIN Usuarios u ON v.id_usuario = u.id_usuario
    """)
    ventas = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(ventas)

# ----------------------------
# Estadisticas
# ----------------------------

@admin_bp.route("/stats", methods=["GET"])
def obtener_estadisticas():
    db = conectar()
    cursor = db.cursor(dictionary=True)

    # Cantidad de productos vendidos (sumar de DetalleVentas)
    cursor.execute("SELECT SUM(cantidad) AS total_productos FROM DetalleVentas")
    productos_vendidos = cursor.fetchone()["total_productos"] or 0

    # Total de dinero ganado (sumar de Ventas)
    cursor.execute("SELECT SUM(total) AS total_dinero FROM Ventas")
    total_dinero = cursor.fetchone()["total_dinero"] or 0

    cursor.close()
    db.close()

    return jsonify({
        "productos_vendidos": productos_vendidos,
        "total_dinero": float(total_dinero)
    })


# ----------------------------
# USUARIOS
# ----------------------------
@admin_bp.route("/usuarios", methods=["GET"])
def obtener_usuarios():
    db = conectar()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id_usuario, nombre, email, rol FROM Usuarios")
    usuarios = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(usuarios)
