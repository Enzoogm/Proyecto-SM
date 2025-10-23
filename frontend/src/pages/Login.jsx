// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "../styles/login-register.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, usuario } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);  // setea cookie y trae /me
      // decide navegación con flags, no por nombre/rol del storage
      if (usuario?.canAccessAdmin) navigate("/");
      else navigate("/homeClientes");
    } catch (err) {
      setError(err.message || "Email o contraseña incorrectos");
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="form-box">
        <label>Email:</label>
        <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} />
        <label>Contraseña:</label>
        <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button type="submit" className="btn-submit">Entrar</button>
      </form>
      <p className="redirect">
        ¿No tienes cuenta?{" "}
        <span onClick={() => navigate("/registro")} className="link">Regístrate</span>
      </p>
    </div>
  );
}
