import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { EgoeraNav } from "@/components/egoera/EgoeraNav";
import { EgoeraFooter } from "@/components/egoera/EgoeraFooter";
import { V5Hud } from "./V5Hud";
import { V5MoodCheckpoint } from "./V5MoodCheckpoint";
import { V5BreathingTimer } from "./V5BreathingTimer";
import { V5Schema } from "./V5Schema";
import styles from "./V5ArticleShell.module.css";

interface RelatedPost {
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
  readTime?: string;
  date?: string;
}

interface Props {
  post: BlogPost;
  /** Posts relacionados ya filtrados (p.ej. mismos categorySlug). */
  related: RelatedPost[];
  /** HTML del cuerpo del artículo, ya limpio del overlay V3/V4. */
  bodyHtml: string;
  /** Lista extraída de pares pregunta/respuesta para Schema FAQPage. */
  faqs: { q: string; a: string }[];
  /** Lista de H2s (texto + id) extraídos del body para el TOC. */
  toc: { id: string; label: string }[];
  /** Word count calculado a partir del HTML limpio. */
  wordCount: number;
}

const SITE_URL = "https://egoera.es";

/**
 * V5ArticleShell · cascarón canónico para artículos del cuaderno.
 *
 * Estructura:
 *   1. EgoeraNav             — nav compartida del sitio
 *   2. V5Hud                 — sticky bar gamificada (progress + estrellas)
 *   3. Hero                  — eyebrow + título + subtítulo + meta
 *   4. V5MoodCheckpoint "in" — picker de 8 emociones antes de leer
 *   5. Reading shell         — TOC sticky + body con HTML inyectado
 *   6. V5BreathingTimer      — ejercicio respirador 4-6 (interactivo)
 *   7. Footer artículo       — sello + V5MoodCheckpoint "out" + related
 *   8. EgoeraFooter          — pie compartido
 *
 * Server component: solo el shell estático corre en server. Los hijos
 * V5Hud, V5MoodCheckpoint y V5BreathingTimer son client components y
 * llevan su propio "use client".
 */
export function V5ArticleShell({
  post,
  related,
  bodyHtml,
  faqs,
  toc,
  wordCount,
}: Props) {
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  // Edición: número derivado del slug (estable y reproducible).
  const editionNumber = String(((post.slug.length * 7) % 100) + 1).padStart(
    3,
    "0"
  );
  const editionLabel = `n.º ${editionNumber}`;
  const year = new Date(post.dateISO).getFullYear() || new Date().getFullYear();

  return (
    <>
      <V5Schema
        post={post}
        canonicalUrl={canonicalUrl}
        faqs={faqs}
        wordCount={wordCount}
      />

      <div className={styles.v5}>
        <EgoeraNav active="cuaderno" />

        <V5Hud
          slug={post.slug}
          editionLabel={editionLabel}
          endTargetId="v5-footer"
        />

        {/* ===== HERO ===== */}
        <section className={`${styles.hero} ${styles.wrap}`}>
          <nav className={styles.crumbs} aria-label="Migas de pan">
            <Link href="/blog">cuaderno</Link>
            <span className={styles.sep}>/</span>
            {post.categorySlug && post.category ? (
              <>
                <Link href={`/categoria/${post.categorySlug}`}>
                  {post.category.toLowerCase()}
                </Link>
                <span className={styles.sep}>/</span>
              </>
            ) : null}
            <span className={styles.here}>{post.title}</span>
          </nav>

          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <span className={styles.heroCat}>
                EGOERA · {post.category || "Cuaderno"}
              </span>
              <h1 className={styles.heroTitle}>
                {renderTitleWithItalicLastWord(post.title)}
              </h1>
              {post.excerpt && (
                <p className={styles.heroSub}>{post.excerpt}</p>
              )}
              <div className={styles.heroMeta}>
                <div className="author">
                  <span className="av">A</span>
                  <span>
                    <strong style={{ color: "var(--blue)", fontWeight: 600 }}>
                      {post.author || "Ander Bilbao"}
                    </strong>
                    {" · Psicólogo"}
                  </span>
                </div>
                <span>{post.date}</span>
                <span>{post.readTime}</span>
                <span>
                  {editionLabel}/{year}
                </span>
              </div>
            </div>

            <div className={styles.heroIllu}>
              <div className="top">
                <span>Edición {editionLabel}</span>
                <span className="stamp">cuaderno · {editionNumber}</span>
              </div>
              <div className="svgwrap">
                <HeroGlyph />
              </div>
              <div className="cap">
                Verdad. Dolor.
                <br />
                <em>Distancia.</em>
              </div>
              <div className="foot">
                <span>
                  {post.category || "Cuaderno"} · {post.readTime}
                </span>
                <span>{post.date}</span>
              </div>
            </div>
          </div>

          <V5MoodCheckpoint slug={post.slug} variant="in" />
        </section>

        {/* ===== READING SHELL ===== */}
        <section className={styles.wrap}>
          <div className={styles.shell}>
            {toc.length > 0 && (
              <>
                <aside className={styles.toc} aria-label="Índice del artículo">
                  <div className={styles.tocEye}>índice</div>
                  {toc.map((entry, i) => (
                    <a key={entry.id} href={`#${entry.id}`}>
                      <span className="n">
                        {String(i + 1).padStart(2, "0")}
                      </span>{" "}
                      {entry.label}
                    </a>
                  ))}
                </aside>

                <details className={styles.tocMobile}>
                  <summary>Índice · {toc.length} secciones</summary>
                  <ol>
                    {toc.map((entry, i) => (
                      <li key={`m-${entry.id}`}>
                        <a href={`#${entry.id}`}>
                          <span className="n">
                            {String(i + 1).padStart(2, "0")}
                          </span>{" "}
                          {entry.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                </details>
              </>
            )}

            <article
              className={styles.body}
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </div>
        </section>

        {/* ===== EJERCICIO ===== */}
        <section className={styles.wrap} style={{ marginTop: 56 }}>
          <V5BreathingTimer slug={post.slug} />
        </section>

        {/* ===== FOOTER del artículo (mood-out + sello) ===== */}
        <section
          id="v5-footer"
          className={`${styles.footer} ${styles.wrap}`}
          aria-label="Cierre de la lectura"
        >
          <V5MoodCheckpoint slug={post.slug} variant="out" />
        </section>

        {/* ===== RELATED ===== */}
        {related.length > 0 && (
          <section className={`${styles.related} ${styles.wrap}`}>
            <div className={styles.relatedHead}>
              <h3 className={styles.h}>
                Seguir <em>leyendo.</em>
              </h3>
              <span className={styles.lbl}>
                {related.length} {related.length === 1 ? "edición" : "ediciones"} cerca
              </span>
            </div>
            <div className={styles.relatedGrid}>
              {related.slice(0, 2).map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className={styles.relatedCard}
                >
                  <div className="ncat">
                    {r.category || "Cuaderno"} · {r.readTime || "—"}
                  </div>
                  <div
                    className="nt"
                    dangerouslySetInnerHTML={{
                      __html: renderTitleWithItalicLastWordHtml(r.title),
                    }}
                  />
                  {r.excerpt && <p className="ns">{r.excerpt}</p>}
                  <div className="nfoot">
                    <span>{r.date || ""}</span>
                    <span>leer →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <EgoeraFooter />
      </div>
    </>
  );
}

/** Renderiza un título partiendo la última palabra en <em> para el
 *  acento editorial Caveat-italic característico de Egoera. */
function renderTitleWithItalicLastWord(title: string) {
  const trimmed = title.trim();
  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace === -1) {
    return <em>{trimmed}</em>;
  }
  const head = trimmed.slice(0, lastSpace);
  const tail = trimmed.slice(lastSpace + 1);
  return (
    <>
      {head} <em>{tail}</em>
    </>
  );
}

/** Variante string-based del helper para usar dentro de
 *  dangerouslySetInnerHTML (related cards). Escapa el HTML antes. */
function renderTitleWithItalicLastWordHtml(title: string) {
  const escaped = title
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .trim();
  const lastSpace = escaped.lastIndexOf(" ");
  if (lastSpace === -1) return `<em>${escaped}</em>`;
  return `${escaped.slice(0, lastSpace)} <em>${escaped.slice(lastSpace + 1)}</em>`;
}

/** Glyph SVG del hero — cuaderno + lápiz + chispas. Replica del V4. */
function HeroGlyph() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <g
        fill="none"
        stroke="#f1ead8"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 50 60 L 50 160 L 150 160 L 150 60 Z" />
        <path d="M 100 60 L 100 160" />
        <path d="M 60 80 L 92 80" strokeWidth="3" />
        <path d="M 60 95 L 92 95" strokeWidth="3" />
        <path d="M 60 110 L 88 110" strokeWidth="3" />
        <path d="M 108 80 L 140 80" strokeWidth="3" />
        <path d="M 108 95 L 140 95" strokeWidth="3" />
        <path d="M 108 110 L 138 110" strokeWidth="3" />
        <path d="M 110 38 L 150 38 L 158 46 L 150 54 L 110 54 Z" />
        <path d="M 150 38 L 150 54" />
        <path d="M 30 40 L 30 52 M 24 46 L 36 46" strokeWidth="3.5" />
        <path d="M 168 60 L 168 72 M 162 66 L 174 66" strokeWidth="3.5" />
        <path d="M 30 170 L 30 182 M 24 176 L 36 176" strokeWidth="3.5" />
        <path d="M 170 170 L 170 182 M 164 176 L 176 176" strokeWidth="3.5" />
      </g>
    </svg>
  );
}

export default V5ArticleShell;
