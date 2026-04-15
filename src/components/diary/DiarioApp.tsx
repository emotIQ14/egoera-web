"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  BarChart3,
  Plus,
  ArrowLeft,
  Calendar,
  TrendingUp,
  Flame,
} from "lucide-react";
import { DiarioHeader } from "./DiarioHeader";
import { MoodSelector } from "./MoodSelector";
import { EntryForm } from "./EntryForm";
import { EntryList } from "./EntryList";
import { StatsView } from "./StatsView";
import type { DiaryEntry } from "./types";

type View = "home" | "new" | "stats";

export function DiarioApp() {
  const [view, setView] = useState<View>("home");
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("egoera-diary");
    if (stored) {
      setEntries(JSON.parse(stored));
    }
  }, []);

  const saveEntry = (entry: DiaryEntry) => {
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem("egoera-diary", JSON.stringify(updated));
    setView("home");
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem("egoera-diary", JSON.stringify(updated));
  };

  const streak = calculateStreak(entries);
  const todayEntry = entries.find(
    (e) => new Date(e.date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="max-w-lg mx-auto min-h-screen flex flex-col">
      {/* App Header */}
      <DiarioHeader view={view} onBack={() => setView("home")} />

      {/* Content */}
      <div className="flex-1 px-4 pb-24">
        <AnimatePresence mode="wait">
          {view === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Welcome / Status Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-dark-text">
                      {getGreeting()}
                    </h2>
                    <p className="text-sm text-grey-text">
                      {todayEntry
                        ? "Ya has registrado como te sientes hoy"
                        : "Como te encuentras hoy?"}
                    </p>
                  </div>
                  {streak > 0 && (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600">
                      <Flame className="w-4 h-4" />
                      <span className="text-sm font-semibold">{streak}</span>
                    </div>
                  )}
                </div>

                {!todayEntry && (
                  <button
                    onClick={() => setView("new")}
                    className="w-full py-3 bg-teal text-white rounded-xl font-medium hover:bg-teal/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Nuevo registro emocional
                  </button>
                )}

                {todayEntry && (
                  <div className="flex items-center gap-3 p-3 bg-teal/5 rounded-xl">
                    <span className="text-3xl">{todayEntry.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-dark-text">
                        {todayEntry.moodLabel}
                      </p>
                      <p className="text-xs text-grey-text line-clamp-1">
                        {todayEntry.note || "Sin nota"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-border">
                  <Calendar className="w-5 h-5 text-teal mx-auto mb-1" />
                  <p className="text-xl font-bold text-dark-text">{entries.length}</p>
                  <p className="text-xs text-grey-text">Registros</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-border">
                  <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-dark-text">{streak}</p>
                  <p className="text-xs text-grey-text">Racha</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-border">
                  <TrendingUp className="w-5 h-5 text-sage mx-auto mb-1" />
                  <p className="text-xl font-bold text-dark-text">
                    {entries.length > 0
                      ? (entries.reduce((sum, e) => sum + e.moodValue, 0) / entries.length).toFixed(1)
                      : "-"}
                  </p>
                  <p className="text-xs text-grey-text">Media</p>
                </div>
              </div>

              {/* Recent entries */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-dark-text">
                    Registros recientes
                  </h3>
                  {entries.length > 5 && (
                    <button
                      onClick={() => setView("stats")}
                      className="text-xs text-teal font-medium"
                    >
                      Ver todo →
                    </button>
                  )}
                </div>
                <EntryList
                  entries={entries.slice(0, 7)}
                  onDelete={deleteEntry}
                />
              </div>
            </motion.div>
          )}

          {view === "new" && (
            <motion.div
              key="new"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <EntryForm onSave={saveEntry} />
            </motion.div>
          )}

          {view === "stats" && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <StatsView entries={entries} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border safe-area-bottom z-50">
        <div className="max-w-lg mx-auto flex items-center justify-around py-2">
          <button
            onClick={() => setView("home")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
              view === "home" ? "text-teal" : "text-grey-text"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-xs font-medium">Diario</span>
          </button>

          <button
            onClick={() => setView("new")}
            className="flex items-center justify-center w-14 h-14 -mt-6 bg-teal text-white rounded-full shadow-lg shadow-teal/30 hover:bg-teal/90 transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>

          <button
            onClick={() => setView("stats")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
              view === "stats" ? "text-teal" : "text-grey-text"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs font-medium">Progreso</span>
          </button>
        </div>
      </nav>

      {/* Floating blog link */}
      <Link
        href="/"
        className="fixed top-4 right-4 z-50 p-2.5 bg-white rounded-full shadow-md border border-border text-grey-text hover:text-teal transition-colors"
        title="Ir al blog"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos dias";
  if (hour < 20) return "Buenas tardes";
  return "Buenas noches";
}

function calculateStreak(entries: DiaryEntry[]): number {
  if (entries.length === 0) return 0;

  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toDateString();

    if (sorted.some((e) => new Date(e.date).toDateString() === dateStr)) {
      streak++;
    } else if (i === 0) {
      continue; // today might not have an entry yet
    } else {
      break;
    }
  }

  return streak;
}
