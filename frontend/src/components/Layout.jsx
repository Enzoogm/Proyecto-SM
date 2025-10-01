// src/components/Layout.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function Layout({ children }) {
  const { carrito } = useCart();
  const { usuario, logout } = useAuth();

  return (
    <div>
      {/* Barra superior */}
      <header
        className="navbar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 20px",
          backgroundColor: "#e63946",
          color: "#fff",
        }}
      >
        <h1>Supermercado</h1>

        <input
          type="text"
          placeholder="Buscar producto..."
          style={{
            padding: "5px 10px",
            borderRadius: "5px",
            border: "none",
            width: "250px",
          }}
        />

        <div>
          <Link to="/carrito" style={{ color: "#fff", marginRight: "20px" }}>
            🛒 Carrito ({carrito.length})
          </Link>
          {usuario ? (
            <>
              <span style={{ marginRight: "15px" }}>
                Hola, {usuario.nombre}
              </span>
              <button onClick={logout}>Cerrar sesión</button>
            </>
          ) : (
            <Link to="/login" style={{ color: "#fff", fontWeight: "bold" }}>
              Iniciar sesión
            </Link>
          )}
        </div>
      </header>

      {/* Contenido dinámico */}
      <main style={{ padding: "20px" }}>{children}</main>
    </div>
  );
}

export default Layout;
