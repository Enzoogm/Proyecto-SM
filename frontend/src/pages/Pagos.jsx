import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Pagos() {
  const { carrito, vaciarCarrito } = useCart();
  const { usuario } = useAuth(); // ✅ usuario logueado
  const [metodo, setMetodo] = useState("tarjeta");
  const [datos, setDatos] = useState({
    nombre: "",
    numero: "",
    vencimiento: "",
    cvv: "",
  });

  const navigate = useNavigate();
  const total = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  // 🖊️ Manejo de inputs con validaciones
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "numero") {
      if (/^\d*$/.test(value) && value.length <= 16) {
        setDatos({ ...datos, numero: value });
      }
      return;
    }

    if (name === "vencimiento") {
      let input = value.replace(/\D/g, "");
      if (input.length > 4) input = input.slice(0, 4);
      if (input.length >= 3) {
        input = input.slice(0, 2) + "/" + input.slice(2);
      }
      setDatos({ ...datos, vencimiento: input });
      return;
    }

    if (name === "cvv") {
      if (/^\d*$/.test(value) && value.length <= 3) {
        setDatos({ ...datos, cvv: value });
      }
      return;
    }

    setDatos({ ...datos, [name]: value });
  };

  // 🛒 Confirmar pago
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario) {
      alert("⚠️ Debes iniciar sesión para poder comprar.");
      navigate("/login");
      return;
    }

    if (metodo === "tarjeta") {
      if (!datos.nombre || !datos.numero || !datos.vencimiento || !datos.cvv) {
        alert("⚠️ Completa todos los datos de la tarjeta.");
        return;
      }
      if (datos.numero.length < 16) {
        alert("⚠️ El número de tarjeta debe tener 16 dígitos.");
        return;
      }
      if (datos.vencimiento.length < 5) {
        alert("⚠️ El vencimiento debe tener el formato MM/AA.");
        return;
      }
      if (datos.cvv.length < 3) {
        alert("⚠️ El CVV debe tener 3 dígitos.");
        return;
      }
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/api/pagos/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carrito,
          metodo,
          total,
          id_usuario: usuario.id, // ✅ mandamos id del usuario logueado
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ Pago registrado con éxito (Venta ID: ${data.id_venta})`);
        vaciarCarrito();
        navigate("/");
      } else {
        alert(`❌ Error: ${data.error || "No se pudo registrar el pago"}`);
      }
    } catch (err) {
      console.error("Error en el pago:", err);
      alert("❌ Error al conectar con el servidor.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>💳 Finalizar Compra</h2>
      <h3>Total a pagar: ${total}</h3>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <label>
          <input
            type="radio"
            value="tarjeta"
            checked={metodo === "tarjeta"}
            onChange={() => setMetodo("tarjeta")}
          />{" "}
          Tarjeta de crédito/débito
        </label>
        <br />
        <label>
          <input
            type="radio"
            value="efectivo"
            checked={metodo === "efectivo"}
            onChange={() => setMetodo("efectivo")}
          />{" "}
          Pago en efectivo
        </label>

        {metodo === "tarjeta" && (
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <input
              type="text"
              name="nombre"
              placeholder="Nombre en la tarjeta"
              value={datos.nombre}
              onChange={handleChange}
            />
            <input
              type="text"
              name="numero"
              placeholder="Número de tarjeta (16 dígitos)"
              value={datos.numero}
              onChange={handleChange}
            />
            <input
              type="text"
              name="vencimiento"
              placeholder="MM/AA"
              value={datos.vencimiento}
              onChange={handleChange}
            />
            <input
              type="text"
              name="cvv"
              placeholder="CVV (3 dígitos)"
              value={datos.cvv}
              onChange={handleChange}
            />
          </div>
        )}

        <button type="submit" style={{ marginTop: "15px" }}>
          Confirmar pago
        </button>
      </form>
    </div>
  );
}
