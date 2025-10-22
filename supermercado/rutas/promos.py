# supermercado/rutas/promos.py
from flask import Blueprint, jsonify
from supermercado.db import conectar

promos_bp = Blueprint("promos", __name__)

def _rows_to_dicts(cursor, rows):
    cols = [c[0] for c in cursor.description]
    return [dict(zip(cols, r)) for r in rows]

@promos_bp.get("/activas")
def listar_activas():
    db = conectar()
    cur = db.cursor()

    # 1) Promos vigentes y activas
    cur.execute("""
        SELECT
          id, tipo, titulo, subtitulo, descripcion, badge,
          cta_text, cta_anchor, image_url, bg_gradient,
          descuento_pct, descuento_monto, buy_x, get_y,
          empieza, termina, activo, prioridad, creado_en
        FROM Promociones
        WHERE activo = 1
          AND NOW() BETWEEN empieza AND termina
        ORDER BY prioridad ASC, empieza DESC
    """)
    promos = _rows_to_dicts(cur, cur.fetchall())

    if not promos:
        return jsonify([])

    promo_ids = tuple([p["id"] for p in promos])
    if len(promo_ids) == 1:
        promo_ids_sql = f"({promo_ids[0]})"
    else:
        promo_ids_sql = str(promo_ids)

    # 2) Alcance (categorías / productos)
    cur.execute(f"""
        SELECT promo_id, target_tipo, target_id
        FROM Promo_Scope
        WHERE promo_id IN {promo_ids_sql}
    """)
    scopes_rows = _rows_to_dicts(cur, cur.fetchall())

    scopes_map = {}
    for r in scopes_rows:
        scopes_map.setdefault(r["promo_id"], []).append({
            "tipo": r["target_tipo"],
            "id": r["target_id"],
        })

    # 3) Medios de pago
    cur.execute(f"""
        SELECT promo_id, metodo, tope_monto, notas
        FROM Promo_Pagos
        WHERE promo_id IN {promo_ids_sql}
    """)
    pagos_rows = _rows_to_dicts(cur, cur.fetchall())

    pagos_map = {}
    for r in pagos_rows:
        pagos_map.setdefault(r["promo_id"], []).append(r)

    # Merge
    for p in promos:
        p["scope"] = scopes_map.get(p["id"], [])
        p["pagos"] = pagos_map.get(p["id"], [])

    cur.close()
    db.close()
    return jsonify(promos)

@promos_bp.get("/<int:promo_id>")
def obtener_promo(promo_id):
    db = conectar()
    cur = db.cursor()

    cur.execute("""
        SELECT
          id, tipo, titulo, subtitulo, descripcion, badge,
          cta_text, cta_anchor, image_url, bg_gradient,
          descuento_pct, descuento_monto, buy_x, get_y,
          empieza, termina, activo, prioridad, creado_en
        FROM Promociones
        WHERE id = %s
        LIMIT 1
    """, (promo_id,))
    row = cur.fetchone()
    if not row:
        return jsonify({"error": "Promo no encontrada"}), 404

    cols = [c[0] for c in cur.description]
    promo = dict(zip(cols, row))

    cur.execute("""
        SELECT target_tipo, target_id
        FROM Promo_Scope
        WHERE promo_id = %s
    """, (promo_id,))
    promo["scope"] = [{"tipo": t, "id": i} for (t, i) in cur.fetchall()]

    cur.execute("""
        SELECT metodo, tope_monto, notas
        FROM Promo_Pagos
        WHERE promo_id = %s
    """, (promo_id,))
    promo["pagos"] = [{"metodo": m, "tope_monto": tm, "notas": n}
                      for (m, tm, n) in cur.fetchall()]

    cur.close(); db.close()
    return jsonify(promo)
