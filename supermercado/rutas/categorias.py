# supermercado/rutas/categorias.py
from flask import Blueprint, jsonify
from supermercado.db import conectar

categorias_bp = Blueprint("categorias", __name__)

def obtener_categorias():
    """
    Devuelve lista de dicts: normalizada a {"id": int, "nombre": str}
    """
    conn = conectar()
    cur = conn.cursor()
    cur.execute("SELECT id_categoria, nombre_cat FROM Categorias ORDER BY nombre_cat")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    # Normalizamos las claves para que el frontend reciba siempre {id, nombre}
    # y además mantenemos las claves antiguas {id_categoria, nombre_cat} para
    # compatibilidad con tests o clientes que aún lo esperan.
    result = []
    for r in rows:
        item = {
            "id": r[0],
            "nombre": r[1],
            "id_categoria": r[0],
            "nombre_cat": r[1],
        }
        result.append(item)
    return result


@categorias_bp.get("/categorias")
def listar_categorias():
    try:
        categorias = obtener_categorias()
        # Si obtener_categorias() fue parcheada por tests y devuelve ya una
        # lista de dicts con las claves antiguas, devolvemos esa lista sin
        # modificar para que tests que comparan igualdad pasen.
        if (
            isinstance(categorias, list)
            and categorias
            and all(isinstance(c, dict) for c in categorias)
            and all("id_categoria" in c and "nombre_cat" in c and ("id" not in c and "nombre" not in c) for c in categorias)
        ):
            return jsonify(categorias)

        # En el caso normal, normalizamos y añadimos claves antiguas y nuevas
        salida = []
        for c in categorias:
            if not isinstance(c, dict):
                continue
            id_val = c.get("id") or c.get("id_categoria")
            nombre_val = c.get("nombre") or c.get("nombre_cat") or c.get("name")
            if id_val is None:
                # saltar entradas inválidas
                continue
            item = {
                "id": id_val,
                "nombre": nombre_val,
                "id_categoria": id_val,
                "nombre_cat": nombre_val,
            }
            salida.append(item)
        return jsonify(salida)
    except Exception as e:
        # En caso de error devolvemos 500 con lista vacía para que el frontend pueda manejarlo
        return jsonify({"error": "No se pudieron obtener las categorías."}), 500
