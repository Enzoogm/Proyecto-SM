import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login-register.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(data, res.status);

      if (res.status === 200) {
        login(data.usuario); // guardamos usuario globalmente
        if (data.usuario.nombre.toLowerCase() === "admin") {
          navigate("/"); // admin al home general
        } else {
          navigate("/homeClientes"); // cliente al home de clientes
        }
      } else {
        setError(data.error || "Email o contraseña incorrectos");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Contraseña:</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
      <p>
        ¿No tienes cuenta?{" "}
        <span
          onClick={() => navigate("/registro")}
          style={{ cursor: "pointer", color: "blue" }}
        >
          Regístrate
        </span>
      </p>
    </div>
  );
}

export default Login;
