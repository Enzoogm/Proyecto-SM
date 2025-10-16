// src/components/SliderPromos.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/SliderPromos.css";

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
        a11y={{
          prevSlideMessage: "Slide anterior",
          nextSlideMessage: "Siguiente slide",
        }}
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
              {/* Izquierda: texto */}
              <div className="hero-copy">
                <span className="hero-badge">Especial semana</span>
                <h1 className="hero-title">
                  Hasta <strong>2×1</strong> y <strong>50% OFF</strong>
                </h1>
                <p className="hero-sub">
                  En <b>limpieza</b>, <b>desayunos</b> y <b>congelados</b>.
                  Stock limitado.
                </p>

                {/* Badges de beneficios */}
                <ul className="hero-perks">
                  <li>
                    🚚 Envío gratis desde <b>$19.999</b>
                  </li>
                  <li>🏬 Retiro en 1 h</li>
                  <li>
                    💳 <b>6</b> cuotas sin interés
                  </li>
                  <li>
                    💵 <b>10% OFF</b> pagando en efectivo
                  </li>
                  <li>🛡️ Precios cuidados</li>
                </ul>

                {/* Chips de categorías */}
                <div className="hero-chips">
                  <button className="chip">Limpieza</button>
                  <button className="chip">Lácteos</button>
                  <button className="chip">Panadería</button>
                  <button className="chip">Bebidas</button>
                  <button className="chip">Snacks</button>
                </div>

                {/* CTA */}
                <div className="hero-cta">
                  <a href="#productos" className="btn-cta">
                    Ver ofertas
                  </a>
                  <a href="#categorias" className="btn-ghost">
                    Ver categorías
                  </a>
                </div>

                {/* Legal */}
                <p className="hero-legal">
                  *Promos vigentes hasta el domingo 23:59 o hasta agotar stock.
                  No acumulable con otras promos. Ver términos en “Condiciones”.
                </p>
              </div>

              {/* Derecha: arte / contador (placeholder) */}
              <div className="hero-art">
                {/* Si tenés una imagen, descomentá:
                <img
                  src="/static/img/banners/hero-ofertas.png"
                  alt="Ofertas"
                  className="hero-img"
                  loading="lazy"
                /> */}
                <div className="hero-countdown" aria-hidden="true">
                  <span className="cd-label">Termina en</span>
                  <div className="cd-box">
                    <span className="cd-num">02</span>
                    <span className="cd-unit">d</span>
                  </div>
                  <div className="cd-col">:</div>
                  <div className="cd-box">
                    <span className="cd-num">13</span>
                    <span className="cd-unit">h</span>
                  </div>
                  <div className="cd-col">:</div>
                  <div className="cd-box">
                    <span className="cd-num">27</span>
                    <span className="cd-unit">m</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </SwiperSlide>

        {/* SLIDE 2 – BANCOS / MEDIOS DE PAGO */}
        <SwiperSlide key="bank-promo">
          <section
            className="bank-promo"
            style={{
              backgroundImage:
                "linear-gradient(120deg,#e7f2ff 0%,#edf4ff 40%,#fff4f4 100%)",
            }}
          >
            <div className="bank-inner">
              {/* Columna izquierda: texto y bullets */}
              <div className="bank-copy">
                <span className="bank-badge">Medios de pago</span>
                <h2 className="bank-title">
                  <strong>Hasta 20% OFF</strong> + <strong>6 cuotas</strong> sin
                  interés
                </h2>

                <ul className="bank-bullets">
                  <li>
                    🏦 <b>Banco Nación:</b> 20% los <b>martes</b> (tope $4.000)
                  </li>
                  <li>
                    💳 <b>BBVA:</b> 15% + 3 cuotas los <b>viernes</b>
                  </li>
                  <li>
                    🪪 <b>Visa/Mastercard:</b> 6 cuotas sin interés en{" "}
                    <b>electro</b>
                  </li>
                  <li>
                    📱 <b>Mercado Pago:</b> 10% con QR en tienda
                  </li>
                </ul>

                <div className="bank-cta">
                  <a href="#medios" className="btn-cta">
                    Ver medios de pago
                  </a>
                  <a href="#legales" className="btn-ghost">
                    Términos
                  </a>
                </div>

                <p className="bank-legal">
                  *Beneficios sujetos a aprobación bancaria y condiciones del
                  comercio. Válidos esta semana o hasta agotar cupos. No
                  acumulable.
                </p>
              </div>

              {/* Columna derecha: logos en marquee */}
              <div className="bank-logos-wrap">
                <div className="bank-logos marquee">
                  {/* Repetido dos veces para loop suave */}
                  <img src="/static/img/bancos/nacion.png" alt="Banco Nación" />
                  <img src="/static/img/bancos/bbva.png" alt="BBVA" />
                  <img src="/static/img/bancos/galicia.png" alt="Galicia" />
                  <img src="/static/img/bancos/santander.png" alt="Santander" />
                  <img src="/static/img/bancos/visa.png" alt="Visa" />
                  <img
                    src="/static/img/bancos/mastercard.png"
                    alt="Mastercard"
                  />
                  <img
                    src="/static/img/bancos/mercadopago.png"
                    alt="Mercado Pago"
                  />
                  <img src="/static/img/bancos/naranjax.png" alt="Naranja X" />

                  <img src="/static/img/bancos/nacion.png" alt="Banco Nación" />
                  <img src="/static/img/bancos/bbva.png" alt="BBVA" />
                  <img src="/static/img/bancos/galicia.png" alt="Galicia" />
                  <img src="/static/img/bancos/santander.png" alt="Santander" />
                  <img src="/static/img/bancos/visa.png" alt="Visa" />
                  <img
                    src="/static/img/bancos/mastercard.png"
                    alt="Mastercard"
                  />
                  <img
                    src="/static/img/bancos/mercadopago.png"
                    alt="Mercado Pago"
                  />
                  <img src="/static/img/bancos/naranjax.png" alt="Naranja X" />
                </div>

                {/* Tarjetones decorativos */}
                <div className="card-stack" aria-hidden="true">
                  <div className="pay-card visa">VISA</div>
                  <div className="pay-card mc">MC</div>
                  <div className="pay-card mp">MP</div>
                </div>
              </div>
            </div>
          </section>
        </SwiperSlide>

        {/* >>> Si querés agregar más slides, copiá otro <SwiperSlide /> y listo. <<< */}
      </Swiper>
    </div>
  );
}

export default SliderPromos;
