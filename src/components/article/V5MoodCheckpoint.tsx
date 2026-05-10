"use client";

import { useEffect, useState } from "react";
import styles from "./V5MoodCheckpoint.module.css";

type Variant = "in" | "out";

interface Props {
  /** Slug del artículo — usado para componer la clave de localStorage. */
  slug: string;
  /** Variante: "in" antes de leer, "out" al final. */
  variant: Variant;
}

/** Las 8 emociones del picker. La 7.ª cambia entre "vacía" (in)
 *  y "aliviada" (out) — replicado del template gamified V4. */
const MOODS_IN = [
  "abierta",
  "cansada",
  "ansiosa",
  "triste",
  "enfadada",
  "curiosa",
  "vacía",
  "esperanzada",
] as const;

const MOODS_OUT = [
  "abierta",
  "cansada",
  "ansiosa",
  "triste",
  "enfadada",
  "curiosa",
  "aliviada",
  "esperanzada",
] as const;

/** Mapeo de cada emoción a un valor 0-100 — usado para la barra
 *  comparativa antes/ahora. No es ciencia, es una visualización. */
const MOOD_SCORE: Record<string, number> = {
  abierta: 70,
  cansada: 30,
  ansiosa: 25,
  triste: 22,
  enfadada: 35,
  curiosa: 65,
  vacía: 18,
  esperanzada: 75,
  aliviada: 80,
};

interface StoredProgress {
  scrollMax?: number;
  checkin?: boolean;
  resona?: boolean;
  body?: boolean;
  exercise?: boolean;
  checkout?: boolean;
  moodIn?: string;
  moodOut?: string;
}

/**
 * V5MoodCheckpoint · selector de emoción al entrar/salir del artículo.
 * - Persiste en localStorage compartido con el HUD.
 * - Variante "out": muestra comparativa visual antes/ahora con la
 *   diferencia y un mensaje contextual sin imperativos.
 */
export function V5MoodCheckpoint({ slug, variant }: Props) {
  const [moodIn, setMoodIn] = useState<string | null>(null);
  const [moodOut, setMoodOut] = useState<string | null>(null);

  const KEY = `egoera-v5-progress-${slug}`;
  const moods = variant === "in" ? MOODS_IN : MOODS_OUT;
  const current = variant === "in" ? moodIn : moodOut;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredProgress;
        setMoodIn(parsed.moodIn ?? null);
        setMoodOut(parsed.moodOut ?? null);
      }
    } catch {
      /* ignoramos */
    }
  }, [KEY]);

  function handlePick(value: string) {
    if (variant === "in") setMoodIn(value);
    else setMoodOut(value);

    try {
      const raw = localStorage.getItem(KEY);
      const parsed: StoredProgress = raw ? (JSON.parse(raw) as StoredProgress) : {};
      if (variant === "in") {
        parsed.moodIn = value;
        parsed.checkin = true;
      } else {
        parsed.moodOut = value;
        parsed.checkout = true;
      }
      localStorage.setItem(KEY, JSON.stringify(parsed));
      window.dispatchEvent(
        new CustomEvent("egoera-v5-progress", { detail: { slug } })
      );
    } catch {
      /* ignoramos errores de storage */
    }
  }

  const beforeScore = moodIn ? MOOD_SCORE[moodIn] ?? 50 : 0;
  const afterScore = moodOut ? MOOD_SCORE[moodOut] ?? 50 : 0;
  const delta = afterScore - beforeScore;

  // Mensajes contextuales para la diferencia. Sin imperativos.
  let deltaMsg = "";
  if (moodIn && moodOut) {
    if (delta > 8) deltaMsg = "un poco más <em>ligero/a</em>. está bien.";
    else if (delta < -8)
      deltaMsg = "removida/o. eso también es información.";
    else
      deltaMsg =
        "parecido. a veces leer no cambia el día — solo lo nombra.";
  }

  return (
    <section
      className={styles.mood}
      aria-label={
        variant === "in"
          ? "Antes de leer, ¿cómo llegas?"
          : "Después de leer, ¿cómo te marchas?"
      }
    >
      <div className={styles.intro}>
        {variant === "in" ? (
          <>
            <h3>
              Antes de leer,
              <br />
              <em>¿cómo llegas?</em>
            </h3>
            <p>
              Una palabra basta. Esto no se publica en ningún sitio — es solo
              para que cuando termines, podamos comparar.
            </p>
          </>
        ) : (
          <>
            <h3>
              ¿Y <em>ahora?</em>
            </h3>
            <p>Mismo gesto que al principio. Una palabra basta.</p>
          </>
        )}
      </div>

      <div>
        <div className={styles.picker} role="radiogroup">
          {moods.map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={current === m}
              className={current === m ? styles.active : undefined}
              onClick={() => handlePick(m)}
            >
              {m}
            </button>
          ))}
        </div>

        {variant === "in" ? (
          <div className={styles.confirm}>
            {moodIn ? (
              <>
                llegas <strong>{moodIn}</strong>. anotado.
              </>
            ) : (
              <>— elige una para empezar.</>
            )}
          </div>
        ) : (
          <>
            <div className={styles.compare}>
              <div className={styles.compareRow}>
                <span className={styles.lbl}>Antes</span>
                <div className={styles.bar}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${beforeScore}%` }}
                  />
                </div>
                <span className={styles.val}>{moodIn ?? "—"}</span>
              </div>
              <div className={`${styles.compareRow} ${styles.now}`}>
                <span className={styles.lbl}>Ahora</span>
                <div className={styles.bar}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${afterScore}%` }}
                  />
                </div>
                <span className={styles.val}>{moodOut ?? "—"}</span>
              </div>
            </div>
            {moodIn && moodOut && (
              <div
                className={styles.delta}
                dangerouslySetInnerHTML={{
                  __html: `Diferencia: ${delta >= 0 ? "+" : ""}${delta} · ${deltaMsg}`,
                }}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default V5MoodCheckpoint;
