import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllPosts, CATEGORIES } from "@/lib/blog";

export const metadata: Metadata = {
  title: "El Cuaderno · Egoera",
  description:
    "Todos los artículos del vlog editorial de Egoera: psicología despacio, sin listicles. Ansiedad, apego, autoconocimiento, regulación emocional.",
  openGraph: {
    title: "El Cuaderno · Egoera",
    description:
      "Todos los artículos del vlog editorial de Egoera: psicología despacio, sin listicles.",
    type: "website",
  },
};

export const revalidate = 3600;

// ── Tokens (cream + cobalto, periódico) ─────────────────────────────────────
const T = {
  blue: "#1d2bdb",
  blueDeep: "#0f1baa",
  cream: "#f1ead8",
  cream2: "#e6dec9",
  cream3: "#d8cfb6",
  ink: "#1d2bdb",
  inkSoft: "rgba(29,43,219,.78)",
  inkFaint: "rgba(29,43,219,.55)",
  rule: "rgba(29,43,219,.32)",
  serif: 'var(--font-serif), "Fraunces", serif',
  display: 'var(--font-display), "Caveat", cursive',
  sans: 'var(--font-sans), "Inter", sans-serif',
  mono: 'var(--font-mono), "JetBrains Mono", monospace',
} as const;

const MONTHS_ES_SHORT = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

function formatTocDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getDate()} · ${MONTHS_ES_SHORT[d.getMonth()]} · ${d.getFullYear()}`;
}

function todayLabel(): string {
  const d = new Date();
  return `${d.getDate()} · ${MONTHS_ES_SHORT[d.getMonth()]} · ${d.getFullYear()}`;
}

function readMinutes(rt: string): number {
  const m = rt.match(/(\d+)/);
  return m ? Number.parseInt(m[1], 10) : 0;
}

function wordCountFromHtml(html: string): number {
  return html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

function formatThousands(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}

function ordinalEs(n: number): string {
  const names = [
    "cero", "uno", "dos", "tres", "cuatro", "cinco",
    "seis", "siete", "ocho", "nueve", "diez", "once",
    "doce", "trece", "catorce", "quince", "dieciséis",
    "diecisiete", "dieciocho", "diecinueve", "veinte",
  ];
  return names[n] ?? String(n);
}

export default async function BlogPage() {
  // Sort by date DESC. First = featured. Rest = grid + TOC.
  const all = (await getAllPosts()).slice().sort((a, b) => {
    const da = new Date(a.dateISO).getTime() || 0;
    const db = new Date(b.dateISO).getTime() || 0;
    return db - da;
  });

  const total = all.length;
  const featured = all[0];
  const rest = all.slice(1);
  const gridPosts = rest.slice(0, 6);

  // Aggregates for the masthead
  const totalWords = all.reduce(
    (sum, p) => sum + wordCountFromHtml(p.content || ""),
    0
  );
  const totalReadMins = all.reduce((sum, p) => sum + readMinutes(p.readTime), 0);
  const avgRead = total > 0 ? Math.max(1, Math.round(totalReadMins / total)) : 0;
  const categoryCount = Object.keys(CATEGORIES).length;

  // Counts per category
  const byCat = new Map<string, number>();
  for (const p of all) {
    if (!p.categorySlug) continue;
    byCat.set(p.categorySlug, (byCat.get(p.categorySlug) ?? 0) + 1);
  }
  const sortedCategoryStats = Array.from(byCat.entries())
    .map(([slug, count]) => ({
      slug,
      count,
      name: CATEGORIES[slug]?.name ?? slug,
    }))
    .sort((a, b) => b.count - a.count);

  // Counts per year for archive
  const byYear = new Map<number, number>();
  for (const p of all) {
    const d = new Date(p.dateISO);
    if (Number.isNaN(d.getTime())) continue;
    const y = d.getFullYear();
    byYear.set(y, (byYear.get(y) ?? 0) + 1);
  }
  const yearStats = Array.from(byYear.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year - a.year);
  const maxYearCount = Math.max(1, ...yearStats.map((y) => y.count));

  return (
    <div
      className="cuaderno"
      style={{
        background: T.cream,
        color: T.ink,
        fontFamily: T.sans,
        paddingTop: 96, // clear the fixed DarkNav
      }}
    >
      <style>{`
        .cuaderno .wrap { max-width: 1240px; margin: 0 auto; padding: 0 32px; }
        @media (max-width: 768px) { .cuaderno .wrap { padding: 0 20px; } }
        @media (max-width: 480px) { .cuaderno .wrap { padding: 0 18px; } }

        /* ====== MASTHEAD ====== */
        .cuad-mast { padding: 36px 0 24px; border-bottom: 3px double ${T.blue}; text-align: center; }
        .cuad-mast-row {
          display: flex; justify-content: space-between; align-items: center;
          font-family: ${T.mono}; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
          color: ${T.blue}; border-bottom: 1px solid ${T.blue};
          padding-bottom: 12px; margin-bottom: 18px; gap: 16px; flex-wrap: wrap;
        }
        .cuad-mast h1 {
          font-family: ${T.display};
          font-size: clamp(60px, 13vw, 200px);
          line-height: 0.85; font-weight: 600;
          color: ${T.blue}; letter-spacing: -0.02em; margin: 0;
        }
        .cuad-mast h1 em { font-style: italic; }
        .cuad-mast-sub {
          margin: 22px auto 0;
          font-family: ${T.serif}; font-style: italic;
          font-size: clamp(17px, 2.2vw, 22px); line-height: 1.4; color: ${T.ink};
          max-width: 680px; text-wrap: pretty;
        }
        .cuad-mast-numbers {
          display: flex; justify-content: center; gap: 56px;
          margin-top: 32px; padding-top: 22px;
          border-top: 1px dashed ${T.blue}; flex-wrap: wrap;
        }
        .cuad-mast-numbers .n { display: flex; flex-direction: column; gap: 4px; align-items: center; }
        .cuad-mast-numbers .n .v {
          font-family: ${T.display}; font-style: italic; font-weight: 600;
          font-size: clamp(40px, 5.5vw, 56px); line-height: 1; color: ${T.blue};
        }
        .cuad-mast-numbers .n .l {
          font-family: ${T.mono}; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
          color: ${T.inkSoft};
        }
        @media (max-width: 768px) {
          .cuad-mast { padding: 28px 0 18px; }
          .cuad-mast-row { font-size: 10px; letter-spacing: 0.18em; gap: 10px; padding-bottom: 10px; margin-bottom: 14px; }
          .cuad-mast-numbers { gap: 28px 36px; margin-top: 24px; padding-top: 18px; }
        }
        @media (max-width: 480px) {
          .cuad-mast-row { justify-content: center; text-align: center; }
          .cuad-mast-row span { flex: 1 1 100%; text-align: center; }
          .cuad-mast-row span:not(:first-child) { display: none; } /* keep only the eyebrow on tiny screens */
          .cuad-mast-numbers { gap: 22px 28px; }
          .cuad-mast-numbers .n .l { font-size: 9.5px; letter-spacing: 0.18em; }
        }

        /* ====== TOOLBAR ====== */
        .cuad-toolbar {
          padding: 28px 0; border-bottom: 1.5px solid ${T.blue};
        }
        .cuad-toolbar-inner {
          display: flex; justify-content: space-between; align-items: center;
          gap: 20px; flex-wrap: wrap;
        }
        .cuad-filters { display: flex; gap: 8px; flex-wrap: wrap; }
        .cuad-filter {
          font-family: ${T.mono}; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          padding: 10px 16px; border: 1.5px solid ${T.blue}; color: ${T.blue};
          background: transparent; cursor: pointer; border-radius: 999px;
          transition: background .15s, color .15s; text-decoration: none;
          display: inline-flex; align-items: center; min-height: 38px;
        }
        .cuad-filter:hover, .cuad-filter.active { background: ${T.blue}; color: ${T.cream}; }
        .cuad-filter:focus-visible {
          outline: 2px solid ${T.blue}; outline-offset: 3px;
        }
        .cuad-sort {
          font-family: ${T.mono}; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
          color: ${T.inkSoft}; display: flex; align-items: center; gap: 12px;
        }
        .cuad-sort strong { color: ${T.blue}; font-weight: 500; }
        @media (max-width: 768px) {
          .cuad-toolbar { padding: 22px 0; }
          .cuad-toolbar-inner { gap: 14px; }
          .cuad-filter { padding: 9px 13px; font-size: 10.5px; }
        }
        @media (max-width: 480px) {
          .cuad-filters { gap: 6px; width: 100%; justify-content: center; }
          .cuad-filter { padding: 9px 12px; font-size: 10.5px; }
          .cuad-sort { width: 100%; justify-content: center; font-size: 10px; letter-spacing: 0.18em; }
        }

        /* ====== FEATURED ====== */
        .cuad-featured { padding: 56px 0; border-bottom: 1.5px solid ${T.blue}; }
        .cuad-featured-grid {
          display: grid; grid-template-columns: 1.4fr 1fr;
          gap: 56px; align-items: end;
        }
        .cuad-featured .tag {
          font-family: ${T.mono}; font-size: 10px; letter-spacing: 0.32em; text-transform: uppercase;
          color: ${T.blue}; display: inline-flex; align-items: center; gap: 12px; margin-bottom: 16px;
        }
        .cuad-featured .tag::before { content: ""; width: 36px; height: 1.5px; background: currentColor; }
        .cuad-featured h2 {
          font-family: ${T.display}; font-size: clamp(40px, 6vw, 96px);
          line-height: 0.95; font-weight: 600; color: ${T.blue};
          letter-spacing: -0.01em; text-wrap: balance; margin: 0;
        }
        .cuad-featured h2 a:focus-visible {
          outline: 2px solid ${T.blue}; outline-offset: 4px;
          border-radius: 3px;
        }
        .cuad-featured h2 em { font-style: italic; }
        .cuad-featured h2 a { color: inherit; text-decoration: none; }
        .cuad-featured .lede {
          margin-top: 22px; font-family: ${T.serif}; font-style: italic;
          font-size: clamp(17px, 2.2vw, 22px); line-height: 1.45; color: ${T.ink};
          max-width: 56ch; text-wrap: pretty;
        }
        .cuad-featured .feat-meta {
          display: flex; gap: 28px; margin-top: 28px; flex-wrap: wrap;
          font-family: ${T.mono}; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
          color: ${T.inkSoft}; padding-bottom: 18px; border-bottom: 1px dashed ${T.blue};
        }
        .cuad-featured .feat-meta strong { color: ${T.blue}; font-weight: 500; }
        .cuad-featured .read-cta {
          margin-top: 20px; display: inline-flex; align-items: center; gap: 12px;
          font-family: ${T.mono}; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase;
          color: ${T.blue}; text-decoration: none;
        }
        .cuad-featured .read-cta .ar {
          width: 48px; height: 48px; border: 1.5px solid ${T.blue}; border-radius: 50%;
          display: grid; place-items: center; transition: background .15s, color .15s;
          font-family: ${T.sans}; font-size: 22px; letter-spacing: 0;
        }
        .cuad-featured .read-cta:hover .ar { background: ${T.blue}; color: ${T.cream}; }

        .cuad-illu {
          border: 1.5px solid ${T.blue};
          aspect-ratio: 4 / 5;
          background: linear-gradient(135deg, ${T.blueDeep} 0%, #4DC1E0 100%);
          position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .cuad-illu .glow {
          position: absolute; width: 70%; height: 70%;
          background: radial-gradient(circle, rgba(241,234,216,.55), transparent 65%);
          filter: blur(40px); bottom: -10%;
        }
        .cuad-illu .num {
          font-family: ${T.display}; font-style: italic; font-weight: 500;
          font-size: clamp(180px, 28vw, 280px); line-height: 0.85;
          color: rgba(241,234,216,.18); z-index: 1;
        }
        .cuad-illu .navlbl {
          position: absolute; bottom: 22px; right: 22px;
          font-family: ${T.mono}; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
          color: ${T.cream}; z-index: 2; text-align: right;
        }
        .cuad-illu .navlbl strong {
          display: block; font-family: ${T.display}; font-style: italic;
          font-size: 26px; letter-spacing: 0; text-transform: none; font-weight: 500;
        }
        .cuad-illu .cover-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; mix-blend-mode: luminosity; opacity: 0.7;
        }
        @media (max-width: 900px) {
          .cuad-featured-grid { grid-template-columns: 1fr; gap: 32px; }
          .cuad-illu { max-width: 380px; width: 100%; }
        }
        @media (max-width: 768px) {
          .cuad-featured { padding: 44px 0; }
        }
        @media (max-width: 480px) {
          .cuad-featured { padding: 36px 0; }
          .cuad-featured .feat-meta { gap: 14px 22px; font-size: 10px; letter-spacing: 0.18em; padding-bottom: 14px; }
          .cuad-featured .read-cta { font-size: 11px; letter-spacing: 0.18em; }
          .cuad-featured .read-cta .ar { width: 42px; height: 42px; font-size: 18px; }
        }

        /* ====== GRID DE ARTÍCULOS ====== */
        .cuad-grid-section { padding: 80px 0 40px; }
        .cuad-grid-h {
          font-family: ${T.display};
          font-size: clamp(36px, 5vw, 80px);
          line-height: 0.95; font-weight: 600; color: ${T.blue};
          letter-spacing: -0.01em; margin: 0 0 32px;
        }
        .cuad-grid-h em { font-style: italic; }
        .cuad-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 48px 40px;
        }
        @media (max-width: 1024px) { .cuad-grid { grid-template-columns: repeat(2, 1fr); gap: 40px 32px; } }
        @media (max-width: 700px) { .cuad-grid { grid-template-columns: 1fr; gap: 36px; } }
        @media (max-width: 768px) { .cuad-grid-section { padding: 56px 0 32px; } }
        @media (max-width: 480px) { .cuad-grid-section { padding: 44px 0 24px; } }

        .cuad-card { display: flex; flex-direction: column; gap: 14px; text-decoration: none; color: inherit; border-radius: 4px; }
        .cuad-card:focus-visible {
          outline: 2px solid ${T.blue}; outline-offset: 4px;
        }
        .cuad-card .cover {
          aspect-ratio: 4 / 3; border: 1.5px solid ${T.blue};
          background: ${T.cream2}; position: relative; overflow: hidden;
          transition: transform .25s ease;
        }
        .cuad-card:hover .cover { transform: translateY(-3px); }
        .cuad-card .cover img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform .5s ease;
        }
        .cuad-card:hover .cover img { transform: scale(1.04); }
        .cuad-card .cover .placeholder {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: ${T.display}; font-style: italic; font-weight: 500;
          font-size: 120px; color: rgba(29,43,219,.18);
          background: linear-gradient(135deg, ${T.cream2}, ${T.cream3});
        }
        .cuad-card .cover .num-badge {
          position: absolute; top: 12px; left: 12px;
          font-family: ${T.mono}; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
          padding: 4px 10px; background: ${T.cream}; color: ${T.blue}; border: 1px solid ${T.blue};
        }
        .cuad-card .cat-tag {
          font-family: ${T.mono}; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
          color: ${T.blue}; padding: 5px 11px; border-radius: 999px;
          background: rgba(15,27,170,.08); width: fit-content;
        }
        .cuad-card h3 {
          font-family: ${T.display};
          font-size: clamp(28px, 2.4vw, 36px);
          line-height: 1.05; font-weight: 600; color: ${T.blue};
          letter-spacing: -0.005em; margin: 0;
        }
        .cuad-card h3 em { font-style: italic; }
        .cuad-card .lede {
          font-family: ${T.serif}; font-style: italic; font-size: 16px; line-height: 1.4;
          color: ${T.ink}; opacity: .82; margin: 0;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .cuad-card .meta {
          display: flex; gap: 14px; flex-wrap: wrap;
          font-family: ${T.mono}; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          color: ${T.inkSoft}; margin-top: auto; padding-top: 6px;
        }

        /* ====== ÍNDICE TOC (renglón tipo periódico) ====== */
        .cuad-index { padding: 60px 0 80px; }
        .cuad-toc { display: flex; flex-direction: column; }
        .cuad-toc-row {
          display: grid;
          grid-template-columns: 80px 110px 1fr 140px 110px 60px;
          gap: 28px; align-items: baseline;
          padding: 22px 0; border-top: 1px solid ${T.blue};
          text-decoration: none; color: inherit;
          transition: background .15s, padding .15s; position: relative;
        }
        .cuad-toc-row:last-child { border-bottom: 1px solid ${T.blue}; }
        .cuad-toc-row:hover { background: ${T.blue}; color: ${T.cream}; padding-left: 12px; padding-right: 12px; }
        .cuad-toc-row:focus-visible {
          outline: 2px solid ${T.blue}; outline-offset: -2px;
        }
        .cuad-toc-row:hover .toc-tag { background: rgba(241,234,216,.18); color: ${T.cream}; }
        .cuad-toc-row:hover .toc-arrow { transform: translateX(4px); }
        .cuad-toc-row .toc-num {
          font-family: ${T.mono}; font-size: 14px; letter-spacing: 0.22em; text-transform: uppercase;
          color: currentColor;
        }
        .cuad-toc-row .toc-date {
          font-family: ${T.mono}; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          color: currentColor; opacity: .75;
        }
        .cuad-toc-row .toc-title {
          font-family: ${T.display};
          font-size: clamp(28px, 2.6vw, 38px);
          line-height: 1.05; font-weight: 600;
          color: currentColor; letter-spacing: -0.005em;
        }
        .cuad-toc-row .toc-title em { font-style: italic; }
        .cuad-toc-row .toc-title small {
          display: block; margin-top: 4px;
          font-family: ${T.serif}; font-style: italic; font-weight: 400;
          font-size: 16px; line-height: 1.4; opacity: .8;
        }
        .toc-tag {
          display: inline-flex; align-items: center; height: fit-content;
          padding: 6px 12px; border-radius: 999px;
          background: rgba(15,27,170,.08); color: ${T.blue};
          font-family: ${T.mono}; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          white-space: nowrap; width: fit-content;
        }
        .cuad-toc-row .toc-time {
          font-family: ${T.mono}; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          color: currentColor; opacity: .75; text-align: right;
        }
        .toc-arrow {
          font-family: ${T.sans}; font-weight: 500; font-size: 22px;
          color: currentColor; transition: transform .2s; text-align: right; line-height: 1;
        }
        @media (max-width: 1100px) {
          .cuad-toc-row { grid-template-columns: 60px 1fr 90px 40px; gap: 20px; }
          .cuad-toc-row .toc-date, .cuad-toc-row .toc-time { display: none; }
        }
        @media (max-width: 700px) {
          .cuad-toc-row { grid-template-columns: 44px 1fr 26px; gap: 14px; padding: 18px 0; }
          .cuad-toc-row:hover { padding-left: 8px; padding-right: 8px; }
          .toc-tag { display: none; }
          .cuad-toc-row .toc-num { font-size: 12px; letter-spacing: 0.18em; }
          .cuad-toc-row .toc-title { font-size: clamp(22px, 5vw, 30px); }
          .cuad-toc-row .toc-title small { font-size: 14.5px; line-height: 1.35; margin-top: 3px; }
          .toc-arrow { font-size: 20px; }
        }
        @media (max-width: 480px) {
          .cuad-index { padding: 44px 0 64px; }
          .cuad-toc-row { padding: 16px 0; }
          .cuad-toc-row .toc-title small {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }

        /* ====== ARCHIVO (año / sentimiento) ====== */
        .cuad-archive { padding: 0 0 100px; }
        .cuad-archive-grid {
          display: grid; grid-template-columns: 1.6fr 1fr; gap: 56px;
        }
        .cuad-archive-grid h3 {
          font-family: ${T.display};
          font-size: 48px; line-height: 0.95; font-weight: 600;
          color: ${T.blue}; margin: 0 0 24px;
          letter-spacing: -0.005em;
        }
        .cuad-archive-grid h3 em { font-style: italic; }
        .by-year { border: 1.5px solid ${T.blue}; background: ${T.cream}; }
        .by-year-row {
          display: grid; grid-template-columns: 90px 1fr auto;
          gap: 24px; padding: 18px 24px;
          border-bottom: 1px solid ${T.blue}; align-items: center;
          font-family: ${T.mono}; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase;
          color: ${T.ink};
        }
        .by-year-row:last-child { border-bottom: none; }
        .by-year-row .y {
          font-family: ${T.display}; font-style: italic; font-weight: 600;
          font-size: 32px; line-height: 1; color: ${T.blue};
          letter-spacing: 0; text-transform: none;
        }
        .by-year-row .bar { height: 6px; background: ${T.cream2}; position: relative; overflow: hidden; }
        .by-year-row .bar::before {
          content: ""; position: absolute; left: 0; top: 0; bottom: 0;
          background: ${T.blue}; width: var(--w, 30%);
        }
        .by-feeling { border: 1.5px solid ${T.blue}; background: ${T.blue}; color: ${T.cream}; }
        .by-feeling-row {
          display: flex; justify-content: space-between; align-items: baseline;
          padding: 18px 24px; border-bottom: 1px solid rgba(241,234,216,.3);
          font-family: ${T.mono}; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase;
          color: ${T.cream}; text-decoration: none;
        }
        .by-feeling-row:last-child { border-bottom: none; }
        .by-feeling-row:focus-visible {
          outline: 2px solid ${T.cream}; outline-offset: -2px;
        }
        .by-feeling-row .name {
          font-family: ${T.display}; font-style: italic; font-weight: 500;
          font-size: 28px; color: ${T.cream};
          letter-spacing: 0; text-transform: none;
        }
        .by-feeling-row .count { color: rgba(241,234,216,.7); }
        @media (max-width: 900px) { .cuad-archive-grid { grid-template-columns: 1fr; gap: 36px; } }
        @media (max-width: 480px) {
          .cuad-archive-grid h3 { font-size: 36px; margin-bottom: 18px; }
          .by-year-row { grid-template-columns: 70px 1fr auto; gap: 14px; padding: 14px 18px; font-size: 11px; letter-spacing: 0.18em; }
          .by-year-row .y { font-size: 26px; }
          .by-feeling-row { padding: 14px 18px; font-size: 11px; letter-spacing: 0.18em; }
          .by-feeling-row .name { font-size: 24px; }
        }

        /* ====== Cargar más ====== */
        .cuad-more {
          padding: 60px 0 100px; text-align: center;
          border-top: 1px dashed ${T.blue};
        }
        .cuad-more p {
          font-family: ${T.serif}; font-style: italic; font-size: 18px;
          color: ${T.inkSoft}; margin: 0 0 18px;
        }
        .cuad-more-btn {
          display: inline-flex; align-items: center; gap: 12px;
          min-height: 44px;
          padding: 14px 28px; border: 1.5px solid ${T.blue};
          font-family: ${T.mono}; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase;
          color: ${T.blue}; text-decoration: none;
          border-radius: 999px; background: transparent;
          transition: background .15s, color .15s;
        }
        .cuad-more-btn:hover { background: ${T.blue}; color: ${T.cream}; }
        .cuad-more-btn:focus-visible {
          outline: 2px solid ${T.blue}; outline-offset: 3px;
        }
        @media (max-width: 480px) {
          .cuad-more { padding: 44px 0 64px; }
          .cuad-more p { font-size: 16px; }
          .cuad-more-btn { padding: 13px 22px; font-size: 11px; letter-spacing: 0.18em; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cuad-card .cover, .cuad-card:hover .cover,
          .cuad-card .cover img, .cuad-card:hover .cover img,
          .cuad-toc-row, .cuad-toc-row:hover,
          .cuad-filter, .cuad-more-btn,
          .cuad-featured .read-cta .ar {
            transition: none;
            transform: none;
          }
        }
      `}</style>

      {/* MASTHEAD */}
      <section className="cuad-mast">
        <div className="wrap">
          <div className="cuad-mast-row">
            <span>cuaderno · archivo completo</span>
            <span>edición n.º {total} · año 2026</span>
            <span>{todayLabel()}</span>
          </div>
          <h1>
            el <em>cuaderno</em>
          </h1>
          <p className="cuad-mast-sub">
            Cada entrega que he escrito desde marzo de 2025. Sin ranking, sin
            algoritmo, ordenadas por la mano que las escribió.
          </p>
          <div className="cuad-mast-numbers">
            <div className="n">
              <span className="v">{total}</span>
              <span className="l">entregas</span>
            </div>
            <div className="n">
              <span className="v">{categoryCount}</span>
              <span className="l">sentimientos</span>
            </div>
            <div className="n">
              <span className="v">{formatThousands(totalWords)}</span>
              <span className="l">palabras</span>
            </div>
            <div className="n">
              <span className="v">{avgRead}</span>
              <span className="l">min · lectura media</span>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLBAR / FILTROS */}
      <section className="cuad-toolbar">
        <div className="wrap cuad-toolbar-inner">
          <div className="cuad-filters">
            <Link href="/blog" className="cuad-filter active">
              todos
            </Link>
            {Object.values(CATEGORIES).map((c) => (
              <Link
                key={c.slug}
                href={`/categoria/${c.slug}`}
                className="cuad-filter"
              >
                {c.name.toLowerCase()}
              </Link>
            ))}
          </div>
          <div className="cuad-sort">
            <span>ordenar</span>
            <strong>↓ más reciente</strong>
          </div>
        </div>
      </section>

      {total === 0 ? (
        <section className="cuad-grid-section">
          <div className="wrap">
            <p
              style={{
                fontFamily: T.serif,
                fontStyle: "italic",
                fontSize: 22,
                color: T.inkSoft,
                textAlign: "center",
                padding: "80px 0",
              }}
            >
              No hay artículos todavía. Vuelve pronto.
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* DESTACADA */}
          {featured && (
            <section className="cuad-featured">
              <div className="wrap">
                <div className="cuad-featured-grid">
                  <div>
                    <span className="tag">
                      entrada n.º {total} · destacada
                    </span>
                    <h2>
                      <Link href={`/blog/${featured.slug}`}>
                        {featured.title}
                      </Link>
                    </h2>
                    {featured.excerpt && (
                      <p className="lede">{featured.excerpt}</p>
                    )}
                    <div className="feat-meta">
                      <span>
                        publicado · <strong>{featured.date}</strong>
                      </span>
                      {featured.category && (
                        <span>
                          etiqueta ·{" "}
                          <strong>{featured.category.toLowerCase()}</strong>
                        </span>
                      )}
                      <span>
                        lectura · <strong>{featured.readTime}</strong>
                      </span>
                    </div>
                    <Link
                      href={`/blog/${featured.slug}`}
                      className="read-cta"
                    >
                      Leer la entrega completa{" "}
                      <span className="ar">→</span>
                    </Link>
                  </div>
                  <div className="cuad-illu">
                    {featured.coverImage ? (
                      <Image
                        src={featured.coverImage}
                        alt={featured.coverAlt || featured.title}
                        fill
                        sizes="(max-width: 900px) 380px, 40vw"
                        className="cover-img"
                        unoptimized
                      />
                    ) : null}
                    <div className="glow" />
                    <span className="num">{total}</span>
                    <div className="navlbl">
                      n.º<strong>{ordinalEs(total)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* GRID DE ARTÍCULOS */}
          {gridPosts.length > 0 && (
            <section className="cuad-grid-section">
              <div className="wrap">
                <h2 className="cuad-grid-h">
                  últimas <em>entregas</em>
                </h2>
                <div className="cuad-grid">
                  {gridPosts.map((post, i) => {
                    const num = total - 1 - i; // descending numeration
                    return (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="cuad-card"
                      >
                        <div className="cover">
                          {post.coverImage ? (
                            <Image
                              src={post.coverImage}
                              alt={post.coverAlt || post.title}
                              fill
                              sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"
                              style={{ objectFit: "cover" }}
                              unoptimized
                            />
                          ) : (
                            <div className="placeholder">
                              n.º{num.toString().padStart(2, "0")}
                            </div>
                          )}
                          <span className="num-badge">
                            № {num.toString().padStart(2, "0")}
                          </span>
                        </div>
                        {post.category && (
                          <span className="cat-tag">
                            {post.category.toLowerCase()}
                          </span>
                        )}
                        <h3>{post.title}</h3>
                        {post.excerpt && (
                          <p className="lede">{post.excerpt}</p>
                        )}
                        <div className="meta">
                          <span>{post.date}</span>
                          <span>·</span>
                          <span>{post.readTime} · lectura</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* ÍNDICE TOC COMPLETO */}
          <section className="cuad-index">
            <div className="wrap">
              <h2 className="cuad-grid-h">
                índice <em>completo</em>
              </h2>
              <div className="cuad-toc">
                {all.map((post, i) => {
                  const num = total - i;
                  const tagLabel = post.category
                    ? post.category.toLowerCase()
                    : "egoera";
                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="cuad-toc-row"
                    >
                      <span className="toc-num">
                        № {num.toString().padStart(2, "0")}
                      </span>
                      <span className="toc-date">
                        {formatTocDate(post.dateISO)}
                      </span>
                      <div className="toc-title">
                        {post.title}
                        {post.excerpt && <small>{post.excerpt}</small>}
                      </div>
                      <span className="toc-tag">{tagLabel}</span>
                      <span className="toc-time">
                        {post.readTime} · lectura
                      </span>
                      <span className="toc-arrow">→</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ARCHIVO POR AÑO + SENTIMIENTO */}
          <section className="cuad-archive">
            <div className="wrap">
              <div className="cuad-archive-grid">
                <div>
                  <h3>
                    archivo por <em>año</em>
                  </h3>
                  <div className="by-year">
                    {yearStats.length === 0 ? (
                      <div className="by-year-row">
                        <span className="y">—</span>
                        <span className="bar" style={{ ["--w" as string]: "0%" }} />
                        <span>en preparación</span>
                      </div>
                    ) : (
                      yearStats.map(({ year, count }) => {
                        const pct = Math.round((count / maxYearCount) * 100);
                        return (
                          <div className="by-year-row" key={year}>
                            <span className="y">{year}</span>
                            <span
                              className="bar"
                              style={{ ["--w" as string]: `${pct}%` }}
                            />
                            <span>
                              {count} {count === 1 ? "entrega" : "entregas"}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
                <div>
                  <h3>
                    por <em>sentimiento</em>
                  </h3>
                  <div className="by-feeling">
                    {sortedCategoryStats.length === 0 ? (
                      <div className="by-feeling-row">
                        <span className="name">sin datos</span>
                        <span className="count">— entregas</span>
                      </div>
                    ) : (
                      sortedCategoryStats.map(({ slug, count, name }) => (
                        <Link
                          key={slug}
                          href={`/categoria/${slug}`}
                          className="by-feeling-row"
                        >
                          <span className="name">{name.toLowerCase()}</span>
                          <span className="count">
                            {count.toString().padStart(2, "0")}{" "}
                            {count === 1 ? "entrega" : "entregas"}
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CARGAR MÁS (estático, placeholder) */}
          <section className="cuad-more">
            <div className="wrap">
              <p>Estás viendo las {total} entregas publicadas hasta hoy.</p>
              <Link href="/boletin" className="cuad-more-btn">
                Recibir cada domingo →
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
