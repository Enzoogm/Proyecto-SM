// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Home from "./pages/Home.jsx";
import Productos from "./pages/Productos.jsx";
import Categorias from "./pages/Categorias.jsx";
import Carrito from "./pages/Carrito.jsx";
import Pagos from "./pages/Pagos.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import ProductosPorCategoria from "./pages/Productos_categoria.jsx";
import Layout from "./components/Layout.jsx";
import { useAuth } from "./components/AuthContext.jsx";
import Terminos from "./pages/Terminos.jsx";
import Privacidad from "./pages/Privacidad.jsx";

// 👑 Importamos el Admin completo
import Admin from "./pages/Admin.jsx";

function App() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const { usuario, logout } = useAuth();

  useEffect(() => {
    axios
      .get(`/api/productos`)
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error cargando productos:", err));

    axios
      .get(`/api/categorias`)
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home
              categorias={categorias}
              productos={productos}
              usuario={usuario}
              onLogout={logout}
            />
          </Layout>
        }
      />
      <Route
        path="/homeClientes"
        element={
          <Layout>
            <Home
              categorias={categorias}
              productos={productos}
              usuario={usuario}
              onLogout={logout}
            />
          </Layout>
        }
      />
      <Route
        path="/productos"
        element={
          <Layout>
            <Productos />
          </Layout>
        }
      />
      <Route
        path="/productos/categoria/:id"
        element={
          <Layout>
            <ProductosPorCategoria />
          </Layout>
        }
      />
      <Route
        path="/carrito"
        element={
          <Layout>
            <Carrito />
          </Layout>
        }
      />
      <Route
        path="/pagos"
        element={
          <Layout>
            <Pagos />
          </Layout>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      {/* 👑 Panel Admin */}
      <Route
        path="/admin"
        element={
          usuario?.canAccessAdmin ? (
            <Layout>
              <Admin />
            </Layout>
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/terminos"
        element={
          <Layout>
            <Terminos />
          </Layout>
        }
      />
      <Route
        path="/privacidad"
        element={
          <Layout>
            <Privacidad />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
