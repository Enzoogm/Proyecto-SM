# supermercado/rutas/pagos.py
from flask import Blueprint, request, jsonify
from supermercado.db import conectar

pagos_bp = Blueprint("pagos", __name__)

# ✅ Obtener cupones disponibles
@pagos_bp.route("/cupones", methods=["GET"])
def obtener_cupones():
    conn = conectar()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT codigo, descuento
            FROM Cupones
            WHERE activo = TRUE AND fecha_expiracion >= CURDATE()
        """)
        cupones = cursor.fetchall()
        return jsonify(cupones), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# ✅ Crear un pago
@pagos_bp.route("/crear", methods=["POST"])
def crear_pago():
    data = request.get_json()
    carrito = data.get("carrito", [])
    metodo = data.get("metodo")
    total = data.get("total")
    id_usuario = data.get("id_usuario")
    cupon_codigo = data.get("cupon")  

    if not carrito or not total or not id_usuario:
        return jsonify({"error": "Faltan datos"}), 400

    conn = conectar()
    cursor = conn.cursor(dictionary=True)

    try:
        subtotal = sum(float(item["precio"]) * int(item["cantidad"]) for item in carrito)
        descuento_total = 0.0

        # Descuento efectivo
        if metodo.lower() == "efectivo":
            descuento_total += subtotal * 0.10  

        # Validar cupon si vino
        if cupon_codigo:
            cursor.execute(
                """
                SELECT descuento FROM Cupones
                WHERE codigo = %s AND activo = TRUE AND fecha_expiracion >= CURDATE()
                """,
                (cupon_codigo,),
            )
            cupon = cursor.fetchone()
            if cupon:
                # Por ahora asumimos que el descuento es un valor fijo (ej: $200)
                descuento_total += cupon["descuento"]

        total_final = max(subtotal - descuento_total, 0)

        # Insertar Venta
        cursor.execute(
            """
            INSERT INTO Ventas (id_usuario, fecha, subtotal, descuento, total)
            VALUES (%s, NOW(), %s, %s, %s)
            """,
            (id_usuario, subtotal, descuento_total, total_final),
        )
        conn.commit()
        id_venta = cursor.lastrowid

        # Insertar Detalle
        for item in carrito:
            subtotal_item = float(item["precio"]) * int(item["cantidad"])
            cursor.execute(
                """
                INSERT INTO DetalleVentas (id_venta, id_producto, cantidad, subtotal)
                VALUES (%s, %s, %s, %s)
                """,
                (id_venta, item["id"], item["cantidad"], subtotal_item),
            )

        # Insertar Pago
        cursor.execute(
            """
            INSERT INTO Pagos (id_venta, metodo_pago, monto, fecha_pago)
            VALUES (%s, %s, %s, NOW())
            """,
            (id_venta, metodo, total_final),
        )
        conn.commit()

        return jsonify({
            "message": "✅ Pago registrado con éxito",
            "id_venta": id_venta,
            "subtotal": subtotal,
            "descuento": descuento_total,
            "total": total_final,
            "metodo": metodo,
            "productos": carrito
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
