"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LangSwitcher } from "./LangSwitcher";
import type { Locale } from "@/i18n/locales";
import styles from "./EgoeraMenu.module.css";

export type EgoeraMenuActive =
  | "home"
  | "cuaderno"
  | "sentir"
  | "sobre"
  | "boletin"
  | "manifiesto";

interface MenuLink {
  href: string;
  label: string;
  /** Eyebrow opcional (encima del título) — p.ej. "cuaderno", "brújula". */
  eyebrow?: string;
  key: EgoeraMenuActive;
}

interface Props {
  links: MenuLink[];
  active?: EgoeraMenuActive;
  /** CTA principal del drawer (ej. "Abrir el diario"). */
  ctaLabel: string;
  ctaHref: string;
  ctaTarget?: string;
  /** Locale + label para el LangSwitcher dentro del drawer. */
  locale: Locale;
  langAriaLabel?: string;
  /** Aria label del botón hamburguesa. */
  menuAriaLabel?: string;
  /** Aria label del botón de cerrar. */
  closeAriaLabel?: string;
  /** Tagline editorial bajo el listado ("psicología, despacio"). */
  tagline?: string;
}

/**
 * EgoeraMenu · botón hamburguesa circular + drawer pantalla-completa.
 *
 * Mantiene el header desktop limpio (lo oculta vía CSS en md+) y se
 * convierte en el único punto de entrada al sitio en mobile. El drawer
 * replica el mockup numerado (01 · Inicio, 02 · El cuaderno, …) con
 * una x grande arriba a la derecha, el switcher de idioma y un footer
 * editorial al pie. Bloquea el scroll del body mientras está abierto y
 * cierra con ESC o al cambiar de ruta.
 */
export function EgoeraMenu({
  links,
  active,
  ctaLabel,
  ctaHref,
  ctaTarget,
  locale,
  langAriaLabel,
  menuAriaLabel = "Abrir menú",
  closeAriaLabel = "Cerrar menú",
  tagline = "psicología, despacio",
}: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Cerrar al cambiar de ruta.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Bloquear scroll body y cerrar con ESC mientras está abierto.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label={menuAriaLabel}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span className={styles.bars} aria-hidden>
          <span />
          <span />
          <span />
        </span>
      </button>

      {open && (
        <div
          className={styles.drawer}
          role="dialog"
          aria-modal="true"
          aria-label="Menú principal"
        >
          <div className={styles.drawerInner}>
            <button
              type="button"
              className={styles.close}
              onClick={() => setOpen(false)}
              aria-label={closeAriaLabel}
            >
              <svg viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M6 6 L18 18 M18 6 L6 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <ol className={styles.list}>
              {links.map((link, i) => {
                const isActive = active === link.key;
                return (
                  <li key={link.key} className={styles.item}>
                    <Link
                      href={link.href}
                      className={`${styles.itemLink} ${isActive ? styles.itemActive : ""}`}
                    >
                      <span className={styles.itemMeta}>
                        <span className={styles.itemNum}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {link.eyebrow && (
                          <span className={styles.itemEye}>
                            · {link.eyebrow}
                          </span>
                        )}
                      </span>
                      <span className={styles.itemH}>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>

            <div className={styles.tools}>
              <LangSwitcher current={locale} ariaLabel={langAriaLabel} />
              <a
                href={ctaHref}
                className={styles.cta}
                target={ctaTarget}
                rel={ctaTarget ? "noopener noreferrer" : undefined}
              >
                {ctaLabel}
              </a>
            </div>

            <div className={styles.foot}>
              <span>— egoera · {tagline} —</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EgoeraMenu;
