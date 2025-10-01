from flask import Blueprint, request, jsonify
from supermercado.db import conectar

pagos_bp = Blueprint("pagos", __name__)

# ✅ Crear un pago
@pagos_bp.route("/crear", methods=["POST"])
def crear_pago():
    data = request.get_json()
    carrito = data.get("carrito", [])
    metodo = data.get("metodo")
    total = data.get("total")
    id_usuario = data.get("id_usuario")

    if not carrito or not total or not id_usuario:
        return jsonify({"error": "Faltan datos"}), 400

    conn = conectar()
    cursor = conn.cursor()

    try:
        # 1️⃣ Crear la venta
        cursor.execute(
            """
            INSERT INTO Ventas (id_usuario, fecha, total)
            VALUES (%s, NOW(), %s)
            """,
            (id_usuario, total),
        )
        conn.commit()
        id_venta = cursor.lastrowid

        # 2️⃣ Guardar detalle de cada producto
        for item in carrito:
            subtotal = float(item["precio"]) * int(item["cantidad"])
            cursor.execute(
                """
                INSERT INTO DetalleVentas (id_venta, id_producto, cantidad, subtotal)
                VALUES (%s, %s, %s, %s)
                """,
                (id_venta, item["id"], item["cantidad"], subtotal),
            )

        # 3️⃣ Guardar en la tabla Pagos (SOLO UNA VEZ)
        cursor.execute(
            """
            INSERT INTO Pagos (id_venta, metodo_pago, monto, fecha_pago)
            VALUES (%s, %s, %s, NOW())
            """,
            (id_venta, metodo, total),
        )

        conn.commit()

        return jsonify({
            "message": "✅ Pago registrado con éxito",
            "id_venta": id_venta,
            "total": total,
            "metodo": metodo,
            "productos": carrito
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()
