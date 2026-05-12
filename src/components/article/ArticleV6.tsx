import Link from "next/link";
import { EgoeraNav } from "@/components/egoera/EgoeraNav";
import { EgoeraFooter } from "@/components/egoera/EgoeraFooter";
import styles from "./ArticleV6.module.css";

/**
 * ArticleV6 · cuaderno editorial cobalto + crema.
 *
 * Sucesor de V5ArticleShell. Mantiene la paleta y los tokens scoped
 * (todo cuelga de .v6 para no contaminar el dark-mode global), pero
 * sube el nivel editorial:
 *   - Hero limpio con kicker mono + título Caveat gigante con palabra
 *     en <em> color naranja Bloom (#d97757) + subtítulo italic + meta
 *     vertical + cover image opcional desbordada.
 *   - TOC auto-generada de los h2 (sticky en desktop, drawer en mobile).
 *   - Body Fraunces 20px/1.7 con drop-cap en el primer párrafo y
 *     blockquote convertido en pull-quote tipográfico con ornamento.
 *   - Callouts: .callout-note (cream sobre cobalto), .callout-quote
 *     (cobalto sobre cobalto con borde dashed), .callout-exercise
 *     (crema-2 con borde dashed y sello "ejercicio") — todos inyectables
 *     desde el HTML de WP usando <aside class="callout-…">.
 *   - .pullquote para citas resaltadas dentro del body.
 *   - Sección "Steps" con sellos 01, 02, 03 (heredado del FAQ de
 *     /contacto), pasada como prop steps.
 *   - Cierre "si te ha llegado": newsletter inline + sugerencia de
 *     siguiente artículo + link a la Brújula Emocional /sentir.
 *
 * Server component: solo el shell estático corre en server. Si en el
 * futuro se añaden hooks (formulario newsletter activo, etc.) habrá
 * que extraer la closing card a un client component.
 *
 * ─── Decisión de inyección de HTML ──────────────────────────
 * Para el body usamos `dangerouslySetInnerHTML` con CSS scoped
 * (`.body :global(h2)`, `.body :global(blockquote)`, …) en lugar de
 * parsear el HTML a nodos React. Razón:
 *   1. El HTML viene de WordPress en buen estado y los autores ya
 *      conocen el markup estándar (h2/h3/p/ul/ol/blockquote/img).
 *   2. Para los bloques especiales (callouts, pull-quotes) basta con
 *      pedirles que envuelvan en `<aside class="callout-note">…</aside>`
 *      o `<aside class="pullquote">…</aside>` — la clase activa el
 *      estilo. Cero coste de runtime, cero serialización de React.
 *   3. Una pasada de transformación en JS (regex / parser HTML) añade
 *      complejidad y riesgo de romper markup raro de WP (shortcodes,
 *      bloques Gutenberg) sin ganar nada que no se consiga con CSS.
 *   4. Si en algún momento hace falta inyectar componentes React entre
 *      párrafos (ads, embeds interactivos), se podrá hacer dividiendo
 *      el HTML con `splitContentForAds` en `content-inject.ts` y
 *      renderizando 3 articles separados.
 * ─────────────────────────────────────────────────────────────
 */

export interface ArticleV6Step {
  /** Texto del título del paso. Ej. "Observación" */
  title: string;
  /** Texto del cuerpo del paso. 1-3 frases máx. */
  body: string;
}

export interface ArticleV6NextSuggestion {
  href: string;
  category?: string;
  title: string;
  subtitle?: string;
}

interface Props {
  /** Etiqueta corta encima del título: categoría + edición. */
  kicker: string;
  /** Título principal. La última palabra (o la marcada con `*palabra*`)
   *  se renderiza en `<em>` color naranja. */
  title: string;
  /** Subtítulo en Fraunces italic, máx. 2-3 líneas. */
  subtitle?: string;
  /** Meta cabecera del artículo. */
  author?: string;
  date?: string;
  readTime?: string;
  category?: string;
  categorySlug?: string;
  /** Slug usado para el breadcrumb y el TOC. */
  slug: string;
  /** URL absoluta de la cover image (opcional). Si no hay, se renderiza
   *  un cover sintético cobalto con número de edición. */
  coverImage?: string | null;
  coverAlt?: string;
  /** Número de edición (string formateado: "n.º 042"). */
  editionLabel?: string;
  /** TOC ya extraída (id + label). Si está vacía, no se renderiza. */
  toc?: { id: string; label: string }[];
  /** Cuerpo del artículo en HTML (post.content de WP, ya limpio de
   *  overlays V3/V4 y con ids inyectados en los h2). */
  bodyHtml: string;
  /** Sección "Pasos" opcional. Si se pasa, se renderiza un bloque
   *  con sellos numerados 01, 02, 03 después del body. */
  steps?: {
    title: string;
    intro?: string;
    items: ArticleV6Step[];
  };
  /** Sugerencia de siguiente artículo para el cierre. */
  nextSuggestion?: ArticleV6NextSuggestion;
  /**
   * Lista de sugerencias relacionadas para el cierre (internal linking
   * automático). Pensado para 3 artículos del mismo `categorySlug`, ya
   * filtrados sin el actual. Si está vacío o no se pasa, se usa el
   * fallback `nextSuggestion`.
   */
  relatedSuggestions?: ArticleV6NextSuggestion[];
}

export function ArticleV6({
  kicker,
  title,
  subtitle,
  author,
  date,
  readTime,
  category,
  categorySlug,
  slug,
  coverImage,
  coverAlt,
  editionLabel,
  toc = [],
  bodyHtml,
  steps,
  nextSuggestion,
  relatedSuggestions = [],
}: Props) {
  // El número de edición sintético es solo cosmético: lo derivamos del
  // slug para que cada artículo tenga un número estable sin tener que
  // mantenerlo en la BBDD.
  const editionNum = editionLabel ?? deriveEditionNumber(slug);

  return (
    <div className={styles.v6}>
      <EgoeraNav active="cuaderno" />

      {/* ─── HERO ───────────────────────────────────────────────── */}
      <section className={`${styles.hero} ${styles.wrap}`}>
        <nav className={styles.crumbs} aria-label="Migas de pan">
          <Link href="/blog">cuaderno</Link>
          <span className="sep">/</span>
          {categorySlug && category ? (
            <>
              <Link href={`/categoria/${categorySlug}`}>
                {category.toLowerCase()}
              </Link>
              <span className="sep">/</span>
            </>
          ) : null}
          <span className="here">{truncateForCrumb(title)}</span>
        </nav>

        <span className={styles.heroKicker}>{kicker}</span>

        <h1 className={styles.heroTitle}>{renderTitleWithEm(title)}</h1>

        {subtitle && <p className={styles.heroSub}>{subtitle}</p>}

        <div className={styles.heroMeta}>
          {author && (
            <div className="item">
              <span>firma</span>
              <strong>{author}</strong>
            </div>
          )}
          {date && (
            <div className="item">
              <span>fecha</span>
              <strong>{date}</strong>
            </div>
          )}
          {readTime && (
            <div className="item">
              <span>lectura</span>
              <strong>{readTime}</strong>
            </div>
          )}
          {editionNum && (
            <div className="item">
              <span>edición</span>
              <strong>{editionNum}</strong>
            </div>
          )}
        </div>

        {coverImage ? (
          <div className={styles.heroCover}>
            <img src={coverImage} alt={coverAlt ?? ""} />
          </div>
        ) : (
          <div className={styles.heroCover} aria-hidden="true">
            <span className="coverGlow" />
            <span className="coverBadge">
              {category || "Cuaderno"} · {editionNum}
            </span>
            <span className="coverNum">{stripPrefix(editionNum)}</span>
          </div>
        )}
      </section>

      {/* ─── READING SHELL (TOC + BODY) ─────────────────────────── */}
      <section className={styles.wrap}>
        <div className={styles.shell}>
          {toc.length > 0 ? (
            <>
              <aside className={styles.toc} aria-label="Índice del artículo">
                <div className={styles.tocEye}>índice</div>
                {toc.map((entry, i) => (
                  <a key={entry.id} href={`#${entry.id}`}>
                    <span className="tn">
                      {String(i + 1).padStart(2, "0")}
                    </span>
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
                        <span className="tn">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {entry.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            </>
          ) : (
            // grid de 1 col cuando no hay TOC
            <div />
          )}

          <article
            className={styles.body}
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </div>
      </section>

      {/* ─── STEPS NUMERADOS ────────────────────────────────────── */}
      {steps && steps.items.length > 0 && (
        <section className={`${styles.steps} ${styles.wrap}`}>
          <div className={styles.stepsHead}>
            <h3>{renderTitleWithEm(steps.title)}</h3>
            {steps.intro && <p>{steps.intro}</p>}
          </div>
          {steps.items.map((s, i) => (
            <div className={styles.stepItem} key={`step-${i}`}>
              <div className={styles.stepNum}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className={styles.stepBody}>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ─── CLOSING: NEWSLETTER + NEXT + BRÚJULA ───────────────── */}
      <section className={`${styles.closing} ${styles.wrap}`}>
        <div className={styles.closingHead}>
          <span>si te ha llegado</span>
        </div>
        <div className={styles.closingGrid}>
          <div className={styles.closingNews}>
            <div className="kicker">el boletín</div>
            <h3>
              Una carta, <em>un domingo</em>.
            </h3>
            <p>
              Un correo lento al mes con lo que voy aprendiendo en consulta y
              en el cuaderno. Sin urgencia, sin spam.
            </p>
            <form
              className={styles.closingForm}
              action="/boletin"
              method="get"
              noValidate
            >
              <input
                type="email"
                name="email"
                placeholder="tu correo"
                aria-label="Tu correo electrónico"
              />
              <button type="submit">Apuntarme</button>
            </form>
          </div>

          <div className={styles.closingNext}>
            {relatedSuggestions.length > 0 ? (
              // Internal linking automático: 3 artículos relacionados
              // del mismo cluster temático. Refuerza el silo SEO y
              // distribuye link equity al resto del cuaderno.
              <>
                <div className="kicker">seguir leyendo</div>
                <ul className="nextList" aria-label="Artículos relacionados">
                  {relatedSuggestions.slice(0, 3).map((s) => (
                    <li key={s.href}>
                      <Link href={s.href} className="nextItem">
                        {s.category && (
                          <span className="nextCat">{s.category}</span>
                        )}
                        <span
                          className="nextTitle"
                          dangerouslySetInnerHTML={{
                            __html: renderTitleWithEmHtml(s.title),
                          }}
                        />
                        {s.subtitle && (
                          <span className="nextSub">{s.subtitle}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : nextSuggestion ? (
              <Link href={nextSuggestion.href} className="nextCard">
                <div className="kicker">seguir leyendo</div>
                {nextSuggestion.category && (
                  <div className="nextCat">{nextSuggestion.category}</div>
                )}
                <h4
                  className="nextTitle"
                  dangerouslySetInnerHTML={{
                    __html: renderTitleWithEmHtml(nextSuggestion.title),
                  }}
                />
                {nextSuggestion.subtitle && (
                  <p className="nextSub">{nextSuggestion.subtitle}</p>
                )}
              </Link>
            ) : (
              <div>
                <div className="kicker">seguir leyendo</div>
                <h4
                  className="nextTitle"
                  dangerouslySetInnerHTML={{
                    __html: renderTitleWithEmHtml("El cuaderno completo →"),
                  }}
                />
                <p className="nextSub">
                  Todas las entradas, ordenadas por mes y por tema.
                </p>
              </div>
            )}

            <Link href="/sentir" className={styles.closingBrujula}>
              <span>brújula emocional</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <EgoeraFooter />
    </div>
  );
}

// ───────────────────────── helpers ──────────────────────────

/**
 * Renderiza un título partiendo la última palabra en <em> (color
 * naranja). Si el título contiene asteriscos `*palabra*`, en su lugar
 * se usa ese trozo como `<em>`. Esto da control editorial al autor
 * cuando la última palabra no es la que quiere acentuar.
 */
function renderTitleWithEm(title: string) {
  const t = title.trim();
  const star = t.match(/\*(.+?)\*/);
  if (star) {
    const idx = t.indexOf(star[0]);
    return (
      <>
        {t.slice(0, idx)}
        <em>{star[1]}</em>
        {t.slice(idx + star[0].length)}
      </>
    );
  }
  const lastSpace = t.lastIndexOf(" ");
  if (lastSpace === -1) return <em>{t}</em>;
  return (
    <>
      {t.slice(0, lastSpace)} <em>{t.slice(lastSpace + 1)}</em>
    </>
  );
}

/** Versión string del helper anterior — usada para
 *  dangerouslySetInnerHTML en las tarjetas. Escapa antes. */
function renderTitleWithEmHtml(title: string) {
  const escaped = title
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .trim();
  const star = escaped.match(/\*(.+?)\*/);
  if (star) {
    const idx = escaped.indexOf(star[0]);
    return (
      escaped.slice(0, idx) +
      `<em>${star[1]}</em>` +
      escaped.slice(idx + star[0].length)
    );
  }
  const lastSpace = escaped.lastIndexOf(" ");
  if (lastSpace === -1) return `<em>${escaped}</em>`;
  return `${escaped.slice(0, lastSpace)} <em>${escaped.slice(
    lastSpace + 1
  )}</em>`;
}

function deriveEditionNumber(slug: string): string {
  const n = String(((slug.length * 7) % 100) + 1).padStart(3, "0");
  return `n.º ${n}`;
}

function stripPrefix(s: string): string {
  return s.replace(/^n\.?º\s*/i, "");
}

function truncateForCrumb(s: string): string {
  if (s.length <= 64) return s;
  return s.slice(0, 60).trimEnd() + "…";
}

export default ArticleV6;
