// src/pages/Productos_categoria.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function ProductosPorCategoria() {
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [cantidades, setCantidades] = useState({});
  const { agregarAlCarrito, carrito } = useCart();
  const { usuario, logout } = useAuth();

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
    <div>
      {/* 🔹 Barra superior (misma que en Home) */}
      <header
        className="navbar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "#e63946",
          color: "#fff",
        }}
      >
        <h1>Supermercado</h1>

        <div>
          <Link to="/carrito" style={{ color: "#fff", marginRight: "20px" }}>
            🛒 Carrito ({carrito.reduce((acc, item) => acc + item.cantidad, 0)})
          </Link>
          {usuario ? (
            <>
              <span style={{ marginRight: "15px" }}>
                Hola, {usuario.nombre}
              </span>
              <button onClick={logout}>Cerrar sesión</button>
            </>
          ) : (
            <Link to="/login" style={{ color: "#fff", fontWeight: "bold" }}>
              Iniciar sesión
            </Link>
          )}
        </div>
      </header>

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
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
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
                  value={cantidades[p.id_producto] || 1}
                  onChange={(e) =>
                    manejarCambioCantidad(p.id_producto, e.target.value)
                  }
                />
                <button
                  onClick={() => handleAgregar(p)}
                  disabled={p.stock === 0}
                >
                  {p.stock > 0 ? "Agregar al carrito" : "Agotado"}
                </button>
              </div>
            ))}
          </div>
        )}

        <Link to="/" style={{ display: "block", marginTop: "20px" }}>
          ⬅ Volver al Home
        </Link>
      </div>
    </div>
  );
}

export default ProductosPorCategoria;
