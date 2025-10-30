# supermercado/app.py
from flask import Flask, request
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
    # Also expose a dedicated JWT secret name so other modules (auth) can use the same value
    app.config["SECRET_KEY_SUPER"] = os.getenv("SECRET_KEY_SUPER") or app.secret_key

    # ====== CORS con credenciales (cookies httpOnly) ======
    # Aceptamos localhost, 127.0.0.1 y la red del colegio
    origins = [
        os.getenv("FRONTEND_ORIGIN", "http://localhost:5173"),
        "http://127.0.0.1:5173",
        "http://10.9.120.5:5173",
    ]
    CORS(
        app,
        supports_credentials=True,                   # necesario para enviar cookies
        resources={r"/api/*": {"origins": origins}},
        expose_headers=["Content-Type"],
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    # Also set explicit CORS response headers for allowed origins so that when
    # supports_credentials=True we return a single Access-Control-Allow-Origin
    # equal to the caller Origin (browsers require a single origin when credentials are used).
    allowed_origins = set(origins)

    @app.after_request
    def _cors_after_request(response):
        origin = request.headers.get("Origin")
        if origin and origin in allowed_origins:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
            response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
        return response

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
    # Bind to 0.0.0.0 para que sea accesible desde la red del colegio (10.9.120.5)
    app.run(host="0.0.0.0", debug=True)
