import type { Metadata } from "next";
import Link from "next/link";

import { EgoeraNav } from "@/components/egoera/EgoeraNav";
import { EgoeraFooter } from "@/components/egoera/EgoeraFooter";
// Reusamos el monigote Egoera ya creado en /sentir (figura sentada
// con flor mostaza creciendo de la cabeza). Es la mascota canónica.
import { Mascot } from "@/app/sentir/illustrations";

export const metadata: Metadata = {
  title: "Ander Bilbao Castejón · Sobre · Egoera",
  description:
    "Psicólogo general sanitario colegiado en Bilbao (B-04122). Más de una década entre academia, hospital y Egoera. Trayectoria, manifiesto y respuestas a las dudas más frecuentes.",
  openGraph: {
    title: "Sobre Ander · Egoera",
    description:
      "Psicólogo general sanitario en Bilbao. Trayectoria, manifiesto y por qué Egoera escribe despacio.",
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
    font-size: clamp(72px, 11vw, 168px);
    line-height: 0.85; font-weight: 600;
    color: var(--blue); letter-spacing: -0.01em;
    margin: 0;
    word-break: break-word;
  }
  .bio-h em { font-style: italic; }
  .bio-h .role {
    display: block;
    font-family: var(--serif); font-style: italic;
    font-size: clamp(16px, 1.5vw, 22px); line-height: 1.4;
    color: var(--ink-soft); margin-top: 18px; max-width: 26em;
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
    border: 1.5px dashed rgba(247, 224, 122, 0.85);
    background:
      repeating-linear-gradient(135deg, rgba(241, 234, 216, 0.06) 0 12px, transparent 12px 24px),
      repeating-linear-gradient(45deg, rgba(247, 224, 122, 0.04) 0 18px, transparent 18px 36px);
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }
  .portrait-frame svg { width: 70%; height: 70%; }
  /* Mascot Egoera (figura sentada + flor mostaza). El trazo usa
     currentColor del padre → cream contra el fondo cobalto.
     La mancha mostaza interior está pintada por color fijo (#f4c842). */
  .portrait-frame .portrait-mascot {
    color: rgba(241, 234, 216, 0.92);
    width: auto;
    height: 78%;
    animation: portrait-breath 7s ease-in-out infinite;
    transform-origin: 50% 60%;
  }
  @keyframes portrait-breath {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.025); }
  }
  @media (prefers-reduced-motion: reduce) {
    .portrait-frame .portrait-mascot { animation: none; }
  }
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
    .bio-h { font-size: clamp(48px, 14vw, 72px); }
    .bio-h .role { font-size: 15px; margin-top: 14px; }
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
    font-size: clamp(48px, 7vw, 110px);
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

  /* MANIFIESTO TILES (sobre cobalto alt) */
  .tiles {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border: 1.5px solid var(--cream);
  }
  .tile {
    padding: 40px;
    border-right: 1.5px solid var(--cream);
    display: flex; flex-direction: column; gap: 16px;
    min-height: 320px;
  }
  .tile:last-child { border-right: none; }
  .tile .num {
    font-family: var(--display);
    font-size: 100px; font-weight: 600; line-height: 0.85;
    color: var(--cream); opacity: .85;
  }
  .tile .num em { font-style: italic; }
  .tile h4 {
    font-family: var(--display);
    font-size: 38px; font-weight: 600; line-height: 1;
    color: var(--cream);
    margin: 0;
  }
  .tile p {
    font-family: var(--serif); font-size: 16px; line-height: 1.55;
    color: rgba(241, 234, 216, 0.92);
    margin: 0;
  }
  @media (max-width: 900px) {
    .tiles { grid-template-columns: 1fr; }
    .tile { border-right: none; border-bottom: 1.5px solid var(--cream); }
    .tile:last-child { border-bottom: none; }
  }
  @media (max-width: 480px) {
    .tile { padding: 28px 22px; min-height: auto; gap: 12px; }
    .tile .num { font-size: 72px; }
    .tile h4 { font-size: 32px; }
    .tile p { font-size: 15px; }
  }

  /* FAQ */
  .qa { border: 1.5px solid var(--blue); }
  .qa-row {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 0;
    border-bottom: 1.5px solid var(--blue);
  }
  .qa-row:last-child { border-bottom: none; }
  .qa-q {
    padding: 32px;
    border-right: 1.5px solid var(--blue);
    font-family: var(--display);
    font-size: 36px; font-weight: 600; line-height: 1;
    color: var(--blue);
  }
  .qa-q em { font-style: italic; }
  .qa-a {
    padding: 32px;
    font-family: var(--serif);
    font-size: 17px; line-height: 1.6;
    color: var(--ink);
  }
  @media (max-width: 900px) {
    .qa-row { grid-template-columns: 1fr; }
    .qa-q { border-right: none; border-bottom: 1px dashed var(--blue); }
  }
  @media (max-width: 480px) {
    .qa-q { padding: 22px; font-size: 30px; }
    .qa-a { padding: 22px; font-size: 16px; }
  }

  /* CIERRE */
  .closer {
    margin-top: 80px;
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
    font-size: clamp(48px, 6vw, 92px);
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
    .closer { grid-template-columns: 1fr; padding: 36px; gap: 28px; margin-top: 56px; }
  }
  @media (max-width: 480px) {
    .closer { padding: 26px 22px; gap: 22px; margin-top: 40px; }
    .closer p { font-size: 15.5px; margin-top: 14px; }
    .closer-actions { width: 100%; gap: 10px; }
    .closer-actions .eg-btn { width: 100%; justify-content: center; padding: 14px 18px; }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .eg-btn { transition: none; }
  }
`;

export default function SobreNosotrosPage() {
  return (
    <div className="sobre-page">
      <style>{css}</style>

      <EgoeraNav active="sobre" />

      {/* HERO BIO */}
      <section className="bio-hero">
        <div className="wrap">
          <div className="bio-grid">
            <div className="bio-text">
              <span className="bio-eyebrow">Quién está detrás · sobre 01</span>
              <h1 className="bio-h" style={{ textWrap: "balance" }}>
                Ander <em>Bilbao</em>
                <br />
                Castejón
                <span className="role">
                  Psicólogo general sanitario. Llevo más de una década escuchando
                  lo que el cuerpo no se atreve a decir en voz alta.
                </span>
              </h1>
              <div className="bio-meta">
                <span>
                  Col. <strong>nº B-04122</strong>
                </span>
                <span>
                  Bilbao · <strong>BBK / online</strong>
                </span>
                <span>
                  Idiomas · <strong>ES · EU · EN</strong>
                </span>
                <span>
                  Desde · <strong>2014</strong>
                </span>
              </div>
            </div>
            <div className="bio-portrait">
              <div className="portrait-frame">
                <span className="placeholder-tag">retrato · 4:5</span>
                {/* El monigote canónico de Egoera (figura sentada
                    con flor mostaza creciendo de la cabeza). Es la
                    misma mascota que aparece en /sentir, así marca
                    continuidad de identidad visual a través del sitio. */}
                <Mascot size={240} className="portrait-mascot" />
              </div>
              <div className="portrait-cap">
                &ldquo;escuchar es <em>resistirse a arreglar</em>&rdquo;
              </div>
              <div className="portrait-meta">
                <span>Bilbao · 2026</span>
                <span>monigote · provisional</span>
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
                de <em>Bilbao</em> a un cuaderno propio
              </h2>
            </div>
            <p className="side">
              Doce años caminando entre la academia, el hospital y los
              procesos largos. Cada parada me dejó una pregunta nueva — y
              una manera distinta de escuchar.
            </p>
          </div>

          <div className="timeline">
            <div className="tl-item">
              <div>
                <div className="tl-year">2014</div>
                <div className="tl-where">UPV/EHU · Leioa</div>
              </div>
              <div>
                <div className="tl-title">Grado en Psicología</div>
                <div className="tl-where" style={{ marginTop: 4 }}>
                  Premio extraordinario fin de carrera
                </div>
              </div>
              <p className="tl-body">
                Empecé creyendo que la psicología era un mapa. Salí entendiendo
                que es, sobre todo, un idioma — y que cada persona tiene el
                suyo.
              </p>
            </div>

            <div className="tl-item">
              <div>
                <div className="tl-year">2016</div>
                <div className="tl-where">Universidad Complutense · Madrid</div>
              </div>
              <div>
                <div className="tl-title">
                  Máster en Psicología General Sanitaria
                </div>
                <div className="tl-where" style={{ marginTop: 4 }}>
                  Especialización clínica
                </div>
              </div>
              <p className="tl-body">
                Dos años de prácticas con población adulta. Mi primer paciente:
                alguien que llevaba diez años sin dormir bien y nadie le había
                preguntado por qué.
              </p>
            </div>

            <div className="tl-item">
              <div>
                <div className="tl-year">2017</div>
                <div className="tl-where">Hospital de Cruces · Barakaldo</div>
              </div>
              <div>
                <div className="tl-title">Unidad de salud mental adulta</div>
                <div className="tl-where" style={{ marginTop: 4 }}>
                  3 años · contrato público
                </div>
              </div>
              <p className="tl-body">
                Aprendí que <em>el tiempo</em> es la herramienta más cara y más
                necesaria. Y que la mayoría de los servicios públicos no la
                pueden permitir.
              </p>
            </div>

            <div className="tl-item">
              <div>
                <div className="tl-year">2020</div>
                <div className="tl-where">Formación · Madrid · Berlín</div>
              </div>
              <div>
                <div className="tl-title">Trauma temprano · apego · IFS</div>
                <div className="tl-where" style={{ marginTop: 4 }}>
                  Terapia somática + sistémica
                </div>
              </div>
              <p className="tl-body">
                Mientras el mundo paraba, yo me formé en lo que más me faltaba:
                cómo el cuerpo guarda lo que la mente no puede sostener.
              </p>
            </div>

            <div className="tl-item">
              <div>
                <div className="tl-year">2022</div>
                <div className="tl-where">Bilbao · cuaderno editorial</div>
              </div>
              <div>
                <div className="tl-title">Abro Egoera · escritura propia</div>
                <div className="tl-where" style={{ marginTop: 4 }}>
                  Online · castellano + euskara
                </div>
              </div>
              <p className="tl-body">
                Decidí poner la psicología que practico en una pantalla,
                pero despacio: cartas semanales, lecturas largas y un
                diario emocional. Para que la gente tenga un sitio adonde
                volver entre sesión y sesión, o cuando ni siquiera hay
                sesión.
              </p>
            </div>

            <div className="tl-item">
              <div>
                <div className="tl-year">2025</div>
                <div className="tl-where">egoera.es</div>
              </div>
              <div>
                <div className="tl-title">
                  Nace <em>Egoera</em>
                </div>
                <div className="tl-where" style={{ marginTop: 4 }}>
                  Vlog + biblioteca abierta
                </div>
              </div>
              <p className="tl-body">
                Porque lo que cuento en consulta no debería costar 50 € por
                entender. Empecé a escribir los domingos, y no he parado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFIESTO (sobre cobalto alt) */}
      <section className="section alt">
        <div className="wrap">
          <div className="head">
            <div>
              <div className="eyebrow">Manifiesto · 03</div>
              <h2>
                cómo <em>trabajo</em>
              </h2>
            </div>
            <p className="side">
              Tres principios. Si alguno te chirría, mejor saberlo antes que
              después.
            </p>
          </div>

          <div className="tiles">
            <div className="tile">
              <span className="num">
                01<em>.</em>
              </span>
              <h4>nada de píldoras rápidas</h4>
              <p>
                Ningún ejercicio sirve si no lo entiendes. Antes de practicar,
                hablamos de para qué. La técnica viene después de la pregunta.
              </p>
            </div>
            <div className="tile">
              <span className="num">
                02<em>.</em>
              </span>
              <h4>el cuerpo manda</h4>
              <p>
                La cabeza explica lo que ya sabe. El cuerpo guarda lo que aún no
                entendemos. Trabajo con los dos, sin opa entre ellos.
              </p>
            </div>
            <div className="tile">
              <span className="num">
                03<em>.</em>
              </span>
              <h4>termina cuando termina</h4>
              <p>
                No firmamos compromiso de continuidad. Si sientes que ya no me
                necesitas, te ayudo a cerrar bien. Volver siempre se puede.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ + CIERRE */}
      <section className="section">
        <div className="wrap">
          <div className="head">
            <div>
              <div className="eyebrow">Lo que más me preguntan · 04</div>
              <h2>
                antes de <em>escribirme</em>
              </h2>
            </div>
            <p className="side">
              Cinco dudas comunes. Si la tuya no está, escríbeme — me leo todo
              lo que llega.
            </p>
          </div>

          <div className="qa">
            <div className="qa-row">
              <div className="qa-q">
                ¿en qué <em>encajo</em> mejor?
              </div>
              <div className="qa-a">
                Adultos con ansiedad, dificultades de apego, duelo, agotamiento
                crónico, o quienes vienen de procesos terapéuticos previos que
                se quedaron a medias. Si llegas con una crisis aguda o necesidad
                de medicación, te puedo orientar pero te derivo.
              </div>
            </div>
            <div className="qa-row">
              <div className="qa-q">
                ¿cuánto <em>dura</em> un proceso?
              </div>
              <div className="qa-a">
                Depende. Procesos breves de 8–12 sesiones para un tema concreto.
                Procesos largos cuando el patrón es antiguo. Lo decidimos juntos
                en sesión 3, no en sesión 1.
              </div>
            </div>
            <div className="qa-row">
              <div className="qa-q">
                ¿es <em>online</em> tan eficaz?
              </div>
              <div className="qa-a">
                Para la mayoría de demandas, sí. Para trabajo somático profundo
                o cuando hay disociación importante, prefiero presencial al
                menos en las primeras sesiones.
              </div>
            </div>
            <div className="qa-row">
              <div className="qa-q">
                ¿guardas <em>secreto</em>?
              </div>
              <div className="qa-a">
                Confidencialidad total, salvo riesgo grave para ti o terceros
                (lo marca la ley). No comparto datos con seguros, familiares ni
                nadie. Si quieres informe, te lo escribo a ti.
              </div>
            </div>
            <div className="qa-row">
              <div className="qa-q">
                ¿qué pasa si <em>no</em> encajamos?
              </div>
              <div className="qa-a">
                Te lo digo pronto y te recomiendo a alguien que pueda encajar
                mejor. No es un fracaso — es la primera información útil del
                proceso.
              </div>
            </div>
          </div>

          <div className="closer">
            <div>
              <h3>
                empieza por <em>donde te apetezca</em>
              </h3>
              <p>
                Si has llegado hasta aquí, ya sabes algo de cómo escribo.
                Todo lo público de Egoera está abierto: cuaderno, brújula,
                diario emocional, boletín. Sin email obligatorio.
              </p>
            </div>
            <div className="closer-actions">
              <Link href="/blog" className="eg-btn eg-btn-blue">
                Empezar por el cuaderno →
              </Link>
              <a
                href="https://diario.egoera.es"
                target="_blank"
                rel="noopener noreferrer"
                className="eg-btn eg-btn-outline"
              >
                Abrir el diario
              </a>
            </div>
          </div>
        </div>
      </section>

      <EgoeraFooter />
    </div>
  );
}
