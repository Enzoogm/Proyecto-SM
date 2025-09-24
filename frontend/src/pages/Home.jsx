import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home({ usuario, onLogout }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [busqueda, setBusqueda] = useState("");

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

  // Cambiar cantidad
  const manejarCambioCantidad = (id, valor) => {
    setCantidades({
      ...cantidades,
      [id]: Math.max(1, parseInt(valor) || 1),
    });
  };

  // Agregar al carrito
  const agregarAlCarrito = (producto) => {
    const cantidad = cantidades[producto.id] || 1;
    console.log(`Agregado al carrito: ${producto.nombre} (x${cantidad})`);
  };

  // Filtrar productos por búsqueda
  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      {/* Barra superior */}
      <header
        className="navbar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "#e63946",
          color: "#fff",
        }}
      >
        <h1 style={{ margin: 0 }}>Supermercado</h1>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            padding: "5px 10px",
            borderRadius: "5px",
            border: "none",
            width: "250px",
          }}
        />

        {/* Usuario / login */}
        <div>
          {usuario ? (
            <>
              <span style={{ marginRight: "15px" }}>
                Hola, {usuario.nombre}
              </span>
              <button
                onClick={onLogout}
                style={{
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/login" style={{ color: "#fff", fontWeight: "bold" }}>
              Iniciar sesión
            </Link>
          )}
        </div>
      </header>

      {/* Contenedor principal */}
      <div className="container">
        {/* Sidebar categorías */}
        <aside>
          <h2>Categorías</h2>
          <ul>
            {categorias.map((c) => (
              <li key={c.id}>
                <Link to={`/productos/categoria/${c.id}`}>{c.nombre}</Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Productos */}
        <main>
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
                  onClick={() => agregarAlCarrito(p)}
                  disabled={p.stock === 0}
                >
                  {p.stock > 0 ? "Agregar al carrito" : "Agotado"}
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
