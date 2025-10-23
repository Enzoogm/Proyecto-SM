// src/components/Header.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext.jsx";
import { useAuth } from "./AuthContext.jsx";
import "../styles/header.css";

export default function Header({ busqueda, setBusqueda }) {
  const { carrito } = useCart();
  const { usuario, logout } = useAuth();

  const totalItems = carrito.reduce((acc, it) => acc + (it.cantidad || 0), 0);

  // 🔥 Efecto: agrega/quita la clase .scrolled según el desplazamiento
  useEffect(() => {
    const onScroll = () => {
      const headerEl = document.querySelector(".header");
      if (!headerEl) return;
      if (window.scrollY > 50) headerEl.classList.add("scrolled");
      else headerEl.classList.remove("scrolled");
    };
    onScroll(); // set inicial por si recargan en medio de la página
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Supermercado</Link>
      </div>

      <input
        type="text"
        className="busqueda"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="acciones-usuario">
        <Link to="/carrito" className="carrito-link">
          🛒 Carrito ({totalItems})
        </Link>

        {usuario ? (
          <>
            <span className="usuario">Hola, {usuario.nombre}</span>
            <button className="btn-logout" onClick={logout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link to="/login" className="login-link">
            Iniciar sesión
          </Link>
        )}
      </div>
    </header>
  );
}
