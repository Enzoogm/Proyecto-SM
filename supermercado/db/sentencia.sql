-- Categorías
CREATE TABLE Categorias (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_cat TEXT NOT NULL
);

-- Proveedores
CREATE TABLE Proveedores (
    id_proveedor INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_prov TEXT NOT NULL,
    telefono TEXT,
    direccion TEXT
);

-- Productos
CREATE TABLE Productos (
    id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_prod TEXT NOT NULL,
    precio REAL NOT NULL,
    stock INTEGER NOT NULL,
    id_categoria INTEGER NOT NULL,
    id_proveedor INTEGER NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria),
    FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor)
);

-- Ventas
CREATE TABLE Ventas (
    id_venta INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL,
    total REAL NOT NULL
);

-- DetalleVentas
CREATE TABLE DetalleVentas (
    id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario REAL NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES Ventas(id_venta),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);

-- Pagos
CREATE TABLE Pagos (
    id_pago INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER NOT NULL,
    metodo_pago TEXT NOT NULL,
    monto REAL NOT NULL,
    fecha_pago TEXT NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES Ventas(id_venta)
);

