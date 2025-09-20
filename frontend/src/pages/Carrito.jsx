import React from 'react';

function Carrito({ carrito, total, onEliminar, onFinalizar }) {
  const [metodoPago, setMetodoPago] = React.useState('Efectivo');

  const handleEliminar = (id_producto) => {
    if (onEliminar) {
      onEliminar(id_producto);
    }
  };

  const handleFinalizar = (e) => {
    e.preventDefault();
    if (onFinalizar) {
      onFinalizar(metodoPago);
    }
  };

  return (
    <div>
      <h1>Carrito de Compras</h1>
      {carrito && carrito.length > 0 ? (
        <>
          <table border="1">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item.id_producto}>
                  <td>{item.nombre}</td>
                  <td>{item.cantidad}</td>
                  <td>${item.precio}</td>
                  <td>${item.cantidad * item.precio}</td>
                  <td>
                    <button onClick={() => handleEliminar(item.id_producto)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Total: ${total}</h2>

          <form onSubmit={handleFinalizar}>
            <label>
              Método de pago:
              <select
                name="metodo_pago"
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </label>
            <br />
            <br />
            <button type="submit">Finalizar Compra</button>
          </form>
        </>
      ) : (
        <p>El carrito está vacío.</p>
      )}

      <a href="/">Seguir comprando</a> | <a href="/">Volver</a>
    </div>
  );
}

export default Carrito;
