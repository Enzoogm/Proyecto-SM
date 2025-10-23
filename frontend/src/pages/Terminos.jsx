// src/pages/Terminos.jsx
import "../styles/pages-legal.css";

export default function Terminos() {
  const fecha = new Date().toLocaleDateString();
  return (
    <main className="page-container legal-page">
      <h1>Términos de Uso</h1>
      <p className="meta">Última actualización: {fecha}</p>

      <section>
        <h2>Resumen</h2>
        <p>Al utilizar este sitio aceptás los Términos de Uso. Leelos para conocer reglas, propiedad intelectual y limitación de responsabilidad.</p>
      </section>

      <section>
        <h2>1. Aceptación</h2>
        <p>El uso del sitio implica aceptación plena de estos términos. Si no estás de acuerdo, no debés utilizarlo.</p>
      </section>

      <section>
        <h2>2. Uso del sitio</h2>
        <p>El sitio se ofrece con fines educativos/demostrativos. Podemos modificar o suspender funciones sin previo aviso.</p>
      </section>

      <section>
        <h2>3. Propiedad intelectual</h2>
        <p>El contenido y la interfaz pertenecen a sus titulares. Se prohíbe la reproducción no autorizada.</p>
      </section>

      <section>
        <h2>4. Limitación de responsabilidad</h2>
        <p>El servicio se brinda “tal cual”. No garantizamos disponibilidad continua ni ausencia de errores.</p>
      </section>

      <section>
        <h2>5. Cambios</h2>
        <p>Podemos actualizar estos términos y publicaremos la versión vigente en esta página.</p>
      </section>

      <div className="page-footer-actions">
        <a href="#top">Volver arriba</a>
      </div>
    </main>
  );
}
