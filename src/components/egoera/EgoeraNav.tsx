import Link from "next/link";

import { getCurrentLocale } from "@/i18n/getCurrentLocale";
import { getDictionary } from "@/i18n/getDictionary";

import { LangSwitcher } from "./LangSwitcher";
import { EgoeraMenu } from "./EgoeraMenu";
import styles from "./EgoeraNav.module.css";

export type EgoeraNavActive =
  | "home"
  | "cuaderno"
  | "sentir"
  | "sobre"
  | "boletin"
  | "manifiesto";

interface Props {
  active?: EgoeraNavActive;
}

/**
 * EgoeraNav — barra superior compartida del rediseño editorial.
 *
 * En desktop muestra la barra de links horizontal con LangSwitcher + CTA.
 * En mobile colapsa a una sola fila (logo + lang + hamburguesa) y delega
 * la navegación al `<EgoeraMenu />`, un drawer pantalla-completa con la
 * lista numerada al estilo del mockup.
 *
 * Server Component: lee el locale activo del request (cookie / header
 * inyectado por middleware) y carga las etiquetas del diccionario.
 * El switcher de idioma y el menú móvil son client-only y reciben los
 * datos como props — así evitamos hidratar mismatches.
 */
export async function EgoeraNav({ active }: Props) {
  const locale = await getCurrentLocale();
  const dict = await getDictionary(locale);

  const NAV_LINKS: {
    href: string;
    label: string;
    key: EgoeraNavActive;
    eyebrow?: string;
  }[] = [
    { href: "/", label: dict.nav.home, key: "home" },
    {
      href: "/blog",
      label: dict.nav.cuaderno,
      key: "cuaderno",
      eyebrow: "cuaderno",
    },
    {
      href: "/sentir",
      label: dict.nav.sentir,
      key: "sentir",
      eyebrow: "brújula",
    },
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
        {/* CTA del nav: ahora apunta al diario emocional (no a
            calendly de consulta). Egoera ya no ofrece consulta
            presencial — el CTA principal es la herramienta. */}
        <a
          href="https://diario.egoera.es"
          className={styles.cta}
          target="_blank"
          rel="noopener noreferrer"
        >
          {dict.nav.consulta}
        </a>
        <EgoeraMenu
          links={NAV_LINKS}
          active={active}
          ctaLabel={dict.nav.consulta}
          ctaHref="https://diario.egoera.es"
          ctaTarget="_blank"
          locale={locale}
          langAriaLabel={dict.nav.ariaIdiomas}
        />
      </div>
    </nav>
  );
}

export default EgoeraNav;
