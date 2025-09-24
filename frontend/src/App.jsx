import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Productos from "./pages/Productos.jsx";
import Categorias from "./pages/Categorias.jsx";
import Carrito from "./pages/Carrito.jsx";
import Pagos from "./pages/Pagos.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/categorias" element={<Categorias />} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/pagos" element={<Pagos />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/" element={<Home />} />
      <Route path="/homeClientes" element={<Home />} />
    </Routes>
  );
}

export default App;
