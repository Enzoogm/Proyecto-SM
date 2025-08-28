-- codigo de  phpMyAdmin 
-- Categorías
CREATE TABLE Categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cat VARCHAR(100) NOT NULL
);

-- Subcategorías
CREATE TABLE Subcategorias (
    id_subcategoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_subcat VARCHAR(100) NOT NULL,
    id_categoria INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria)
);

-- Proveedores
CREATE TABLE Proveedores (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre_prov VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(200)
);

-- Productos
CREATE TABLE Productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_prod VARCHAR(200) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    id_subcategoria INT NOT NULL,
    id_proveedor INT NOT NULL,
    FOREIGN KEY (id_subcategoria) REFERENCES Subcategorias(id_subcategoria),
    FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor)
);

-- Usuarios
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    direccion VARCHAR(200),
    telefono VARCHAR(20)
);

-- Carrito
CREATE TABLE Carrito (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

-- Detalle del Carrito
CREATE TABLE DetalleCarrito (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_carrito INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (id_carrito) REFERENCES Carrito(id_carrito),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);

-- Ventas
CREATE TABLE Ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

-- Detalle de Ventas
CREATE TABLE DetalleVentas (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES Ventas(id_venta),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);

-- Pagos
CREATE TABLE Pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente',
    FOREIGN KEY (id_venta) REFERENCES Ventas(id_venta)
);

-- Solicitudes de Restock
CREATE TABLE SolicitudesRestock (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cantidad_deseada INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);
---------------------
-- Categorías
CREATE TABLE Categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cat VARCHAR(100) NOT NULL
);

-- Proveedores
CREATE TABLE Proveedores (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre_prov VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(200)
);

-- Productos
CREATE TABLE Productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_prod VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    id_categoria INT NOT NULL,
    id_proveedor INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria),
    FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor)
);

-- Ventas
CREATE TABLE Ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    total DECIMAL(10,2) NOT NULL
);

-- DetalleVentas
CREATE TABLE DetalleVentas (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES Ventas(id_venta),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);

-- Pagos
CREATE TABLE Pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATE NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES Ventas(id_venta)
);

-- Carrito
CREATE TABLE Carrito (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- DetalleCarrito
CREATE TABLE DetalleCarrito (
    id_detalle_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_carrito INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (id_carrito) REFERENCES Carrito(id_carrito) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);
----------------------------------------
INSERT INTO Categorias (nombre_cat) VALUES
('Bebidas'),
('Snacks'),
('Limpieza'),
('Lácteos'),
('Panadería'),
('Congelados');

-- Proveedores
INSERT INTO Proveedores (nombre_prov, telefono, direccion) VALUES
('Coca-Cola Company', '111-222-333', 'Av. Corrientes 123, CABA'),
('PepsiCo', '222-333-444', 'Av. Libertador 456, CABA'),
('La Serenísima', '333-444-555', 'Ruta 8 Km 70, Bs.As'),
('Bimbo', '444-555-666', 'Av. Siempre Viva 742, CABA'),
('Unilever', '555-666-777', 'Av. San Martín 500, CABA'),
('Arcor', '666-777-888', 'Ruta Nacional 9, Córdoba');

-- Productos (2 por proveedor)
INSERT INTO Productos (nombre_prod, descripcion, precio, stock, id_categoria, id_proveedor) VALUES
-- Coca-Cola Company (Bebidas)
('Coca-Cola 2.25L', 'Bebida gaseosa clásica', 300.00, 40, 1, 1),
('Sprite 1.5L', 'Bebida gaseosa lima-limón', 280.00, 35, 1, 1),

-- PepsiCo (Snacks)
('Pepsi 2.25L', 'Bebida gaseosa cola', 290.00, 30, 1, 2),
('Lays Clásicas 120g', 'Papas fritas clásicas', 250.00, 50, 2, 2),

-- La Serenísima (Lácteos)
('Leche Entera 1L', 'Leche entera en sachet', 180.00, 60, 4, 3),
('Yogur Frutilla 180g', 'Yogur sabor frutilla', 120.00, 40, 4, 3),

-- Bimbo (Panadería)
('Pan de Molde 500g', 'Pan lactal blanco', 220.00, 25, 5, 4),
('Medialunas 6u', 'Medialunas de manteca', 350.00, 20, 5, 4),

-- Unilever (Limpieza)
('Ala 800g', 'Detergente en polvo para ropa', 400.00, 15, 3, 5),
('Cif Crema 500ml', 'Limpiador multiuso', 380.00, 20, 3, 5),

-- Arcor (Snacks / Congelados)
('Bon o Bon 6u', 'Chocolate con relleno', 300.00, 30, 2, 6),
('Helado Arcor 1L', 'Helado de crema americana', 700.00, 10, 6, 6);