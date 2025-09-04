from flask import Blueprint, render_template
from supermercado.db import conectar

productos_bp = Blueprint('productos', __name__)

# Función para obtener todas las categorías desde la tabla Categorias
def obtener_categorias():
    db = conectar()
    cursor = db.cursor()
    cursor.execute("SELECT id_categoria, nombre_cat FROM `Categorias` ORDER BY nombre_cat")
    categorias = cursor.fetchall()  # devuelve lista de tuplas (id_categoria, nombre_cat)
    return categorias

# Mostrar productos por categoría
@productos_bp.route('/categoria/<int:id_categoria>')
def productos_por_categoria(id_categoria):
    db = conectar()
    cursor = db.cursor()
    
    # Traer nombre de la categoría
    cursor.execute("SELECT nombre_cat FROM `Categorias` WHERE id_categoria=%s", (id_categoria,))
    categoria = cursor.fetchone()
    if categoria:
        nombre_categoria = categoria[0]
    else:
        nombre_categoria = "Categoría desconocida"

    # Traer productos de la categoría
    cursor.execute(
        "SELECT id_producto, nombre_prod, descripcion, precio, stock FROM `Productos` WHERE id_categoria=%s",
        (id_categoria,)
    )
    productos = cursor.fetchall()
    
    return render_template(
        'productos_categoria.html',
        categoria=nombre_categoria,
        productos=productos
    )

# Opcional: ruta para mostrar todas las categorías en una página
@productos_bp.route('/categorias')
def mostrar_categorias():
    categorias = obtener_categorias()
    return render_template('categorias.html', categorias=categorias)
