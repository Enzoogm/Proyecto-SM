from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

from supermercado.rutas.productos import productos_bp, obtener_categorias
from supermercado.rutas.ventas import ventas_bp
from supermercado.rutas.pagos import pagos_bp
from supermercado.rutas.carrito import carrito_bp
from supermercado.rutas.auth import auth_bp
from supermercado.rutas.admin import admin_bp
from supermercado.db import conectar

# Cargar .env
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")  # ← ya viene de .env
CORS(app)

app.register_blueprint(admin_bp, url_prefix="/api/admin")
app.register_blueprint(productos_bp, url_prefix='/api/productos')
app.register_blueprint(ventas_bp, url_prefix='/api/ventas')
app.register_blueprint(pagos_bp, url_prefix='/api/pagos')
app.register_blueprint(carrito_bp, url_prefix='/api/carrito')
app.register_blueprint(auth_bp, url_prefix='/api/auth')

# Endpoint API para obtener categorías
@app.route('/api/categorias')
def api_categorias():
    categorias = obtener_categorias()
    # Suponiendo que obtener_categorias() devuelve lista de tuplas o dicts
    lista_categorias = []
    for c in categorias:
        # Ajusta según estructura real de obtener_categorias()
        if isinstance(c, dict):
            lista_categorias.append(c)
        else:
            lista_categorias.append({'id': c[0], 'nombre': c[1]})
    return jsonify(lista_categorias)

# Endpoint API para obtener todos los productos
@app.route('/api/productos/all')
def api_productos():
    db = conectar()
    cursor = db.cursor()
    cursor.execute("SELECT id_producto, nombre_prod, descripcion, precio, stock FROM `Productos`")
    productos = cursor.fetchall()

    lista_productos = []
    for p in productos:
        lista_productos.append({
            'id': p[0],
            'nombre': p[1],
            'descripcion': p[2],
            'precio': p[3],
            'stock': p[4],
        })

    return jsonify(lista_productos)

if __name__ == '__main__':
    app.run(debug=True)
