import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Categorias() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/categoria") // Cambia la ruta si tu API es diferente
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container my-4">
      <h1 className="mb-3">Categorías</h1>
      <ul className="list-group">
        {categorias.map(({ id_categoria, nombre_cat }) => (
          <li key={id_categoria} className="list-group-item">
            <Link to={`/productos/categoria/${id_categoria}`}>
              {nombre_cat}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categorias;
