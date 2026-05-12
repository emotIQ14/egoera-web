import Link from "next/link";
import type { Learning } from "@/lib/article/extract-learnings";
import styles from "./CuadernoCierre.module.css";

/**
 * CuadernoCierre · bloque de cierre tipo "cuaderno de campo".
 *
 * Estética inspirada en el post de Bidaiatzen "Hiljainen Kansa"
 * (sección `.notebook-section`): papel sepia con 4 post-its rotados,
 * sello rojo manuscrito, washi tape y mini-souvenirs. Aparece al final
 * de cada artículo del blog de egoera.es como "lo que te llevas a
 * casa".
 *
 * Es un Server Component puro: sin estado, sin efectos, sólo
 * presentación. Persistencia del "ya leído" se delega al V5Hud
 * adyacente vía localStorage compartido por slug.
 *
 * Si `learnings` viene vacío o null, el componente devuelve null y no
 * renderiza nada — mejor ausente que vacío.
 */

interface CuadernoCierreProps {
  /** Número de edición a mostrar en el sello — "014", "027"... */
  editionNumber: string;
  /** Slug del post, usado para construir cross-link al diario. */
  slug: string;
  /** Tema/categoría legible del artículo. */
  tema?: string;
  /** Año/fecha en formato legible para el sello. */
  fechaLectura?: string;
  /** 1 a 4 aprendizajes extraídos del cuerpo del artículo. */
  learnings: Learning[] | null;
  /** Cita opcional al pie del cuaderno (manuscrita azul). */
  cita?: string;
  /** Si está disponible, próxima pieza para el CTA secundario. */
  proximaPieza?: { slug: string; title: string };
  /** Diccionario i18n del componente. Por defecto: castellano. */
  dict?: CuadernoDict;
}

export interface CuadernoDict {
  ariaLabel: string;
  eyebrow: (n: string) => string;
  titlePre: string;
  titleEm: string;
  lede: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  pageEye: string;
  pageTitlePre: string;
  pageTitleEm: string;
  pageNum: (n: string) => string;
  stamp: string;
  stampBig: (n: string) => string;
  labels: Record<Learning["tipo"], string>;
  souvenirs: string[];
}

/**
 * Diccionario por defecto (castellano). Para EU/EN se pasa el
 * correspondiente desde el shell.
 */
export const CUADERNO_DICT_ES: CuadernoDict = {
  ariaLabel: "Cuaderno de cierre · lo aprendido",
  eyebrow: (n) => `Egoera · Cuaderno № ${n}`,
  titlePre: "Lo que te",
  titleEm: "llevas.",
  lede:
    "Cuatro anotaciones de esta lectura. Ábrelas cuando vuelvas a casa de la sesión, cuando aprieta o cuando se te olvide.",
  ctaPrimaryLabel: "Abrir mi diario",
  ctaPrimaryHref: "https://diario.egoera.es",
  ctaSecondaryLabel: "Volver al cuaderno",
  pageEye: "Lo aprendido",
  pageTitlePre: "Cuaderno",
  pageTitleEm: "abierto",
  pageNum: (n) => `${n} / Egoera 2026`,
  stamp: "edición  ·  completada",
  stampBig: (n) => `№ ${n}`,
  labels: {
    idea: "idea",
    cuerpo: "cuerpo",
    pregunta: "pregunta",
    practica: "práctica",
  },
  souvenirs: ["📍", "✚", "✿", "★"],
};

export const CUADERNO_DICT_EU: CuadernoDict = {
  ariaLabel: "Itxiera-koadernoa · ikasitakoa",
  eyebrow: (n) => `Egoera · Koadernoa № ${n}`,
  titlePre: "Eramango",
  titleEm: "duzuna.",
  lede:
    "Irakurketa honetako lau ohar. Ireki itzazu etxera itzultzean, estutzen zaituenean edo ahaztu zaizunean.",
  ctaPrimaryLabel: "Nire egunkaria zabaldu",
  ctaPrimaryHref: "https://diario.egoera.es",
  ctaSecondaryLabel: "Koadernora itzuli",
  pageEye: "Ikasitakoa",
  pageTitlePre: "Koadernoa",
  pageTitleEm: "irekita",
  pageNum: (n) => `${n} / Egoera 2026`,
  stamp: "edizioa  ·  bukatuta",
  stampBig: (n) => `№ ${n}`,
  labels: {
    idea: "ideia",
    cuerpo: "gorputza",
    pregunta: "galdera",
    practica: "praktika",
  },
  souvenirs: ["📍", "✚", "✿", "★"],
};

export const CUADERNO_DICT_EN: CuadernoDict = {
  ariaLabel: "Closing notebook · what was learned",
  eyebrow: (n) => `Egoera · Notebook № ${n}`,
  titlePre: "What you",
  titleEm: "take home.",
  lede:
    "Four notes from this reading. Open them when you get home from the session, when it hurts, or when you forget.",
  ctaPrimaryLabel: "Open my journal",
  ctaPrimaryHref: "https://diario.egoera.es",
  ctaSecondaryLabel: "Back to the notebook",
  pageEye: "What was learned",
  pageTitlePre: "Notebook",
  pageTitleEm: "open",
  pageNum: (n) => `${n} / Egoera 2026`,
  stamp: "edition  ·  completed",
  stampBig: (n) => `№ ${n}`,
  labels: {
    idea: "idea",
    cuerpo: "body",
    pregunta: "question",
    practica: "practice",
  },
  souvenirs: ["📍", "✚", "✿", "★"],
};

export function CuadernoCierre({
  editionNumber,
  slug,
  fechaLectura,
  learnings,
  proximaPieza,
  dict = CUADERNO_DICT_ES,
}: CuadernoCierreProps) {
  if (!learnings || learnings.length < 2) return null;

  // CTA hacia el diario emocional con el slug del artículo como query
  // param: la app del diario puede pre-rellenar una entrada con un
  // pequeño contexto ("Vengo de leer X y me llevo Y").
  const diarioHref = `${dict.ctaPrimaryHref}/?entrada=${encodeURIComponent(
    slug,
  )}&pre=${encodeURIComponent(learnings[0].texto.slice(0, 80))}`;

  return (
    <section className={styles.section} aria-label={dict.ariaLabel}>
      <div className={styles.wrap}>
        {/* ── Columna izquierda ── */}
        <div className={styles.text}>
          <p className={styles.eyebrow}>{dict.eyebrow(editionNumber)}</p>
          <h2 className={styles.h2}>
            {dict.titlePre} <em>{dict.titleEm}</em>
          </h2>
          <p className={styles.lede}>{dict.lede}</p>
          <div className={styles.ctaRow}>
            <a
              href={diarioHref}
              className={styles.cta}
              target="_blank"
              rel="noopener noreferrer"
            >
              {dict.ctaPrimaryLabel}
            </a>
            {proximaPieza ? (
              <Link
                href={`/blog/${proximaPieza.slug}`}
                className={styles.ctaSecondary}
              >
                ↗ {proximaPieza.title}
              </Link>
            ) : (
              <Link href="/blog" className={styles.ctaSecondary}>
                ↗ {dict.ctaSecondaryLabel}
              </Link>
            )}
          </div>
        </div>

        {/* ── Columna derecha — página de cuaderno ── */}
        <div className={styles.book}>
          <div className={styles.page}>
            <span className={styles.pgnum}>{dict.pageNum(editionNumber)}</span>
            <div className={styles.tape} aria-hidden />
            <p className={styles.pgEye}>{dict.pageEye}</p>
            <h3 className={styles.pgTitle}>
              {dict.pageTitlePre} <em>{dict.pageTitleEm}</em>
            </h3>

            <ul className={styles.notes}>
              {learnings.slice(0, 4).map((l) => (
                <li
                  key={l.tipo}
                  className={`${styles.note} ${styles[l.tipo]}`}
                >
                  <span className={styles.noteLab}>{dict.labels[l.tipo]}</span>
                  <span className={styles.noteText}>{l.texto}</span>
                </li>
              ))}
            </ul>

            <div className={styles.stamp} aria-hidden>
              {dict.stamp}
              <span className={styles.stampBig}>
                {dict.stampBig(editionNumber)}
              </span>
              {fechaLectura ? <div>{fechaLectura}</div> : null}
            </div>
          </div>

          {/* Souvenirs flotando bajo el libro */}
          <div className={styles.souvenirs} aria-hidden>
            {dict.souvenirs.slice(0, 4).map((s, i) => (
              <span key={i} className={styles.souvenir}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CuadernoCierre;
