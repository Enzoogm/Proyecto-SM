import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Productos({ onAgregarAlCarrito }) {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/productos/all") // ✅ corregido
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        // Inicializar cantidades en 1
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
    <div className="container my-4">
      <h1 className="text-center mb-4">Todos los Productos</h1>

      <div className="row">
        {productos.map((p) => (
          <div className="col-md-3 mb-4" key={p.id_producto}>
            <div className="card h-100 shadow-sm">
              <img
                src={`/static/img/productos/${p.id_producto}.jpg`}
                className="card-img-top"
                alt={p.nombre_prod} // ✅ corregido
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/static/img/no-image.png";
                }}
              />
              <div className="card-body">
                <h5 className="card-title">{p.nombre_prod}</h5>{" "}
                {/* ✅ corregido */}
                <p className="card-text">
                  <strong>${p.precio}</strong>
                </p>
                <p className="card-text">
                  {p.stock > 0 ? (
                    <span className="text-success">En stock: {p.stock}</span>
                  ) : (
                    <span className="text-danger">Agotado</span>
                  )}
                </p>
              </div>
              <div className="card-footer text-center">
                <form
                  onSubmit={(e) => handleAgregar(e, p.id_producto)}
                  className="d-flex justify-content-center align-items-center"
                >
                  <input
                    type="number"
                    value={cantidades[p.id_producto]}
                    min="1"
                    max={p.stock}
                    className="form-control form-control-sm w-25 me-2"
                    onChange={(e) =>
                      handleCantidadChange(
                        p.id_producto,
                        e.target.value,
                        p.stock
                      )
                    }
                    disabled={p.stock === 0}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={p.stock === 0}
                  >
                    Agregar
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <Link to="/carrito" className="btn btn-warning me-2">
          Ver carrito
        </Link>
        <Link to="/" className="btn btn-secondary">
          Volver
        </Link>
      </div>
    </div>
  );
}

export default Productos;
