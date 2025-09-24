import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home({
  categorias = [],
  productos = [],
  usuario,
  onLogout,
  onAgregarAlCarrito,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [cantidades, setCantidades] = useState({});

  useEffect(() => {
    if (productos.length > 0) {
      const inicial = productos.reduce((acc, p) => {
        acc[p.id_producto] = 1;
        return acc;
      }, {});
      setCantidades(inicial);
    }
  }, [productos]);

  const handleCantidadChange = (id_producto, value, max) => {
    const cantidad = Math.min(Math.max(Number(value), 1), max);
    setCantidades((prev) => ({ ...prev, [id_producto]: cantidad }));
  };

  const handleAgregar = (e, id_producto) => {
    e.preventDefault();
    if (onAgregarAlCarrito) {
      onAgregarAlCarrito(id_producto, cantidades[id_producto] || 1);
    }
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="navbar">
        <div className="logo">
          <h1>Supermercado</h1>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Buscar producto, marca o categoría" />
        </div>
        <div className="nav-actions">
          {usuario ? (
            <>
              <span>Hola, {usuario.nombre}</span>
              <button onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <a href="/login">Iniciar sesión</a>
          )}
          <a href="/carrito">🛒 Carrito</a>
        </div>
      </header>

      {/* Main content */}
      <div className="main">
        {/* Sidebar categorías */}
        <aside className="sidebar">
          <h2>Categorías</h2>
          <ul>
            {categorias.map(({ id_categoria, nombre_cat }) => (
              <li key={id_categoria}>
                <Link to={`/productos/categoria/${id_categoria}`}>
                  {nombre_cat}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Productos */}
        <section className="productos">
          {productos.length === 0 ? (
            <p>No hay productos disponibles</p>
          ) : (
            <div className="productos-grid">
              {productos.map((p) => (
                <div className="card" key={p.id_producto}>
                  <h3>{p.nombre_prod}</h3>
                  <p>{p.descripcion}</p>
                  <p>
                    <strong>${p.precio}</strong>
                  </p>
                  <form onSubmit={(e) => handleAgregar(e, p.id_producto)}>
                    <input
                      type="number"
                      value={cantidades[p.id_producto] || 1}
                      min="1"
                      max={p.stock}
                      onChange={(e) =>
                        handleCantidadChange(
                          p.id_producto,
                          e.target.value,
                          p.stock
                        )
                      }
                    />
                    <button type="submit">Agregar al carrito</button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <footer>&copy; 2025 Supermercado Online</footer>
    </div>
  );
}

export default Home;
