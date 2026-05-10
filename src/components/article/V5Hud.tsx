"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./V5Hud.module.css";

interface Props {
  /** Slug del artículo, usado como key de localStorage para el progreso. */
  slug: string;
  /** Número de edición — string ya formateado, p.ej. "n.º 020". */
  editionLabel: string;
  /** Selector del id donde apunta el botón "Saltar al final". */
  endTargetId?: string;
}

interface ArticleProgress {
  scrollMax: number;
  checkin: boolean;
  resona: boolean;
  body: boolean;
  exercise: boolean;
  checkout: boolean;
}

const DEFAULT_STATE: ArticleProgress = {
  scrollMax: 0,
  checkin: false,
  resona: false,
  body: false,
  exercise: false,
  checkout: false,
};

/**
 * V5Hud · barra superior gamificada del artículo.
 * - Lee el estado del artículo desde localStorage (clave compartida con
 *   V5MoodCheckpoint, V5BreathingTimer y los checkpoints inline).
 * - Reacciona al evento "egoera-v5-progress" para actualizarse en vivo
 *   cuando otros componentes guardan progreso.
 * - Reacciona al scroll para actualizar la barra de lectura.
 */
export function V5Hud({ slug, editionLabel, endTargetId = "v5-footer" }: Props) {
  const [state, setState] = useState<ArticleProgress>(DEFAULT_STATE);

  useEffect(() => {
    const KEY = `egoera-v5-progress-${slug}`;

    function load(): ArticleProgress {
      if (typeof window === "undefined") return DEFAULT_STATE;
      try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return DEFAULT_STATE;
        const parsed = JSON.parse(raw) as Partial<ArticleProgress>;
        return { ...DEFAULT_STATE, ...parsed };
      } catch {
        return DEFAULT_STATE;
      }
    }

    setState(load());

    function onScroll() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;

      setState((prev) => {
        if (pct <= prev.scrollMax) return prev;
        const next: ArticleProgress = {
          ...prev,
          scrollMax: pct,
          body: pct >= 70 ? true : prev.body,
        };
        try {
          localStorage.setItem(KEY, JSON.stringify(next));
        } catch {
          /* storage lleno o deshabilitado: ignoramos. */
        }
        return next;
      });
    }

    function onProgressEvent(e: Event) {
      const detail = (e as CustomEvent<{ slug: string }>).detail;
      if (detail?.slug && detail.slug !== slug) return;
      setState(load());
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("egoera-v5-progress", onProgressEvent);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("egoera-v5-progress", onProgressEvent);
    };
  }, [slug]);

  const stage = computeStage(state);
  const pct = Math.min(
    100,
    Math.round((stage / 5) * 60 + (state.scrollMax / 100) * 40)
  );

  function handleSkip() {
    if (typeof document === "undefined") return;
    const target = document.getElementById(endTargetId);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <header className={styles.hud} aria-label="Progreso de lectura">
      <Link href="/blog" className={styles.back}>
        <span>◀ Cuaderno</span>
      </Link>

      <div className={styles.progress}>
        <span className={styles.lbl}>progreso · {editionLabel}</span>
        <div className={styles.track} aria-hidden>
          <div className={styles.fill} style={{ width: `${pct}%` }} />
          <div className={styles.marks}>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`${styles.mark} ${n <= stage ? styles.markDone : ""}`}
                data-stage={n}
              />
            ))}
          </div>
        </div>
        <span className={styles.pct}>{pct}%</span>
      </div>

      <div className={styles.stars} aria-hidden>
        <span
          className={`${styles.star} ${state.checkin ? styles.starEarned : ""}`}
          title="Pre-lectura"
        >
          ①
        </span>
        <span
          className={`${styles.star} ${state.resona ? styles.starEarned : ""}`}
          title="Resonancia"
        >
          ②
        </span>
        <span
          className={`${styles.star} ${state.body ? styles.starEarned : ""}`}
          title="Cuerpo del artículo"
        >
          ③
        </span>
        <span
          className={`${styles.star} ${state.exercise ? styles.starEarned : ""}`}
          title="Ejercicio"
        >
          ④
        </span>
        <span
          className={`${styles.star} ${state.checkout ? styles.starEarned : ""}`}
          title="Cierre"
        >
          ⑤
        </span>
      </div>

      <button type="button" className={styles.cta} onClick={handleSkip}>
        Saltar al final ↓
      </button>
    </header>
  );
}

function computeStage(s: ArticleProgress): number {
  let stage = 0;
  if (s.scrollMax >= 30 || s.checkin) stage = Math.max(stage, 1);
  if (s.resona) stage = Math.max(stage, 2);
  if (s.body) stage = Math.max(stage, 3);
  if (s.exercise) stage = Math.max(stage, 4);
  if (s.checkout) stage = 5;
  return stage;
}

export default V5Hud;
