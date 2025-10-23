// src/pages/Registro.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "../styles/login-register.css";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { registro, usuario } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await registro(nombre, email, password); // crea cookie y trae /me
      if (usuario?.canAccessAdmin) navigate("/");
      else navigate("/homeClientes");
    } catch (err) {
      setError(err.message || "Error en registro");
    }
  };

  return (
    <div className="form-container">
      <h2>Registro</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="form-box">
        <label>Nombre:</label>
        <input type="text" required value={nombre} onChange={(e)=>setNombre(e.target.value)} />
        <label>Email:</label>
        <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} />
        <label>Contraseña:</label>
        <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button type="submit" className="btn-submit">Registrarse</button>
      </form>
      <p className="redirect">
        ¿Ya tienes cuenta?{" "}
        <span onClick={() => navigate("/login")} className="link">Inicia sesión</span>
      </p>
    </div>
  );
}
