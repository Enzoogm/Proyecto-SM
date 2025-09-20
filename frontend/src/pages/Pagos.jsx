import React from 'react';
import { Link } from 'react-router-dom'; // Si usas React Router

function Pagos({ pagos }) {
  return (
    <div>
      <h1>Pagos Realizados</h1>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Venta</th>
            <th>Método</th>
            <th>Monto</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map((p) => (
            <tr key={p.id_pago}>
              <td>{p.id_pago}</td>
              <td>{p.id_venta}</td>
              <td>{p.metodo_pago}</td>
              <td>${p.monto}</td>
              <td>{p.fecha_pago}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/">Volver</Link>
      {/* Si no usas React Router, usa: <a href="/">Volver</a> */}
    </div>
  );
}

export default Pagos;
