"use client";

import Link from "next/link";

/* =========================================================================
 * /recursos · biblioteca de Egoera (cobalto + crema)
 * -------------------------------------------------------------------------
 * Layout server adyacente añade EgoeraNav + EgoeraFooter. Esta page
 * sólo dibuja el contenido. Cobalto + crema con la misma densidad
 * editorial que /contacto y /blog.
 *
 * Cinco bloques:
 *   1. Masthead "la biblioteca"
 *   2. Archivo grid · descargas gratuitas
 *   3. Pack premium (sección cobalto invertido)
 *   4. Estantería · lecturas recomendadas
 *   5. Cierre: cuaderno + newsletter
 * ===================================================================== */

type Recurso = {
  id: string;
  kind: "pdf" | "audio" | "test" | "plantilla";
  title: string;
  lead: string;
  meta: string;
  size?: string;
  href?: string;
};

const FREE: Recurso[] = [
  {
    id: "regulacion-10",
    kind: "pdf",
    title: "10 técnicas de regulación emocional",
    lead: "PDF con diez ejercicios basados en evidencia para los días en los que el cuerpo se adelanta a la cabeza.",
    meta: "PDF · 15 páginas · 2,1 MB",
    href: "/descargas/diario-gratis",
  },
  {
    id: "apego-test",
    kind: "test",
    title: "Cuestionario de estilo de apego",
    lead: "Test breve para descubrir cómo te vinculas. No diagnostica: ordena lo que ya intuyes.",
    meta: "Online · 5 min · 18 preguntas",
    href: "/descargas/test-apego",
  },
  {
    id: "grounding",
    kind: "audio",
    title: "Meditación de grounding · 10 min",
    lead: "Audio guiado para volver al cuerpo cuando la cabeza se va. Versión castellano + euskera.",
    meta: "MP3 · 10 min · castellano / euskera",
    href: "/descargas/meditacion-ansiedad",
  },
  {
    id: "diario-plantilla",
    kind: "plantilla",
    title: "Plantilla del diario emocional",
    lead: "La estructura del diario en PDF imprimible. Para los días que prefieres papel.",
    meta: "PDF · 4 páginas · imprimible A4",
    href: "/diario",
  },
  {
    id: "ansiedad-decalogo",
    kind: "pdf",
    title: "Decálogo de la ansiedad amable",
    lead: "Diez cosas que ojalá te hubieran contado antes de tu primer ataque de ansiedad.",
    meta: "PDF · 8 páginas · 1,4 MB",
    href: "#",
  },
  {
    id: "limites-script",
    kind: "plantilla",
    title: "Guion para poner un límite",
    lead: "Cuatro fórmulas para decir no sin justificarte demasiado. Adaptadas del modelo asertivo.",
    meta: "PDF · 3 páginas · imprimible",
    href: "#",
  },
];

const KIND_META: Record<
  Recurso["kind"],
  { tag: string; label: string }
> = {
  pdf: { tag: "01", label: "guía" },
  test: { tag: "02", label: "test" },
  audio: { tag: "03", label: "audio" },
  plantilla: { tag: "04", label: "plantilla" },
};

const PREMIUM = [
  {
    title: "Curso · Domina tu ansiedad",
    lead: "Seis semanas para entender tu ansiedad sin medicalizarla, con prácticas semanales y workbook.",
    meta: "6 módulos · 8h video · workbook · grupo privado",
    price: "97 €",
    cta: "Ver el curso",
    href: "/cursos",
  },
  {
    title: "Pack · Vínculos y apego",
    lead: "Programa breve de 4 sesiones grabadas + ejercicios para entender cómo te vinculas y reescribir lo que duele.",
    meta: "4 módulos · 5h video · plantillas · 1 sesión 1-a-1",
    price: "147 €",
    cta: "Próximamente",
    href: "/cursos",
  },
];

const BOOKS = [
  {
    title: "El cuerpo lleva la cuenta",
    author: "Bessel van der Kolk",
    note: "Libro madre del trauma somático. Largo, riguroso, vital.",
  },
  {
    title: "Apego adulto",
    author: "Levine & Heller",
    note: "Tres estilos, mil situaciones. El libro más práctico sobre apego.",
  },
  {
    title: "Saber acabar",
    author: "Itxiar Ortega",
    note: "Cómo cerrar relaciones sin destrozar lo que fueron. Honesto y nada moralista.",
  },
  {
    title: "Por qué a mí",
    author: "Edith Eger",
    note: "Sobre el sufrimiento, la elección y los días en los que nada parece tener sentido.",
  },
];

export default function RecursosPage() {
  return (
    <main className="rec-page">
      <style jsx>{`
        .rec-page {
          --blue: #1d2bdb;
          --blue-deep: #0f1baa;
          --cream: #f1ead8;
          --cream-2: #e6dec9;
          --cream-3: #d8cfb6;
          --ink: #1d2bdb;
          --ink-soft: rgba(29, 43, 219, 0.78);
          --rule: rgba(29, 43, 219, 0.32);
          --rule-soft: rgba(29, 43, 219, 0.14);
          --orange: #d97757;
          --serif: var(--font-serif), "Fraunces", Georgia, serif;
          --display: var(--font-display), "Caveat", cursive;
          --sans: var(--font-sans), "Inter", system-ui, sans-serif;
          --mono: var(--font-mono), "JetBrains Mono", monospace;
          background: var(--cream);
          color: var(--ink);
          font-family: var(--sans);
          min-height: 100vh;
        }
        .wrap { max-width: 1240px; margin: 0 auto; padding: 0 32px; }
        @media (max-width: 768px) { .wrap { padding: 0 22px; } }
        @media (max-width: 480px) { .wrap { padding: 0 18px; } }

        /* ─── MASTHEAD ─────────────────────────────────────── */
        .rec-mast { padding: 96px 0 64px; border-bottom: 1.5px solid var(--blue); }
        .rec-mast-row {
          display: flex; justify-content: space-between; align-items: center;
          font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--ink-soft);
          margin-bottom: 32px; flex-wrap: wrap; gap: 12px;
        }
        .rec-mast h1 {
          font-family: var(--display); font-style: italic; font-weight: 600;
          font-size: clamp(56px, 10vw, 156px); line-height: 0.92;
          color: var(--blue); letter-spacing: -0.01em; margin: 0;
          text-wrap: balance;
        }
        .rec-mast h1 em { color: var(--orange); }
        .rec-mast-sub {
          font-family: var(--serif); font-style: italic;
          font-size: clamp(20px, 2.4vw, 26px); line-height: 1.45;
          color: var(--ink); max-width: 60ch; margin: 28px 0 0;
        }

        /* ─── TOOLBAR ─────────────────────────────────────── */
        .rec-toolbar {
          padding: 28px 0; border-bottom: 1px solid var(--rule);
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; flex-wrap: wrap;
        }
        .rec-filters {
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .rec-filter {
          font-family: var(--mono); font-size: 10.5px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--ink-soft); text-decoration: none;
          padding: 8px 14px; border: 1px solid var(--rule);
          border-radius: 999px;
        }
        .rec-filter.active {
          color: var(--cream); background: var(--blue); border-color: var(--blue);
        }
        .rec-stats {
          font-family: var(--mono); font-size: 10.5px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--ink-soft);
        }
        .rec-stats strong { color: var(--blue); font-weight: 500; }

        /* ─── ARCHIVE GRID ────────────────────────────────── */
        .rec-grid-section { padding: 60px 0 100px; }
        .rec-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          border: 1.5px solid var(--blue); background: var(--cream);
        }
        @media (max-width: 980px) { .rec-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .rec-grid { grid-template-columns: 1fr; } }

        .rec-card {
          padding: 32px 28px; min-height: 240px;
          display: flex; flex-direction: column; gap: 14px;
          border-right: 1.5px solid var(--blue);
          border-bottom: 1.5px solid var(--blue);
          text-decoration: none; color: inherit;
          transition: background .15s, color .15s;
          position: relative;
        }
        .rec-card:nth-child(3n) { border-right: 0; }
        @media (max-width: 980px) {
          .rec-card { border-right: 1.5px solid var(--blue); }
          .rec-card:nth-child(3n) { border-right: 1.5px solid var(--blue); }
          .rec-card:nth-child(2n) { border-right: 0; }
        }
        @media (max-width: 640px) {
          .rec-card { border-right: 0; }
        }
        .rec-card:last-child { border-bottom: 0; }

        .rec-card:hover { background: var(--blue); color: var(--cream); }
        .rec-card:hover .rec-tag { color: rgba(241, 234, 216, 0.7); border-color: rgba(241, 234, 216, 0.5); }
        .rec-card:hover .rec-meta { color: rgba(241, 234, 216, 0.6); }
        .rec-card:hover .rec-arr {
          background: var(--cream); color: var(--blue);
        }

        .rec-card-top {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px;
        }
        .rec-tag {
          font-family: var(--mono); font-size: 9.5px;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--ink-soft); padding: 5px 10px;
          border: 1px solid var(--rule); border-radius: 999px;
        }
        .rec-num {
          font-family: var(--display); font-style: italic;
          font-weight: 600; font-size: 32px;
          color: var(--orange); line-height: 1;
        }
        .rec-h {
          font-family: var(--serif); font-weight: 400;
          font-size: 22px; line-height: 1.18; letter-spacing: -0.01em;
          margin: 0; color: inherit;
        }
        .rec-lead {
          font-family: var(--serif); font-style: italic;
          font-size: 15.5px; line-height: 1.5; color: inherit;
          margin: 0; flex: 1; opacity: 0.92;
        }
        .rec-foot {
          display: flex; align-items: end; justify-content: space-between;
          gap: 12px;
        }
        .rec-meta {
          font-family: var(--mono); font-size: 10px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--ink-soft);
        }
        .rec-arr {
          font-family: var(--mono); font-size: 11px;
          padding: 7px 14px; border-radius: 999px;
          background: var(--cream-2); color: var(--blue);
          transition: background .15s, color .15s;
        }

        /* ─── PREMIUM (cobalto invertido) ─────────────────── */
        .rec-premium {
          background: var(--blue); color: var(--cream);
          padding: 100px 0; position: relative; overflow: hidden;
        }
        .rec-premium::before {
          content: ""; position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at 80% 20%, rgba(241, 234, 216, 0.12), transparent 55%),
            radial-gradient(ellipse at 15% 90%, rgba(217, 119, 87, 0.18), transparent 60%);
          pointer-events: none;
        }
        .rec-premium-head {
          display: grid; grid-template-columns: 1.4fr 1fr;
          gap: 48px; align-items: end; margin-bottom: 48px;
          position: relative;
        }
        @media (max-width: 900px) {
          .rec-premium-head { grid-template-columns: 1fr; gap: 28px; }
        }
        .rec-premium-eye {
          font-family: var(--mono); font-size: 10.5px;
          letter-spacing: 0.22em; text-transform: uppercase;
          opacity: 0.78; margin: 0 0 18px;
        }
        .rec-premium h2 {
          font-family: var(--display); font-style: italic; font-weight: 600;
          font-size: clamp(48px, 8vw, 120px); line-height: 0.92;
          margin: 0; color: var(--cream); letter-spacing: -0.01em;
        }
        .rec-premium h2 em { color: #f3a8c4; }
        .rec-premium-lead {
          font-family: var(--serif); font-style: italic;
          font-size: 19px; line-height: 1.55;
          color: rgba(241, 234, 216, 0.85); margin: 0;
          max-width: 44ch;
        }

        .rec-premium-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
          position: relative;
        }
        @media (max-width: 760px) {
          .rec-premium-grid { grid-template-columns: 1fr; }
        }
        .rec-prem-card {
          background: rgba(241, 234, 216, 0.06);
          border: 1.5px solid rgba(241, 234, 216, 0.35);
          border-radius: 18px; padding: 36px 32px;
          display: flex; flex-direction: column; gap: 16px;
          text-decoration: none; color: var(--cream);
          transition: background .2s, border-color .2s, transform .2s;
        }
        .rec-prem-card:hover {
          background: rgba(241, 234, 216, 0.1);
          border-color: var(--cream);
          transform: translateY(-3px);
        }
        .rec-prem-card h3 {
          font-family: var(--display); font-style: italic; font-weight: 600;
          font-size: 32px; line-height: 1.05; margin: 0;
        }
        .rec-prem-card p {
          font-family: var(--serif); font-size: 16px; line-height: 1.55;
          color: rgba(241, 234, 216, 0.85); margin: 0;
        }
        .rec-prem-meta {
          font-family: var(--mono); font-size: 10px;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(241, 234, 216, 0.6);
          padding-top: 14px; border-top: 1px dashed rgba(241, 234, 216, 0.28);
        }
        .rec-prem-row {
          display: flex; align-items: baseline;
          justify-content: space-between; gap: 16px; flex-wrap: wrap;
        }
        .rec-prem-price {
          font-family: var(--display); font-style: italic; font-weight: 600;
          font-size: 36px; color: #f3a8c4;
        }
        .rec-prem-cta {
          font-family: var(--mono); font-size: 11px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--cream); padding: 10px 18px;
          border: 1px solid rgba(241, 234, 216, 0.4); border-radius: 999px;
          transition: background .15s, color .15s;
        }
        .rec-prem-card:hover .rec-prem-cta {
          background: var(--cream); color: var(--blue);
        }

        /* ─── ESTANTERÍA ──────────────────────────────────── */
        .rec-shelf { padding: 100px 0; }
        .rec-shelf-head {
          display: flex; align-items: end; justify-content: space-between;
          gap: 32px; margin-bottom: 40px; flex-wrap: wrap;
        }
        .rec-shelf h2 {
          font-family: var(--display); font-style: italic; font-weight: 600;
          font-size: clamp(40px, 6vw, 80px); line-height: 0.95;
          margin: 0; color: var(--blue); letter-spacing: -0.01em;
        }
        .rec-shelf h2 em { color: var(--orange); }
        .rec-shelf-lead {
          font-family: var(--serif); font-style: italic;
          font-size: 18px; line-height: 1.5; color: var(--ink);
          max-width: 38ch; margin: 0;
        }
        .rec-shelf-list {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 0; border-top: 1.5px solid var(--blue);
        }
        @media (max-width: 760px) {
          .rec-shelf-list { grid-template-columns: 1fr; }
        }
        .rec-book {
          display: flex; flex-direction: column; gap: 8px;
          padding: 24px 28px 24px 0;
          border-right: 1px dashed var(--rule);
          border-bottom: 1px solid var(--rule);
        }
        .rec-book:nth-child(2n) { padding-right: 0; padding-left: 28px; border-right: 0; }
        @media (max-width: 760px) {
          .rec-book { padding: 24px 0; border-right: 0; }
          .rec-book:nth-child(2n) { padding-left: 0; }
        }
        .rec-book-title {
          font-family: var(--serif); font-weight: 400;
          font-size: 22px; line-height: 1.2; color: var(--blue);
          letter-spacing: -0.01em; margin: 0;
        }
        .rec-book-author {
          font-family: var(--mono); font-size: 10.5px;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--ink-soft);
        }
        .rec-book-note {
          font-family: var(--serif); font-style: italic;
          font-size: 15px; line-height: 1.55; color: var(--ink);
          margin: 6px 0 0; opacity: 0.86;
        }

        /* ─── CIERRE ──────────────────────────────────────── */
        .rec-close {
          padding: 80px 0 120px; border-top: 1.5px solid var(--blue);
        }
        .rec-close-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 32px;
        }
        @media (max-width: 720px) { .rec-close-grid { grid-template-columns: 1fr; } }
        .rec-close-card {
          padding: 36px 32px; border: 1.5px solid var(--blue);
          border-radius: 18px; background: var(--cream);
          display: flex; flex-direction: column; gap: 14px;
          text-decoration: none; color: var(--ink);
          transition: background .15s, color .15s, transform .15s;
        }
        .rec-close-card:hover {
          background: var(--blue); color: var(--cream); transform: translateY(-2px);
        }
        .rec-close-card .ce {
          font-family: var(--mono); font-size: 10.5px;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--ink-soft);
        }
        .rec-close-card:hover .ce { color: rgba(241, 234, 216, 0.7); }
        .rec-close-card h3 {
          font-family: var(--display); font-style: italic; font-weight: 600;
          font-size: 36px; line-height: 1; margin: 0; color: inherit;
        }
        .rec-close-card p {
          font-family: var(--serif); font-style: italic;
          font-size: 17px; line-height: 1.5; color: inherit;
          margin: 0; opacity: 0.85;
        }
        .rec-close-card .ar {
          font-family: var(--mono); font-size: 11px;
          letter-spacing: 0.18em; text-transform: uppercase;
          align-self: flex-start; padding: 8px 14px;
          border-radius: 999px; border: 1px solid currentColor;
          margin-top: 8px;
        }
      `}</style>

      {/* ─── MASTHEAD ───────────────────────────────────── */}
      <section className="rec-mast">
        <div className="wrap">
          <div className="rec-mast-row">
            <span>la biblioteca · descargas y lecturas</span>
            <span>{FREE.length} recursos gratis · {BOOKS.length} lecturas</span>
            <span>actualizada cada mes</span>
          </div>
          <h1>
            la <em>biblioteca</em>.
          </h1>
          <p className="rec-mast-sub">
            Guías, audios, plantillas y lecturas que uso en consulta o que me
            han ayudado a pensar. Todo gratis, todo descargable, todo en
            castellano. Lo que pido a cambio: léelo despacio.
          </p>
        </div>
      </section>

      {/* ─── TOOLBAR ────────────────────────────────────── */}
      <section className="wrap">
        <div className="rec-toolbar">
          <div className="rec-filters">
            <Link href="/recursos" className="rec-filter active">todos</Link>
            <Link href="/recursos" className="rec-filter">guías</Link>
            <Link href="/recursos" className="rec-filter">audios</Link>
            <Link href="/recursos" className="rec-filter">tests</Link>
            <Link href="/recursos" className="rec-filter">plantillas</Link>
          </div>
          <div className="rec-stats">
            ordenar · <strong>↓ más reciente</strong>
          </div>
        </div>
      </section>

      {/* ─── ARCHIVE GRID ───────────────────────────────── */}
      <section className="rec-grid-section">
        <div className="wrap">
          <div className="rec-grid">
            {FREE.map((r, i) => (
              <Link
                key={r.id}
                href={r.href ?? "#"}
                className="rec-card"
              >
                <div className="rec-card-top">
                  <span className="rec-tag">{KIND_META[r.kind].label}</span>
                  <span className="rec-num">
                    n.º{String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="rec-h">{r.title}</h3>
                <p className="rec-lead">{r.lead}</p>
                <div className="rec-foot">
                  <span className="rec-meta">{r.meta}</span>
                  <span className="rec-arr">descargar →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PREMIUM (cobalto invertido) ───────────────── */}
      <section className="rec-premium">
        <div className="wrap">
          <div className="rec-premium-head">
            <div>
              <p className="rec-premium-eye">premium · cursos y programas</p>
              <h2>
                Para ir <em>más despacio</em>.
              </h2>
            </div>
            <p className="rec-premium-lead">
              Programas estructurados con video, workbook y grupo. Si lo
              gratuito no te llega y quieres acompañamiento real, aquí
              empezamos.
            </p>
          </div>
          <div className="rec-premium-grid">
            {PREMIUM.map((p) => (
              <Link key={p.title} href={p.href} className="rec-prem-card">
                <h3>{p.title}</h3>
                <p>{p.lead}</p>
                <div className="rec-prem-meta">{p.meta}</div>
                <div className="rec-prem-row">
                  <span className="rec-prem-price">{p.price}</span>
                  <span className="rec-prem-cta">{p.cta} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ESTANTERÍA ─────────────────────────────────── */}
      <section className="rec-shelf">
        <div className="wrap">
          <div className="rec-shelf-head">
            <h2>
              La <em>estantería</em>.
            </h2>
            <p className="rec-shelf-lead">
              Cuatro libros que llevo años recomendando.
              Sin afiliados, sin venderte nada que no haya leído.
            </p>
          </div>
          <div className="rec-shelf-list">
            {BOOKS.map((b) => (
              <div key={b.title} className="rec-book">
                <span className="rec-book-author">{b.author}</span>
                <h3 className="rec-book-title">{b.title}</h3>
                <p className="rec-book-note">{b.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CIERRE ──────────────────────────────────────── */}
      <section className="rec-close">
        <div className="wrap">
          <div className="rec-close-grid">
            <Link href="/blog" className="rec-close-card">
              <span className="ce">cuaderno · artículos largos</span>
              <h3>
                ¿Y si lo que buscas es <em>leer</em>?
              </h3>
              <p>
                Veinte ediciones del cuaderno. Sin titulares, sin algoritmo.
                Una nueva entrada cada domingo.
              </p>
              <span className="ar">Abrir el cuaderno →</span>
            </Link>
            <Link href="/boletin" className="rec-close-card">
              <span className="ce">boletín · cada domingo</span>
              <h3>
                Una <em>carta</em> a la semana.
              </h3>
              <p>
                Cada domingo, diez minutos de lectura en tu correo.
                Suscribirte es gratis y darte de baja también.
              </p>
              <span className="ar">Suscribirme al boletín →</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
