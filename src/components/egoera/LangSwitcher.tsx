"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

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
 * LangSwitcher — segmented control ES / EU / EN.
 *
 * Persiste la elección en cookie `NEXT_LOCALE` (1 año, path=/, SameSite=Lax),
 * que luego lee `getCurrentLocale()` y el middleware. Tras setear la
 * cookie, refresca la ruta actual con `router.refresh()` para que el
 * Server Component renderice con el nuevo diccionario.
 *
 * Nota: en routing cookie-based (approach B) no cambiamos la URL —
 * sólo cambia el contenido renderizado. Si se promociona a sub-path
 * routing (approach A) en el futuro, este componente debería navegar
 * con `router.push(prependLocale(pathname, locale))` además de la cookie.
 */
export function LangSwitcher({ current, ariaLabel }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSelect(next: Locale) {
    if (next === current) return;

    // Cookie: 1 año, raíz del sitio, SameSite=Lax (ningún uso cross-site).
    const oneYear = 60 * 60 * 24 * 365;
    document.cookie = `${NEXT_LOCALE_COOKIE}=${next}; Max-Age=${oneYear}; Path=/; SameSite=Lax`;

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div
      className={styles.wrap}
      role="group"
      aria-label={ariaLabel ?? "Change language"}
    >
      {locales.map((l) => {
        const isActive = l === current;
        return (
          <button
            key={l}
            type="button"
            className={`${styles.btn} ${isActive ? styles.active : ""}`}
            onClick={() => handleSelect(l)}
            aria-pressed={isActive}
            aria-label={localeNativeLabels[l]}
            disabled={isPending && !isActive}
          >
            {localeShortLabels[l]}
          </button>
        );
      })}
    </div>
  );
}

export default LangSwitcher;
