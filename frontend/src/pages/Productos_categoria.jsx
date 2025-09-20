import React from 'react';

function ProductosPorCategoria({ categoria, productos }) {
  return (
    <div>
      <h1>Productos de {categoria}</h1>

      {productos && productos.length > 0 ? (
        <ul>
          {productos.map(([id_producto, nombre_prod, descripcion, precio, stock]) => (
            <li key={id_producto}>
              <h3>{nombre_prod}</h3>
              <p>{descripcion}</p>
              <p>Precio: ${precio}</p>
              <p>Stock: {stock}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay productos en esta categoría.</p>
      )}
    </div>
  );
}

export default ProductosPorCategoria;
