// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../components/CartContext.jsx";
import { useAuth } from "../components/AuthContext.jsx";
import "../styles/Home.css";

function Home({ busqueda, setBusqueda }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const { agregarAlCarrito } = useCart();

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

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

  const manejarCambioCantidad = (id, valor) => {
    setCantidades({
      ...cantidades,
      [id]: Math.max(1, parseInt(valor) || 1),
    });
  };

  const handleAgregar = (producto) => {
    const cantidad = cantidades[producto.id] || 1;
    agregarAlCarrito(producto, cantidad);
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container">
      {/* Sidebar categorías */}
      <aside className="sidebar">
        <h2>Categorías</h2>
        <ul>
          {categorias.map((c) => (
            <li key={c.id}>
              <Link to={`/categorias/${c.id}`}>{c.nombre}</Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Productos */}
      <main className="productos">
        <h2>Productos</h2>
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
