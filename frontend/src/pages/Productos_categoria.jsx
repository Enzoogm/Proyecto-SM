import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProductosPorCategoria() {
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/api/productos/categoria/${id}`)
      .then((res) => {
        setCategoria(res.data.categoria);
        setProductos(res.data.productos);
      })
      .catch((err) =>
        console.error("Error cargando productos por categoría:", err)
      );
  }, [id]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Productos de {categoria}</h2>
      {productos.length === 0 ? (
        <p>No hay productos en esta categoría.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "15px",
          }}
        >
          {productos.map((p) => (
            <div
              key={p.id_producto}
              className="card"
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <h3>{p.nombre_prod}</h3>
              <p>{p.descripcion}</p>
              <p>
                <strong>${p.precio}</strong>
              </p>
              <p>{p.stock > 0 ? `Stock: ${p.stock}` : "Agotado"}</p>
              <input
                type="number"
                min="1"
                defaultValue={1}
                style={{ width: "60px", marginRight: "10px" }}
                disabled={p.stock === 0}
              />
              <button disabled={p.stock === 0}>
                {p.stock > 0 ? "Agregar al carrito" : "Agotado"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductosPorCategoria;
