import React, { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext();


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);

  async function fetchAuthMe() {
    setLoadingAuth(true);
    try {
      const resp = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const body = await resp.json();
      const userData = body?.user || null;
      setUser(userData);
      setLoadingAuth(false);
      return { user: userData, status: resp.status };
    } catch (err) {
      console.error("fetchAuthMe error:", err);
      setUser(null);
      setLoadingAuth(false);
      return { user: null, status: 0 };
    }
  }

  useEffect(() => {
    fetchAuthMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchAuthMe, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}