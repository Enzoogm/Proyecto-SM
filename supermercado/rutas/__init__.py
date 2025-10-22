# supermercado/rutas/__init__.py

# Exponer submódulos como atributos del paquete
from . import categorias as categorias
from . import productos as productos

# (opcional) exportar blueprints si querés importarlos desde acá
from .categorias import categorias_bp  # noqa: F401
from .productos import productos_bp    # noqa: F401
