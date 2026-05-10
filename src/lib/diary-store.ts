"use client";

import { useEffect, useState, useCallback } from "react";

// === FEELING TAXONOMY (matches Egoera's WordPress categories + 8-emotion system) ===
export const FEELINGS = [
  { id: "ansiedad",   name: "ansiedad",   meta: "Alerta",        color: "#1d2bdb", soft: "#a4b1ff" },
  { id: "tristeza",   name: "tristeza",   meta: "Duelo",         color: "#3a4ad8", soft: "#9bb1f5" },
  { id: "apego",      name: "apego",      meta: "Vinculo",       color: "#5b3fc4", soft: "#c5b3f0" },
  { id: "autoestima", name: "autoestima", meta: "Identidad",     color: "#c44a8a", soft: "#f0a8c8" },
  { id: "enfado",     name: "enfado",     meta: "Limite",        color: "#d34a3a", soft: "#f5b3a8" },
  { id: "calma",      name: "calma",      meta: "Regulacion",    color: "#3a9b8c", soft: "#a8e0d2" },
  { id: "soledad",    name: "soledad",    meta: "Introspeccion", color: "#3a6cd2", soft: "#a8c8f0" },
  { id: "culpa",      name: "culpa",      meta: "Verguenza",     color: "#7a4a8c", soft: "#d2a8e0" },
] as const;

export type FeelingId = (typeof FEELINGS)[number]["id"];

// === DIARY ENTRY ===
export interface DiaryEntry {
  id: string;
  /** ISO datetime */
  date: string;
  feelingId: FeelingId;
  /** 1-10 */
  intensity: number;
  /** Free-form note */
  note: string;
  /** Activity tags */
  tags: string[];
  /** Voice memo blob URL (data:audio/...) — local only */
  voiceUrl?: string;
  /** Companion context */
  companions?: ("solo" | "pareja" | "familia" | "amigos" | "compañeros" | "mascotas" | "desconocidos")[];
  /** Where */
  place?: "casa" | "trabajo" | "ciudad" | "naturaleza" | "transito";
  /** Weather */
  weather?: "sol" | "nube" | "lluvia" | "noche";
}

// === HABIT TRACKING ===
export interface Habit {
  id: string;
  label: string;
  icon: string; // Single character glyph or emoji
  target: number; // e.g. 30 (minutes), 5 (glasses)
  unit: string; // "min", "vasos", "min", "veces"
}

export const DEFAULT_HABITS: Habit[] = [
  { id: "meditate", label: "Meditar",   icon: "○", target: 10, unit: "min" },
  { id: "water",    label: "Hidratarme", icon: "≈", target: 6,  unit: "vasos" },
  { id: "walk",     label: "Caminar",   icon: "↗", target: 30, unit: "min" },
  { id: "read",     label: "Leer",      icon: "▤", target: 20, unit: "min" },
  { id: "sleep",    label: "Dormir",    icon: "☾", target: 7,  unit: "h" },
];

export interface HabitLog {
  habitId: string;
  date: string; // YYYY-MM-DD
  value: number;
}

// === SETTINGS ===
export interface DiarySettings {
  name: string;
  /** Check-in frequency */
  checkInsPerDay: 1 | 2 | 3 | 4;
  reminderTimes: string[]; // ["09:00", "21:00"]
  notifications: boolean;
  weeklyReviewDay: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sun
}

export const DEFAULT_SETTINGS: DiarySettings = {
  name: "",
  checkInsPerDay: 2,
  reminderTimes: ["09:00", "21:00"],
  notifications: false,
  weeklyReviewDay: 0,
};

// === LOCALSTORAGE PERSISTENCE ===
const KEY_ENTRIES = "egoera:diary:entries";
const KEY_HABITS  = "egoera:diary:habits";
const KEY_HABIT_LOG = "egoera:diary:habitLog";
const KEY_SETTINGS = "egoera:diary:settings";

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

// === HOOK ===
export function useDiaryStore() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS);
  const [habitLog, setHabitLog] = useState<HabitLog[]>([]);
  const [settings, setSettings] = useState<DiarySettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEntries(load<DiaryEntry[]>(KEY_ENTRIES, []));
    setHabits(load<Habit[]>(KEY_HABITS, DEFAULT_HABITS));
    setHabitLog(load<HabitLog[]>(KEY_HABIT_LOG, []));
    setSettings(load<DiarySettings>(KEY_SETTINGS, DEFAULT_SETTINGS));
    setHydrated(true);
  }, []);

  const addEntry = useCallback((entry: Omit<DiaryEntry, "id">) => {
    setEntries((prev) => {
      const next = [{ ...entry, id: crypto.randomUUID() }, ...prev];
      save(KEY_ENTRIES, next);
      return next;
    });
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      save(KEY_ENTRIES, next);
      return next;
    });
  }, []);

  const logHabit = useCallback((habitId: string, value: number, date?: string) => {
    const d = date ?? new Date().toISOString().slice(0, 10);
    setHabitLog((prev) => {
      const existing = prev.find((h) => h.habitId === habitId && h.date === d);
      const next = existing
        ? prev.map((h) => (h.habitId === habitId && h.date === d ? { ...h, value } : h))
        : [...prev, { habitId, date: d, value }];
      save(KEY_HABIT_LOG, next);
      return next;
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<DiarySettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      save(KEY_SETTINGS, next);
      return next;
    });
  }, []);

  // === DERIVED VALUES ===
  const today = new Date().toISOString().slice(0, 10);
  const todayEntries = entries.filter((e) => e.date.startsWith(today));
  const lastEntry = entries[0];

  // Streak: consecutive days with at least 1 entry, ending today
  const streak = (() => {
    if (entries.length === 0) return 0;
    const days = new Set(entries.map((e) => e.date.slice(0, 10)));
    let s = 0;
    const d = new Date();
    while (true) {
      const key = d.toISOString().slice(0, 10);
      if (days.has(key)) {
        s++;
        d.setDate(d.getDate() - 1);
      } else {
        if (s === 0 && key === today) {
          // No entry today; check yesterday
          d.setDate(d.getDate() - 1);
          continue;
        }
        break;
      }
    }
    return s;
  })();

  // Habits done today out of total tracked
  const habitsDoneToday = habits.filter((h) => {
    const log = habitLog.find((l) => l.habitId === h.id && l.date === today);
    return log && log.value >= h.target;
  }).length;

  return {
    hydrated,
    entries,
    habits,
    habitLog,
    settings,
    todayEntries,
    lastEntry,
    streak,
    habitsDoneToday,
    addEntry,
    removeEntry,
    logHabit,
    updateSettings,
  };
}

export function getFeeling(id: FeelingId) {
  return FEELINGS.find((f) => f.id === id) ?? FEELINGS[0];
}
