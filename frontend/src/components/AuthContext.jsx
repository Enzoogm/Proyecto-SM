import React, { createContext, useContext, useState, useEffect } from "react";

// Creamos el contexto
const AuthContext = createContext();

// Hook para usarlo en los componentes
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    // Recupera usuario del localStorage si existe
    const stored = localStorage.getItem("usuario");
    return stored ? JSON.parse(stored) : null;
  });

  // Guarda usuario en state y localStorage
  const login = (user) => {
    // Nos aseguramos de que siempre tenga un rol
    const userWithRole = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol || "cliente", // 👈 si no viene, cliente por defecto
    };

    setUsuario(userWithRole);
    localStorage.setItem("usuario", JSON.stringify(userWithRole));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
