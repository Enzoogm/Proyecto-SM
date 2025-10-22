// src/components/SliderPromos.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/SliderPromos.css";

/* Scroll suave a un id con offset por el header fijo */
const HEADER_OFFSET = 90;
function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
  window.scrollTo({ top: y, behavior: "smooth" });
}

function SliderPromos() {
  return (
    <div className="slider-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        speed={600}
        a11y={{ prevSlideMessage: "Slide anterior", nextSlideMessage: "Siguiente slide" }}
      >
        {/* SLIDE 1 – HERO OFERTAS */}
        <SwiperSlide key="hero-ofertas">
          <section
            className="hero-promo"
            style={{
              backgroundImage:
                "linear-gradient(120deg, #fce9ea 0%, #ffe5ec 45%, #eaf3ff 100%)",
            }}
          >
            <div className="hero-inner">
              {/* Izquierda */}
              <div className="hero-copy">
                <span className="hero-badge">Especial semana</span>
                <h1 className="hero-title">
                  Hasta <strong>2×1</strong> y <strong>50% OFF</strong>
                </h1>
                <p className="hero-sub">
                  En <b>limpieza</b>, <b>Lácteos</b> y <b>congelados</b>. Stock limitado.
                </p>

                <ul className="hero-perks">
                  <li>🚚 Envío gratis desde <b>$19.999</b></li>
                  <li>🏬 Retiro en 1 h</li>
                  <li>💳 <b>6</b> cuotas sin interés</li>
                  <li>💵 <b>10% OFF</b> pagando en efectivo</li>
                  <li>🛡️ Precios cuidados</li>
                </ul>

                <div className="hero-chips">
                  <button className="chip">Limpieza</button>
                  <button className="chip">Lácteos</button>
                  <button className="chip">Panadería</button>
                  <button className="chip">Bebidas</button>
                  <button className="chip">Snacks</button>
                </div>

                <div className="hero-cta">
                  <a
                    href="#productos"
                    className="btn-cta"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId("productos");
                    }}
                  >
                    Ver ofertas
                  </a>
                  <a
                    href="#categorias"
                    className="btn-ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId("categorias");
                    }}
                  >
                    Ver categorías
                  </a>
                </div>

                <p className="hero-legal">
                  *Promos vigentes hasta el domingo 23:59 o hasta agotar stock. No acumulable con otras promos.
                  Ver términos en “Condiciones”.
                </p>
              </div>

              {/* Derecha */}
              <div className="hero-art">
                {/* Si querés usar una imagen, descomentá: */}
                {/* <img src="/banners/hero-ofertas.png" alt="Ofertas" className="hero-img" loading="lazy" /> */}
                <div className="hero-countdown" aria-hidden="true">
                  <span className="cd-label">Termina en</span>
                  <div className="cd-box"><span className="cd-num">02</span><span className="cd-unit">d</span></div>
                  <div className="cd-col">:</div>
                  <div className="cd-box"><span className="cd-num">13</span><span className="cd-unit">h</span></div>
                  <div className="cd-col">:</div>
                  <div className="cd-box"><span className="cd-num">27</span><span className="cd-unit">m</span></div>
                </div>
              </div>
            </div>
          </section>
        </SwiperSlide>

        {/* SLIDE 2 – MEDIOS DE PAGO (con tus 8 logos) */}
        <SwiperSlide key="bank-promo">
          <section
            className="bank-promo"
            style={{
              backgroundImage:
                "linear-gradient(120deg,#e7f2ff 0%,#edf4ff 40%,#fff4f4 100%)",
            }}
          >
            <div className="bank-inner">
              <div className="bank-copy">
                <span className="bank-badge">Medios de pago</span>
                <h2 className="bank-title">
                  <strong>Hasta 20% OFF</strong> + <strong>6 cuotas</strong> sin interés
                </h2>

                <ul className="bank-bullets">
                  <li>🏦 <b>Nación</b> y <b>Santander</b> con promos semanales</li>
                  <li>💳 <b>BBVA</b>, <b>Visa</b> y <b>Mastercard</b> hasta 6 cuotas</li>
                  <li>📱 <b>Mercado Pago</b> con QR en tienda</li>
                  <li>🧡 <b>Naranja X</b> beneficios seleccionados</li>
                </ul>

                <div className="bank-cta">
                  <a
                    href="#medios"
                    className="btn-cta"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId("medios");
                    }}
                  >
                    Ver medios de pago
                  </a>
                  <a
                    href="#legales"
                    className="btn-ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId("legales");
                    }}
                  >
                    Términos
                  </a>
                </div>

                <p className="bank-legal">
                  *Beneficios sujetos a condiciones del banco y del comercio.
                </p>
              </div>

              <div className="bank-logos-wrap">
                <div className="bank-logos marquee">
                  <img src="/bancos/nacion.png" alt="Banco Nación" />
                  <img src="/bancos/bbva.png" alt="BBVA" />
                  <img src="/bancos/galicia.png" alt="Galicia" />
                  <img src="/bancos/santander.png" alt="Santander" />
                  <img src="/bancos/visa.png" alt="Visa" />
                  <img src="/bancos/mastercard.png" alt="Mastercard" />
                  <img src="/bancos/mercadopago.png" alt="Mercado Pago" />
                  <img src="/bancos/naranjax.png" alt="Naranja X" />

                  {/* duplicado para loop continuo */}
                  <img src="/bancos/nacion.png" alt="Banco Nación" />
                  <img src="/bancos/bbva.png" alt="BBVA" />
                  <img src="/bancos/galicia.png" alt="Galicia" />
                  <img src="/bancos/santander.png" alt="Santander" />
                  <img src="/bancos/visa.png" alt="Visa" />
                  <img src="/bancos/mastercard.png" alt="Mastercard" />
                  <img src="/bancos/mercadopago.png" alt="Mercado Pago" />
                  <img src="/bancos/naranjax.png" alt="Naranja X" />
                </div>

                <div className="card-stack" aria-hidden="true">
                  <div className="pay-card visa">VISA</div>
                  <div className="pay-card mc">MC</div>
                  <div className="pay-card mp">MP</div>
                </div>
              </div>
            </div>
          </section>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default SliderPromos;
