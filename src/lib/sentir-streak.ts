/**
 * Egoera — gamificación de la Brújula Emocional ("/sentir").
 *
 * Capa cliente que persiste en localStorage:
 *   - racha de días consecutivos haciendo el check-in
 *   - total de sesiones completadas
 *   - puntos de autoconciencia acumulados
 *   - afinidad por región (qué región sale más en el resultado)
 *
 * Se llama desde el componente cliente (SentirClient) tras completar
 * un mazo. El cálculo es determinista y testeable: separamos la lógica
 * pura (mergeSession, computeStreak) del acceso a localStorage.
 *
 * Filosofía Duolingo, no infantilismo: mensajes calmados, niveles con
 * nombres editoriales, racha visible pero sin culpa si se rompe.
 */

import type { RegionId, SentirResult } from "./sentir-data";

const STORAGE_KEY = "egoera.sentir.v1";
const STREAK_GRACE_HOURS = 36; // tolerancia: si vuelves antes de 36h cuenta.

export interface SentirState {
  /** Versión del schema, por si migramos. */
  version: 1;
  /** Total de mazos completados. */
  totalSessions: number;
  /** Suma de cartas respondidas (incluye skip y no). */
  totalAnswers: number;
  /** Puntos de autoconciencia (10 por sesión + 1 por carta con afinidad). */
  points: number;
  /** Racha en días consecutivos. */
  streak: number;
  /** Mejor racha histórica. */
  bestStreak: number;
  /** ISO timestamp de la última sesión completada. */
  lastSessionAt: string | null;
  /** Suma normalizada por región (los scores acumulados). */
  regionTotals: Record<RegionId, number>;
  /** Última región dominante registrada. */
  lastRegion: RegionId | null;
}

export const EMPTY_STATE: SentirState = {
  version: 1,
  totalSessions: 0,
  totalAnswers: 0,
  points: 0,
  streak: 0,
  bestStreak: 0,
  lastSessionAt: null,
  regionTotals: {
    amygdala: 0,
    prefrontal: 0,
    hippocampus: 0,
    insula: 0,
    accumbens: 0,
    cerebellum: 0,
  },
  lastRegion: null,
};

// ── Niveles editoriales (no Duolingo-infantilismo) ──────────────────

export interface SentirLevel {
  id: string;
  /** Nombre evocativo del nivel. */
  name: string;
  /** Frase corta que define el nivel. */
  tagline: string;
  /** Puntos mínimos para alcanzarlo. */
  threshold: number;
  /** Glifo. */
  glyph: string;
}

export const LEVELS: SentirLevel[] = [
  { id: "petalo", name: "pétalo", tagline: "primera mirada", threshold: 0, glyph: "✦" },
  { id: "brote", name: "brote", tagline: "te asomas a ti", threshold: 25, glyph: "❋" },
  { id: "raiz", name: "raíz", tagline: "ya no te asustas de mirar", threshold: 75, glyph: "◈" },
  { id: "rio", name: "río", tagline: "te dejas pasar", threshold: 160, glyph: "◯" },
  { id: "bosque", name: "bosque", tagline: "te habitas entera", threshold: 300, glyph: "◉" },
  { id: "cuidadora", name: "cuidadora", tagline: "puedes acompañar a otras", threshold: 500, glyph: "✸" },
];

export function levelFor(points: number): {
  current: SentirLevel;
  next: SentirLevel | null;
  /** Progreso 0-1 hacia el próximo nivel. */
  progress: number;
} {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (points >= level.threshold) current = level;
  }
  const next = LEVELS.find((l) => l.threshold > current.threshold && points < l.threshold) ?? null;
  if (!next) return { current, next: null, progress: 1 };
  const range = next.threshold - current.threshold;
  const within = points - current.threshold;
  return { current, next, progress: range > 0 ? within / range : 0 };
}

// ── Pure helpers (testables) ────────────────────────────────────────

/**
 * Decide la nueva racha en función de la última fecha registrada y la
 * fecha actual. Reglas:
 *  - Si nunca se hizo: 1
 *  - Si hace < 36h desde el último: streak + 1 (con cap a 1 si fue HOY).
 *  - Si hace > 36h: reset a 1 (perdiste la racha pero hoy cuenta).
 *
 * "Cap a 1 si fue HOY" significa: hacer el mazo dos veces el mismo día
 * NO incrementa la racha; solo cuenta una vez al día.
 */
export function computeStreak(
  prev: SentirState,
  now: Date = new Date()
): { streak: number; bestStreak: number; isNewDay: boolean } {
  if (!prev.lastSessionAt) {
    return { streak: 1, bestStreak: Math.max(prev.bestStreak, 1), isNewDay: true };
  }
  const last = new Date(prev.lastSessionAt);
  const sameDay = isSameLocalDay(last, now);
  if (sameDay) {
    // No incrementamos racha, no es nuevo día.
    return {
      streak: prev.streak,
      bestStreak: prev.bestStreak,
      isNewDay: false,
    };
  }
  const diffMs = now.getTime() - last.getTime();
  const withinGrace = diffMs <= STREAK_GRACE_HOURS * 60 * 60 * 1000;
  const newStreak = withinGrace ? prev.streak + 1 : 1;
  return {
    streak: newStreak,
    bestStreak: Math.max(prev.bestStreak, newStreak),
    isNewDay: true,
  };
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Calcula los puntos ganados al completar una sesión.
 * - Base: 10 por terminar el mazo
 * - +1 por cada carta a la que se respondió "yes" o "mucho" (afinidad real)
 * - +5 si es nuevo día (mantiene la racha)
 * - +10 si la racha llega a un múltiplo de 7 (premio semanal)
 */
export function pointsEarned(
  yesCount: number,
  isNewDay: boolean,
  newStreak: number
): number {
  let p = 10;
  p += yesCount;
  if (isNewDay) p += 5;
  if (newStreak > 0 && newStreak % 7 === 0) p += 10;
  return p;
}

/**
 * Mergea el resultado de una sesión con el estado previo y devuelve
 * el nuevo estado + un "delta" útil para mostrar feedback en pantalla.
 */
export interface SessionDelta {
  pointsEarned: number;
  isNewDay: boolean;
  newStreak: number;
  hitWeeklyMilestone: boolean;
  unlockedLevel: SentirLevel | null;
}

export function mergeSession(
  prev: SentirState,
  result: SentirResult,
  yesCount: number,
  totalAnswers: number,
  now: Date = new Date()
): { next: SentirState; delta: SessionDelta } {
  const { streak, bestStreak, isNewDay } = computeStreak(prev, now);
  const earned = pointsEarned(yesCount, isNewDay, streak);
  const newPoints = prev.points + earned;

  const prevLevel = levelFor(prev.points).current;
  const nextLevel = levelFor(newPoints).current;
  const unlockedLevel = prevLevel.id !== nextLevel.id ? nextLevel : null;

  // Acumulamos los scores normalizados por región.
  const regionTotals = { ...prev.regionTotals };
  for (const [rid, val] of Object.entries(result.normalized) as [RegionId, number][]) {
    regionTotals[rid] = (regionTotals[rid] ?? 0) + val;
  }

  const next: SentirState = {
    version: 1,
    totalSessions: prev.totalSessions + 1,
    totalAnswers: prev.totalAnswers + totalAnswers,
    points: newPoints,
    streak,
    bestStreak,
    lastSessionAt: now.toISOString(),
    regionTotals,
    lastRegion: result.region.id as RegionId,
  };

  return {
    next,
    delta: {
      pointsEarned: earned,
      isNewDay,
      newStreak: streak,
      hitWeeklyMilestone: isNewDay && streak > 0 && streak % 7 === 0,
      unlockedLevel,
    },
  };
}

// ── localStorage I/O (cliente) ──────────────────────────────────────

export function loadState(): SentirState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<SentirState>;
    if (parsed?.version !== 1) return EMPTY_STATE;
    // Defensa: rellenamos campos que puedan faltar.
    return {
      ...EMPTY_STATE,
      ...parsed,
      regionTotals: {
        ...EMPTY_STATE.regionTotals,
        ...(parsed.regionTotals ?? {}),
      },
    } as SentirState;
  } catch {
    return EMPTY_STATE;
  }
}

export function saveState(state: SentirState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota exceeded o private browsing — silent */
  }
}

export function resetState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* silent */
  }
}

// ── Helper: determinar racha viva (no expirada) ─────────────────────

/**
 * Devuelve la racha "viva" en el momento de mostrarla. Si la última
 * sesión fue hace más de 36h (perdiste la racha pero aún no has hecho
 * una nueva), mostramos 0 — pero no escribimos en localStorage hasta
 * que el usuario haga una nueva sesión.
 */
export function liveStreak(state: SentirState, now: Date = new Date()): number {
  if (!state.lastSessionAt) return 0;
  const last = new Date(state.lastSessionAt);
  if (isSameLocalDay(last, now)) return state.streak;
  const diffMs = now.getTime() - last.getTime();
  const withinGrace = diffMs <= STREAK_GRACE_HOURS * 60 * 60 * 1000;
  return withinGrace ? state.streak : 0;
}
