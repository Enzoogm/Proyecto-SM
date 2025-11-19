# supermercado/rutas/productos.py
from flask import Blueprint, jsonify
from supermercado.db import conectar

productos_bp = Blueprint("productos", __name__, url_prefix="/api")

def obtener_productos():
    """
    Devuelve lista de productos como dicts con claves:
    id_producto, nombre_prod, descripcion, precio, stock, id_categoria, imagen_url
    """
    conn = conectar()
    cur = conn.cursor()
    cur.execute("""
        SELECT id_producto, nombre_prod, descripcion, precio, stock, id_categoria, imagen_url
        FROM Productos
        ORDER BY id_producto
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [
        {
            "id_producto": r[0],
            "nombre_prod": r[1],
            "descripcion": r[2],
            "precio": r[3],
            "stock": r[4],
            "id_categoria": r[5],
            "imagen_url": r[6],
        } for r in rows
    ]

def obtener_producto(id_producto: int):
    """
    Devuelve un producto (dict) o None si no existe.
    """
    conn = conectar()
    cur = conn.cursor()
    cur.execute("""
        SELECT id_producto, nombre_prod, descripcion, precio, stock, id_categoria, imagen_url
        FROM Productos
        WHERE id_producto = %s
    """, (id_producto,))
    r = cur.fetchone()
    cur.close()
    conn.close()
    if not r:
        return None
    return {
        "id_producto": r[0],
        "nombre_prod": r[1],
        "descripcion": r[2],
        "precio": r[3],
        "stock": r[4],
        "id_categoria": r[5],
        "imagen_url": r[6],
    }

@productos_bp.get("/productos")
def listar_productos():
    return jsonify(obtener_productos())

@productos_bp.get("/productos/categoria/<int:id_categoria>")
def listar_por_categoria(id_categoria: int):
    conn = conectar()
    cur = conn.cursor()
    # nombre de categoría (opcional)
    cur.execute("SELECT nombre_cat FROM Categorias WHERE id_categoria = %s", (id_categoria,))
    cat_row = cur.fetchone()
    nombre_categoria = cat_row[0] if cat_row else "Categoría"

    cur.execute("""
        SELECT id_producto, nombre_prod, descripcion, precio, stock, id_categoria, imagen_url
        FROM Productos
        WHERE id_categoria = %s
        ORDER BY id_producto
    """, (id_categoria,))
    rows = cur.fetchall()
    cur.close()
    conn.close()

    productos = [
        {
            "id_producto": r[0],
            "nombre_prod": r[1],
            "descripcion": r[2],
            "precio": r[3],
            "stock": r[4],
            "id_categoria": r[5],
            "imagen_url": r[6],
        } for r in rows
    ]
    return jsonify({"categoria": nombre_categoria, "productos": productos})
