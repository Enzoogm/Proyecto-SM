// src/pages/Carrito.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  // Cargar carrito desde sessionStorage al iniciar
  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("carrito")) || [];
    setCarrito(storedCart);
  }, []);

  // Eliminar un producto
  const handleEliminar = (id_producto) => {
    const updatedCart = carrito.filter(
      (item) => item.id_producto !== id_producto
    );
    setCarrito(updatedCart);
    sessionStorage.setItem("carrito", JSON.stringify(updatedCart));
  };

  // Vaciar carrito
  const handleVaciar = () => {
    setCarrito([]);
    sessionStorage.removeItem("carrito");
  };

  // Ir a página de pago
  const handlePagar = () => {
    navigate("/pagos"); // O tu ruta de simulación de compra
  };

  // Calcular total
  const total = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate("/")}>Volver a la tienda</button>
      <h2>🛒 Tu Carrito</h2>

      {carrito.length > 0 ? (
        <>
          <table border="1" cellPadding="5">
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
              {carrito.map((item, index) => (
                <tr key={item.id_producto || index}>
                  <td>{item.nombre}</td>
                  <td>{item.cantidad}</td>
                  <td>${item.precio}</td>
                  <td>${item.precio * item.cantidad}</td>
                  <td>
                    <button onClick={() => handleEliminar(item.id_producto)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Total: ${total}</h3>
          <button onClick={handleVaciar}>Vaciar Carrito</button>
          <button onClick={handlePagar} style={{ marginLeft: "10px" }}>
            Pagar
          </button>
        </>
      ) : (
        <p>Tu carrito está vacío.</p>
      )}
    </div>
  );
}
