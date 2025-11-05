
# supermercado/tests/__init__.py
# Exponer la app para que los tests la puedan importar correctamente.
# Usamos import absoluto para evitar que Python intente resolver
# `supermercado.tests.app` durante la recolección de pytest.
from supermercado.app import app
