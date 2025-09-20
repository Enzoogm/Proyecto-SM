import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Si usas React Router

function Home({ categorias, productos, usuario, onLogout, onAgregarAlCarrito }) {
  const [busqueda, setBusqueda] = useState('');
  const [cantidades, setCantidades] = useState(
    // Inicializa cantidades con 1 para cada producto
    productos.reduce((acc, p) => {
      acc[p[0]] = 1;
      return acc;
    }, {})
  );

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
    <div>
      <header className="header">
        <div className="logo">
          <h1>Supermercado</h1>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar producto, marca o categoría"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button type="button" onClick={() => {/* Implementar búsqueda */}}>
            <i className="fas fa-search"></i>
          </button>
        </div>

        <div className="header-actions">
          <span className="user">
            👋 Hola, <b>{usuario || 'PrimerUsu'}</b>
          </span>
          <button className="btn logout" onClick={onLogout}>
            Cerrar Sesión
          </button>

          <Link to="/carrito" className="btn carrito">
            <i className="fas fa-shopping-cart"></i> Carrito
          </Link>
        </div>
      </header>

      <main className="main-container">
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

        {/* Productos en cards */}
        <section className="productos">
          <h2>Productos</h2>
          <div className="productos-grid">
            {productos.map((p) => {
              const [id_producto, nombre_prod, descripcion, precio, stock] = p;
              return (
                <div className="card" key={id_producto}>
                  <h3>{nombre_prod}</h3>
                  <p>{descripcion}</p>
                  <p>
                    <strong>${precio}</strong>
                  </p>
                  <form onSubmit={(e) => handleAgregar(e, id_producto)}>
                    <input type="hidden" name="id_producto" value={id_producto} />
                    <input
                      type="number"
                      name="cantidad"
                      value={cantidades[id_producto]}
                      min="1"
                      max={stock}
                      onChange={(e) =>
                        handleCantidadChange(id_producto, e.target.value, stock)
                      }
                    />
                    <button type="submit">Agregar al carrito</button>
                  </form>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer>&copy; 2025 Supermercado Online</footer>
    </div>
  );
}

export default Home;
