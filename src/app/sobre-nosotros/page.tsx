import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ander Bilbao Castejón · Sobre · Egoera",
  description:
    "Psicólogo colegiado en Bilbao (BI-04567). Práctica clínica + escritura editorial sobre psicología en egoera.es. Apego, ansiedad, autoconocimiento.",
  openGraph: {
    title: "Sobre Ander · Egoera",
    description:
      "Psicólogo colegiado en Bilbao (BI-04567). Práctica clínica + escritura editorial sobre psicología en egoera.es.",
    type: "profile",
  },
};

const css = `
  .sobre-page {
    --blue: #1d2bdb;
    --blue-deep: #0f1baa;
    --cream: #f1ead8;
    --cream-2: #e6dec9;
    --cream-3: #d8cfb6;
    --ink: #1d2bdb;
    --ink-soft: rgba(29, 43, 219, 0.78);
    --rule: rgba(29, 43, 219, 0.32);
    --serif: var(--font-serif), "Fraunces", serif;
    --display: var(--font-display), "Caveat", cursive;
    --sans: var(--font-sans), "Inter", sans-serif;
    --mono: var(--font-mono), "JetBrains Mono", monospace;

    background: var(--cream);
    color: var(--ink);
    font-family: var(--sans);
    -webkit-font-smoothing: antialiased;
  }
  .sobre-page ::selection { background: var(--blue); color: var(--cream); }

  .sobre-page .wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
  }
  @media (max-width: 768px) { .sobre-page .wrap { padding: 0 20px; } }
  @media (max-width: 480px) { .sobre-page .wrap { padding: 0 18px; } }

  /* NAV inlined (until EgoeraNav component lands) */
  .eg-nav {
    display: flex; align-items: center; justify-content: space-between;
    gap: 32px; padding: 22px 32px;
    border-bottom: 1.5px solid var(--blue);
    background: var(--cream);
    font-family: var(--sans);
  }
  .eg-badge {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: var(--display); font-weight: 600;
    color: var(--blue); font-size: 28px; line-height: 1;
    text-decoration: none;
  }
  .eg-badge em { font-style: italic; font-size: 16px; color: var(--ink-soft); }
  .eg-badge .star { width: 22px; height: 22px; }
  .eg-nav-links {
    display: flex; gap: 28px; align-items: center;
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
  }
  .eg-nav-links a {
    color: var(--ink-soft); text-decoration: none;
    padding: 6px 2px; border-bottom: 1.5px solid transparent;
    transition: color .2s, border-color .2s; border-radius: 4px;
  }
  .eg-nav-links a:hover { color: var(--blue); }
  .eg-nav-links a:focus-visible {
    outline: 2px solid var(--blue); outline-offset: 4px; color: var(--blue);
  }
  .eg-nav-links a.active { color: var(--blue); border-bottom-color: var(--blue); border-radius: 0; }
  .eg-nav-cta {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
    background: var(--blue); color: var(--cream);
    min-height: 44px; display: inline-flex; align-items: center;
    padding: 12px 18px; text-decoration: none;
    border: 1.5px solid var(--blue);
    transition: background .2s, color .2s;
  }
  .eg-nav-cta:hover { background: var(--cream); color: var(--blue); }
  .eg-nav-cta:focus-visible {
    outline: 2px solid var(--blue); outline-offset: 3px;
  }
  @media (max-width: 900px) {
    .eg-nav { flex-wrap: wrap; gap: 16px; padding: 18px 22px; }
    .eg-nav-links { order: 3; width: 100%; flex-wrap: wrap; gap: 14px 18px; padding-top: 12px; border-top: 1px dashed var(--rule); }
    .eg-nav-links a { padding: 8px 4px; min-height: 44px; display: inline-flex; align-items: center; }
  }
  @media (max-width: 480px) {
    .eg-nav { padding: 16px 18px; }
    .eg-badge { font-size: 22px; }
    .eg-badge em { font-size: 12px; }
    .eg-nav-cta { padding: 10px 14px; font-size: 10.5px; letter-spacing: 0.18em; }
  }

  /* HERO BIO */
  .bio-hero {
    padding: 64px 0 96px;
    border-bottom: 1.5px solid var(--blue);
  }
  .bio-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 0;
    border: 1.5px solid var(--blue);
    background: var(--cream);
  }
  .bio-text {
    padding: 56px;
    display: flex; flex-direction: column; gap: 24px;
    border-right: 1.5px solid var(--blue);
  }
  .bio-eyebrow {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--blue); display: flex; gap: 12px; align-items: center;
  }
  .bio-eyebrow::before { content: ""; width: 36px; height: 1.5px; background: currentColor; }
  .bio-h {
    font-family: var(--display);
    font-size: clamp(48px, 10vw, 152px);
    line-height: 0.85; font-weight: 600;
    color: var(--blue); letter-spacing: -0.01em;
    margin: 0;
    word-break: break-word;
  }
  .bio-h em { font-style: italic; }
  .bio-h .role {
    display: block;
    font-family: var(--serif); font-style: italic;
    font-size: clamp(15px, 1.4vw, 20px); line-height: 1.4;
    color: var(--ink-soft); margin-top: 18px; max-width: 28em;
    font-weight: 400; letter-spacing: normal;
  }
  .bio-meta {
    display: flex; flex-wrap: wrap; gap: 28px;
    padding-top: 18px;
    border-top: 1px dashed var(--blue);
    font-family: var(--mono); font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--ink-soft);
  }
  .bio-meta strong { color: var(--blue); font-weight: 500; }

  .bio-portrait {
    background: var(--blue); color: var(--cream);
    padding: 36px;
    display: flex; flex-direction: column; gap: 20px;
    min-height: 540px;
  }
  .portrait-frame {
    flex: 1;
    border: 1px dashed rgba(241, 234, 216, 0.45);
    background: repeating-linear-gradient(135deg, rgba(241, 234, 216, 0.04) 0 12px, transparent 12px 24px);
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }
  .portrait-frame svg { width: 70%; height: 70%; }
  .portrait-frame .placeholder-tag {
    position: absolute; top: 14px; left: 14px;
    font-family: var(--mono); font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(241, 234, 216, 0.7);
  }
  .portrait-cap {
    font-family: var(--display);
    font-size: 44px; font-weight: 600; line-height: 0.95;
    color: var(--cream);
  }
  .portrait-cap em { font-style: italic; }
  .portrait-meta {
    padding-top: 14px;
    border-top: 1px solid rgba(241, 234, 216, 0.35);
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(241, 234, 216, 0.85);
    display: flex; justify-content: space-between;
  }
  @media (max-width: 900px) {
    .bio-grid { grid-template-columns: 1fr; }
    .bio-text { padding: 36px; border-right: none; border-bottom: 1.5px solid var(--blue); }
    .bio-portrait { min-height: 420px; padding: 28px; }
  }
  @media (max-width: 480px) {
    .bio-hero { padding: 36px 0 56px; }
    .bio-text { padding: 26px 22px; gap: 18px; }
    .bio-h { font-size: clamp(44px, 13vw, 64px); }
    .bio-h .role { font-size: 14.5px; margin-top: 14px; }
    .bio-meta { gap: 14px 22px; padding-top: 14px; font-size: 9.5px; letter-spacing: 0.18em; }
    .bio-portrait { min-height: 360px; padding: 22px; gap: 16px; }
    .portrait-cap { font-size: 36px; }
    .portrait-meta { font-size: 10px; letter-spacing: 0.18em; }
  }

  /* SECTIONS */
  .section { padding: 110px 0; }
  .section.alt { background: var(--blue); color: var(--cream); }
  .section.alt ::selection { background: var(--cream); color: var(--blue); }
  @media (max-width: 768px) { .section { padding: 72px 0; } }
  @media (max-width: 480px) { .section { padding: 56px 0; } }

  .head {
    display: grid; grid-template-columns: 1fr 1fr; gap: 64px;
    align-items: end;
    margin-bottom: 56px;
    padding-bottom: 28px;
    border-bottom: 1.5px solid var(--blue);
  }
  .section.alt .head { border-bottom-color: var(--cream); }
  .head h2 {
    font-family: var(--display);
    font-size: clamp(40px, 7vw, 110px);
    line-height: 0.92; font-weight: 600;
    color: var(--blue); letter-spacing: -0.01em;
    margin: 0;
  }
  .section.alt .head h2 { color: var(--cream); }
  .head h2 em { font-style: italic; }
  .head .side {
    font-family: var(--serif); font-style: italic;
    font-size: 17px; line-height: 1.55;
    margin: 0;
  }
  .head .eyebrow {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--blue);
    display: flex; align-items: center; gap: 12px; margin-bottom: 14px;
  }
  .section.alt .head .eyebrow { color: var(--cream); }
  .head .eyebrow::before { content: ""; width: 36px; height: 1.5px; background: currentColor; }
  @media (max-width: 900px) {
    .head { grid-template-columns: 1fr; gap: 24px; align-items: start; }
  }
  @media (max-width: 480px) {
    .head { margin-bottom: 36px; padding-bottom: 22px; gap: 18px; }
    .head .side { font-size: 16px; }
  }

  /* TIMELINE */
  .timeline {
    border-left: 1.5px solid var(--blue);
    margin-left: 24px;
    display: flex; flex-direction: column; gap: 0;
  }
  .tl-item {
    display: grid;
    grid-template-columns: 130px 1fr 1fr;
    gap: 32px;
    padding: 36px 0 36px 32px;
    border-bottom: 1px dashed var(--rule);
    position: relative;
  }
  .tl-item:last-child { border-bottom: none; }
  .tl-item::before {
    content: ""; position: absolute;
    left: -7px; top: 44px;
    width: 12px; height: 12px;
    background: var(--cream);
    border: 1.5px solid var(--blue);
    border-radius: 50%;
  }
  .tl-year {
    font-family: var(--display);
    font-size: 64px; font-weight: 600; line-height: 0.9;
    color: var(--blue);
  }
  .tl-where {
    font-family: var(--mono); font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--ink-soft);
    margin-top: 4px;
  }
  .tl-title {
    font-family: var(--serif);
    font-size: 22px; font-weight: 500; line-height: 1.25;
    color: var(--ink);
  }
  .tl-title em { font-style: italic; }
  .tl-body {
    font-family: var(--serif); font-style: italic;
    font-size: 16px; line-height: 1.55;
    color: var(--ink-soft);
    margin: 0;
  }
  @media (max-width: 900px) {
    .tl-item { grid-template-columns: 1fr; gap: 6px; padding: 28px 0 28px 24px; }
    .tl-item::before { top: 36px; }
  }
  @media (max-width: 480px) {
    .timeline { margin-left: 14px; }
    .tl-item { padding: 22px 0 22px 22px; gap: 4px; }
    .tl-item::before { top: 30px; }
    .tl-year { font-size: 48px; }
    .tl-title { font-size: 19px; }
    .tl-body { font-size: 15px; }
  }

  /* MANIFIESTO TILES (sobre cream) */
  .manifest-tiles {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border: 1.5px solid var(--blue);
  }
  .m-tile {
    padding: 40px;
    border-right: 1.5px solid var(--blue);
    display: flex; flex-direction: column; gap: 16px;
    min-height: 280px;
  }
  .m-tile:last-child { border-right: none; }
  .m-tile .num {
    font-family: var(--display);
    font-size: 96px; font-weight: 600; line-height: 0.85;
    color: var(--blue); opacity: .85;
  }
  .m-tile .num em { font-style: italic; }
  .m-tile h4 {
    font-family: var(--display);
    font-size: 36px; font-weight: 600; line-height: 1;
    color: var(--blue);
    margin: 0;
  }
  .m-tile p {
    font-family: var(--serif); font-size: 16px; line-height: 1.55;
    color: var(--ink);
    margin: 0;
  }
  @media (max-width: 900px) {
    .manifest-tiles { grid-template-columns: 1fr; }
    .m-tile { border-right: none; border-bottom: 1.5px solid var(--blue); }
    .m-tile:last-child { border-bottom: none; }
  }
  @media (max-width: 480px) {
    .m-tile { padding: 28px 22px; min-height: auto; gap: 12px; }
    .m-tile .num { font-size: 72px; }
    .m-tile h4 { font-size: 30px; }
    .m-tile p { font-size: 15px; }
  }

  /* LECTURAS (sobre alt cobalto) */
  .reads {
    border: 1.5px solid var(--cream);
  }
  .reads-row {
    display: grid;
    grid-template-columns: 1fr 1.6fr;
    gap: 0;
    border-bottom: 1.5px solid var(--cream);
  }
  .reads-row:last-child { border-bottom: none; }
  .reads-name {
    padding: 32px;
    border-right: 1.5px solid var(--cream);
    font-family: var(--display);
    font-size: 44px; font-weight: 600; line-height: 1;
    color: var(--cream);
  }
  .reads-name em { font-style: italic; }
  .reads-name .where {
    display: block; margin-top: 8px;
    font-family: var(--mono); font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(241, 234, 216, 0.7); font-weight: 400;
  }
  .reads-body {
    padding: 32px;
    font-family: var(--serif); font-style: italic;
    font-size: 17px; line-height: 1.6;
    color: rgba(241, 234, 216, 0.92);
  }
  @media (max-width: 900px) {
    .reads-row { grid-template-columns: 1fr; }
    .reads-name { border-right: none; border-bottom: 1px dashed rgba(241, 234, 216, 0.35); }
  }
  @media (max-width: 480px) {
    .reads-name { padding: 24px 22px; font-size: 36px; }
    .reads-body { padding: 22px; font-size: 15.5px; }
  }

  /* CIERRE / Hablamos */
  .closer {
    margin-top: 0;
    padding: 64px;
    border: 1.5px solid var(--blue);
    background: var(--cream);
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 40px;
    align-items: end;
  }
  .closer h3 {
    font-family: var(--display);
    font-size: clamp(40px, 6vw, 92px);
    line-height: 0.95; font-weight: 600;
    color: var(--blue); letter-spacing: -0.01em;
    margin: 0;
  }
  .closer h3 em { font-style: italic; }
  .closer p {
    font-family: var(--serif); font-style: italic;
    font-size: 17px; line-height: 1.55;
    margin: 18px 0 0; max-width: 460px;
    color: var(--ink);
  }
  .closer-actions { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
  .eg-btn {
    display: inline-flex; align-items: center; min-height: 44px;
    padding: 14px 22px;
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
    text-decoration: none; border: 1.5px solid var(--blue);
    transition: background .2s, color .2s;
  }
  .eg-btn-blue { background: var(--blue); color: var(--cream); }
  .eg-btn-blue:hover { background: var(--cream); color: var(--blue); }
  .eg-btn-outline { background: transparent; color: var(--blue); }
  .eg-btn-outline:hover { background: var(--blue); color: var(--cream); }
  .eg-btn:focus-visible {
    outline: 2px solid var(--blue); outline-offset: 3px;
  }
  @media (max-width: 900px) {
    .closer { grid-template-columns: 1fr; padding: 36px; gap: 28px; }
  }
  @media (max-width: 480px) {
    .closer { padding: 26px 22px; gap: 22px; }
    .closer p { font-size: 15.5px; margin-top: 14px; }
    .closer-actions { width: 100%; gap: 10px; }
    .closer-actions .eg-btn { width: 100%; justify-content: center; padding: 14px 18px; }
  }

  /* FOOTER inlined */
  .eg-foot {
    background: var(--cream);
    border-top: 1.5px solid var(--blue);
    padding: 64px 0 28px;
    color: var(--ink);
  }
  .eg-foot-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 48px;
    padding-bottom: 48px;
    border-bottom: 1px dashed var(--blue);
  }
  .eg-foot-tag {
    font-family: var(--serif); font-style: italic;
    font-size: 16px; line-height: 1.55;
    margin-top: 12px; color: var(--ink-soft);
  }
  .eg-foot-tag em { font-style: italic; }
  .eg-foot-col h5 {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--blue); margin: 0 0 16px;
    font-weight: 500;
  }
  .eg-foot-col a {
    display: block;
    font-family: var(--serif);
    font-size: 16px; line-height: 1.7;
    color: var(--ink-soft);
    text-decoration: none;
  }
  .eg-foot-col a:hover { color: var(--blue); text-decoration: underline; }
  .eg-foot-col a:focus-visible {
    outline: 2px solid var(--blue); outline-offset: 3px;
    color: var(--blue); border-radius: 2px;
  }
  .eg-foot-bot {
    display: flex; justify-content: space-between; gap: 24px; flex-wrap: wrap;
    padding-top: 24px;
    font-family: var(--mono); font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--ink-soft);
  }
  @media (max-width: 900px) {
    .eg-foot { padding: 48px 0 26px; }
    .eg-foot-grid { grid-template-columns: 1fr 1fr; gap: 32px; padding-bottom: 36px; }
  }
  @media (max-width: 540px) {
    .eg-foot-grid { grid-template-columns: 1fr; gap: 28px; }
  }
  @media (max-width: 480px) {
    .eg-foot { padding: 36px 0 22px; }
    .eg-foot-tag { font-size: 15px; }
    .eg-foot-bot { font-size: 9.5px; letter-spacing: 0.18em; gap: 10px; padding-top: 18px; }
  }

  /* Reduced motion: disable transitions */
  @media (prefers-reduced-motion: reduce) {
    .eg-nav-cta, .eg-nav-links a, .eg-btn, .eg-foot-col a {
      transition: none;
    }
  }
`;

export default function SobreNosotrosPage() {
  return (
    <div className="sobre-page">
      <style>{css}</style>

      {/* NAV (inline; sustituir por <EgoeraNav active="sobre" /> cuando exista) */}
      <nav className="eg-nav" aria-label="Navegación principal Egoera">
        <Link href="/" className="eg-badge">
          <svg
            className="star"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M12 3 L13.5 10.5 L21 12 L13.5 13.5 L12 21 L10.5 13.5 L3 12 L10.5 10.5 Z" />
          </svg>
          egoera <em>· psicología</em>
        </Link>
        <div className="eg-nav-links">
          <Link href="/">Inicio</Link>
          <Link href="/blog">Vlog</Link>
          <Link href="/sobre-nosotros" className="active">Sobre Ander</Link>
          <Link href="/servicios">Consulta</Link>
          <Link href="/contacto">Contacto</Link>
        </div>
        <Link href="/contacto" className="eg-nav-cta">
          Reservar consulta
        </Link>
      </nav>

      {/* HERO BIO */}
      <section className="bio-hero">
        <div className="wrap">
          <div className="bio-grid">
            <div className="bio-text">
              <span className="bio-eyebrow">Quién está detrás · sobre 01</span>
              <h1 className="bio-h" style={{ textWrap: "balance" }}>
                Ander <em>Bilbao</em> Castejón.
                <span className="role">
                  Psicólogo colegiado · BI-04567 · Bilbao. Llevo más de una década
                  escuchando lo que el cuerpo no se atreve a decir en voz alta.
                </span>
              </h1>
              <div className="bio-meta">
                <span>
                  Col. <strong>nº BI-04567</strong>
                </span>
                <span>
                  Bilbao · <strong>presencial / online</strong>
                </span>
                <span>
                  Idiomas · <strong>ES · EU</strong>
                </span>
                <span>
                  Desde · <strong>2018</strong>
                </span>
              </div>
            </div>
            <div className="bio-portrait">
              <div className="portrait-frame">
                <span className="placeholder-tag">retrato · 4:5</span>
                <svg
                  viewBox="0 0 200 250"
                  fill="none"
                  stroke="rgba(241,234,216,.35)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="100" cy="80" r="38" />
                  <path d="M 40 230 C 40 170, 70 140, 100 140 C 130 140, 160 170, 160 230" />
                  <path d="M 80 75 C 86 80, 94 80, 100 75" />
                  <path d="M 100 75 C 106 80, 114 80, 120 75" />
                  <path d="M 92 95 Q 100 100, 108 95" />
                  <line x1="20" y1="20" x2="40" y2="20" strokeDasharray="2 4" />
                  <line x1="20" y1="20" x2="20" y2="40" strokeDasharray="2 4" />
                  <line x1="180" y1="20" x2="160" y2="20" strokeDasharray="2 4" />
                  <line x1="180" y1="20" x2="180" y2="40" strokeDasharray="2 4" />
                </svg>
              </div>
              <div className="portrait-cap">
                Despacio. <em>Bilbaíno.</em>
              </div>
              <div className="portrait-meta">
                <span>Bilbao · 2026</span>
                <span>foto pendiente</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRAYECTORIA / TIMELINE */}
      <section className="section">
        <div className="wrap">
          <div className="head">
            <div>
              <div className="eyebrow">Trayectoria · 02</div>
              <h2>
                de <em>Bilbao</em> a una consulta propia
              </h2>
            </div>
            <p className="side">
              Ocho años caminando entre la academia, la consulta y la escritura.
              Cada parada me dejó una pregunta nueva — y una manera distinta de
              escuchar.
            </p>
          </div>

          <div className="timeline">
            <div className="tl-item">
              <div>
                <div className="tl-year">2018</div>
                <div className="tl-where">UPV/EHU · Leioa</div>
              </div>
              <div>
                <div className="tl-title">Licenciatura en Psicología</div>
                <div className="tl-where" style={{ marginTop: 4 }}>
                  Universidad del País Vasco
                </div>
              </div>
              <p className="tl-body">
                Empecé creyendo que la psicología era un mapa. Salí entendiendo
                que es, sobre todo, un idioma — y que cada persona tiene el suyo.
              </p>
            </div>

            <div className="tl-item">
              <div>
                <div className="tl-year">2020</div>
                <div className="tl-where">Formación · Madrid</div>
              </div>
              <div>
                <div className="tl-title">
                  Máster en Terapia <em>Cognitivo-Conductual</em>
                </div>
                <div className="tl-where" style={{ marginTop: 4 }}>
                  Especialización clínica
                </div>
              </div>
              <p className="tl-body">
                Dos años para aprender que la técnica no sirve si no entiendes a
                quién tienes delante. La cabeza explica; la persona, no siempre.
              </p>
            </div>

            <div className="tl-item">
              <div>
                <div className="tl-year">2021</div>
                <div className="tl-where">Bilbao · consulta propia</div>
              </div>
              <div>
                <div className="tl-title">
                  Inicio <em>práctica clínica</em> en Bilbao
                </div>
                <div className="tl-where" style={{ marginTop: 4 }}>
                  Presencial + online
                </div>
              </div>
              <p className="tl-body">
                Una sala con luz buena, una butaca cómoda y suficiente silencio
                para que uno se oiga a sí mismo. Eso era lo que quería ofrecer.
              </p>
            </div>

            <div className="tl-item">
              <div>
                <div className="tl-year">2024</div>
                <div className="tl-where">Instagram · TikTok</div>
              </div>
              <div>
                <div className="tl-title">
                  Lanzamiento de <em>@egoera.psikologia</em>
                </div>
                <div className="tl-where" style={{ marginTop: 4 }}>
                  Contenido semanal · líneas Reflexiona, Aprende, Práctica
                </div>
              </div>
              <p className="tl-body">
                Lo que cuento en consulta no debería costar 50 € por entender.
                Empecé a publicar en redes sin imperativos ni listicles.
              </p>
            </div>

            <div className="tl-item">
              <div>
                <div className="tl-year">2026</div>
                <div className="tl-where">egoera.es</div>
              </div>
              <div>
                <div className="tl-title">
                  Egoera.es: vlog editorial + diario emocional como app
                </div>
                <div className="tl-where" style={{ marginTop: 4 }}>
                  Biblioteca abierta · web + PWA
                </div>
              </div>
              <p className="tl-body">
                La casa propia. Domingos para escribir despacio, una app para
                anotar lo que uno siente entre semana. Lo demás, ya iremos
                viendo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFIESTO RESUMIDO (sobre cream) */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="head">
            <div>
              <div className="eyebrow">Manifiesto · 03</div>
              <h2>
                cómo <em>trabajo</em>
              </h2>
            </div>
            <p className="side">
              Cuatro principios. Si alguno te chirría, mejor saberlo antes que
              después.
            </p>
          </div>

          <div className="manifest-tiles">
            <div className="m-tile">
              <span className="num">
                01<em>.</em>
              </span>
              <h4>nada de imperativos</h4>
              <p>
                No te voy a decir qué tienes que hacer. Vamos a mirar juntos qué
                te está pasando, y desde ahí decides tú.
              </p>
            </div>
            <div className="m-tile">
              <span className="num">
                02<em>.</em>
              </span>
              <h4>despacio</h4>
              <p>
                Lo importante rara vez se entiende deprisa. Trabajo a la
                velocidad de quien tengo delante, no a la del manual.
              </p>
            </div>
            <div className="m-tile">
              <span className="num">
                03<em>.</em>
              </span>
              <h4>sin listicles</h4>
              <p>
                Ni «5 claves para», ni «10 hábitos que». La psicología no cabe
                en una infografía. Aquí se escribe en párrafos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LECTURAS QUE ME HAN FORMADO (alt cobalto) */}
      <section className="section alt">
        <div className="wrap">
          <div className="head">
            <div>
              <div className="eyebrow">Biblioteca · 04</div>
              <h2>
                lecturas que me han <em>formado</em>
              </h2>
            </div>
            <p className="side">
              Cuatro nombres a los que vuelvo cuando me pierdo. No son los
              únicos; son los que más me han cambiado la escucha.
            </p>
          </div>

          <div className="reads">
            <div className="reads-row">
              <div className="reads-name">
                <em>Viktor</em> Frankl
                <span className="where">El hombre en busca de sentido</span>
              </div>
              <div className="reads-body">
                Que el sufrimiento, cuando encuentra un porqué, deja de ser solo
                sufrimiento. La logoterapia como recordatorio de que el sentido
                no se encuentra: se construye.
              </div>
            </div>
            <div className="reads-row">
              <div className="reads-name">
                <em>Irvin</em> Yalom
                <span className="where">El don de la terapia · Psicoterapia existencial</span>
              </div>
              <div className="reads-body">
                Que la relación terapéutica es el verdadero trabajo. Lo demás
                son herramientas. Yalom me enseñó a no esconderme detrás del
                rol.
              </div>
            </div>
            <div className="reads-row">
              <div className="reads-name">
                Fernando <em>Pessoa</em>
                <span className="where">Libro del desasosiego</span>
              </div>
              <div className="reads-body">
                Que dentro de uno caben muchos. La identidad como conversación
                entre voces, no como monólogo. La literatura es también
                psicología, sólo que mejor escrita.
              </div>
            </div>
            <div className="reads-row">
              <div className="reads-name">
                John <em>Bowlby</em>
                <span className="where">Trilogía del apego</span>
              </div>
              <div className="reads-body">
                Que cómo nos cuidaron de pequeños sigue eligiendo a quién amamos
                de mayores. El apego como mapa silencioso de casi todo lo que
                nos pasa con los demás.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HABLAMOS · CIERRE */}
      <section className="section">
        <div className="wrap">
          <div className="head">
            <div>
              <div className="eyebrow">Hablamos · 05</div>
              <h2>
                nos <em>vemos</em> cuando quieras
              </h2>
            </div>
            <p className="side">
              Si has llegado hasta aquí, ya sabes algo de cómo trabajo. La
              primera sesión es una conversación sin compromiso para vernos las
              caras antes de decidir nada.
            </p>
          </div>

          <div className="closer">
            <div>
              <h3>
                empezamos por <em>una conversación</em>
              </h3>
              <p>
                Sin formularios largos ni cuestionarios clínicos. Me escribes,
                acordamos un día, y vemos si encajamos. Si no encajamos, te
                recomiendo a alguien que sí.
              </p>
            </div>
            <div className="closer-actions">
              <Link href="/contacto" className="eg-btn eg-btn-blue">
                Reservar primera sesión →
              </Link>
              <Link href="/contacto" className="eg-btn eg-btn-outline">
                Escribir un email
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER (inline; sustituir por <EgoeraFooter /> cuando exista) */}
      <footer className="eg-foot">
        <div className="wrap">
          <div className="eg-foot-grid">
            <div>
              <div className="eg-badge">
                <svg
                  className="star"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M12 3 L13.5 10.5 L21 12 L13.5 13.5 L12 21 L10.5 13.5 L3 12 L10.5 10.5 Z" />
                </svg>
                egoera
              </div>
              <p className="eg-foot-tag">
                un sitio para <em>sentir despacio</em>
              </p>
            </div>
            <div className="eg-foot-col">
              <h5>Vlog</h5>
              <Link href="/blog">Últimas entradas</Link>
              <Link href="/sentimiento">Por sentimiento</Link>
              <Link href="/blog">Archivo</Link>
            </div>
            <div className="eg-foot-col">
              <h5>Egoera</h5>
              <Link href="/sobre-nosotros">Sobre Ander</Link>
              <Link href="/servicios">Consulta</Link>
              <Link href="/contacto">Contacto</Link>
            </div>
            <div className="eg-foot-col">
              <h5>Legal</h5>
              <Link href="/aviso-legal">Aviso legal</Link>
              <Link href="/privacidad">Privacidad</Link>
              <span style={{ display: "block", fontFamily: "var(--font-serif)", fontSize: 16, lineHeight: 1.7, color: "var(--ink-soft)" }}>
                Colegio · BI-04567
              </span>
            </div>
          </div>
          <div className="eg-foot-bot">
            <span>© 2026 · egoera · ander bilbao castejón</span>
            <span>diseñado en Bilbao · publicado los domingos</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
