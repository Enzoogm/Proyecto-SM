import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// 🔧 Normalizar SIEMPRE el producto a una forma canónica
const toCanonical = (p) => {
  const id = p.id ?? p.id_producto; // venga de /all o /categoria
  return {
    id, // ← clave única usada en TODO el carrito
    nombre: p.nombre ?? p.nombre_prod ?? "",
    descripcion: p.descripcion ?? "",
    precio: Number(p.precio ?? 0),
    stock: Number(p.stock ?? 0),
    // guardo por compatibilidad (no se usan como clave)
    id_producto: id,
    id_categoria: p.id_categoria ?? p.categoria_id ?? null,
  };
};

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const stored = sessionStorage.getItem("carrito");
    return stored ? JSON.parse(stored) : [];
  });

  // Persistencia
  useEffect(() => {
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // 🛒 Agregar (si existe → suma cantidades)
  const agregarAlCarrito = (producto, cantidad = 1) => {
    const canon = toCanonical(producto);
    const qty = Math.max(1, Number(cantidad) || 1);

    setCarrito((prev) => {
      const existe = prev.find((it) => it.id === canon.id);
      if (existe) {
        return prev.map((it) =>
          it.id === canon.id ? { ...it, cantidad: it.cantidad + qty } : it
        );
      }
      return [...prev, { ...canon, cantidad: qty }];
    });
  };

  // ✏️ Cambiar cantidad absoluta (desde el carrito)
  const setCantidad = (id, cantidad) => {
    const qty = Math.max(1, Number(cantidad) || 1);
    setCarrito((prev) =>
      prev.map((it) => (it.id === id ? { ...it, cantidad: qty } : it))
    );
  };

  // 🗑️ Eliminar 1 item
  const eliminarDelCarrito = (idOrProduct) => {
    const id =
      typeof idOrProduct === "object"
        ? toCanonical(idOrProduct).id
        : idOrProduct;
    setCarrito((prev) => prev.filter((it) => it.id !== id));
  };

  // 🧹 Vaciar todo
  const vaciarCarrito = () => {
    setCarrito([]);
    sessionStorage.removeItem("carrito");
  };

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        setCantidad,
        vaciarCarrito,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
