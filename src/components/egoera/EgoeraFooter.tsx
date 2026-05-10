import Link from "next/link";
import styles from "./EgoeraFooter.module.css";

/**
 * EgoeraFooter — pie de página minimal del rediseño editorial.
 * Handle @egoera, año actual y dos enlaces legales (Aviso legal,
 * Privacidad). Cobalto deep + crema, responsive.
 */
export function EgoeraFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.foot}>
      <div className={styles.wrap}>
        <div className={styles.row}>
          <div className={styles.brand}>
            <span className={styles.handle}>@egoera</span>
            <span className={styles.tag}>psicología, despacio</span>
          </div>

          <nav className={styles.links} aria-label="Enlaces legales">
            <Link href="/aviso-legal">Aviso legal</Link>
            <Link href="/privacidad">Privacidad</Link>
            <a
              href="https://www.instagram.com/egoera.psikologia/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </nav>
        </div>

        <div className={styles.year}>
          <span>© {year} · Egoera · Bilbao</span>
          <span>publicado los domingos</span>
        </div>
      </div>
    </footer>
  );
}

export default EgoeraFooter;
