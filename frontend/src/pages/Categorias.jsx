import React from 'react';
import { Link } from 'react-router-dom'; // Importa solo si usas React Router

function Categorias({ categorias }) {
  return (
    <div>
      <h1>Categorías</h1>
      <ul>
        {categorias.map(({ id_categoria, nombre_cat }) => (
          <li key={id_categoria}>
            {/* Si usas React Router: */}
            <Link to={`/productos/categoria/${id_categoria}`}>
              {nombre_cat}
            </Link>

            {/* Si no usas React Router, usa un enlace normal: */}
            {/* <a href={`/productos/categoria/${id_categoria}`}>{nombre_cat}</a> */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categorias;
