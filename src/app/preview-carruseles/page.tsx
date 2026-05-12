/**
 * Preview de 2 carruseles 9:16 (1080×1920) para TikTok / Instagram Reels.
 *
 * Adapta el patrón viral de @subtexto. (psicología social ilustrada,
 * carrusel de 6 slides) a la estética editorial de Egoera Psikologia:
 * paleta cobalto + crema + mostaza, tipografías Caveat/Fraunces/Inter,
 * ilustraciones papel-herbario absurd.
 *
 * Dos posts sobre "tipos de personas":
 *  1. "La que dice estoy bien" — pasivo-agresivo
 *  2. "El que pide perdón antes de hablar" — auto-anulación
 *
 * Cada slide está en formato 9:16 (1080×1920) escalado a 540×960
 * para preview. Captura cada slide con screenshot a 2x DPR para el
 * export final a TikTok/Instagram.
 *
 * Ruta: /preview-carruseles (noindex)
 */
import type { Metadata } from "next";
import styles from "./Carrusel.module.css";

export const metadata: Metadata = {
  title: "Egoera · Carruseles TikTok (preview)",
  robots: { index: false, follow: false },
};

// ─── Ilustraciones SVG inline ───────────────────────────────────────

/** Figura encerrada en una pompa con grietas — interior de la persona
 *  que aguanta. */
function IlluPompaQueAguanta() {
  return (
    <svg viewBox="0 0 460 460" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <radialGradient id="pompa-g" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#fef9ed" />
          <stop offset="55%" stopColor="#f1ead8" />
          <stop offset="100%" stopColor="#d9c896" />
        </radialGradient>
      </defs>
      {/* Pompa */}
      <circle cx="230" cy="230" r="180" fill="url(#pompa-g)" stroke="#1d2bdb" strokeWidth="3" />
      {/* Grietas */}
      <path d="M 60 230 L 120 240 L 100 280 L 150 270" stroke="#1d2bdb" strokeWidth="2" fill="none" opacity="0.5"/>
      <path d="M 410 230 L 360 220 L 380 180 L 340 200" stroke="#1d2bdb" strokeWidth="2" fill="none" opacity="0.5"/>
      <path d="M 230 50 L 220 100 L 250 110 L 230 140" stroke="#1d2bdb" strokeWidth="2" fill="none" opacity="0.45"/>
      {/* Brillo pompa */}
      <ellipse cx="180" cy="160" rx="40" ry="22" fill="#ffffff" opacity="0.5" />
      {/* Figura encogida dentro */}
      <g transform="translate(170, 200)">
        <ellipse cx="60" cy="20" rx="22" ry="26" fill="#1d2bdb" />
        <path d="M 30 50 C 22 70, 22 110, 38 130 L 82 130 C 98 110, 98 70, 90 50 Z" fill="#1d2bdb" />
        {/* Brazos abrazando rodillas */}
        <path d="M 38 90 C 50 100, 70 100, 82 90 L 82 110 L 38 110 Z" fill="#0f1baa" />
        {/* Lágrima cobalto */}
        <circle cx="50" cy="32" r="3" fill="#f4c842" />
      </g>
      {/* Mostaza acento */}
      <circle cx="380" cy="90" r="14" fill="#f4c842" opacity="0.85" />
      <circle cx="380" cy="90" r="6" fill="#1d2bdb" />
    </svg>
  );
}

/** Cuerpo con dos caras — exterior sereno, interior tormenta */
function IlluDosCaras() {
  return (
    <svg viewBox="0 0 460 460" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* Marco circular */}
      <circle cx="230" cy="230" r="180" fill="#fdf4dd" stroke="#1d2bdb" strokeWidth="3" />
      {/* Cabeza */}
      <ellipse cx="230" cy="170" rx="90" ry="100" fill="#1d2bdb" />
      {/* División vertical — exterior calmado vs interior con rayos */}
      <path d="M 230 70 L 230 270" stroke="#f4c842" strokeWidth="2" strokeDasharray="6 4" opacity="0.8" />
      {/* Lado izquierdo: sonrisa serena (línea fina amarilla) */}
      <path d="M 175 195 C 195 205, 220 207, 225 200" stroke="#f4c842" strokeWidth="2.5" fill="none" />
      <circle cx="195" cy="160" r="3.5" fill="#f4c842" />
      {/* Lado derecho: rayos de tormenta saliendo de la cabeza */}
      <g stroke="#c47a4b" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M 290 90 L 310 70" />
        <path d="M 320 130 L 350 120" />
        <path d="M 320 180 L 360 180" />
        <path d="M 320 220 L 350 240" />
        <path d="M 290 250 L 310 270" />
      </g>
      {/* Cuerpo abajo encogido */}
      <path d="M 180 270 C 170 290, 170 330, 190 350 L 270 350 C 290 330, 290 290, 280 270 Z" fill="#1d2bdb" />
      {/* Mancha mostaza interior */}
      <circle cx="260" cy="180" r="22" fill="#f4c842" opacity="0.85" />
    </svg>
  );
}

/** Figura pequeña con sombra enorme detrás — el que se hace pequeño */
function IlluSombraEnorme() {
  return (
    <svg viewBox="0 0 460 460" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* Suelo */}
      <line x1="40" y1="380" x2="420" y2="380" stroke="#1d2bdb" strokeWidth="2" strokeDasharray="4 6" />
      {/* Sombra GRANDE detrás (la idea de "ocupar" sin querer) */}
      <ellipse cx="230" cy="380" rx="200" ry="14" fill="#1d2bdb" opacity="0.18" />
      <path
        d="M 230 380 C 130 320, 110 220, 130 130 C 145 70, 210 60, 230 60 C 250 60, 315 70, 330 130 C 350 220, 330 320, 230 380 Z"
        fill="#1d2bdb"
        opacity="0.18"
      />
      {/* Figura pequeñita encogida en el centro abajo */}
      <g transform="translate(200, 285)">
        <ellipse cx="30" cy="18" rx="14" ry="16" fill="#1d2bdb" />
        <path d="M 12 40 C 8 55, 8 80, 18 92 L 42 92 C 52 80, 52 55, 48 40 Z" fill="#1d2bdb" />
        {/* Pies/loto */}
        <path d="M 8 92 L 0 110 L 60 110 L 52 92 Z" fill="#1d2bdb" />
      </g>
      {/* Mostaza acento: una mancha pequeña a la altura del pecho */}
      <circle cx="230" cy="320" r="5" fill="#f4c842" />
      {/* Flecha decorativa apuntando "tú estás aquí" */}
      <g stroke="#c47a4b" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M 360 240 L 280 290" />
        <path d="M 280 290 L 290 280" />
        <path d="M 280 290 L 290 300" />
      </g>
      <text x="375" y="232" fontFamily="Caveat" fontSize="22" fill="#c47a4b" fontStyle="italic">aquí</text>
    </svg>
  );
}

/** Boca cosida con hilo amarillo — auto-censura */
function IlluBocaCosida() {
  return (
    <svg viewBox="0 0 460 460" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="230" cy="230" r="180" fill="#fef4d9" stroke="#1d2bdb" strokeWidth="3" />
      {/* Cara cobalto */}
      <ellipse cx="230" cy="220" rx="120" ry="135" fill="#1d2bdb" />
      {/* Ojos cerrados pequeños */}
      <path d="M 180 195 L 210 195" stroke="#f1ead8" strokeWidth="3" />
      <path d="M 250 195 L 280 195" stroke="#f1ead8" strokeWidth="3" />
      {/* Línea de boca */}
      <path d="M 170 260 L 290 260" stroke="#f4c842" strokeWidth="3.5" />
      {/* Puntadas de hilo */}
      <g stroke="#f4c842" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M 180 250 L 195 270" />
        <path d="M 205 250 L 220 270" />
        <path d="M 230 250 L 245 270" />
        <path d="M 255 250 L 270 270" />
        <path d="M 280 250 L 285 263" />
      </g>
      {/* Mancha mostaza con cita encima */}
      <circle cx="380" cy="120" r="36" fill="#f4c842" opacity="0.78" />
      <text
        x="380"
        y="125"
        fontFamily="Caveat"
        fontSize="22"
        fill="#1d2bdb"
        fontStyle="italic"
        textAnchor="middle"
        fontWeight="600"
      >
        sshh
      </text>
    </svg>
  );
}

/** Reflexión final — círculo abierto con luz dorada saliendo */
function IlluAperturaCierre() {
  return (
    <svg viewBox="0 0 460 460" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* Halo cálido detrás */}
      <radialGradient id="halo-c" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff4d2" />
        <stop offset="55%" stopColor="rgba(244, 200, 66, 0.4)" />
        <stop offset="100%" stopColor="rgba(241, 234, 216, 0)" />
      </radialGradient>
      <circle cx="230" cy="230" r="200" fill="url(#halo-c)" />
      {/* Círculo abierto cobalto */}
      <path
        d="M 230 100 A 130 130 0 1 1 130 270"
        stroke="#1d2bdb"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />
      {/* Punto luminoso al final del trazo */}
      <circle cx="130" cy="270" r="22" fill="#f4c842" />
      <circle cx="130" cy="270" r="10" fill="#fdf4dd" />
      {/* Estrella decorativa */}
      <path
        d="M 320 130 L 326 144 L 340 146 L 330 156 L 332 170 L 320 162 L 308 170 L 310 156 L 300 146 L 314 144 Z"
        fill="#1d2bdb"
        opacity="0.8"
      />
    </svg>
  );
}

// ─── Slide component ────────────────────────────────────────────────

interface SlideProps {
  num: string; // "1/6"
  variant?: "light" | "dark";
  brand?: string;
  decorate?: { tape?: "tl" | "br" | "both"; stamp?: { num: string; line2: string } };
  children: React.ReactNode;
}
function Slide({
  num,
  variant = "light",
  brand = "@egoera",
  decorate,
  children,
}: SlideProps) {
  return (
    <div className={`${styles.slide} ${variant === "dark" ? styles.dark : ""}`}>
      <span className={styles.slideNum}>{num}</span>
      <span className={styles.slideBrand}>{brand}</span>
      {decorate?.tape && (decorate.tape === "tl" || decorate.tape === "both") && (
        <div className={`${styles.tape} ${styles.tl}`} aria-hidden />
      )}
      {decorate?.tape && (decorate.tape === "br" || decorate.tape === "both") && (
        <div className={`${styles.tape} ${styles.br}`} aria-hidden />
      )}
      {decorate?.stamp && (
        <div className={`${styles.stamp} ${styles.tr}`} aria-hidden>
          serie tipos
          <span className={styles.big}>{decorate.stamp.num}</span>
          {decorate.stamp.line2}
        </div>
      )}
      <div className={styles.slideInner}>{children}</div>
    </div>
  );
}

// ─── PÁGINA ─────────────────────────────────────────────────────────

export default function PreviewCarruselesPage() {
  return (
    <div className={styles.page}>
      <header className={styles.pageHead}>
        <h1>
          Carruseles <em>TikTok</em> · Egoera
        </h1>
        <p>2 posts · serie tipos de personas · 6 slides cada uno</p>
      </header>

      {/* ────────────────────────────────────────────────────────────
          POST 1 · "La que dice estoy bien"
          ──────────────────────────────────────────────────────────── */}
      <section>
        <div className={styles.carouselHeader}>
          <h2>1 · La que dice <em>estoy bien</em></h2>
          <span>perfil pasivo-agresivo · post 028</span>
        </div>
        <div className={styles.slideRow}>

          {/* SLIDE 1 — HOOK */}
          <Slide
            num="1/6"
            decorate={{ tape: "tl", stamp: { num: "028", line2: "pasivo · agresivo" } }}
          >
            <p className={styles.slideKicker}>egoera · serie tipos</p>
            <h2 className={styles.slideTitle}>
              La que dice <em>“estoy bien.”</em>
            </h2>
            <div className={styles.slideBody}>
              <div className={styles.illu}><IlluDosCaras /></div>
            </div>
          </Slide>

          {/* SLIDE 2 — SUBTEXTO */}
          <Slide num="2/6">
            <p className={styles.slideKicker}>el patrón</p>
            <h2 className={`${styles.slideTitle} ${styles.slideTitleSmall}`}>
              Sonríe en la mesa.
              <br />
              <em>Aprieta la mandíbula.</em>
            </h2>
            <div className={styles.slideBody}>
              <div className={styles.illu}><IlluPompaQueAguanta /></div>
            </div>
          </Slide>

          {/* SLIDE 3 — FRASES (estilo lista cómic) */}
          <Slide num="3/6" decorate={{ tape: "br" }}>
            <p className={styles.slideKicker}>frases que oirás</p>
            <h2 className={`${styles.slideTitle} ${styles.slideTitleSmall}`}>
              Su <em>vocabulario.</em>
            </h2>
            <div className={styles.slideBody}>
              <div className={styles.quoteList}>
                <span className={styles.q}>no pasa nada</span>
                <span className={styles.q}>como tú quieras</span>
                <span className={styles.q}>si tú lo dices</span>
                <span className={styles.q}>da igual</span>
              </div>
            </div>
          </Slide>

          {/* SLIDE 4 — BOCADILLO */}
          <Slide num="4/6" variant="dark">
            <p className={styles.slideKicker}>cuando estalla, dice:</p>
            <div className={styles.slideBody}>
              <div className={styles.bubble}>
                <span className={styles.bubbleText}>
                  <em>“llevo</em> meses
                  <br />
                  diciéndotelo.”
                </span>
              </div>
            </div>
            <h2
              className={`${styles.slideTitle} ${styles.slideTitleSmall}`}
              style={{ color: "#f1ead8" }}
            >
              No te lo había dicho.
            </h2>
          </Slide>

          {/* SLIDE 5 — POR DENTRO */}
          <Slide num="5/6">
            <p className={styles.slideKicker}>lo que vive dentro</p>
            <h2 className={`${styles.slideTitle} ${styles.slideTitleSmall}`}>
              Una factura
              <br />
              <em>que crece sola.</em>
            </h2>
            <div className={styles.slideBody}>
              <div className={styles.illu}><IlluBocaCosida /></div>
            </div>
          </Slide>

          {/* SLIDE 6 — CTA */}
          <Slide num="6/6" variant="dark" decorate={{ tape: "tl" }}>
            <p className={styles.slideKicker}>egoera · psicología, despacio</p>
            <h2 className={`${styles.slideTitle} ${styles.slideTitleHuge}`}
              style={{ color: "#f1ead8" }}
            >
              <em>Tragar</em>
              <br />
              no es paz.
            </h2>
            <div className={styles.slideBody}>
              <p className={styles.cta} style={{ color: "#f1ead8" }}>
                Leélo entero en egoera.es
                <br />
                <span className={styles.ctaTag}>cuaderno · 028</span>
              </p>
            </div>
          </Slide>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          POST 2 · "El que pide perdón antes de hablar"
          ──────────────────────────────────────────────────────────── */}
      <section>
        <div className={styles.carouselHeader}>
          <h2>2 · El que pide <em>perdón antes de hablar</em></h2>
          <span>perfil de auto-anulación · post 029</span>
        </div>
        <div className={styles.slideRow}>

          {/* SLIDE 1 — HOOK */}
          <Slide
            num="1/6"
            decorate={{ tape: "tl", stamp: { num: "029", line2: "auto · anulación" } }}
          >
            <p className={styles.slideKicker}>egoera · serie tipos</p>
            <h2 className={styles.slideTitle}>
              El que pide <em>perdón</em>
              <br />
              antes de hablar.
            </h2>
            <div className={styles.slideBody}>
              <div className={styles.illu}><IlluSombraEnorme /></div>
            </div>
          </Slide>

          {/* SLIDE 2 — SUBTEXTO */}
          <Slide num="2/6">
            <p className={styles.slideKicker}>el patrón</p>
            <h2 className={`${styles.slideTitle} ${styles.slideTitleSmall}`}>
              Se hace pequeño
              <br />
              <em>para que entren los demás.</em>
            </h2>
            <div className={styles.slideBody}>
              <div className={styles.illu}><IlluPompaQueAguanta /></div>
            </div>
          </Slide>

          {/* SLIDE 3 — FRASES */}
          <Slide num="3/6" decorate={{ tape: "br" }}>
            <p className={styles.slideKicker}>frases que repite</p>
            <h2 className={`${styles.slideTitle} ${styles.slideTitleSmall}`}>
              Su <em>vocabulario.</em>
            </h2>
            <div className={styles.slideBody}>
              <div className={styles.quoteList}>
                <span className={styles.q}>perdón, una cosita</span>
                <span className={styles.q}>si no os molesto</span>
                <span className={styles.q}>cuando puedas</span>
                <span className={styles.q}>era solo una idea</span>
              </div>
            </div>
          </Slide>

          {/* SLIDE 4 — BOCADILLO */}
          <Slide num="4/6" variant="dark">
            <p className={styles.slideKicker}>cuando le preguntan</p>
            <div className={styles.slideBody}>
              <div className={styles.bubble}>
                <span className={styles.bubbleText}>
                  <em>“no,</em> no,
                  <br />
                  da igual.”
                </span>
              </div>
            </div>
            <h2
              className={`${styles.slideTitle} ${styles.slideTitleSmall}`}
              style={{ color: "#f1ead8" }}
            >
              (no daba igual)
            </h2>
          </Slide>

          {/* SLIDE 5 — POR DENTRO */}
          <Slide num="5/6">
            <p className={styles.slideKicker}>lo que oye dentro</p>
            <h2 className={`${styles.slideTitle} ${styles.slideTitleSmall}`}>
              Una voz que
              <br />
              <em>siempre se disculpa.</em>
            </h2>
            <div className={styles.slideBody}>
              <div className={styles.illu}><IlluBocaCosida /></div>
            </div>
          </Slide>

          {/* SLIDE 6 — CTA */}
          <Slide num="6/6" variant="dark" decorate={{ tape: "tl" }}>
            <p className={styles.slideKicker}>egoera · psicología, despacio</p>
            <h2 className={`${styles.slideTitle} ${styles.slideTitleHuge}`}
              style={{ color: "#f1ead8" }}
            >
              <em>Pedir</em>
              <br />
              no es robar.
            </h2>
            <div className={styles.slideBody}>
              <p className={styles.cta} style={{ color: "#f1ead8" }}>
                Leélo entero en egoera.es
                <br />
                <span className={styles.ctaTag}>cuaderno · 029</span>
              </p>
            </div>
          </Slide>

        </div>
      </section>

      {/* Cierre */}
      <section style={{ textAlign: "center", color: "#f1ead8", padding: "40px 0 80px" }}>
        <p
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(241,234,216,0.55)",
          }}
        >
          Captura cada slide individual con Cmd+Shift+4 (área) o screenshot del browser a 2× DPR.
          Cada slide está dimensionado a 540×960 (1:2 del export 1080×1920).
        </p>
      </section>
    </div>
  );
}
