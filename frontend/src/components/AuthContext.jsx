import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  function getToken() {
    return localStorage.getItem("token") || null;
  }

  async function me() {
    try {
      const token = getToken();
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include", // keep cookie support; Authorization preferred
        headers,
      });
      if (res.ok) {
        const data = await res.json();
        setUsuario(data);
        return data;
      } else {
        setUsuario(null);
        return null;
      }
    } catch {
      setUsuario(null);
      return null;
    } finally {
      setCargando(false);
    }
  }

  async function login(email, password) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "Login falló");
    }
    // ensure token is stored if server returned it
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    // call me() which will send Authorization if token present
    return await me();
  }

  async function registro(nombre, email, password) {
    const res = await fetch("/api/auth/registro", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "Registro falló");
    }
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return await me();
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("token"); // <-- limpia token
    setUsuario(null);
  }

  useEffect(() => {
    me();
  }, []);

  return (
    <AuthContext.Provider
      value={{ usuario, cargando, login, registro, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
