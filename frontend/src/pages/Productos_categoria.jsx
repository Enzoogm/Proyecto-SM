// src/pages/Productos_categoria.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ProductosPorCategoria() {
  const { id } = useParams();
  const [payload, setPayload] = useState({ categoria: "", productos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`${API}/api/productos/categoria/${id}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setPayload)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [API, id]);

  if (loading) return <div className="container my-4">Cargando…</div>;
  if (error) return <div className="container my-4 text-danger">Error: {error}</div>;

  const { categoria, productos } = payload;

  return (
    <div className="container my-4">
      <div className="d-flex align-items-center gap-3 mb-3">
        <h1 className="mb-0">Productos</h1>
        <span className="badge bg-secondary">Categoría: {categoria || id}</span>
      </div>

      {(!productos || productos.length === 0) ? (
        <div className="alert alert-warning">No hay productos en esta categoría.</div>
      ) : (
        <div className="row g-3">
          {productos.map((p) => (
            <div key={p.id_producto} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100">
                {p.imagen_url && (
                  <img
                    src={p.imagen_url}
                    alt={p.nombre_prod}
                    className="card-img-top"
                    style={{ objectFit: "cover", height: 160 }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{p.nombre_prod}</h5>
                  <p className="card-text flex-grow-1">{p.descripcion || "—"}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">${p.precio}</span>
                    <span className={`badge ${p.stock > 0 ? "bg-success" : "bg-danger"}`}>
                      {p.stock > 0 ? `Stock: ${p.stock}` : "Sin stock"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <Link to="/categorias" className="btn btn-outline-secondary">
          ← Volver a categorías
        </Link>
      </div>
    </div>
  );
}
