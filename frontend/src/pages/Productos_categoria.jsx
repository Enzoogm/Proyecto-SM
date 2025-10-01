// src/pages/Productos_categoria.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../components/CartContext.jsx";
import { useAuth } from "../components/AuthContext.jsx";
import "../styles/ProductosCategoria.css";

function ProductosPorCategoria() {
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [cantidades, setCantidades] = useState({});
  const { agregarAlCarrito } = useCart();

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/productos/categoria/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCategoria(data.categoria);
        setProductos(data.productos);
        const inicial = data.productos.reduce((acc, p) => {
          acc[p.id_producto] = 1;
          return acc;
        }, {});
        setCantidades(inicial);
      })
      .catch((err) => {
        console.error("Error cargando productos por categoría:", err);
        setCategoria("Categoría no encontrada");
        setProductos([]);
      });
  }, [id]);

  const manejarCambioCantidad = (id, valor) => {
    setCantidades({
      ...cantidades,
      [id]: Math.max(1, parseInt(valor) || 1),
    });
  };

  const handleAgregar = (producto) => {
    const cantidad = cantidades[producto.id_producto] || 1;
    agregarAlCarrito(
      {
        id: producto.id_producto,
        nombre: producto.nombre_prod,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
      },
      cantidad
    );
  };

  return (
    <div className="categoria-container">
      <h2>Productos de {categoria}</h2>

      {productos.length === 0 ? (
        <p>No hay productos en esta categoría.</p>
      ) : (
        <div className="grid">
          {productos.map((p) => (
            <div key={p.id_producto} className="card">
              <h3>{p.nombre_prod}</h3>
              <p>{p.descripcion}</p>
              <p>
                <strong>${p.precio}</strong>
              </p>
              <p>{p.stock > 0 ? `Stock: ${p.stock}` : "Agotado"}</p>
              <input
                type="number"
                min="1"
                value={cantidades[p.id_producto] || 1}
                onChange={(e) =>
                  manejarCambioCantidad(p.id_producto, e.target.value)
                }
              />
              <button
                onClick={() => handleAgregar(p)}
                disabled={p.stock === 0}
                className="btn-agregar"
              >
                {p.stock > 0 ? "Agregar al carrito" : "Agotado"}
              </button>
            </div>
          ))}
        </div>
      )}

      <Link to="/" className="btn-volver">
        ⬅ Volver al Home
      </Link>
    </div>
  );
}

export default ProductosPorCategoria;
