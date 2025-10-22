# tests/test_carrito.py
def test_no_puede_agregar_sin_stock(client, mocker):
    """
    🚫 No debe permitir agregar un producto con stock = 0
    """
    mocker.patch("supermercado.rutas.productos.obtener_producto", return_value={
        "id_producto": 1,
        "nombre_prod": "Helado de Chocolate",
        "precio": 500,
        "stock": 0
    })

    payload = {"id_producto": 1, "cantidad": 1}
    res = client.post("/api/carrito", json=payload)

    assert res.status_code == 400
    assert "stock" in res.get_json().get("error", "").lower()
