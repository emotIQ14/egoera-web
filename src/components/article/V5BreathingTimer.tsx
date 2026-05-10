"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./V5BreathingTimer.module.css";

interface Props {
  /** Slug del artículo — para marcar el ejercicio como completado en
   *  el localStorage compartido con el HUD. */
  slug: string;
  /** Total de ciclos del ejercicio. Por defecto 12 (≈ 2-3 minutos). */
  cycles?: number;
}

type Phase = "idle" | "inhale" | "hold" | "exhale";

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
 * V5BreathingTimer · respiración 4-6 guiada.
 * - Inspira 4 s, sostén 1 s, espira 6 s. 12 ciclos por defecto.
 * - Marca state.exercise = true en localStorage al terminar el ciclo
 *   completo y emite "egoera-v5-progress" para que el HUD reaccione.
 * - El círculo central usa transitions CSS que coinciden con cada fase
 *   (la barra de duración está sincronizada con el setTimeout).
 */
export function V5BreathingTimer({ slug, cycles = 12 }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [cycle, setCycle] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runRef = useRef(false);

  useEffect(() => {
    return () => {
      runRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function markExerciseComplete() {
    if (typeof window === "undefined") return;
    const KEY = `egoera-v5-progress-${slug}`;
    try {
      const raw = localStorage.getItem(KEY);
      const parsed: StoredProgress = raw ? (JSON.parse(raw) as StoredProgress) : {};
      parsed.exercise = true;
      localStorage.setItem(KEY, JSON.stringify(parsed));
      window.dispatchEvent(
        new CustomEvent("egoera-v5-progress", { detail: { slug } })
      );
    } catch {
      /* ignoramos errores de storage */
    }
  }

  function tick(currentCycle: number) {
    if (!runRef.current) return;
    if (currentCycle >= cycles) {
      runRef.current = false;
      setRunning(false);
      setPhase("idle");
      markExerciseComplete();
      return;
    }
    setPhase("inhale");
    timerRef.current = setTimeout(() => {
      if (!runRef.current) return;
      setPhase("hold");
      timerRef.current = setTimeout(() => {
        if (!runRef.current) return;
        setPhase("exhale");
        timerRef.current = setTimeout(() => {
          if (!runRef.current) return;
          const next = currentCycle + 1;
          setCycle(next);
          tick(next);
        }, 6000);
      }, 1000);
    }, 4000);
  }

  function handleStart() {
    if (running) return;
    runRef.current = true;
    setRunning(true);
    setCycle(0);
    tick(0);
  }

  function handleStop() {
    runRef.current = false;
    setRunning(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("idle");
  }

  const phaseLabel =
    phase === "inhale"
      ? "inspira"
      : phase === "hold"
        ? "sostén"
        : phase === "exhale"
          ? "espira"
          : "listo";

  const phaseSeconds =
    phase === "inhale" ? "4 s" : phase === "hold" ? "1 s" : phase === "exhale" ? "6 s" : "—";

  return (
    <section className={styles.timer} aria-label="Respiración guiada 4-6">
      <div className={styles.text}>
        <div className={styles.eye}>Ejercicio · respiración 4-6</div>
        <h4>
          Inspira <em>cuatro</em>,
          <br />
          espira <em>seis</em>.
        </h4>
        <p>
          Tres minutos. Cuando vibre el círculo, cambia de fase. Si te cuesta,
          baja a 3-5 — la idea es que el cuerpo recuerde que sabe.
        </p>
        <div className={styles.controls}>
          <button type="button" onClick={handleStart} disabled={running}>
            {running ? "en marcha…" : "▶ empezar"}
          </button>
          <button type="button" className={styles.ghost} onClick={handleStop}>
            cerrar
          </button>
        </div>
      </div>
      <div>
        <div className={styles.vis}>
          <div className={`${styles.circle} ${styles[phase]}`} aria-live="polite">
            <span>{phaseLabel}</span>
            <small>{phaseSeconds}</small>
          </div>
        </div>
        <div className={styles.cycle}>
          ciclo {cycle}/{cycles}
        </div>
      </div>
    </section>
  );
}

export default V5BreathingTimer;
