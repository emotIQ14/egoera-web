import Link from "next/link";

import { getCurrentLocale } from "@/i18n/getCurrentLocale";
import { getDictionary } from "@/i18n/getDictionary";

import { LangSwitcher } from "./LangSwitcher";
import styles from "./EgoeraNav.module.css";

export type EgoeraNavActive =
  | "home"
  | "cuaderno"
  | "sobre"
  | "boletin"
  | "manifiesto";

interface Props {
  active?: EgoeraNavActive;
}

/**
 * EgoeraNav — barra superior compartida del rediseño editorial.
 * Cobalto sobre cobalto deep, crema en texto. Aparece en todas las
 * páginas del nuevo diseño (home, cuaderno, sobre, boletin, manifiesto).
 *
 * Server Component: lee el locale activo del request (cookie / header
 * inyectado por middleware) y carga las etiquetas del diccionario.
 * El <LangSwitcher /> es client-only y recibe el locale como prop —
 * así evitamos hidratar mismatches.
 */
export async function EgoeraNav({ active }: Props) {
  const locale = await getCurrentLocale();
  const dict = await getDictionary(locale);

  const NAV_LINKS: { href: string; label: string; key: EgoeraNavActive }[] = [
    { href: "/", label: dict.nav.home, key: "home" },
    { href: "/blog", label: dict.nav.cuaderno, key: "cuaderno" },
    { href: "/sobre-nosotros", label: dict.nav.sobre, key: "sobre" },
    { href: "/boletin", label: dict.nav.boletin, key: "boletin" },
    { href: "/manifiesto", label: dict.nav.manifiesto, key: "manifiesto" },
  ];

  return (
    <nav className={styles.nav} aria-label={dict.nav.ariaPrincipal}>
      <Link href="/" className={styles.badge}>
        <svg
          className={styles.star}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 3 L13.5 10.5 L21 12 L13.5 13.5 L12 21 L10.5 13.5 L3 12 L10.5 10.5 Z" />
        </svg>
        egoera
        <em>· psicología</em>
      </Link>

      <div className={styles.links}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.key}
            href={link.href}
            className={active === link.key ? styles.active : undefined}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className={styles.tools}>
        <LangSwitcher current={locale} ariaLabel={dict.nav.ariaIdiomas} />
        <Link href="/contacto" className={styles.cta}>
          {dict.nav.consulta}
        </Link>
      </div>

      {/* Variante compacta para móvil — los links principales del header
          desaparecen, mostramos un strip horizontal scrollable con todo. */}
      <div className={styles.mobile} aria-hidden="false">
        {NAV_LINKS.map((link) => (
          <Link
            key={`m-${link.key}`}
            href={link.href}
            className={active === link.key ? styles.active : undefined}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default EgoeraNav;
