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

def create_app():
    app = Flask(__name__)

    # Secret para sesiones / JWT fallback
    app.secret_key = os.getenv("SECRET_KEY") or "dev-secret-for-tests"

    # ====== CORS con credenciales (cookies httpOnly) ======
    # Configurable por .env -> FRONTEND_ORIGIN=http://localhost:5173
    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    CORS(
        app,
        supports_credentials=True,                   # necesario para enviar cookies
        resources={r"/api/*": {"origins": FRONTEND_ORIGIN}},
        expose_headers=["Content-Type"],
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    # Aceptar /ruta y /ruta/
    app.url_map.strict_slashes = False

    # ====== Registrar Blueprints ======
    app.register_blueprint(admin_bp,       url_prefix="/api/admin")
    app.register_blueprint(categorias_bp,  url_prefix="/api")
    app.register_blueprint(productos_bp,   url_prefix="/api")
    app.register_blueprint(ventas_bp,      url_prefix="/api/ventas")
    app.register_blueprint(pagos_bp,       url_prefix="/api/pagos")
    app.register_blueprint(carrito_bp,     url_prefix="/api/carrito")
    app.register_blueprint(auth_bp,        url_prefix="/api/auth")
    app.register_blueprint(promos_bp,      url_prefix="/api/promos")

    return app

# instancia usada por tests e import
app = create_app()

if __name__ == "__main__":
    # En dev podés dejar debug=True
    app.run(debug=True)
