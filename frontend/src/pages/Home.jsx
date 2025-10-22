// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../components/CartContext.jsx";
import { useAuth } from "../components/AuthContext.jsx";
import "../styles/Home.css";
import "../styles/Medios.css";          // << estilos para medios de pago
import SliderPromos from "../components/SliderPromos.jsx";

function Home({ busqueda, setBusqueda }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [mostrarCategorias, setMostrarCategorias] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [productosPorPagina] = useState(10);

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
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch(() => {});
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
    const matchBusqueda = p.nombre_prod?.toLowerCase().includes((busqueda || "").toLowerCase());
    const matchCategoria = categoriaSeleccionada ? p.id_categoria === categoriaSeleccionada : true;
    return matchBusqueda && matchCategoria;
  });

  const indexOfLastProduct = paginaActual * productosPorPagina;
  const indexOfFirstProduct = indexOfLastProduct - productosPorPagina;
  const productosPagina = productosFiltrados.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  const generarRangoPaginas = () => {
    let rango = [];
    let inicio = Math.max(paginaActual - 1, 1);
    let fin = Math.min(paginaActual + 1, totalPaginas);
    if (inicio > 1) rango = [1];
    for (let i = inicio; i <= fin; i++) rango.push(i);
    if (fin < totalPaginas) rango.push(totalPaginas);
    return rango;
  };

  const cambiarPagina = (pagina) => setPaginaActual(pagina);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  /* Logos disponibles en /public/bancos */
  const bancos = [
    { nombre: "Banco Nación", logo: "/bancos/nacion.png" },
    { nombre: "BBVA", logo: "/bancos/bbva.png" },
    { nombre: "Galicia", logo: "/bancos/galicia.png" },
    { nombre: "Santander", logo: "/bancos/santander.png" },
    { nombre: "Visa", logo: "/bancos/visa.png" },
    { nombre: "Mastercard", logo: "/bancos/mastercard.png" },
    { nombre: "Mercado Pago", logo: "/bancos/mercadopago.png" },
    { nombre: "Naranja X", logo: "/bancos/naranjax.png" },
  ];

  return (
    <>
      {/* Slider ancho completo */}
      <SliderPromos />

      <div className="container">
        {/* Sidebar Categorías */}
        <div className="sidebar">
          <h2
            id="categorias"
            onClick={() => setMostrarCategorias(!mostrarCategorias)}
            className={`categorias-titulo ${mostrarCategorias ? "abierto" : ""}`}
          >
            Categorías
          </h2>
          <div className={`categorias-menu ${mostrarCategorias ? "mostrar" : ""}`}>
            <ul>
              {categorias.length > 0 ? (
                categorias.map((c) => (
                  <li key={c.id}>
                    <button
                      className={`categoria-btn ${categoriaSeleccionada === c.id ? "activa" : ""}`}
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
                <button className="categoria-btn" onClick={() => setCategoriaSeleccionada(null)}>
                  Todas
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Productos */}
        <main className="productos">
          <div id="productos" />
          <h2>Productos</h2>

          {usuario?.rol === "admin" && (
            <div className="admin-link">
              <Link to="/admin">👑 Ir al Panel de Administración</Link>
            </div>
          )}

          {productosFiltrados.length === 0 ? (
            <p>No se encontraron productos.</p>
          ) : (
            <>
              <div className="grid">
                {productosPagina.map((p) => (
                  <div key={p.id_producto} className="card">
                    <img
                      src={p.imagen_url ? p.imagen_url : "/static/img/no-image.png"}
                      alt={p.nombre_prod}
                      className="producto-img"
                    />
                    <h3>{p.nombre_prod}</h3>
                    <p>{p.descripcion}</p>
                    <p><strong>${p.precio}</strong></p>
                    <p>{p.stock > 0 ? `Stock: ${p.stock}` : "Agotado"}</p>

                    <div className="cantidad-selector">
                      <button
                        type="button"
                        className="btn-cantidad"
                        onClick={() =>
                          manejarCambioCantidad(p.id_producto, (cantidades[p.id_producto] || 1) - 1)
                        }
                      >
                        –
                      </button>
                      <span className="cantidad">{cantidades[p.id_producto] || 1}</span>
                      <button
                        type="button"
                        className="btn-cantidad"
                        onClick={() =>
                          manejarCambioCantidad(p.id_producto, (cantidades[p.id_producto] || 1) + 1)
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
                ))}
              </div>

              {/* Paginación */}
              <div className="paginacion">
                <button
                  className="pagina-btn flecha-doble"
                  onClick={() => cambiarPagina(1)}
                  disabled={paginaActual === 1}
                  aria-label="Primera página"
                >
                  &laquo;
                </button>
                <button
                  className="pagina-btn flecha"
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  aria-label="Página anterior"
                >
                  &lt;
                </button>
                {generarRangoPaginas().map((num) => (
                  <button
                    key={num}
                    className={`pagina-btn ${paginaActual === num ? "activa" : ""}`}
                    onClick={() => cambiarPagina(num)}
                    aria-label={`Página ${num}`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  className="pagina-btn flecha"
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                  aria-label="Página siguiente"
                >
                  &gt;
                </button>
                <button
                  className="pagina-btn flecha-doble"
                  onClick={() => cambiarPagina(totalPaginas)}
                  disabled={paginaActual === totalPaginas}
                  aria-label="Última página"
                >
                  &raquo;
                </button>
              </div>
            </>
          )}

          {/* =================== MEDIOS DE PAGO =================== */}
          <section id="medios" className="medios">
            <h2>Medios de pago</h2>
            <p className="medios-desc">
              Aceptamos tarjetas y billeteras más usadas. Mirá los bancos con beneficios esta semana:
            </p>

            <div className="medios-grid">
              {bancos.map((b) => (
                <div className="medio-card" key={b.nombre}>
                  <img src={b.logo} alt={b.nombre} loading="lazy" />
                  <span>{b.nombre}</span>
                </div>
              ))}
            </div>

            <div id="legales" className="medios-legales">
              *Beneficios sujetos a aprobación bancaria y condiciones del comercio. Las promos
              pueden variar por día y sucursal.
            </div>
          </section>
          {/* ====================================================== */}
        </main>
      </div>
    </>
  );
}

export default Home;
