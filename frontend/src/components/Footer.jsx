// src/components/Footer.jsx
import { Link } from "react-router-dom";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="brand">
          <span className="brand-name">Supermercado</span>
          <span className="brand-copy">© {new Date().getFullYear()} — Todos los derechos reservados</span>
        </div>

        <nav className="footer-links">
          <Link to="/terminos">Términos de Uso</Link>
          <Link to="/privacidad">Política de Privacidad</Link>
        </nav>
      </div>
    </footer>
  );
}
