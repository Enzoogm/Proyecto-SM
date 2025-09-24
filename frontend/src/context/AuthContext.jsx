import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  // Si no hay usuario logueado, redirige al login
  if (!usuario) {
    navigate("/login");
    return null;
  }

  return (
    <div>
      <h1>Bienvenido, {usuario.nombre}</h1>

      {usuario.nombre.toLowerCase() === "admin" ? (
        <div>
          <h2>Panel de Administración</h2>
          {/* Aquí van los componentes que quieras para admin */}
          <button onClick={() => alert("Ver usuarios")}>Ver Usuarios</button>
          <button onClick={() => alert("Reportes")}>Reportes</button>
        </div>
      ) : (
        <div>
          <h2>Home Clientes</h2>
          {/* Aquí va el contenido para clientes */}
          <p>Puedes ver productos, categorías y tu carrito</p>
          <button onClick={() => navigate("/productos")}>Ver Productos</button>
          <button onClick={() => navigate("/carrito")}>Ir al Carrito</button>
        </div>
      )}
    </div>
  );
}

export default Home;
