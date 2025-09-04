
import mysql.connector
from datetime import datetime


def conectar():
    return mysql.connector.connect(
        host="10.9.120.5",
        port=3306,
        user="supermercado",
        password="super1234",  
        database="SupermercadoOnline"
    )

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
        return None  # Ningún error
    except Exception as e:
        conn.rollback()
        return str(e)
    finally:
        conn.close()
