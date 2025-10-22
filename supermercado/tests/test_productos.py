# tests/test_productos.py
def test_get_productos_lista(client, mocker):
    """
    ✅ Testea que /api/productos devuelva una lista de productos simulados.
    """
    fake_prods = [
        {"id_producto": 1, "nombre_prod": "Leche Descremada 1L", "precio": 350, "stock": 20},
        {"id_producto": 2, "nombre_prod": "Queso Rallado", "precio": 500, "stock": 10},
    ]

    mocker.patch("supermercado.rutas.productos.obtener_productos", return_value=fake_prods)

    res = client.get("/api/productos")
    assert res.status_code == 200

    data = res.get_json()
    assert isinstance(data, list)
    assert "nombre_prod" in data[0]


def test_get_producto_inexistente(client, mocker):
    """
    ❌ Testea que si no existe el producto devuelva 404.
    """
    mocker.patch("supermercado.rutas.productos.obtener_producto", return_value=None)
    res = client.get("/api/productos/999")
    assert res.status_code in (400, 404)
