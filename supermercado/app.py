# supermercado/app.py
from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

from supermercado.rutas.productos import productos_bp
from supermercado.rutas.categorias import categorias_bp
from supermercado.rutas.ventas import ventas_bp
from supermercado.rutas.pagos import pagos_bp
from supermercado.rutas.carrito import carrito_bp
from supermercado.rutas.auth import auth_bp
from supermercado.rutas.admin import admin_bp
from supermercado.rutas.promos import promos_bp

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY") or "dev-secret-for-tests"
CORS(app)

# ✅ importante: después de crear la app
app.url_map.strict_slashes = False  # acepta /ruta y /ruta/

# Blueprints
app.register_blueprint(admin_bp,       url_prefix="/api/admin")
app.register_blueprint(categorias_bp,  url_prefix="/api")
app.register_blueprint(productos_bp,   url_prefix="/api")
app.register_blueprint(ventas_bp,      url_prefix="/api/ventas")
app.register_blueprint(pagos_bp,       url_prefix="/api/pagos")
app.register_blueprint(carrito_bp,     url_prefix="/api/carrito")  # POST/GET /api/carrito
app.register_blueprint(auth_bp,        url_prefix="/api/auth")
app.register_blueprint(promos_bp,      url_prefix="/api/promos")

if __name__ == "__main__":
    app.run(debug=True)
