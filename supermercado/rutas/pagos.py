from flask import Blueprint, render_template
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
        return f"Error al cargar pagos: {e}"
    finally:
        conn.close()
    return render_template('pagos.html', pagos=pagos)
