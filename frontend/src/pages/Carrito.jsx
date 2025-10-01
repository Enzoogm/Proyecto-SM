import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Carrito() {
  const { carrito, eliminarDelCarrito, setCantidad, vaciarCarrito } = useCart();
  const navigate = useNavigate();
  const [items, setItems] = useState(carrito);

  useEffect(() => {
    setItems(carrito); // sincronizar con context
  }, [carrito]);

  const total = items.reduce(
    (sum, it) => sum + Number(it.precio) * Number(it.cantidad),
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate("/")}>Volver a la tienda</button>
      <h2>🛒 Tu Carrito</h2>

      {items.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <table
            border="1"
            cellPadding="5"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
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
                      style={{ width: 70 }}
                    />
                  </td>
                  <td>${Number(it.precio).toFixed(2)}</td>
                  <td>
                    ${(Number(it.precio) * Number(it.cantidad)).toFixed(2)}
                  </td>
                  <td>
                    <button onClick={() => eliminarDelCarrito(it.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginTop: 10 }}>Total: ${total.toFixed(2)}</h3>

          <button onClick={vaciarCarrito}>Vaciar Carrito</button>
          <button onClick={() => navigate("/pagos")} style={{ marginLeft: 10 }}>
            Pagar
          </button>
        </>
      )}
    </div>
  );
}
