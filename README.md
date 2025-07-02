# Proyecto-SMfrom flask import Flask, render_template, request, redirect
import sqlite3
from datetime import datetime

app = Flask(__name__)

def conectar():
    conn = sqlite3.connect('db/supermercado.db')
    return conn

# Ruta principal
@app.route('/')
def index():
    return render_template('index.html')

# Listado de productos
@app.route('/productos')
def productos():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Productos")
    productos = cursor.fetchall()
    conn.close()
    return render_template('productos.html', productos=productos)

# Formulario de venta
@app.route('/ventas', methods=['GET', 'POST'])
def ventas():
    conn = conectar()
    cursor = conn.cursor()
    if request.method == 'POST':
        id_producto = request.form['id_producto']
        cantidad = int(request.form['cantidad'])
        metodo_pago = request.form['metodo_pago']

        # Precio unitario del producto
        cursor.execute("SELECT precio, stock FROM Productos WHERE id_producto = ?", (id_producto,))
        producto = cursor.fetchone()
        precio_unitario, stock_actual = producto

        if cantidad > stock_actual:
            return "No hay suficiente stock."

        total = cantidad * precio_unitario
        fecha = datetime.now().strftime('%Y-%m-%d')

        # Insertar venta
        cursor.execute("INSERT INTO Ventas (fecha, total) VALUES (?, ?)", (fecha, total))
        id_venta = cursor.lastrowid

        # Insertar detalle de venta
        cursor.execute("INSERT INTO DetalleVentas (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
                       (id_venta, id_producto, cantidad, precio_unitario))

        # Descontar stock
        nuevo_stock = stock_actual - cantidad
        cursor.execute("UPDATE Productos SET stock = ? WHERE id_producto = ?", (nuevo_stock, id_producto))

        # Registrar pago
        cursor.execute("INSERT INTO Pagos (id_venta, metodo_pago, monto, fecha_pago) VALUES (?, ?, ?, ?)",
                       (id_venta, metodo_pago, total, fecha))

        conn.commit()
        conn.close()
        return redirect('/ventas')

    # Obtener productos para seleccionar
    cursor.execute("SELECT id_producto, nombre_prod FROM Productos")
    productos = cursor.fetchall()
    conn.close()
    return render_template('ventas.html', productos=productos)

# Ver pagos
@app.route('/pagos')
def pagos():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Pagos")
    pagos = cursor.fetchall()
    conn.close()
    return render_template('pagos.html', pagos=pagos)

if __name__ == '__main__':
    app.run(debug=True)
