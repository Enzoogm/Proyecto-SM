def test_obtener_categorias_normaliza_tuplas(mocker):
    """
    Test aislado sin DB — parchea conectar() para devolver filas y valida que obtener_categorias() normaliza correctamente.
    """
    from supermercado.rutas.categorias import obtener_categorias
    class FakeCursor:
        def execute(self, sql, params=None): pass
        def fetchall(self):
            return [
                (1, "Bebidas"),
                (2, "Snacks"),
            ]
        def close(self): pass
    class FakeConn:
        def cursor(self): return FakeCursor()
        def close(self): pass
    mocker.patch("supermercado.rutas.categorias.conectar", return_value=FakeConn())
    result = obtener_categorias()
    assert result == [
        {"id": 1, "nombre": "Bebidas", "id_categoria": 1, "nombre_cat": "Bebidas"},
        {"id": 2, "nombre": "Snacks", "id_categoria": 2, "nombre_cat": "Snacks"},
    ], "La función debe normalizar correctamente las filas de la DB"

def test_obtener_categorias_salta_invalidas(mocker):
    """
    Test aislado sin DB — parchea conectar() para devolver filas con id None y valida que obtener_categorias() ignora las inválidas.
    """
    from supermercado.rutas.categorias import obtener_categorias
    class FakeCursor:
        def execute(self, sql, params=None): pass
        def fetchall(self):
            return [
                (None, "Sin id"),
                (0, "Cero"),
                (3, "Válida"),
            ]
        def close(self): pass
    class FakeConn:
        def cursor(self): return FakeCursor()
        def close(self): pass
    mocker.patch("supermercado.rutas.categorias.conectar", return_value=FakeConn())
    result = obtener_categorias()
    assert result == [
        {"id": 3, "nombre": "Válida", "id_categoria": 3, "nombre_cat": "Válida"},
    ], "La función debe ignorar filas con id None o <= 0"
import pytest

# ---------- CATEGORÍAS (mock) ----------
def test_categorias_listado_mock(client, mocker):
    fake_rows = [
        {"id_categoria": 1, "nombre_cat": "Bebidas"},
        {"id_categoria": 2, "nombre_cat": "Snacks"},
    ]
    mocker.patch("supermercado.rutas.categorias.obtener_categorias", return_value=fake_rows)

    resp = client.get("/api/categorias")
    assert resp.status_code == 200
    data = resp.get_json()
    assert isinstance(data, list)
    assert data == fake_rows
    assert set(data[0].keys()) == {"id_categoria", "nombre_cat"}

# ---------- PRODUCTOS (mock lista) ----------
def test_productos_listado_mock(client, mocker):
    fake_prods = [
        {
            "id_producto": 1,
            "nombre_prod": "Leche",
            "descripcion": "1L",
            "precio": 350,
            "stock": 5,
            "id_categoria": 1,
            "imagen_url": None,
        },
        {
            "id_producto": 2,
            "nombre_prod": "Galletitas",
            "descripcion": "250g",
            "precio": 500,
            "stock": 0,
            "id_categoria": 2,
            "imagen_url": None,
        },
    ]
    mocker.patch("supermercado.rutas.productos.obtener_productos", return_value=fake_prods)

    resp = client.get("/api/productos")
    assert resp.status_code == 200
    data = resp.get_json()
    assert isinstance(data, list)
    assert len(data) == 2
    for p in data:
        for k in ["id_producto", "nombre_prod", "precio", "stock", "id_categoria"]:
            assert k in p

# ---------- PRODUCTOS POR CATEGORÍA (mock conectar) ----------
def test_productos_por_categoria_mock(client, mocker):
    """
    Parchamos supermercado.rutas.productos.conectar para simular:
      - SELECT nombre_cat FROM Categorias WHERE id_categoria = %s
      - SELECT ... FROM Productos WHERE id_categoria = %s
    Sin tocar la DB real.
    """

    class FakeCursor:
        def __init__(self):
            self._last_sql = None
            self._last_params = None

        def execute(self, sql, params=None):
            self._last_sql = " ".join(sql.split()).lower()
            self._last_params = params

        def fetchone(self):
            # Si está consultando el nombre de la categoría:
            if "from categorias" in self._last_sql:
                # Devuelve una sola fila con el nombre de la categoría
                return ("Bebidas",)
            return None

        def fetchall(self):
            # Si está consultando los productos por categoría:
            if "from productos" in self._last_sql and "where id_categoria" in self._last_sql:
                cat_id = self._last_params[0]
                # devolvemos 2 productos de esa categoría
                return [
                    (10, "Agua", "500ml", 200, 20, cat_id, None),
                    (11, "Jugo", "1L", 650, 5, cat_id, None),
                ]
            return []

        def close(self):
            pass

    class FakeConn:
        def cursor(self):
            return FakeCursor()
        def close(self):
            pass

    # parchear conectar() dentro del módulo productos
    mocker.patch("supermercado.rutas.productos.conectar", return_value=FakeConn())

    # Elegimos una categoría ficticia (1)
    resp = client.get("/api/productos/categoria/1")
    assert resp.status_code == 200
    payload = resp.get_json()
    assert "categoria" in payload
    assert "productos" in payload
    assert payload["categoria"] == "Bebidas"
    prods = payload["productos"]
    assert isinstance(prods, list) and len(prods) == 2
    for p in prods:
        assert p["id_categoria"] == 1

# ---------- CARRITO (mock producto OK) ----------
def test_carrito_agregar_ok_mock(client, mocker):
    # Mockeamos obtener_producto (el carrito lo llama a través del módulo productos_rutas)
    mocker.patch("supermercado.rutas.productos.obtener_producto", return_value={
        "id_producto": 99,
        "nombre_prod": "Mock Item",
        "descripcion": "",
        "precio": 1000,
        "stock": 3,
        "id_categoria": 1,
        "imagen_url": None,
    })

    payload = {"id_producto": 99, "cantidad": 2}
    r = client.post("/api/carrito", json=payload)
    assert r.status_code == 200
    cart = r.get_json()
    assert cart.get("99") == 2

# ---------- CARRITO (mock sin stock) ----------
def test_carrito_agregar_sin_stock_mock(client, mocker):
    mocker.patch("supermercado.rutas.productos.obtener_producto", return_value={
        "id_producto": 100,
        "nombre_prod": "Sin Stock",
        "descripcion": "",
        "precio": 500,
        "stock": 0,
        "id_categoria": 1,
        "imagen_url": None,
    })

    payload = {"id_producto": 100, "cantidad": 1}
    r = client.post("/api/carrito", json=payload)
    assert r.status_code == 400
    data = r.get_json()
    assert "error" in data
