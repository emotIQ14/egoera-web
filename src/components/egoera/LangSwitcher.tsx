"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import {
  locales,
  localeShortLabels,
  localeNativeLabels,
  NEXT_LOCALE_COOKIE,
  type Locale,
} from "@/i18n/locales";
import styles from "./LangSwitcher.module.css";

interface Props {
  /**
   * Locale activo. Se debe pasar desde el server (page o layout que
   * usa `getCurrentLocale()`), no detectarlo en cliente — así evitamos
   * mismatches de hidratación.
   */
  current: Locale;
  /**
   * Etiqueta accesible del grupo. Se traduce en el componente padre.
   */
  ariaLabel?: string;
}

/**
 * LangSwitcher — disclosure menu (estilo bidaiatzen.com).
 *
 * Un solo botón compacto con el código del idioma actual ("ES"); al
 * activar despliega un pequeño panel con las opciones. Soluciona el
 * colapso del nav en mobile (antes tres pills siempre visibles).
 *
 * Persiste la elección en cookie `NEXT_LOCALE` (1 año, path=/, SameSite=Lax),
 * que lee `getCurrentLocale()` y el middleware. Tras setear la cookie,
 * `router.refresh()` re-renderiza el Server Component con el nuevo
 * diccionario sin cambiar URL.
 */
export function LangSwitcher({ current, ariaLabel }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Cerrar al click fuera o con escape, sin trapping ni overlay.
  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleSelect(next: Locale) {
    setOpen(false);
    if (next === current) return;
    // Cookie: 1 año, raíz del sitio, SameSite=Lax.
    const oneYear = 60 * 60 * 24 * 365;
    document.cookie = `${NEXT_LOCALE_COOKIE}=${next}; Max-Age=${oneYear}; Path=/; SameSite=Lax`;
    startTransition(() => {
      router.refresh();
    });
  }

  const label = ariaLabel ?? "Change language";

  return (
    <div ref={rootRef} className={styles.wrap}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${localeNativeLabels[current]}`}
        disabled={isPending}
      >
        <span className={styles.code}>{localeShortLabels[current]}</span>
        <svg
          className={`${styles.caret} ${open ? styles.caretOpen : ""}`}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden
        >
          <path
            d="M2 4 L5 7 L8 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          className={styles.menu}
          role="listbox"
          aria-label={label}
          tabIndex={-1}
        >
          {locales.map((l) => {
            const isActive = l === current;
            return (
              <li key={l} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={`${styles.option} ${
                    isActive ? styles.optionActive : ""
                  }`}
                  onClick={() => handleSelect(l)}
                >
                  <span className={styles.optionCode}>{localeShortLabels[l]}</span>
                  <span className={styles.optionName}>
                    {localeNativeLabels[l]}
                  </span>
                  {isActive && (
                    <span className={styles.optionCheck} aria-hidden>
                      ✓
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default LangSwitcher;
