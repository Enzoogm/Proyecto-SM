import React, { useEffect, useState } from 'react';

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/ventas')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setVentas(data.ventas);
          setTotalVentas(data.total_ventas);
        }
      })
      .catch(() => setError('Error al cargar las ventas'));
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>Total de ventas: ${totalVentas}</h2>

      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>ID Usuario</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id_venta}>
              <td>{venta.id_venta}</td>
              <td>{venta.fecha}</td>
              <td>${venta.total}</td>
              <td>{venta.id_usuario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Ventas;
