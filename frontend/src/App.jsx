import { Routes, Route } from "react-router-dom";
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
import { useAuth } from "./context/AuthContext.jsx"; // 👈 Importar AuthContext

function App() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const { usuario, logout } = useAuth(); // 👈 Traer usuario global

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/productos/all") // 👈 corregido endpoint
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error cargando productos:", err));

    axios
      .get("http://127.0.0.1:5000/api/categorias")
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            categorias={categorias}
            productos={productos}
            usuario={usuario} // 👈 ya no es null
            onLogout={logout} // 👈 logout real
          />
        }
      />
      <Route path="/productos" element={<Productos />} />
      <Route
        path="/categorias"
        element={<Categorias categorias={categorias} />}
      />
      <Route path="/categorias/:id" element={<ProductosPorCategoria />} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/pagos" element={<Pagos />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route
        path="/homeClientes"
        element={
          <Home
            categorias={categorias}
            productos={productos}
            usuario={usuario}
            onLogout={logout}
          />
        }
      />
    </Routes>
  );
}

export default App;
