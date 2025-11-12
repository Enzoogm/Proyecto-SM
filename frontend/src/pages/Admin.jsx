import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "../styles/Admin.css";

export default function Admin() {
  const { user, fetchAuthMe, loadingAuth } = useAuth();
  const [accessStatus, setAccessStatus] = useState(null); // 'loading', 'admin', 'forbidden', 'not-auth'
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

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function checkAccess() {
      setAccessStatus("loading");
      const { user: fetchedUser, status } = await fetchAuthMe();
      if (!mounted) return;

      if (!fetchedUser) {
        // No autenticado
        setAccessStatus("not-auth");
        return;
      }

      if (fetchedUser.role === "admin") {
        setAccessStatus("admin");
        return;
      }

      // Autenticado pero sin rol admin
      setAccessStatus("forbidden");
    }

    checkAccess();
    return () => {
      mounted = false;
    };
  }, []);

  // ------------------------
  // Cargar datos iniciales
  // ------------------------
  useEffect(() => {
    if (user?.rol !== "admin") return;

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
  }, [user]);

  if (accessStatus === "loading" || loadingAuth) {
    return <div style={{ padding: "20px" }}>Cargando...</div>;
  }

  if (accessStatus === "not-auth") {
    return (
      <div style={{ padding: "20px" }}>
        <h2>No autenticado</h2>
        <p>Debes iniciar sesión para acceder al panel de administración.</p>
        <button onClick={() => navigate("/login")}>Ir a Login</button>
      </div>
    );
  }

  if (accessStatus === "forbidden") {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Acceso denegado</h2>
        <p>Solo administradores pueden acceder a esta sección.</p>
        <button onClick={() => navigate("/")}>Volver al inicio</button>
      </div>
    );
  }

  if (accessStatus === "admin") {
    return (
      <div className="admin-page">
        <h1>Panel de administración</h1>
        {/* ------------------------ */}
        {/* Sidebar */}
        {/* ------------------------ */}
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

        {/* ------------------------ */}
        {/* Contenido dinámico */}
        {/* ------------------------ */}
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

  return null;
}
