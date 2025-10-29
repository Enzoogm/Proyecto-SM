// src/pages/Categorias.jsx
import { Link } from "react-router-dom";

export default function Categorias({ categorias = [] }) {
  return (
    <div className="container my-4">
      <h1 className="mb-3">Categorías</h1>

      {categorias.length === 0 ? (
        <div className="alert alert-warning">No hay categorías para mostrar.</div>
      ) : (
        <ul className="list-group">
          {categorias.map((c) => {
            const id = c.id_categoria ?? c.id ?? "";
            const name = c.nombre_cat ?? c.nombre ?? c.name ?? "(sin nombre)";
            return (
              <li key={id} className="list-group-item">
                <Link to={`/categorias/${id}`} className="text-decoration-none">
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
