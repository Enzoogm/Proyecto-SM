from flask import Blueprint, request, jsonify
from supermercado.db import conectar

ventas_bp = Blueprint('ventas', __name__)

@ventas_bp.route('/ventas', methods=['POST'])
def registrar_venta_api():
    data = request.get_json()
    id_producto = data.get('id_producto')
    cantidad = data.get('cantidad')
    metodo_pago = data.get('metodo_pago')

    if not id_producto or not cantidad or not metodo_pago:
        return jsonify({'error': 'Faltan datos'}), 400

    error = registrar_venta(id_producto, cantidad, metodo_pago)
    if error:
        return jsonify({'error': error}), 400

    return jsonify({'message': 'Venta registrada correctamente'}), 201

@ventas_bp.route('/ventas', methods=['GET'])
def obtener_ventas():
    conn = conectar()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id_venta, fecha, total, id_usuario
        FROM Ventas
        ORDER BY fecha DESC
    """)
    ventas = cursor.fetchall()

    cursor.execute("SELECT COALESCE(SUM(total), 0) FROM Ventas")
    total_ventas = cursor.fetchone()[0]

    conn.close()

    lista_ventas = [{
        'id_venta': v[0],
        'fecha': v[1].strftime('%Y-%m-%d %H:%M:%S') if v[1] else '',
        'total': v[2],
        'id_usuario': v[3]
    } for v in ventas]

    return jsonify({
        'total_ventas': total_ventas,
        'ventas': lista_ventas
    })

def registrar_venta(id_producto, cantidad, metodo_pago):
    conn = conectar()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT precio, stock FROM Productos WHERE id_producto = %s", (id_producto,))
        producto = cursor.fetchone()
        if producto is None:
            return "Producto no encontrado."
        precio_unitario, stock_actual = producto
        if cantidad > stock_actual:
            return "No hay suficiente stock."

        total = cantidad * precio_unitario

        cursor.execute("INSERT INTO Ventas (fecha, total) VALUES (NOW(), %s)", (total,))
        id_venta = cursor.lastrowid

        cursor.execute("""
            INSERT INTO DetalleVentas (id_venta, id_producto, cantidad, precio_unitario)
            VALUES (%s, %s, %s, %s)
        """, (id_venta, id_producto, cantidad, precio_unitario))

        cursor.execute("UPDATE Productos SET stock = stock - %s WHERE id_producto = %s", (cantidad, id_producto))
        cursor.execute("""
            INSERT INTO Pagos (id_venta, metodo_pago, monto, fecha_pago)
            VALUES (%s, %s, %s, NOW())
        """, (id_venta, metodo_pago, total))

        conn.commit()
        return None
    except Exception as e:
        conn.rollback()
        return str(e)
    finally:
        conn.close()