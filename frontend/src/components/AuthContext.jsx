// src/components/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  async function me() {
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUsuario(data); // { id, nombre?, canAccessAdmin }
      } else {
        setUsuario(null);
      }
    } catch {
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }

  async function login(email, password) {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      credentials: "include", // cookie httpOnly
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Login falló");
    }
    await me(); // refresca el estado de usuario desde /me
  }

  async function registro(nombre, email, password) {
    const res = await fetch("http://localhost:5000/api/auth/registro", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Registro falló");
    }
    await me();
  }

  async function logout() {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUsuario(null);
  }

  useEffect(() => { me(); }, []);

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
