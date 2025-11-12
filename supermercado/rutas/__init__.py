# supermercado/rutas/__init__.py
"""
Inicializa todos los módulos de rutas (blueprints) del proyecto.
Esto asegura que Flask cargue los endpoints antes de registrar los blueprints en app.py.
"""

import importlib
import logging

logger = logging.getLogger(__name__)

_module_names = [
    "categorias",
    "productos",
    "carrito",
    "ventas",
    "pagos",
    "auth",
    "admin",
    "promos",
]

_loaded = []
for name in _module_names:
    try:
        importlib.import_module(f".{name}", __package__)
        _loaded.append(name)
    except Exception as e:
        # Log and skip modules that fail to import (SyntaxError, ImportError, etc.)
        logger.warning("supermercado.rutas: could not import %s: %s", name, e)

__all__ = _loaded
