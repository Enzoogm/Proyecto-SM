import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login-register.css';

function Registro({ onRegistro }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onRegistro({ nombre, email });
        navigate('/login'); // redirige a login
      } else {
        setError(data.error || 'Error en registro');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Nombre de usuario:{' '}
          <input
            type="text"
            name="nombre"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </label>
        <br />
        <label>
          Email:{' '}
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Contraseña:{' '}
          <input
            type="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Registrarse</button>
      </form>
      <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
    </div>
  );
}

export default Registro;