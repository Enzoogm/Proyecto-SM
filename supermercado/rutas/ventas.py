from flask import Blueprint, request, redirect, render_template
from supermercado.db import conectar, registrar_venta

ventas_bp = Blueprint('ventas', __name__)

@ventas_bp.route('/ventas', methods=['GET', 'POST'])
def ventas():
    if request.method == 'POST':
        id_producto = request.form['id_producto']
        cantidad = int(request.form['cantidad'])
        metodo_pago = request.form['metodo_pago']

        error = registrar_venta(id_producto, cantidad, metodo_pago)
        if error:
            return f"Error: {error}"

        return redirect('/ventas')

    # GET: mostrar formulario
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT id_producto, nombre_prod FROM Productos")
    productos = cursor.fetchall()
    conn.close()
    return render_template('ventas.html', productos=productos)

@ventas_bp.route('/resumen')
def ventas_listado():
    conn = conectar()
    cursor = conn.cursor()

    # Obtener todas las ventas
    cursor.execute("""
        SELECT id_venta, fecha, total, id_usuario
        FROM Ventas
        ORDER BY fecha DESC
    """)
    ventas = cursor.fetchall()

    # Calcular el total de todas las ventas
    cursor.execute("SELECT SUM(total) FROM Ventas")
    total_ventas = cursor.fetchone()[0]  # Esto devuelve la suma total
    conn.close()

    return render_template('ventas_listado.html', ventas=ventas, total_ventas=total_ventas)
