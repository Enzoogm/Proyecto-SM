from flask import Blueprint, jsonify
from supermercado.db import conectar

productos_bp = Blueprint('productos', __name__)

def obtener_categorias():
    db = conectar()
    cursor = db.cursor()
    cursor.execute("SELECT id_categoria, nombre_cat FROM `Categorias` ORDER BY nombre_cat")
    categorias = cursor.fetchall()
    lista_categorias = [{'id': c[0], 'nombre': c[1]} for c in categorias]
    return lista_categorias

@productos_bp.route('/categoria/<int:id_categoria>')
def productos_por_categoria(id_categoria):
    db = conectar()
    cursor = db.cursor()
    
    cursor.execute("SELECT nombre_cat FROM `Categorias` WHERE id_categoria=%s", (id_categoria,))
    categoria = cursor.fetchone()
    nombre_categoria = categoria[0] if categoria else "Categoría desconocida"

    cursor.execute(
        "SELECT id_producto, nombre_prod, descripcion, precio, stock FROM `Productos` WHERE id_categoria=%s",
        (id_categoria,)
    )
    productos = cursor.fetchall()
    lista_productos = [{
        'id_producto': p[0],
        'nombre': p[1],
        'descripcion': p[2],
        'precio': p[3],
        'stock': p[4],
    } for p in productos]

    return jsonify({
        'categoria': nombre_categoria,
        'productos': lista_productos
    })

@productos_bp.route('/productos')
def mostrar_productos():
    db = conectar()
    cursor = db.cursor()
    cursor.execute("SELECT id_producto, nombre_prod, descripcion, precio, stock FROM `Productos`")
    productos = cursor.fetchall()
    lista_productos = [{
        'id_producto': p[0],
        'nombre': p[1],
        'descripcion': p[2],
        'precio': p[3],
        'stock': p[4],
    } for p in productos]
    return jsonify(lista_productos)

@productos_bp.route('/categorias')
def mostrar_categorias():
    categorias = obtener_categorias()
    return jsonify(categorias)
