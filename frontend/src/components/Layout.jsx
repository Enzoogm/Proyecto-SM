// src/components/Layout.jsx
import React, { useState } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import "../styles/layout.css";

function Layout({ children }) {
  const [busqueda, setBusqueda] = useState(""); // 👈 estado global de búsqueda

  return (
    <div>
      <Header busqueda={busqueda} setBusqueda={setBusqueda} />
      <main style={{ padding: "20px" }}>
        {/* Inyectamos la búsqueda a los hijos si lo necesitan */}
        {React.cloneElement(children, { busqueda })}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
