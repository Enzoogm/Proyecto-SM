// src/components/Header.jsx
import React from "react";
import "../styles/header.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Header({ busqueda, setBusqueda }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Placeholder para totalItems y logout, reemplaza por lógica real si tienes contexto de carrito y logout
  const totalItems = 0;
  const logout = () => { window.alert("Cerrar sesión (implementa la lógica real)"); };

  const handleAdminClick = (e) => {
    e.preventDefault();
    if (!user) {
      // No autenticado: navegar a login
      navigate("/login");
      return;
    }
    if (user.role === "admin") {
      // Admin: navegar a admin
      navigate("/admin");
      return;
    }
    if (user.role === "cliente") {
      // Cliente: mostrar "sin permisos" pero NO redirigir
      window.alert("Acceso denegado: solo administradores pueden acceder al panel de administración.");
      return;
    }
  };

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
        {user?.rol === "admin" ? (
          // Para admins mostramos un acceso directo al panel en lugar del carrito
          <Link to="/admin" className="admin-link">
            👑 Admin
          </Link>
        ) : (
          <Link to="/carrito" className="carrito-link">
            🛒 Carrito ({totalItems})
          </Link>
        )}

        {user ? (
          <>
            <span className="usuario">Hola, {user.nombre}</span>
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
