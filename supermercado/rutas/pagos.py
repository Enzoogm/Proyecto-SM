from flask import Blueprint, jsonify
from supermercado.db import conectar

pagos_bp = Blueprint('pagos', __name__)

@pagos_bp.route('/pagos')
def pagos():
    conn = conectar()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Pagos")
        pagos = cursor.fetchall()
    except Exception as e:
        return jsonify({"error": f"Error al cargar pagos: {e}"}), 500
    finally:
        conn.close()
    return jsonify(pagos)
