import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../components/CartContext.jsx";
import { useAuth } from "../components/AuthContext.jsx";
import "../styles/Home.css";

function Home({ busqueda, setBusqueda }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [mostrarCategorias, setMostrarCategorias] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);

  const { agregarAlCarrito } = useCart();
  const { usuario } = useAuth();

  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:5000/api/productos")
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        const inicial = data.reduce((acc, p) => {
          acc[p.id_producto] = 1;
          return acc;
        }, {});
        setCantidades(inicial);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando productos:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

  const manejarCambioCantidad = (id, valor) => {
    const nueva = Math.max(1, parseInt(valor) || 1);
    setCantidades({ ...cantidades, [id]: nueva });
  };

  const handleAgregar = (producto) => {
    const cantidad = cantidades[producto.id_producto] || 1;
    agregarAlCarrito(producto, cantidad);
  };

  const productosFiltrados = productos.filter((p) => {
    const matchBusqueda = p.nombre_prod
      ?.toLowerCase()
      .includes(busqueda?.toLowerCase() || "");
    const matchCategoria = categoriaSeleccionada
      ? p.id_categoria === categoriaSeleccionada
      : true;
    return matchBusqueda && matchCategoria;
  });

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="container">
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
                    className={`categoria-btn ${
                      categoriaSeleccionada === c.id ? "activa" : ""
                    }`}
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

      <main className="productos">
        <h2>Productos</h2>

        {usuario?.rol === "admin" && (
          <div className="admin-link">
            <Link to="/admin">👑 Ir al Panel de Administración</Link>
          </div>
        )}

        {productosFiltrados.length === 0 ? (
          <p>No se encontraron productos.</p>
        ) : (
          <div className="grid">
            {productosFiltrados.map((p) => (
              <div key={p.id_producto} className="card">
                <img
                  src={p.imagen_url ? p.imagen_url : "/static/img/no-image.png"}
                  alt={p.nombre_prod}
                  className="producto-img"
                />
                <h3>{p.nombre_prod}</h3>
                <p>{p.descripcion}</p>
                <p>
                  <strong>${p.precio}</strong>
                </p>
                <p>{p.stock > 0 ? `Stock: ${p.stock}` : "Agotado"}</p>

                {/* Contador + botón alineados */}
                <div className="acciones-producto">
                  <div className="cantidad-selector">
                    <button
                      type="button"
                      className="btn-cantidad"
                      onClick={() =>
                        manejarCambioCantidad(
                          p.id_producto,
                          (cantidades[p.id_producto] || 1) - 1
                        )
                      }
                    >
                      –
                    </button>
                    <span className="cantidad">
                      {cantidades[p.id_producto] || 1}
                    </span>
                    <button
                      type="button"
                      className="btn-cantidad"
                      onClick={() =>
                        manejarCambioCantidad(
                          p.id_producto,
                          (cantidades[p.id_producto] || 1) + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="btn-agregar"
                    onClick={() => handleAgregar(p)}
                    disabled={p.stock === 0}
                  >
                    {p.stock > 0 ? "Agregar" : "Agotado"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
