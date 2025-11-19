
# supermercado/app.py
import os
from flask import Flask, request
from flask_cors import CORS
import importlib
import logging
from supermercado import rutas

logger = logging.getLogger(__name__)

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
    # Dynamically import and register blueprints from rutas.__all__
    for name in getattr(rutas, "__all__", []):
        try:
            mod = importlib.import_module(f"supermercado.rutas.{name}")
            bp = getattr(mod, f"{name}_bp", None) or getattr(mod, "bp", None)
            if bp:
                app.register_blueprint(bp)
                logger.debug("Registered blueprint: %s", name)
            else:
                logger.debug("No blueprint found in supermercado.rutas.%s", name)
        except Exception as e:
            logger.warning("Failed to import/register supermercado.rutas.%s: %s", name, e)

    return app

# instancia usada por tests e import
app = create_app()

if __name__ == "__main__":
    # En dev podés dejar debug=True
    # Bind to 0.0.0.0 para que sea accesible desde la red del colegio (10.9.120.5)
    app.run(host="0.0.0.0", debug=True)
