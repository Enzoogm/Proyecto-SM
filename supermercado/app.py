from flask import Flask, render_template
from supermercado.rutas.productos import productos_bp, obtener_categorias
from supermercado.rutas.ventas import ventas_bp
from supermercado.rutas.pagos import pagos_bp
from supermercado.rutas.carrito import carrito_bp
from supermercado.rutas.auth import auth_bp
from supermercado.db import conectar

app = Flask(__name__)
app.secret_key = 'tu_clave_secreta_muy_segura_123456'

# Registrar blueprints
app.register_blueprint(productos_bp)
app.register_blueprint(ventas_bp)
app.register_blueprint(pagos_bp)
app.register_blueprint(carrito_bp)
app.register_blueprint(auth_bp)

@app.route('/')
def index():
    categorias = obtener_categorias()

    # Traemos todos los productos
    db = conectar()
    cursor = db.cursor()
    cursor.execute("SELECT id_producto, nombre_prod, descripcion, precio, stock FROM `Productos`")
    productos = cursor.fetchall()

    return render_template('index.html', categorias=categorias, productos=productos)

# Ejecutar app
if __name__ == '__main__':
    app.run(debug=True)
