// src/pages/Carrito.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext.jsx";
import "../styles/Carrito.css";

export default function Carrito() {
  const { carrito, eliminarDelCarrito, setCantidad, vaciarCarrito } = useCart();
  const navigate = useNavigate();
  const [items, setItems] = useState(carrito);

  useEffect(() => {
    setItems(carrito);
  }, [carrito]);

  const total = items.reduce(
    (sum, it) => sum + Number(it.precio) * Number(it.cantidad),
    0
  );

  return (
    <div className="carrito-container">
      <button className="btn-volver" onClick={() => navigate("/")}>
        Volver a la tienda
      </button>
      <h2>🛒 Tu Carrito</h2>

      {items.length === 0 ? (
        <p className="carrito-vacio">Tu carrito está vacío.</p>
      ) : (
        <>
          <table className="carrito-tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>{it.nombre}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={it.cantidad}
                      onChange={(e) => setCantidad(it.id, e.target.value)}
                      className="input-cantidad"
                    />
                  </td>
                  <td>${Number(it.precio).toFixed(2)}</td>
                  <td>
                    ${(Number(it.precio) * Number(it.cantidad)).toFixed(2)}
                  </td>
                  <td>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarDelCarrito(it.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="carrito-total">Total: ${total.toFixed(2)}</h3>

          <div className="carrito-acciones">
            <button className="btn-vaciar" onClick={vaciarCarrito}>
              Vaciar Carrito
            </button>
            <button className="btn-pagar" onClick={() => navigate("/pagos")}>
              Pagar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
