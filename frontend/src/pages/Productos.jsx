import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Productos.css";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/productos`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setProductos(data || []))
      .catch((err) => setError(err.message || "Error cargando productos"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container my-4">Cargando productos…</div>;
  if (error)
    return <div className="container my-4 text-danger">Error: {error}</div>;
  if (!productos || productos.length === 0)
    return (
      <div className="container my-4 alert alert-warning">
        No hay productos para mostrar.
      </div>
    );

  return (
    <div className="productos-grid container my-4">
      <div className="row g-3">
        {productos.map((p) => (
          <div
            key={p.id_producto}
            className="col-12 col-sm-6 col-md-4 col-lg-3"
          >
            <div className="card h-100">
              {p.imagen_url && (
                <img
                  src={p.imagen_url}
                  alt={p.nombre_prod}
                  className="card-img-top"
                  style={{ height: 160, objectFit: "cover" }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.nombre_prod}</h5>
                <p className="card-text flex-grow-1">{p.descripcion || "—"}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">${p.precio}</span>
                  <span
                    className={`badge ${
                      p.stock > 0 ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {p.stock > 0 ? `Stock: ${p.stock}` : "Sin stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Productos;
