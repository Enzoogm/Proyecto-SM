import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Pagos() {
  const { carrito, vaciarCarrito } = useCart();
  const { usuario } = useAuth();
  const [metodo, setMetodo] = useState("tarjeta");
  const [datos, setDatos] = useState({
    nombre: "",
    numero: "",
    vencimiento: "",
    cvv: "",
  });
  const [cupon, setCupon] = useState("");
  const [cuponesDisponibles, setCuponesDisponibles] = useState([]);
  const [descuento, setDescuento] = useState(0);

  const navigate = useNavigate();

  // ✅ calcular subtotal
  const subtotal = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  // ✅ descuento automático por efectivo
  const descuentoEfectivo = metodo === "efectivo" ? subtotal * 0.1 : 0;

  // ✅ total final (forzado a números)
  const totalFinal = Math.max(
    subtotal - Number(descuento) - Number(descuentoEfectivo),
    0
  );

  // 🔹 Traer cupones desde el backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/pagos/cupones")
      .then((res) => res.json())
      .then((data) => {
        console.log("🟢 Cupones disponibles:", data);
        setCuponesDisponibles(data);
      })
      .catch((err) => console.error("Error cargando cupones:", err));
  }, []);

  // 🔹 Aplicar cupón
  const aplicarCupon = () => {
    if (!cupon) {
      alert("⚠️ Ingresá un código de cupón.");
      return;
    }

    const encontrado = cuponesDisponibles.find(
      (c) => c.codigo.toLowerCase() === cupon.toLowerCase()
    );

    if (encontrado) {
      if (encontrado.tipo === "porcentaje") {
        setDescuento((subtotal * Number(encontrado.descuento)) / 100);
      } else {
        setDescuento(Number(encontrado.descuento));
      }
      alert(`✅ Cupón "${cupon}" aplicado!`);
    } else {
      alert("❌ Cupón inválido o no disponible.");
      setDescuento(0);
    }
  };

  // 🔹 Confirmar pago
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario) {
      alert("⚠️ Debes iniciar sesión para poder comprar.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/api/pagos/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carrito,
          metodo,
          subtotal,
          descuento: Number(descuento) + Number(descuentoEfectivo),
          total: totalFinal,
          id_usuario: usuario.id,
          cupon, // ✅ enviamos el cupón al backend
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
      <h3>Subtotal: ${subtotal.toFixed(2)}</h3>
      {descuentoEfectivo > 0 && (
        <h3>Descuento efectivo: -${Number(descuentoEfectivo).toFixed(2)}</h3>
      )}
      {Number(descuento) > 0 && (
        <h3>Descuento cupón: -${Number(descuento).toFixed(2)}</h3>
      )}
      <h2>Total Final: ${Number(totalFinal).toFixed(2)}</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <label>
          <input
            type="radio"
            value="tarjeta"
            checked={metodo === "tarjeta"}
            onChange={() => setMetodo("tarjeta")}
          />{" "}
          Tarjeta
        </label>
        <br />
        <label>
          <input
            type="radio"
            value="efectivo"
            checked={metodo === "efectivo"}
            onChange={() => setMetodo("efectivo")}
          />{" "}
          Efectivo (10% OFF)
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
              onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
            />
            <input
              type="text"
              name="numero"
              placeholder="Número de tarjeta"
              value={datos.numero}
              onChange={(e) => setDatos({ ...datos, numero: e.target.value })}
            />
            <input
              type="text"
              name="vencimiento"
              placeholder="MM/AA"
              value={datos.vencimiento}
              onChange={(e) =>
                setDatos({ ...datos, vencimiento: e.target.value })
              }
            />
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              value={datos.cvv}
              onChange={(e) => setDatos({ ...datos, cvv: e.target.value })}
            />
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
          <input
            type="text"
            placeholder="Código de cupón"
            value={cupon}
            onChange={(e) => setCupon(e.target.value)}
          />
          <button type="button" onClick={aplicarCupon}>
            Aplicar cupón
          </button>
        </div>

        <button type="submit" style={{ marginTop: "15px" }}>
          Confirmar pago
        </button>
      </form>
    </div>
  );
}
