import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext.jsx";
import "../styles/Carrito.css";

export default function Carrito() {
  const { carrito, eliminarDelCarrito, setCantidad, vaciarCarrito } = useCart();
  const navigate = useNavigate();
  const [items, setItems] = useState(carrito);

  useEffect(() => setItems(carrito), [carrito]);

  const money = useMemo(
    () =>
      new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 2,
      }),
    []
  );

  const total = items.reduce(
    (sum, it) => sum + Number(it.precio) * Number(it.cantidad),
    0
  );

  return (
    <div className="carrito-page">
      <div className="carrito-header">
        <button className="btn btn-volver" onClick={() => navigate("/")}>
          Volver a la tienda
        </button>
        <h2 className="titulo">Tu Carrito</h2>
      </div>

      {items.length === 0 ? (
        <div className="carrito-empty">
          <div className="empty-card">
            <h3>Tu carrito está vacío</h3>
            <p>Explorá nuestros productos y empezá a comprar.</p>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Ver productos
            </button>
          </div>
        </div>
      ) : (
        <div className="carrito-layout">
          {/* Columna izquierda: listado */}
          <section className="card listado">
            <table className="carrito-tabla">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td className="td-producto">
                      {/* Si tenés imagen: <img src={it.imagen_url} alt={it.nombre}/> */}
                      <div className="prod-info">
                        <span className="prod-nombre">{it.nombre}</span>
                        {it.marca && <span className="prod-marca">{it.marca}</span>}
                      </div>
                    </td>

                    <td className="td-cantidad">
                      <input
                        type="number"
                        min="1"
                        value={it.cantidad}
                        onChange={(e) => setCantidad(it.id, e.target.value)}
                        className="input-cantidad"
                        aria-label={`Cantidad de ${it.nombre}`}
                      />
                    </td>

                    <td>{money.format(Number(it.precio) || 0)}</td>

                    <td className="td-subtotal">
                      {money.format((Number(it.precio) || 0) * Number(it.cantidad))}
                    </td>

                    <td className="td-acciones">
                      <button
                        className="btn btn-ghost"
                        onClick={() => eliminarDelCarrito(it.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Columna derecha: resumen */}
          <aside className="card resumen">
            <h3>Resumen</h3>
            <div className="resumen-row">
              <span>Total</span>
              <strong className="total">{money.format(total)}</strong>
            </div>

            <div className="resumen-actions">
              <button className="btn btn-outline" onClick={vaciarCarrito}>
                Vaciar carrito
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/pagos")}
              >
                Continuar al pago
              </button>
            </div>

            <p className="hint">
              Los precios finales se confirman en el checkout.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
