from flask import Flask, render_template, request, redirect
import sqlite3
from datetime import datetime

app = Flask(__name__)

# Función para conectar a la base de datos con timeout
def conectar():
    return sqlite3.connect('db/supermercado.db', timeout=10)

# Ruta principal
@app.route('/')
def index():
    return render_template('index.html')

# Listado de productos
@app.route('/productos')
def productos():
    try:
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Productos")
        productos = cursor.fetchall()
    except Exception as e:
        return f"Error al obtener productos: {e}"
    finally:
        conn.close()
    return render_template('productos.html', productos=productos)

# Formulario de ventas
@app.route('/ventas', methods=['GET', 'POST'])
def ventas():
    if request.method == 'POST':
        id_producto = request.form['id_producto']
        cantidad = int(request.form['cantidad'])
        metodo_pago = request.form['metodo_pago']
        fecha = datetime.now().strftime('%Y-%m-%d')

        try:
            conn = conectar()
            cursor = conn.cursor()

            # Obtener precio y stock del producto
            cursor.execute("SELECT precio, stock FROM Productos WHERE id_producto = ?", (id_producto,))
            producto = cursor.fetchone()

            if producto is None:
                return "Producto no encontrado."

            precio_unitario, stock_actual = producto

            if cantidad > stock_actual:
                return "No hay suficiente stock disponible."

            total = cantidad * precio_unitario

            # Insertar venta
            cursor.execute("INSERT INTO Ventas (fecha, total) VALUES (?, ?)", (fecha, total))
            id_venta = cursor.lastrowid

            # Insertar detalle
            cursor.execute("""
                INSERT INTO DetalleVentas (id_venta, id_producto, cantidad, precio_unitario)
                VALUES (?, ?, ?, ?)
            """, (id_venta, id_producto, cantidad, precio_unitario))

            # Actualizar stock
            nuevo_stock = stock_actual - cantidad
            cursor.execute("UPDATE Productos SET stock = ? WHERE id_producto = ?", (nuevo_stock, id_producto))

            # Registrar pago
            cursor.execute("""
                INSERT INTO Pagos (id_venta, metodo_pago, monto, fecha_pago)
                VALUES (?, ?, ?, ?)
            """, (id_venta, metodo_pago, total, fecha))

            conn.commit()
            return redirect('/ventas')

        except sqlite3.OperationalError as e:
            conn.rollback()
            return f"Error de base de datos: {e}"
        except Exception as e:
            conn.rollback()
            return f"Error general: {e}"
        finally:
            conn.close()

    # Método GET: mostrar formulario
    try:
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("SELECT id_producto, nombre_prod FROM Productos")
        productos = cursor.fetchall()
    except Exception as e:
        return f"Error al cargar productos: {e}"
    finally:
        conn.close()

    return render_template('ventas.html', productos=productos)

# Ver pagos
@app.route('/pagos')
def pagos():
    try:
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Pagos")
        pagos = cursor.fetchall()
    except Exception as e:
        return f"Error al cargar pagos: {e}"
    finally:
        conn.close()
    return render_template('pagos.html', pagos=pagos)

if __name__ == '__main__':
    app.run(debug=True)
