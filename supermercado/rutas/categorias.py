# supermercado/rutas/categorias.py
from flask import Blueprint, jsonify
from supermercado.db import conectar

categorias_bp = Blueprint("categorias", __name__)

def obtener_categorias():
    """
    Devuelve lista de dicts: {"id_categoria": int, "nombre_cat": str}
    """
    conn = conectar()
    cur = conn.cursor()
    cur.execute("SELECT id_categoria, nombre_cat FROM Categorias ORDER BY nombre_cat")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [{"id_categoria": r[0], "nombre_cat": r[1]} for r in rows]

@categorias_bp.get("/categorias")
def listar_categorias():
    return jsonify(obtener_categorias())
