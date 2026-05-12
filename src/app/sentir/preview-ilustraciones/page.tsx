/**
 * /sentir/preview-ilustraciones — galería de propuestas (v2 "absurd design").
 *
 * Ruta TEMPORAL de evaluación: 8 ilustraciones SVG inline animadas, una
 * por sentimiento, en estética "absurd design" — personajes esquemáticos
 * hand-drawn sobre papel blanco/crema, con áreas planas de amarillo
 * mostaza fluorescente como acento metafórico. Cada escena cuenta UNA
 * idea absurda pero significativa (un nudo donde debería estar el
 * estómago, un charco que se pega a los pies, un hilo que une dos
 * personas, una piedra a cuestas…).
 *
 * Sirve para que el usuario apruebe la dirección antes de propagarla
 * por el resto del flujo de /sentir.
 */
import Link from "next/link";

import { EgoeraNav } from "@/components/egoera/EgoeraNav";

export const metadata = {
  title: "Preview ilustraciones · Brújula",
  robots: { index: false, follow: false },
};

// ───────────────────────────────────────────────────────────────────────
// Convención: viewBox 0 0 120 120, stroke currentColor (sepia oscuro),
// stroke-width 1.8-2.2, fill #f4c842 hardcoded para manchurrones
// amarillos. Cada SVG es una ESCENA, no un objeto pelado.
// ───────────────────────────────────────────────────────────────────────

const MUSTARD = "#f4c842";

const PROPS = {
  viewBox: "0 0 120 120",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* ANSIEDAD — nudo amarillo enorme donde debería estar el estómago */
function Ansiedad() {
  return (
    <svg {...PROPS} className="ill ill-ansiedad" aria-hidden>
      {/* cabeza pequeña */}
      <g className="ans-head">
        <path d="M50 16 C50 10, 56 6, 60 6 C66 6, 70 10, 70 16 C70 22, 66 26, 60 26 C56 26, 50 22, 50 16 Z" />
        <path d="M54 15 L57 14" strokeWidth={1.6} />
        <path d="M63 14 L66 15" strokeWidth={1.6} />
        <path d="M56 21 L64 21" strokeWidth={1.7} />
      </g>
      <path d="M60 26 L60 36" />
      {/* mancha mostaza del nudo */}
      <g className="ans-knot">
        <ellipse cx={60} cy={62} rx={28} ry={24} fill={MUSTARD} stroke="none" />
        <path d="M34 58 C34 44, 46 38, 60 38 C74 38, 86 46, 86 60 C86 76, 76 86, 60 86 C44 86, 34 76, 34 62 Z" />
        <path d="M42 50 C52 58, 58 62, 70 58 C78 56, 82 64, 78 72" strokeWidth={2} />
        <path d="M44 72 C52 68, 56 64, 64 68 C72 72, 80 70, 80 64" strokeWidth={2} />
      </g>
      {/* piernecitas */}
      <path d="M52 88 L48 104" />
      <path d="M68 88 L72 104" />
      <path d="M44 106 L52 104" />
      <path d="M68 104 L76 106" />
      {/* salpicaduras */}
      <g className="ans-sparks">
        <circle cx={22} cy={48} r={1.8} fill={MUSTARD} stroke="none" />
        <circle cx={98} cy={50} r={1.6} fill={MUSTARD} stroke="none" />
        <circle cx={104} cy={70} r={2} fill={MUSTARD} stroke="none" />
      </g>
    </svg>
  );
}

/* TRISTEZA — figura saliendo de un charco mostaza pegado a los pies */
function Tristeza() {
  return (
    <svg {...PROPS} className="ill ill-tristeza" aria-hidden>
      {/* charco */}
      <g className="tri-puddle">
        <path
          d="M14 100 C10 92, 16 84, 30 82 C46 80, 60 86, 78 84 C96 82, 110 88, 108 96 C106 106, 92 112, 70 112 C48 112, 22 110, 14 100 Z"
          fill={MUSTARD}
          stroke="none"
        />
        <path d="M14 100 C10 92, 16 84, 30 82 C46 80, 60 86, 78 84 C96 82, 110 88, 108 96 C106 106, 92 112, 70 112 C48 112, 22 110, 14 100 Z" />
        <circle cx={18} cy={86} r={2.2} fill={MUSTARD} stroke="none" />
        <circle cx={110} cy={84} r={1.8} fill={MUSTARD} stroke="none" />
      </g>
      {/* figura */}
      <g className="tri-body">
        <path d="M48 32 C48 22, 54 16, 60 16 C68 16, 74 22, 74 32 C74 42, 68 48, 60 48 C54 48, 48 42, 48 32 Z" />
        <path d="M52 30 C54 32, 56 32, 58 30" />
        <path d="M64 30 C66 32, 68 32, 70 30" />
        <path d="M56 40 C58 38, 62 38, 64 40" />
        <path
          d="M54 38 C52 44, 52 48, 54 50 C56 50, 56 44, 54 38 Z"
          fill={MUSTARD}
          stroke="currentColor"
          strokeWidth={1.4}
          className="tri-tear"
        />
        <path d="M40 70 C46 56, 56 50, 60 50" />
        <path d="M80 70 C74 56, 64 50, 60 50" />
        <path d="M44 70 C46 84, 50 92, 60 92" />
        <path d="M76 70 C74 84, 70 92, 60 92" />
        <path d="M40 72 C36 80, 34 88, 32 96" />
        <path d="M80 72 C84 80, 86 88, 88 96" />
      </g>
    </svg>
  );
}

/* APEGO — dos figuras conectadas por un hilo amarillo larguísimo */
function Apego() {
  return (
    <svg {...PROPS} className="ill ill-apego" aria-hidden>
      {/* figura izquierda */}
      <g className="ape-left">
        <path d="M18 50 C18 42, 24 38, 30 38 C36 38, 42 42, 42 50 C42 58, 36 62, 30 62 C24 62, 18 58, 18 50 Z" />
        <path d="M22 49 L26 49" />
        <path d="M34 49 L38 49" />
        <path d="M26 56 C28 57, 32 57, 34 56" />
        <path d="M22 78 C24 70, 26 64, 30 64" />
        <path d="M38 78 C36 70, 34 64, 30 64" />
        <path d="M26 102 L22 78" />
        <path d="M34 102 L38 78" />
      </g>
      {/* hilo amarillo */}
      <g className="ape-thread">
        <path
          d="M30 38 C36 22, 60 16, 78 22 C92 26, 98 38, 92 50"
          stroke={MUSTARD}
          strokeWidth={4.5}
          fill="none"
        />
        <path d="M30 38 C36 22, 60 16, 78 22 C92 26, 98 38, 92 50" strokeWidth={1.4} strokeDasharray="2 6" />
        <circle cx={60} cy={18} r={3.5} fill={MUSTARD} stroke="currentColor" strokeWidth={1.4} className="ape-knot" />
      </g>
      {/* figura derecha */}
      <g className="ape-right">
        <path d="M76 50 C76 42, 82 38, 92 38 C100 38, 104 44, 104 52 C104 60, 100 64, 92 64 C84 64, 76 58, 76 50 Z" />
        <path d="M82 49 L86 49" />
        <path d="M94 49 L98 49" />
        <path d="M84 56 C86 57, 90 57, 92 56" />
        <path d="M82 80 C82 72, 86 66, 92 66" />
        <path d="M104 80 C102 72, 98 66, 92 66" />
        <path d="M86 104 L82 80" />
        <path d="M98 104 L104 80" />
      </g>
    </svg>
  );
}

/* AUTOESTIMA — figura sosteniendo su propio reflejo mostaza en alto */
function Autoestima() {
  return (
    <svg {...PROPS} className="ill ill-autoestima" aria-hidden>
      <g className="aut-body">
        <path d="M48 80 C48 72, 54 68, 60 68 C68 68, 72 72, 72 80 C72 88, 68 92, 60 92 C54 92, 48 88, 48 80 Z" />
        <circle cx={55} cy={78} r={1.3} fill="currentColor" stroke="none" />
        <circle cx={65} cy={78} r={1.3} fill="currentColor" stroke="none" />
        <path d="M55 84 C58 86, 62 86, 65 84" strokeWidth={1.7} />
        <path d="M50 106 L50 92" />
        <path d="M70 106 L70 92" />
        <path d="M48 76 C40 64, 32 50, 30 38" />
        <path d="M72 76 C80 64, 88 50, 90 38" />
      </g>
      {/* reflejo mostaza arriba */}
      <g className="aut-mirror">
        <path
          d="M30 36 C28 22, 42 12, 60 12 C80 12, 94 22, 90 36 C86 46, 76 50, 60 50 C44 50, 32 46, 30 36 Z"
          fill={MUSTARD}
          stroke="none"
        />
        <path d="M30 36 C28 22, 42 12, 60 12 C80 12, 94 22, 90 36 C86 46, 76 50, 60 50 C44 50, 32 46, 30 36 Z" />
        <circle cx={54} cy={28} r={1.5} fill="currentColor" stroke="none" />
        <circle cx={66} cy={28} r={1.5} fill="currentColor" stroke="none" />
        <path d="M54 36 C58 38, 62 38, 66 36" strokeWidth={1.6} />
      </g>
      <g className="aut-sparkles">
        <path d="M22 18 L18 14" />
        <path d="M98 18 L102 14" />
        <path d="M16 30 L12 32" />
        <path d="M104 30 L108 32" />
      </g>
    </svg>
  );
}

/* ENFADO — cabeza explotando en chispas mostaza */
function Enfado() {
  return (
    <svg {...PROPS} className="ill ill-enfado" aria-hidden>
      {/* chispas */}
      <g className="enf-sparks">
        <path
          d="M60 6 L62 18 L72 12 L66 22 L80 22 L68 28 L82 36 L66 32 L60 12 Z"
          fill={MUSTARD}
          stroke="none"
        />
        <path
          d="M40 14 L46 24 L34 30 L48 30 L42 40 L50 32 L60 16 Z"
          fill={MUSTARD}
          stroke="none"
        />
        <path
          d="M96 22 L88 30 L98 32 L86 38 L98 42 L88 44 L84 28 Z"
          fill={MUSTARD}
          stroke="none"
        />
        <circle cx={20} cy={28} r={2.8} fill={MUSTARD} stroke="none" />
        <circle cx={100} cy={56} r={2.6} fill={MUSTARD} stroke="none" />
        <circle cx={16} cy={50} r={2} fill={MUSTARD} stroke="none" />
      </g>
      {/* cabeza fracturada */}
      <g className="enf-body">
        <path d="M40 52 C40 42, 48 36, 60 36 C72 36, 80 42, 80 52" />
        <path d="M40 52 L46 48 L52 56 L60 50 L68 56 L74 48 L80 52" strokeWidth={2.2} />
        <path d="M46 60 L54 62" strokeWidth={2.2} />
        <path d="M74 60 L66 62" strokeWidth={2.2} />
        <path d="M50 66 L56 66" strokeWidth={2} />
        <path d="M64 66 L70 66" strokeWidth={2} />
        <path d="M52 76 L68 76" strokeWidth={2} />
        <path d="M52 76 L52 80" />
        <path d="M68 76 L68 80" />
        <path d="M34 96 C40 88, 50 84, 60 84 C70 84, 80 88, 86 96" />
        <path d="M34 108 C40 100, 50 96, 60 96 C70 96, 80 100, 86 108" />
      </g>
    </svg>
  );
}

/* CALMA — figura flotando dentro de una mancha mostaza ovoide */
function Calma() {
  return (
    <svg {...PROPS} className="ill ill-calma" aria-hidden>
      <g className="cal-blob">
        <path
          d="M16 60 C16 36, 32 18, 60 18 C88 18, 104 36, 104 60 C104 86, 88 102, 60 102 C32 102, 16 84, 16 60 Z"
          fill={MUSTARD}
          stroke="none"
        />
        <path d="M16 60 C16 36, 32 18, 60 18 C88 18, 104 36, 104 60 C104 86, 88 102, 60 102 C32 102, 16 84, 16 60 Z" />
      </g>
      <g className="cal-body">
        <path d="M50 48 C50 40, 54 36, 60 36 C66 36, 70 40, 70 48 C70 56, 66 60, 60 60 C54 60, 50 56, 50 48 Z" />
        <path d="M54 47 C55 49, 57 49, 58 47" />
        <path d="M62 47 C63 49, 65 49, 66 47" />
        <path d="M56 54 C58 55, 62 55, 64 54" />
        <path d="M48 70 C50 64, 56 60, 60 60" />
        <path d="M72 70 C70 64, 64 60, 60 60" />
        <path d="M48 70 C50 78, 56 82, 64 80 C72 78, 80 76, 84 70" />
        <path d="M44 68 C36 72, 30 76, 26 84" />
      </g>
      <g className="cal-bubbles">
        <circle cx={108} cy={28} r={1.8} fill={MUSTARD} stroke="currentColor" strokeWidth={0.8} />
        <circle cx={14} cy={30} r={1.5} fill={MUSTARD} stroke="currentColor" strokeWidth={0.8} />
        <circle cx={104} cy={94} r={2} fill={MUSTARD} stroke="currentColor" strokeWidth={0.8} />
        <circle cx={18} cy={98} r={1.6} fill={MUSTARD} stroke="currentColor" strokeWidth={0.8} />
      </g>
    </svg>
  );
}

/* SOLEDAD — figura pequeñita con una SOMBRA MOSTAZA enorme detrás */
function Soledad() {
  return (
    <svg {...PROPS} className="ill ill-soledad" aria-hidden>
      <g className="sol-shadow">
        <path
          d="M16 108 C12 102, 30 56, 46 38 C58 24, 64 18, 70 18 C76 18, 76 26, 74 38 C70 60, 54 100, 50 110 C44 116, 24 116, 16 108 Z"
          fill={MUSTARD}
          stroke="none"
        />
        <path
          d="M16 108 C12 102, 30 56, 46 38 C58 24, 64 18, 70 18"
          strokeDasharray="2 4"
          opacity={0.65}
        />
      </g>
      <g className="sol-figure">
        <path d="M76 48 C76 42, 80 38, 84 38 C90 38, 94 42, 94 48 C94 54, 90 58, 84 58 C80 58, 76 54, 76 48 Z" />
        <path d="M79 48 L82 48" />
        <path d="M86 48 L90 48" />
        <path d="M82 53 L88 53" />
        <path d="M78 70 C78 64, 82 60, 85 60" />
        <path d="M92 70 C92 64, 88 60, 85 60" />
        <path d="M78 70 C76 76, 78 82, 84 84" />
        <path d="M92 70 C94 76, 92 82, 86 84" />
        <path d="M80 92 L78 104" />
        <path d="M90 92 L92 104" />
        <path d="M74 106 L82 104" />
        <path d="M88 104 L96 106" />
      </g>
    </svg>
  );
}

/* CULPA — figura cargando una piedra amarilla a cuestas */
function Culpa() {
  return (
    <svg {...PROPS} className="ill ill-culpa" aria-hidden>
      <g className="cul-stone">
        <path
          d="M28 38 C26 28, 36 18, 50 16 C66 14, 82 18, 92 26 C100 32, 102 42, 96 48 C88 54, 70 54, 56 52 C42 50, 30 46, 28 38 Z"
          fill={MUSTARD}
          stroke="none"
        />
        <path d="M28 38 C26 28, 36 18, 50 16 C66 14, 82 18, 92 26 C100 32, 102 42, 96 48 C88 54, 70 54, 56 52 C42 50, 30 46, 28 38 Z" />
        <path d="M42 26 C48 30, 56 32, 64 30" opacity={0.6} />
        <path d="M50 42 C58 40, 70 40, 80 38" opacity={0.6} />
      </g>
      <g className="cul-body">
        <path d="M50 70 C50 62, 56 58, 62 58 C70 58, 74 64, 74 72 C74 80, 70 84, 62 84 C56 84, 50 78, 50 70 Z" />
        <path d="M54 70 L57 70" />
        <path d="M65 70 L68 70" />
        <path d="M56 78 C58 76, 64 76, 66 78" />
        <path d="M58 58 L58 52" />
        <path d="M66 58 L66 52" />
        <path d="M42 102 C42 92, 48 86, 60 86 C72 86, 80 92, 82 102" />
        <path d="M44 96 C40 100, 36 106, 32 112" />
        <path d="M80 96 C84 100, 88 106, 92 112" />
        <path d="M50 104 L46 116" />
        <path d="M72 104 L76 116" />
      </g>
    </svg>
  );
}

const ILLS = [
  {
    id: "ansiedad",
    name: "Ansiedad",
    lead: "Un nudo amarillo donde debería estar el estómago.",
    C: Ansiedad,
  },
  {
    id: "tristeza",
    name: "Tristeza",
    lead: "Salir de un charco que se te pega a los pies.",
    C: Tristeza,
  },
  {
    id: "apego",
    name: "Apego",
    lead: "Dos personas atadas por un hilo que ya no se afloja.",
    C: Apego,
  },
  {
    id: "autoestima",
    name: "Autoestima",
    lead: "Sostener tu propio reflejo en alto y mirarlo bien.",
    C: Autoestima,
  },
  {
    id: "enfado",
    name: "Enfado",
    lead: "La cabeza explotando en chispas amarillas.",
    C: Enfado,
  },
  {
    id: "calma",
    name: "Calma",
    lead: "Flotar dentro de una mancha que te sostiene.",
    C: Calma,
  },
  {
    id: "soledad",
    name: "Soledad",
    lead: "Una sombra enorme detrás de un cuerpo diminuto.",
    C: Soledad,
  },
  {
    id: "culpa",
    name: "Culpa",
    lead: "Cargar una piedra amarilla que no es tuya.",
    C: Culpa,
  },
];

export default function PreviewIlustracionesPage() {
  return (
    <>
      <EgoeraNav />
      <main className="prev-page">
        <style>{`
          .prev-page {
            --paper: #fdfaf2;
            --paper-2: #ffffff;
            --paper-shadow: rgba(43, 24, 18, 0.08);
            --ink: #1f160e;
            --ink-soft: #4a3a2a;
            --ink-dim: #88735a;
            --mustard: #f4c842;
            --mustard-deep: #c79214;
            --rule: rgba(43, 24, 18, 0.16);
            --serif: var(--font-serif), "Fraunces", Georgia, serif;
            --display: var(--font-display), "Caveat", cursive;
            --mono: var(--font-mono), "JetBrains Mono", monospace;
            background:
              radial-gradient(1200px 600px at 12% -10%, rgba(244, 200, 66, 0.10), transparent 60%),
              radial-gradient(900px 500px at 110% 110%, rgba(244, 200, 66, 0.07), transparent 55%),
              var(--paper);
            color: var(--ink);
            min-height: 100vh;
            font-family: var(--serif);
          }
          .prev-wrap { max-width: 1240px; margin: 0 auto; padding: 80px 32px 120px; }
          @media (max-width: 768px) { .prev-wrap { padding: 56px 22px 80px; } }

          .prev-mast { margin-bottom: 48px; }
          .prev-kicker {
            display: inline-flex; gap: 12px; align-items: center;
            font-family: var(--mono); font-size: 11px; letter-spacing: 0.26em;
            text-transform: uppercase; color: var(--mustard-deep);
            margin-bottom: 18px;
          }
          .prev-kicker::before {
            content: ""; width: 36px; height: 1.5px; background: currentColor;
          }
          .prev-mast h1 {
            font-family: var(--serif); font-weight: 400;
            font-size: clamp(40px, 5.5vw, 72px); line-height: 1.05;
            letter-spacing: -0.02em; margin: 0 0 14px; color: var(--ink);
          }
          .prev-mast h1 em {
            font-family: var(--display); font-style: italic; font-weight: 700;
            color: var(--mustard-deep);
            position: relative;
          }
          .prev-mast h1 em::after {
            content: ""; position: absolute; left: -4px; right: -4px;
            top: 70%; height: 26%;
            background: var(--mustard); opacity: 0.55; z-index: -1;
            transform: skewY(-2deg);
          }
          .prev-mast p {
            font-family: var(--serif); font-style: italic;
            font-size: 19px; line-height: 1.5; color: var(--ink-soft);
            max-width: 60ch; margin: 0;
          }

          .prev-meta {
            margin-top: 28px; padding: 14px 0;
            border-top: 1px dashed var(--rule);
            border-bottom: 1px dashed var(--rule);
            font-family: var(--mono); font-size: 10.5px;
            letter-spacing: 0.2em; text-transform: uppercase;
            color: var(--ink-dim);
            display: flex; justify-content: space-between;
            flex-wrap: wrap; gap: 12px;
          }
          .prev-meta a { color: var(--mustard-deep); text-decoration: none; }
          .prev-meta a:hover { color: var(--ink); }

          .prev-grid {
            display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px;
            margin-top: 48px;
          }
          @media (max-width: 980px) { .prev-grid { grid-template-columns: repeat(3, 1fr); } }
          @media (max-width: 720px) { .prev-grid { grid-template-columns: repeat(2, 1fr); } }
          @media (max-width: 440px) { .prev-grid { grid-template-columns: 1fr; } }

          .prev-card {
            background: var(--paper-2);
            border: 1.5px solid var(--rule);
            border-radius: 16px;
            padding: 28px 22px 24px;
            display: flex; flex-direction: column; gap: 14px;
            position: relative;
            box-shadow: 0 12px 28px -22px var(--paper-shadow);
          }
          .prev-card::before {
            content: ""; position: absolute; inset: 8px;
            border: 1.2px dashed rgba(43, 24, 18, 0.14);
            border-radius: 10px; pointer-events: none;
          }
          /* manchita mostaza en la esquina superior izquierda, sello */
          .prev-card::after {
            content: ""; position: absolute; top: 14px; left: 14px;
            width: 14px; height: 14px; border-radius: 50%;
            background: var(--mustard); opacity: 0.85;
            box-shadow: 2px 1px 0 rgba(0,0,0,0.08);
          }
          .prev-card > * { position: relative; z-index: 1; }

          .prev-ill-wrap {
            display: flex; align-items: center; justify-content: center;
            height: 150px; color: var(--ink);
            margin-top: 4px;
          }
          .ill { width: 132px; height: 132px; }

          .prev-card-tag {
            font-family: var(--mono); font-size: 9px;
            letter-spacing: 0.22em; text-transform: uppercase;
            color: var(--ink-dim); text-align: center; margin: 0;
          }
          .prev-card-name {
            font-family: var(--display); font-style: italic; font-weight: 700;
            font-size: 32px; color: var(--ink); margin: 0;
            text-align: center; line-height: 1;
          }
          .prev-card-lead {
            font-family: var(--serif); font-style: italic;
            font-size: 14px; line-height: 1.45; color: var(--ink-soft);
            margin: 0; text-align: center;
          }

          /* ─── ANIMACIONES POR ILUSTRACIÓN ─────────────────────── */

          /* ansiedad: nudo pulsando, cabeza pequeño tic, salpicaduras blink */
          .ans-knot { transform-origin: 60px 62px; animation: ansPulse 1.5s ease-in-out infinite; }
          .ans-head { transform-origin: 60px 18px; animation: ansTic 0.7s steps(4) infinite; }
          .ans-sparks { animation: blinkSlow 1.6s ease-in-out infinite; }
          @keyframes ansPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.04); }
          }
          @keyframes ansTic {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-0.6px) rotate(-1deg); }
            75% { transform: translateX(0.6px) rotate(1deg); }
          }
          @keyframes blinkSlow {
            0%, 80%, 100% { opacity: 1; }
            85% { opacity: 0.2; }
          }

          /* tristeza: charco respirando, lágrima caendo */
          .tri-puddle { transform-origin: 60px 96px; animation: triBreath 5s ease-in-out infinite; }
          .tri-body { transform-origin: 60px 60px; animation: triSlump 5s ease-in-out infinite; }
          .tri-tear { transform-origin: 54px 38px; animation: triTear 3.4s ease-in-out infinite; }
          @keyframes triBreath {
            0%, 100% { transform: scaleX(1) scaleY(1); }
            50% { transform: scaleX(1.03) scaleY(0.97); }
          }
          @keyframes triSlump {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(1.5px); }
          }
          @keyframes triTear {
            0% { transform: translateY(-3px) scaleY(0.6); opacity: 0; }
            30% { opacity: 1; }
            70% { transform: translateY(6px) scaleY(1.1); opacity: 1; }
            100% { transform: translateY(14px) scaleY(1.3); opacity: 0; }
          }

          /* apego: hilo tensándose, nudo pulsando, figuras quietas */
          .ape-thread { animation: apeStretch 3.6s ease-in-out infinite; transform-origin: 60px 30px; }
          .ape-knot { animation: apePulse 1.6s ease-in-out infinite; transform-origin: 60px 18px; }
          .ape-left { transform-origin: 30px 50px; animation: apeLean 4s ease-in-out infinite; }
          .ape-right { transform-origin: 92px 50px; animation: apeLeanReverse 4s ease-in-out infinite; }
          @keyframes apeStretch {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(1.06); }
          }
          @keyframes apePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.25); }
          }
          @keyframes apeLean {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-1.5deg); }
          }
          @keyframes apeLeanReverse {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(1.5deg); }
          }

          /* autoestima: reflejo brillando, destellos pulsando */
          .aut-mirror { transform-origin: 60px 32px; animation: autGlow 4s ease-in-out infinite; }
          .aut-sparkles { animation: pulseOpacity 3s ease-in-out infinite; }
          .aut-body { transform-origin: 60px 80px; animation: autBreath 5s ease-in-out infinite; }
          @keyframes autGlow {
            0%, 100% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.04); filter: brightness(1.1); }
          }
          @keyframes pulseOpacity {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
          @keyframes autBreath {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.015); }
          }

          /* enfado: chispas explotando, cuerpo intermitente */
          .enf-body { animation: enfShake 0.5s steps(5) infinite; }
          .enf-sparks { transform-origin: 60px 24px; animation: enfBurst 1.3s ease-in-out infinite; }
          @keyframes enfShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-1px); }
            75% { transform: translateX(1px); }
          }
          @keyframes enfBurst {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.12); opacity: 0.75; }
          }

          /* calma: mancha amarilla respirando lentamente */
          .cal-blob { transform-origin: 60px 60px; animation: calBreath 6s ease-in-out infinite; }
          .cal-body { transform-origin: 60px 58px; animation: calFloat 6s ease-in-out infinite; }
          .cal-bubbles { animation: calBubbles 5s ease-in-out infinite; }
          @keyframes calBreath {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes calFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-1.5px); }
          }
          @keyframes calBubbles {
            0%, 100% { transform: translateY(0); opacity: 0.7; }
            50% { transform: translateY(-3px); opacity: 1; }
          }

          /* soledad: sombra creciendo y volviendo, figura quietísima */
          .sol-shadow { transform-origin: 70px 110px; animation: solGrow 5.5s ease-in-out infinite; }
          .sol-figure { transform-origin: 85px 60px; animation: solBreath 5s ease-in-out infinite; }
          @keyframes solGrow {
            0%, 100% { transform: scale(0.96) translate(0, 0); }
            50% { transform: scale(1.06) translate(-2px, -1px); }
          }
          @keyframes solBreath {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.012); }
          }

          /* culpa: piedra pesando, cuerpo hundiéndose */
          .cul-stone { transform-origin: 60px 32px; animation: culPress 3.6s ease-in-out infinite; }
          .cul-body { transform-origin: 60px 80px; animation: culSink 3.6s ease-in-out infinite; }
          @keyframes culPress {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(2px); }
          }
          @keyframes culSink {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(2.5px) scale(0.99); }
          }

          @media (prefers-reduced-motion: reduce) {
            .ans-knot, .ans-head, .ans-sparks,
            .tri-puddle, .tri-body, .tri-tear,
            .ape-thread, .ape-knot, .ape-left, .ape-right,
            .aut-mirror, .aut-sparkles, .aut-body,
            .enf-body, .enf-sparks,
            .cal-blob, .cal-body, .cal-bubbles,
            .sol-shadow, .sol-figure,
            .cul-stone, .cul-body {
              animation: none;
            }
          }

          /* ─── BLOQUE NOTAS ABAJO ────────────────────────────── */
          .prev-notes {
            margin-top: 72px; padding: 36px 40px;
            background: var(--ink); color: var(--paper);
            border-radius: 16px; position: relative; overflow: hidden;
          }
          .prev-notes::before {
            content: ""; position: absolute; inset: 8px;
            border: 1px dashed rgba(253, 250, 242, 0.28);
            border-radius: 10px; pointer-events: none;
          }
          /* mancha mostaza decorativa en la esquina del bloque oscuro */
          .prev-notes::after {
            content: ""; position: absolute;
            right: -40px; bottom: -40px;
            width: 180px; height: 180px;
            background: var(--mustard); border-radius: 50%;
            opacity: 0.18; pointer-events: none;
          }
          .prev-notes h2 {
            font-family: var(--display); font-style: italic; font-weight: 600;
            font-size: 40px; line-height: 1; margin: 0 0 18px;
            color: var(--paper);
          }
          .prev-notes h2 em { color: var(--mustard); }
          .prev-notes p {
            font-family: var(--serif); font-size: 16px; line-height: 1.6;
            color: rgba(253, 250, 242, 0.85); margin: 0 0 10px;
            max-width: 60ch;
          }
          .prev-notes ul {
            list-style: none; padding: 0; margin: 14px 0 0;
            display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 32px;
          }
          @media (max-width: 720px) { .prev-notes ul { grid-template-columns: 1fr; } }
          .prev-notes li {
            font-family: var(--mono); font-size: 11px;
            letter-spacing: 0.16em; text-transform: uppercase;
            color: rgba(253, 250, 242, 0.78);
          }
          .prev-notes li strong { color: var(--mustard); font-weight: 500; }
        `}</style>

        <div className="prev-wrap">
          <header className="prev-mast">
            <div className="prev-kicker">brújula · v2 absurd design</div>
            <h1>
              Ocho escenas <em>absurdas</em> para ocho estados.
            </h1>
            <p>
              Propuesta v2: ilustraciones hand-drawn sobre papel blanco, con áreas
              planas de amarillo mostaza fluorescente como acento. Cada figura
              ejecuta UNA metáfora absurda pero clara — un nudo en el estómago,
              una sombra desmesurada, una piedra que no es tuya. Animaciones
              CSS suaves: el papel respira, el amarillo pulsa.
            </p>
            <div className="prev-meta">
              <span>8 ilustraciones · SVG inline · amarillo #f4c842</span>
              <Link href="/sentir">← volver a la Brújula</Link>
            </div>
          </header>

          <div className="prev-grid">
            {ILLS.map((it) => (
              <article key={it.id} className="prev-card">
                <div className="prev-ill-wrap">
                  <it.C />
                </div>
                <p className="prev-card-tag">{it.id}</p>
                <h3 className="prev-card-name">{it.name}</h3>
                <p className="prev-card-lead">{it.lead}</p>
              </article>
            ))}
          </div>

          <aside className="prev-notes">
            <h2>
              Notas sobre <em>la dirección</em>
            </h2>
            <p>
              Estética absurd design: cuerpos esquemáticos hand-drawn (tinta
              sobre papel) con áreas planas de amarillo mostaza fluorescente
              como acento metafórico. La línea es imperfecta, con grosor 1.8-2.2
              y leves temblores. El amarillo nunca decora: siempre cuenta la
              metáfora (el nudo, el charco, la piedra, el reflejo, la sombra).
              Animaciones CSS infinitas respetan `prefers-reduced-motion`.
            </p>
            <ul>
              <li><strong>Papel:</strong> #fdfaf2 (blanco-crema) con halos amarillos sutiles</li>
              <li><strong>Tinta:</strong> #1f160e currentColor — hereda del padre</li>
              <li><strong>Mostaza:</strong> #f4c842 hardcoded en mancha y salpicaduras</li>
              <li><strong>ViewBox:</strong> 120×120 — escala 56-220px según contexto</li>
              <li><strong>Stroke:</strong> 1.8-2.2 hand-drawn · cap/join round</li>
              <li><strong>Metáfora:</strong> el amarillo siempre dice algo, nunca decora</li>
            </ul>
          </aside>
        </div>
      </main>
    </>
  );
}
