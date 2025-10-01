// src/pages/Productos.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Productos.css";

function Productos({ onAgregarAlCarrito }) {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/productos/all")
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        const iniciales = data.reduce((acc, p) => {
          acc[p.id_producto] = 1;
          return acc;
        }, {});
        setCantidades(iniciales);
      })
      .catch((err) => console.error(err));
  }, []);

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
    <div className="productos-container">
      <h1 className="productos-titulo">Todos los Productos</h1>

      <div className="productos-grid">
        {productos.map((p) => (
          <div className="producto-card" key={p.id_producto}>
            <img
              src={`/static/img/productos/${p.id_producto}.jpg`}
              alt={p.nombre_prod}
              className="producto-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/static/img/no-image.png";
              }}
            />
            <div className="producto-body">
              <h5>{p.nombre_prod}</h5>
              <p>
                <strong>${p.precio}</strong>
              </p>
              <p>
                {p.stock > 0 ? (
                  <span className="stock-ok">En stock: {p.stock}</span>
                ) : (
                  <span className="stock-no">Agotado</span>
                )}
              </p>
            </div>
            <div className="producto-footer">
              <form
                onSubmit={(e) => handleAgregar(e, p.id_producto)}
                className="form-agregar"
              >
                <input
                  type="number"
                  value={cantidades[p.id_producto]}
                  min="1"
                  max={p.stock}
                  className="input-cantidad"
                  onChange={(e) =>
                    handleCantidadChange(p.id_producto, e.target.value, p.stock)
                  }
                  disabled={p.stock === 0}
                />
                <button
                  type="submit"
                  className="btn-agregar"
                  disabled={p.stock === 0}
                >
                  Agregar
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <div className="productos-acciones">
        <Link to="/carrito" className="btn-ver-carrito">
          Ver carrito
        </Link>
        <Link to="/" className="btn-volver">
          Volver
        </Link>
      </div>
    </div>
  );
}

export default Productos;
