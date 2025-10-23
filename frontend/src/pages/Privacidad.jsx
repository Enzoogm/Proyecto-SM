// src/pages/Privacidad.jsx
import "../styles/pages-legal.css";

export default function Privacidad() {
  const fecha = new Date().toLocaleDateString();
  return (
    <main className="page-container legal-page">
      <h1>Política de Privacidad</h1>
      <p className="meta">Última actualización: {fecha}</p>

      <section>
        <h2>Resumen</h2>
        <p>Cuidamos tu información. Conocé qué datos recopilamos, cómo los usamos y cómo ejercer tus derechos.</p>
      </section>

      <section>
        <h2>1. Datos que recopilamos</h2>
        <ul>
          <li>Datos básicos (p. ej., nombre y correo) al registrarte o comprar.</li>
          <li>Preferencias/cookies para mejorar tu experiencia.</li>
        </ul>
      </section>

      <section>
        <h2>2. Finalidades</h2>
        <p>Operar el sitio, mejorar la experiencia, gestionar compras/soporte y cumplir objetivos académicos del proyecto.</p>
      </section>

      <section>
        <h2>3. Cookies</h2>
        <p>Usamos cookies para sesión y preferencias. Podés desactivarlas en tu navegador (algunas funciones pueden verse afectadas).</p>
      </section>

      <section>
        <h2>4. Seguridad</h2>
        <p>Aplicamos medidas razonables, aunque ninguna plataforma es 100% segura.</p>
      </section>

      <section>
        <h2>5. Tus derechos</h2>
        <p>Podés solicitar acceso, corrección o eliminación de tus datos usando los canales indicados en el sitio.</p>
      </section>

      <section>
        <h2>6. Cambios</h2>
        <p>Publicaremos aquí cualquier actualización de esta política.</p>
      </section>

      <div className="page-footer-actions">
        <a href="#top">Volver arriba</a>
      </div>
    </main>
  );
}
