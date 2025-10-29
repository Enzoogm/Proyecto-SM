import pytest

# --- Skip integración si la DB no está accesible ---
from supermercado.db import conectar

def _db_available() -> bool:
    try:
        cn = conectar()
        cn.close()
        return True
    except Exception:
        return False

pytestmark = pytest.mark.skipif(
    not _db_available(),
    reason="DB no accesible: se saltan tests de integración."
)

# ---------- FIXTURES ----------
@pytest.fixture(scope="session")
def app_instance():
    from supermercado.app import app
    # aseguramos modo testing y una secret key para la sesión
    app.config.update(
        TESTING=True,
        SECRET_KEY=app.config.get("SECRET_KEY") or "test-secret-key",
    )
    return app

@pytest.fixture()
def client(app_instance):
    return app_instance.test_client()

# ---------- TESTS: CATEGORÍAS ----------
def test_categorias_listado(client):
    resp = client.get("/api/categorias")
    assert resp.status_code == 200
    data = resp.get_json()
    assert isinstance(data, list)
    # si hay al menos una categoría, validar campos
    if data:
        assert "id_categoria" in data[0]
        assert "nombre_cat" in data[0]

# ---------- TESTS: PRODUCTOS ----------
def test_productos_listado(client):
    resp = client.get("/api/productos")
    assert resp.status_code == 200
    data = resp.get_json()
    assert isinstance(data, list)
    if data:
        p = data[0]
        for k in ["id_producto", "nombre_prod", "precio", "stock", "id_categoria"]:
            assert k in p

def test_productos_por_categoria_coincide(client):
    # tomar una categoría existente y verificar filtrado
    rc = client.get("/api/categorias")
    assert rc.status_code == 200
    cats = rc.get_json()
    if not cats:
        pytest.skip("No hay categorías cargadas en BD")

    cat_id = cats[0]["id_categoria"]
    rp = client.get(f"/api/productos/categoria/{cat_id}")
    assert rp.status_code == 200
    payload = rp.get_json()
    assert "productos" in payload
    prods = payload["productos"]
    # si hay productos en esa categoría, deben coincidir
    for prod in prods:
        assert prod["id_categoria"] == cat_id

# ---------- TESTS: CARRITO ----------
def test_carrito_flujo_basico(client):
    # buscar un producto con stock > 0
    r = client.get("/api/productos")
    assert r.status_code == 200
    productos = r.get_json()
    assert isinstance(productos, list)

    prod_ok = next((p for p in productos if p.get("stock", 0) > 0), None)
    if not prod_ok:
        pytest.skip("No hay productos con stock > 0 en BD para probar carrito")

    payload = {"id_producto": prod_ok["id_producto"], "cantidad": 1}
    # este endpoint es el que expone tu blueprint para POST JSON
    add = client.post("/api/carrito", json=payload)
    assert add.status_code == 200
    cart = add.get_json()
    assert str(prod_ok["id_producto"]) in cart
    assert cart[str(prod_ok["id_producto"])] >= 1

def test_carrito_producto_sin_stock_si_existe(client):
    # condicional: solo prueba si existe alguno con stock == 0
    r = client.get("/api/productos")
    assert r.status_code == 200
    productos = r.get_json()

    prod_sin_stock = next((p for p in productos if p.get("stock", 0) == 0), None)
    if not prod_sin_stock:
        pytest.skip("No hay productos con stock 0 en BD: se salta este test")

    payload = {"id_producto": prod_sin_stock["id_producto"], "cantidad": 1}
    res = client.post("/api/carrito", json=payload)
    # tu endpoint devuelve 400 cuando stock <= 0
    assert res.status_code == 400
    data = res.get_json()
    assert "error" in data
