from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Importar blueprints
from supermercado.rutas.productos import productos_bp
from supermercado.rutas.ventas import ventas_bp
from supermercado.rutas.pagos import pagos_bp
from supermercado.rutas.carrito import carrito_bp
from supermercado.rutas.auth import auth_bp
from supermercado.rutas.admin import admin_bp

# Cargar .env
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")
CORS(app)

# ✅ Registrar Blueprints
app.register_blueprint(admin_bp, url_prefix="/api/admin")
app.register_blueprint(productos_bp, url_prefix="/api")  # 👈 corregido
app.register_blueprint(ventas_bp, url_prefix="/api/ventas")
app.register_blueprint(pagos_bp, url_prefix="/api/pagos")
app.register_blueprint(carrito_bp, url_prefix="/api/carrito")
app.register_blueprint(auth_bp, url_prefix="/api/auth")

if __name__ == "__main__":
    app.run(debug=True)
