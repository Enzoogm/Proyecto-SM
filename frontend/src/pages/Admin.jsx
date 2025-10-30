// src/pages/Admin.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext.jsx";
import "../styles/Admin.css";

export default function Admin() {
  const { usuario } = useAuth();
  const [vista, setVista] = useState("dashboard");
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [stats, setStats] = useState({
    productos_vendidos: 0,
    total_dinero: 0,
  });

  // Inputs para crear producto
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_prod: "",
    descripcion: "",
    precio: "",
    stock: "",
    id_categoria: "",
  });

  // Input para nueva categoría
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  // ------------------------
  // Cargar datos iniciales
  // ------------------------
  useEffect(() => {
    if (usuario?.rol !== "admin") return;

    fetch(`/api/admin/stats`)
      .then((res) => res.json())
      .then(setStats);

    fetch(`/api/admin/productos`)
      .then((res) => res.json())
      .then(setProductos);

    fetch(`/api/admin/ventas`)
      .then((res) => res.json())
      .then(setVentas);

    fetch(`/api/admin/categorias`)
      .then((res) => res.json())
      .then(setCategorias);

    fetch(`/api/admin/usuarios`)
      .then((res) => res.json())
      .then(setUsuarios);
  }, [usuario]);

  if (!usuario || usuario.rol !== "admin") {
    return <h2>⚠️ Acceso denegado. Solo administradores.</h2>;
  }

  // ------------------------
  // Productos
  // ------------------------
  const handleCrearProducto = () => {
    fetch(`/api/admin/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoProducto),
    })
      .then((res) => res.json())
      .then(() => {
        setNuevoProducto({
          nombre_prod: "",
          descripcion: "",
          precio: "",
          stock: "",
          id_categoria: "",
        });
        setVista("productos");
      });
  };

  const handleActualizarStock = (id, nuevoStock) => {
    fetch(`/api/admin/productos/${id}/stock`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: nuevoStock }),
    }).then(() => setVista("productos"));
  };

  const handleEliminarProducto = (id) => {
    fetch(`/api/admin/productos/${id}`, {
      method: "DELETE",
    }).then(() => setVista("productos"));
  };

  // ------------------------
  // Categorías
  // ------------------------
  const handleCrearCategoria = () => {
    fetch(`/api/admin/categorias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nuevaCategoria }),
    })
      .then((res) => res.json())
      .then(() => {
        setNuevaCategoria("");
        setVista("categorias");
      });
  };

  const handleEliminarCategoria = (id) => {
    fetch(`/api/admin/categorias/${id}`, {
      method: "DELETE",
    }).then(() => setVista("categorias"));
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>👑 Admin</h2>
        <ul>
          <li onClick={() => setVista("dashboard")}>📊 Dashboard</li>
          <li onClick={() => setVista("productos")}>📦 Productos</li>
          <li onClick={() => setVista("ventas")}>💰 Ventas</li>
          <li onClick={() => setVista("categorias")}>📂 Categorías</li>
          <li onClick={() => setVista("usuarios")}>👥 Usuarios</li>
        </ul>
      </aside>

      {/* Contenido dinámico */}
      <main className="admin-content">
        {/* DASHBOARD */}
        {vista === "dashboard" && (
          <div>
            <h1>📊 Dashboard</h1>
            <div className="admin-dashboard">
              <div className="stat-card">
                <h3>📦 Productos</h3>
                <p>{productos.length}</p>
              </div>
              <div className="stat-card">
                <h3>📂 Categorías</h3>
                <p>{categorias.length}</p>
              </div>
              <div className="stat-card">
                <h3>👥 Usuarios</h3>
                <p>{usuarios.length}</p>
              </div>
              <div className="stat-card">
                <h3>💰 Ventas</h3>
                <p>{ventas.length}</p>
              </div>
              <div className="stat-card">
                <h3>🛒 Productos vendidos</h3>
                <p>{stats.productos_vendidos}</p>
              </div>
              <div className="stat-card">
                <h3>💵 Total facturado</h3>
                <p>${stats.total_dinero.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTOS */}
        {vista === "productos" && (
          <div>
            <h1>📦 Productos</h1>
            <h3>Agregar nuevo producto</h3>
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoProducto.nombre_prod}
              onChange={(e) =>
                setNuevoProducto({
                  ...nuevoProducto,
                  nombre_prod: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Descripción"
              value={nuevoProducto.descripcion}
              onChange={(e) =>
                setNuevoProducto({
                  ...nuevoProducto,
                  descripcion: e.target.value,
                })
              }
            />
            <input
              type="number"
              placeholder="Precio"
              value={nuevoProducto.precio}
              onChange={(e) =>
                setNuevoProducto({ ...nuevoProducto, precio: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Stock"
              value={nuevoProducto.stock}
              onChange={(e) =>
                setNuevoProducto({ ...nuevoProducto, stock: e.target.value })
              }
            />
            <select
              value={nuevoProducto.id_categoria}
              onChange={(e) =>
                setNuevoProducto({
                  ...nuevoProducto,
                  id_categoria: e.target.value,
                })
              }
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((c) => (
                <option key={c.id_categoria} value={c.id_categoria}>
                  {c.nombre_cat}
                </option>
              ))}
            </select>
            <button onClick={handleCrearProducto}>Agregar</button>

            <h3>Lista de productos</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id_producto}>
                    <td>{p.id_producto}</td>
                    <td>{p.nombre_prod}</td>
                    <td>${p.precio}</td>
                    <td>
                      <input
                        type="number"
                        defaultValue={p.stock}
                        onBlur={(e) =>
                          handleActualizarStock(p.id_producto, e.target.value)
                        }
                      />
                    </td>
                    <td>{p.categoria || "Sin categoría"}</td>
                    <td>
                      <button
                        className="btn-danger"
                        onClick={() => handleEliminarProducto(p.id_producto)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VENTAS */}
        {vista === "ventas" && (
          <div>
            <h1>💰 Ventas</h1>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID Venta</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Cliente</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((v) => (
                  <tr key={v.id_venta}>
                    <td>{v.id_venta}</td>
                    <td>{new Date(v.fecha).toLocaleString()}</td>
                    <td>${v.total}</td>
                    <td>{v.cliente || "Desconocido"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CATEGORÍAS */}
        {vista === "categorias" && (
          <div>
            <h1>📂 Categorías</h1>
            <input
              type="text"
              placeholder="Nueva categoría"
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
            />
            <button onClick={handleCrearCategoria}>Agregar</button>

            <ul>
              {categorias.map((c) => (
                <li key={c.id_categoria}>
                  {c.nombre_cat}
                  <button
                    onClick={() => handleEliminarCategoria(c.id_categoria)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* USUARIOS */}
        {vista === "usuarios" && (
          <div>
            <h1>👥 Usuarios</h1>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id_usuario}>
                    <td>{u.id_usuario}</td>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>{u.rol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
