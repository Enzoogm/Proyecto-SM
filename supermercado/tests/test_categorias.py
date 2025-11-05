# tests/test_categorias.py

def test_listar_categorias_mock(client, mocker):
    """
    Test aislado sin DB — parchea conectar() para devolver filas y valida que /api/categorias devuelve lista normalizada.
    """
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
    res = client.get("/api/categorias")
    assert res.status_code == 200, "Debe responder 200"
    data = res.get_json()
    assert isinstance(data, list), "Debe devolver una lista"
    assert data == [
        {"id": 1, "nombre": "Bebidas", "id_categoria": 1, "nombre_cat": "Bebidas"},
        {"id": 2, "nombre": "Snacks", "id_categoria": 2, "nombre_cat": "Snacks"},
    ], "La lista debe estar normalizada con todas las claves"

def test_get_categoria_por_id_ok_mock(client, mocker):
    """
    Test aislado sin DB — parchea conectar() para devolver una fila y valida que /api/categorias/<id> responde 200 y objeto normalizado.
    """
    class FakeCursor:
        def execute(self, sql, params=None): pass
        def fetchone(self): return (5, "Lácteos")
        def close(self): pass
    class FakeConn:
        def cursor(self): return FakeCursor()
        def close(self): pass
    mocker.patch("supermercado.rutas.categorias.conectar", return_value=FakeConn())
    res = client.get("/api/categorias/5")
    assert res.status_code == 200, "Debe responder 200 si existe"
    obj = res.get_json()
    assert set(obj.keys()) == {"id", "nombre", "id_categoria", "nombre_cat"}, "Debe tener todas las claves normalizadas"
    assert obj["id"] == 5 and obj["nombre"] == "Lácteos"

def test_get_categoria_por_id_not_found_mock(client, mocker):
    """
    Test aislado sin DB — parchea conectar() para devolver None y valida que /api/categorias/<id> responde 404 y error.
    """
    class FakeCursor:
        def execute(self, sql, params=None): pass
        def fetchone(self): return None
        def close(self): pass
    class FakeConn:
        def cursor(self): return FakeCursor()
        def close(self): pass
    mocker.patch("supermercado.rutas.categorias.conectar", return_value=FakeConn())
    res = client.get("/api/categorias/999")
    assert res.status_code == 404, "Debe responder 404 si no existe"
    obj = res.get_json()
    assert obj == {"error": "No existe la categoría."}, "Debe devolver mensaje de error exacto"

def test_get_categoria_por_id_invalid_mock(client, mocker):
    """
    Test aislado sin DB — llama a /api/categorias/0 y espera 400 por input inválido.
    """
    res = client.get("/api/categorias/0")
    assert res.status_code == 400, "Debe responder 400 si el id es inválido"
    obj = res.get_json()
    assert obj == {"error": "Parámetros inválidos."}, "Debe devolver mensaje de error exacto"
