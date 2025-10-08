from flask import Blueprint, jsonify
from supermercado.db import conectar

productos_bp = Blueprint("productos", __name__)

# ✅ Obtener todas las categorías
def obtener_categorias():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT id_categoria, nombre_cat FROM Categorias ORDER BY nombre_cat")
    categorias = cursor.fetchall()
    conn.close()

    lista_categorias = [{"id": c[0], "nombre": c[1]} for c in categorias]
    return lista_categorias


# ✅ Endpoint: /api/categorias
@productos_bp.route("/categorias", methods=["GET"])
def mostrar_categorias():
    categorias = obtener_categorias()
    return jsonify(categorias)


# ✅ Endpoint: /api/productos
@productos_bp.route("/productos", methods=["GET"])
def mostrar_productos():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id_producto, nombre_prod, descripcion, precio, stock, id_categoria, imagen_url
        FROM Productos
    """)
    productos = cursor.fetchall()
    conn.close()

    lista_productos = [
        {
            "id_producto": p[0],
            "nombre_prod": p[1],
            "descripcion": p[2],
            "precio": p[3],
            "stock": p[4],
            "id_categoria": p[5],
            "imagen_url": p[6],
        }
        for p in productos
    ]
    return jsonify(lista_productos)


# ✅ Endpoint: /api/productos/categoria/<id>
@productos_bp.route("/productos/categoria/<int:id_categoria>", methods=["GET"])
def productos_por_categoria(id_categoria):
    conn = conectar()
    cursor = conn.cursor()

    # Obtener nombre de la categoría
    cursor.execute("SELECT nombre_cat FROM Categorias WHERE id_categoria = %s", (id_categoria,))
    categoria = cursor.fetchone()
    nombre_categoria = categoria[0] if categoria else "Categoría desconocida"

    # Obtener productos de esa categoría
    cursor.execute("""
        SELECT id_producto, nombre_prod, descripcion, precio, stock, id_categoria, imagen_url
        FROM Productos
        WHERE id_categoria = %s
    """, (id_categoria,))
    productos = cursor.fetchall()
    conn.close()

    lista_productos = [
        {
            "id_producto": p[0],
            "nombre_prod": p[1],
            "descripcion": p[2],
            "precio": p[3],
            "stock": p[4],
            "id_categoria": p[5],
            "imagen_url": p[6],
        }
        for p in productos
    ]

    return jsonify({"categoria": nombre_categoria, "productos": lista_productos})
