import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "../styles/Admin.css";
from dotenv import load_dotenv
export default function Admin() {est, jsonify, make_response, current_app, g, session
  const { user, fetchAuthMe, loadingAuth } = useAuth();heck_password_hash
  const [accessStatus, setAccessStatus] = useState(null); // 'loading', 'admin', 'forbidden', 'not-auth'
  const [vista, setVista] = useState("dashboard");
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);x="/api/auth")
  const [stats, setStats] = useState({
    productos_vendidos: 0,
    total_dinero: 0,
  }); Use a single stable secret. Prefer env var SECRET_KEY_SUPER, then Flask config SECRET_KEY_SUPER,
    # then app SECRET_KEY, then a dev fallback. This ensures encode/decode use the same value across processes.
  // Inputs para crear producto
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_prod: "",pp.config.get("SECRET_KEY_SUPER")
    descripcion: "",pp.config.get("SECRET_KEY")
    precio: "",-secret"
    stock: "",
    id_categoria: "",
  });XP_SECONDS = int(os.getenv("JWT_EXP_SECONDS", "3600"))  # 1 hora

  // Input para nueva categoría str:
  const [nuevaCategoria, setNuevaCategoria] = useState("");
        # JWT "sub" (subject) is typically a string; encode as string to avoid library validation errors
  const navigate = useNavigate();
        "iat": dt.datetime.utcnow(),
  useEffect(() => {atetime.utcnow() + dt.timedelta(seconds=JWT_EXP_SECONDS),
    let mounted = true;
    token = jwt.encode(payload, _secret(), algorithm="HS256")
    async function checkAccess() {
      setAccessStatus("loading");
      const { user: fetchedUser, status } = await fetchAuthMe();
      if (!mounted) return;
def require_jwt(fn):
      if (!fetchedUser) {
        // No autenticadokwargs):
        setAccessStatus("not-auth");r (explicit) over cookie. If not present, fall back to cookie.
        return; None
      } auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
      if (fetchedUser.role === "admin") {
        setAccessStatus("admin");
        return;en = request.cookies.get("access_token")
      } if not token:
            return jsonify({"error": "token requerido"}), 401
      // Autenticado pero sin rol admin
      setAccessStatus("forbidden");ken, _secret(), algorithms=["HS256"])
    }       g.user_id = int(payload.get("sub"))
        except jwt.ExpiredSignatureError:
    checkAccess(); jsonify({"error": "token expirado"}), 401
    return () => {.InvalidTokenError:
      mounted = false;nify({"error": "token inválido"}), 401
    };  return fn(*args, **kwargs)
  }, []);n wrapper

  // ------------------------
  // Cargar datos inicialese sesión Flask."""
  // ------------------------)
  useEffect(() => {
    if (user?.rol !== "admin") return;
    """
    fetch(`/api/admin/stats`)ado devuelve 401; si autenticado pero sin role admin devuelve 403.
      .then((res) => res.json())
      .then(setStats);)
    def wrapper(*args, **kwargs):
    fetch(`/api/admin/productos`)sion()
      .then((res) => res.json())
      .then(setProductos);({"error": "Not authenticated"}), 401
        if user.get("role") != "admin":
    fetch(`/api/admin/ventas`)rror": "Forbidden"}), 403
        return f(*args, **kwargs)son())
    return wrapper


@auth_bp.post("/registro")s.json())
def registro():
    data = request.get_json() or {}
    nombre = (data.get("nombre") or "").strip()
    email = (data.get("email") or "").strip().lower()> res.json())
    password = data.get("password")
  }, [user]);
    if not nombre or not email or not password:
        return jsonify({"error": "Faltan datos"}), 400
 padding: "20px" }}>Cargando...</div>;
    db = conectar()
    cur = db.cursor()
    try:t-auth") {
        cur.execute("SELECT 1 FROM Usuarios WHERE email=%s", (email,))
        if cur.fetchone():ng: "20px" }}>
            return jsonify({"error": "Email ya registrado"}), 409
iar sesión para acceder al panel de administración.</p>
        hashed = generate_password_hash(password)button onClick={() => navigate("/login")}>Ir a Login</button>
        cur.execute("""
            INSERT INTO Usuarios (nombre, email, password, rol)
            VALUES (%s, %s, %s, %s)
        """, (nombre, email, hashed, "cliente"))
        db.commit()Status === "forbidden") {
        user_id = cur.lastrowid
{ padding: "20px" }}>
        token = _gen_token(user_id)        <h2>Acceso denegado</h2>
        resp = make_response(jsonify({"ok": True, "token": token}))  # <-- incluye token        <p>Solo administradores pueden acceder a esta sección.</p>
        resp.set_cookie(={() => navigate("/")}>Volver al inicio</button>
            "access_token",
            token,
            httponly=True,
            samesite="Lax",
            secure=False,  if (accessStatus === "admin") {
            max_age=JWT_EXP_SECONDS,
            path="/",
        )        <h1>Panel de administración</h1>
        return resp, 201----------------- */}
    except Exception as e:
        db.rollback(){/* ------------------------ */}
        return jsonify({"error": str(e)}), 400
    finally:>
        cur.close()l>
        db.close()lick={() => setVista("dashboard")}>📊 Dashboard</li>
Click={() => setVista("productos")}>📦 Productos</li>
            <li onClick={() => setVista("ventas")}>💰 Ventas</li>
@auth_bp.post("/login")ías</li>
def login():
    data = request.get_json() or {}          </ul>
    email = (data.get("email") or "").strip().lower()
    password = data.get("password")
---------------- */}
    if not email or not password:inámico */}
        return jsonify({"error": "Faltan datos"}), 400---------------------- */}
e="admin-content">
    db = conectar() */}
    cur = db.cursor(dictionary=True)"dashboard" && (
    try:
        cur.execute("SELECT * FROM Usuarios WHERE email=%s", (email,))>📊 Dashboard</h1>
        u = cur.fetchone()         <div className="admin-dashboard">
    finally: className="stat-card">
        cur.close()                  <h3>📦 Productos</h3>
        db.close()                  <p>{productos.length}</p>
>
    if not u or not check_password_hash(u["password"], password):
        return jsonify({"error": "Email o contraseña incorrectos"}), 401>📂 Categorías</h3>
p>{categorias.length}</p>
    token = _gen_token(int(u["id_usuario"]))    </div>
    resp = make_response(jsonify({"ok": True, "token": token}))  # <-- incluye token       <div className="stat-card">
    resp.set_cookie(
        "access_token",p>{usuarios.length}</p>
        token,
        httponly=True,        <div className="stat-card">
        samesite="Lax",
        secure=False,as.length}</p>
        max_age=JWT_EXP_SECONDS,/div>
        path="/",
    )                  <h3>🛒 Productos vendidos</h3>
    return resp, 200p>

at-card">
# -------------------turado</h3>
# ME (devuelve lo mínimo, sin filtrar info sensible)(2)}</p>
# ------------------- </div>
@auth_bp.get("/me")  </div>
def me():
    """
    GET /api/auth/me
    - 200 + {"user": {...}} si hay sesión válidaOS */}
    - 200 + {"user": null} si NO hay sesión (no es error, es OK pero sin usuario)roductos" && (
    """
    user = _get_user_from_session()ductos</h1>
    return jsonify({"user": user}), 200 <h3>Agregar nuevo producto</h3>

# -------------------
# LOGOUT (borra cookie)eholder="Nombre"
# -------------------                value={nuevoProducto.nombre_prod}
@auth_bp.post("/logout")
def logout():ucto({
    resp = make_response(jsonify({"ok": True}))...nuevoProducto,
    resp.set_cookie("access_token", "", expires=0, path="/")  # <- path agregadonombre_prod: e.target.value,
    return resp, 200

# supermercado/rutas/auth.py (abajo)   />
@auth_bp.get("/_debug_cookie")              <input
def _debug_cookie():
    return jsonify({ceholder="Descripción"
        "cookies": list(request.cookies.keys()),
        "has_access_token": "access_token" in request.cookiesonChange={(e) =>
    }), 200({

@auth_bp.get("/_debug_token")
def _debug_token():              })
    auth = request.headers.get("Authorization", "")
    token = None
    if auth.startswith("Bearer "):
        token = auth.split(" ", 1)[1]
    cookie_token = request.cookies.get("access_token")
    
    return jsonify({     onChange={(e) =>
        "has_auth_header": bool(auth),                  setNuevoProducto({ ...nuevoProducto, precio: e.target.value })                }              />              <input                type="number"                placeholder="Stock"                value={nuevoProducto.stock}                onChange={(e) =>                  setNuevoProducto({ ...nuevoProducto, stock: e.target.value })                }              />              <select                value={nuevoProducto.id_categoria}                onChange={(e) =>                  setNuevoProducto({                    ...nuevoProducto,                    id_categoria: e.target.value,                  })                }              >                <option value="">Selecciona una categoría</option>                {categorias.map((c) => (                  <option key={c.id_categoria} value={c.id_categoria}>                    {c.nombre_cat}                  </option>                ))}              </select>              <button onClick={handleCrearProducto}>Agregar</button>              <h3>Lista de productos</h3>              <table className="admin-table">                <thead>                  <tr>                    <th>ID</th>                    <th>Nombre</th>                    <th>Precio</th>                    <th>Stock</th>                    <th>Categoría</th>                    <th>Acciones</th>                  </tr>                </thead>                <tbody>                  {productos.map((p) => (                    <tr key={p.id_producto}>                      <td>{p.id_producto}</td>                      <td>{p.nombre_prod}</td>                      <td>${p.precio}</td>                      <td>                        <input                          type="number"                          defaultValue={p.stock}                          onBlur={(e) =>                            handleActualizarStock(p.id_producto, e.target.value)                          }                        />                      </td>                      <td>{p.categoria || "Sin categoría"}</td>                      <td>                        <button                          className="btn-danger"                          onClick={() => handleEliminarProducto(p.id_producto)}                        >                          Eliminar                        </button>                      </td>                    </tr>                  ))}                </tbody>              </table>            </div>          )}          {/* VENTAS */}          {vista === "ventas" && (            <div>              <h1>💰 Ventas</h1>              <table className="admin-table">                <thead>                  <tr>                    <th>ID Venta</th>                    <th>Fecha</th>                    <th>Total</th>                    <th>Cliente</th>                  </tr>                </thead>                <tbody>                  {ventas.map((v) => (                    <tr key={v.id_venta}>                      <td>{v.id_venta}</td>                      <td>{new Date(v.fecha).toLocaleString()}</td>                      <td>${v.total}</td>                      <td>{v.cliente || "Desconocido"}</td>                    </tr>                  ))}                </tbody>              </table>            </div>          )}          {/* CATEGORÍAS */}          {vista === "categorias" && (            <div>              <h1>📂 Categorías</h1>              <input                type="text"                placeholder="Nueva categoría"                value={nuevaCategoria}                onChange={(e) => setNuevaCategoria(e.target.value)}              />              <button onClick={handleCrearCategoria}>Agregar</button>              <ul>                {categorias.map((c) => (                  <li key={c.id_categoria}>
        "auth_header": auth,
        "has_token_in_header": bool(token),
        "has_token_in_cookie": bool(cookie_token),
        "tokens_match": token == cookie_token if token and cookie_token else None
    }), 200
                    {c.nombre_cat}                    <button                      onClick={() => handleEliminarCategoria(c.id_categoria)}                    >                      Eliminar                    </button>                  </li>                ))}              </ul>            </div>          )}          {/* USUARIOS */}          {vista === "usuarios" && (            <div>              <h1>👥 Usuarios</h1>              <table className="admin-table">                <thead>                  <tr>                    <th>ID</th>                    <th>Nombre</th>                    <th>Email</th>                    <th>Rol</th>                  </tr>                </thead>                <tbody>                  {usuarios.map((u) => (                    <tr key={u.id_usuario}>                      <td>{u.id_usuario}</td>                      <td>{u.nombre}</td>                      <td>{u.email}</td>                      <td>{u.rol}</td>                    </tr>                  ))}                </tbody>              </table>            </div>          )}        </main>      </div>    );  }  return null;}