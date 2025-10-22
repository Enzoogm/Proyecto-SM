# tests/test_categorias.py
def test_get_categorias_ok(client, mocker):
    """
    ✅ Testea que /api/categorias devuelva 200 y una lista mockeada.
    """
    fake_rows = [
        {"id_categoria": 1, "nombre_cat": "Bebidas"},
        {"id_categoria": 2, "nombre_cat": "Snacks"},
    ]

    # Simula la conexión a base de datos
    mocker.patch("supermercado.rutas.categorias.obtener_categorias", return_value=fake_rows)

    res = client.get("/api/categorias")
    assert res.status_code == 200

    data = res.get_json()
    assert isinstance(data, list)
    assert data[0]["nombre_cat"] == "Bebidas"
