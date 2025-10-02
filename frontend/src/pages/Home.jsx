// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // 👈 agregado
import { useCart } from "../components/CartContext.jsx";
import { useAuth } from "../components/AuthContext.jsx"; // 👈 agregado
import "../styles/Home.css";

function Home({ busqueda, setBusqueda }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [mostrarCategorias, setMostrarCategorias] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null); // 👈 para filtrar
  const { agregarAlCarrito } = useCart();
  const { usuario } = useAuth(); // 👈 para saber si es admin

  // Cargar productos
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/productos/all")
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        const inicial = data.reduce((acc, p) => {
          acc[p.id] = 1;
          return acc;
        }, {});
        setCantidades(inicial);
      })
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  // Cargar categorías
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

  // Cambiar cantidad de producto
  const manejarCambioCantidad = (id, valor) => {
    setCantidades({
      ...cantidades,
      [id]: Math.max(1, parseInt(valor) || 1),
    });
  };

  // Agregar al carrito
  const handleAgregar = (producto) => {
    const cantidad = cantidades[producto.id] || 1;
    agregarAlCarrito(producto, cantidad);
  };

  // Filtrado por búsqueda y categoría
  const productosFiltrados = productos.filter((p) => {
    const matchBusqueda = p.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const matchCategoria = categoriaSeleccionada
      ? p.id_categoria === categoriaSeleccionada
      : true;
    return matchBusqueda && matchCategoria;
  });

  return (
    <div className="container">
      {/* Sidebar Categorías */}
      <div className="sidebar">
        <h2
          onClick={() => setMostrarCategorias(!mostrarCategorias)}
          className={`categorias-titulo ${mostrarCategorias ? "abierto" : ""}`}
        >
          Categorías
        </h2>

        <div
          className={`categorias-menu ${mostrarCategorias ? "mostrar" : ""}`}
        >
          <ul>
            {categorias.length > 0 ? (
              categorias.map((c) => (
                <li key={c.id}>
                  <button
                    className="categoria-btn"
                    onClick={() => setCategoriaSeleccionada(c.id)}
                  >
                    {c.nombre}
                  </button>
                </li>
              ))
            ) : (
              <li>Cargando categorías...</li>
            )}
            <li>
              <button
                className="categoria-btn"
                onClick={() => setCategoriaSeleccionada(null)}
              >
                Todas
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Productos */}
      <main className="productos">
        <h2>Productos</h2>

        {/* 👑 Link al panel admin */}
        {usuario?.rol === "admin" && (
          <div className="admin-link">
            <Link to="/admin">👑 Ir al Panel de Administración</Link>
          </div>
        )}

        <div className="grid">
          {productosFiltrados.map((p) => (
            <div key={p.id} className="card">
              <h3>{p.nombre}</h3>
              <p>{p.descripcion}</p>
              <p>
                <strong>${p.precio}</strong>
              </p>
              <p>Stock: {p.stock}</p>
              <input
                type="number"
                min="1"
                value={cantidades[p.id] || 1}
                onChange={(e) => manejarCambioCantidad(p.id, e.target.value)}
              />
              <button
                className="btn-agregar"
                onClick={() => handleAgregar(p)}
                disabled={p.stock === 0}
              >
                {p.stock > 0 ? "Agregar al carrito" : "Agotado"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;
