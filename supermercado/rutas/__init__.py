# supermercado/rutas/__init__.py
"""
Inicializa todos los módulos de rutas (blueprints) del proyecto.
Esto asegura que Flask cargue los endpoints antes de registrar los blueprints en app.py.
"""

from . import categorias
from . import productos
from . import carrito
from . import ventas
from . import pagos
from . import auth
from . import admin
from . import promos

__all__ = [
    "categorias",
    "productos",
    "carrito",
    "ventas",
    "pagos",
    "auth",
    "admin",
    "promos",
]
