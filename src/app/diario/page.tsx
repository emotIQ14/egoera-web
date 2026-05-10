"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useDiaryStore, getFeeling } from "@/lib/diary-store";
import { CalendarStrip } from "@/components/diary/cobalt/CalendarStrip";
import { ProgressCard } from "@/components/diary/cobalt/ProgressCard";
import { HabitItem } from "@/components/diary/cobalt/HabitItem";
import { MoodBlob } from "@/components/diary/cobalt/MoodBlob";
import { Onboarding } from "@/components/diary/cobalt/Onboarding";

export default function DiarioHomePage() {
  const {
    hydrated,
    entries,
    settings,
    streak,
    habits,
    habitLog,
    todayEntries,
    lastEntry,
    habitsDoneToday,
    logHabit,
    updateSettings,
  } = useDiaryStore();
  const [selectedDay, setSelectedDay] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );

  if (!hydrated) {
    return (
      <div style={{ paddingTop: 40, textAlign: "center" }}>
        <p className="serif" style={{ fontSize: 14 }}>Cargando…</p>
      </div>
    );
  }

  // Onboarding: first visit with no name set
  if (!settings.name && entries.length === 0) {
    return <Onboarding onContinue={(name) => updateSettings({ name })} />;
  }

  const daysWithEntries = new Set(entries.map((e) => e.date.slice(0, 10)));
  const dayEntries = entries.filter((e) => e.date.startsWith(selectedDay));

  // Hour-aware greeting
  const hour = new Date().getHours();
  const greet =
    hour < 6 ? "Aún de noche" :
    hour < 12 ? "Buenos días" :
    hour < 18 ? "Buenas tardes" :
    hour < 22 ? "Buenas noches" :
    "Casi madrugada";

  // Weekly check-ins target
  const weeklyTotal = settings.checkInsPerDay * 7;
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  const weeklyDone = entries.filter((e) => new Date(e.date) >= weekStart).length;

  return (
    <>
      <header className="diario-greet">
        <div className="diario-greet-row">
          <div>
            <div className="diario-greet-meta">{greet}</div>
            <h1 className="diario-greet-name">
              Hola, <em>{settings.name || "tú"}</em>.
            </h1>
          </div>
          <div className="diario-avatar" aria-hidden="true" />
        </div>
      </header>

      <div className="diario-eyebrow">Tu mood hoy</div>
      <CalendarStrip
        selected={selectedDay}
        onSelect={setSelectedDay}
        daysWithEntries={daysWithEntries}
      />

      {dayEntries.length === 0 ? (
        <div className="d-card" style={{ textAlign: "center", padding: "30px 20px" }}>
          <MoodBlob size={140} />
          <p
            className="serif"
            style={{ fontSize: 16, lineHeight: 1.45, color: "var(--ink)", margin: "10px 0 18px" }}
          >
            {selectedDay === new Date().toISOString().slice(0, 10)
              ? "Todavía no has registrado nada hoy."
              : "Sin entrada en este día."}
          </p>
          {selectedDay === new Date().toISOString().slice(0, 10) && (
            <Link href="/diario/check-in" className="d-btn d-btn-blue d-btn-lg">
              Hacer check-in →
            </Link>
          )}
        </div>
      ) : (
        <div className="d-card">
          <div className="d-card-eyebrow">{dayEntries.length} {dayEntries.length === 1 ? "registro" : "registros"} · {selectedDay}</div>
          {dayEntries.slice(0, 1).map((e) => {
            const f = getFeeling(e.feelingId);
            return (
              <div key={e.id}>
                <h3 className="d-card-title">
                  <em>{f.name}</em>.{" "}
                  <span style={{ fontSize: 18, fontFamily: "var(--font-mono)", opacity: 0.5 }}>
                    {e.intensity}/10
                  </span>
                </h3>
                {e.note && <p className="serif" style={{ fontSize: 15, lineHeight: 1.55 }}>{e.note}</p>}
              </div>
            );
          })}
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <Link href="/diario/check-in" className="d-btn d-btn-outline">+ Otro check-in</Link>
            <Link href="/diario/historial" className="d-btn d-btn-ghost">Ver historial</Link>
          </div>
        </div>
      )}

      <ProgressCard
        streak={streak}
        habitsDone={habitsDoneToday}
        habitsTotal={habits.length}
        weeklyDone={weeklyDone}
        weeklyTotal={weeklyTotal}
      />

      <div className="d-card">
        <div className="d-card-eyebrow">Hábitos · hoy</div>
        <h2 className="d-card-title">
          Lo de cada <em>día</em>.
        </h2>
        <div style={{ marginTop: 8 }}>
          {habits.map((h) => {
            const today = new Date().toISOString().slice(0, 10);
            const log = habitLog.find((l) => l.habitId === h.id && l.date === today);
            const value = log?.value ?? 0;
            return (
              <HabitItem
                key={h.id}
                habit={h}
                current={value}
                onIncrement={() => logHabit(h.id, value + 1)}
                onDecrement={() => logHabit(h.id, Math.max(0, value - 1))}
              />
            );
          })}
        </div>
      </div>

      {lastEntry && (
        <div className="d-card">
          <div className="d-card-eyebrow">Última entrada</div>
          <p className="serif" style={{ fontSize: 14, lineHeight: 1.5, margin: 0 }}>
            {lastEntry.note ? `"${lastEntry.note.slice(0, 120)}${lastEntry.note.length > 120 ? "…" : ""}"` : "Sin nota."}
          </p>
          <p className="diario-greet-meta" style={{ marginTop: 8 }}>
            {new Date(lastEntry.date).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
      )}
    </>
  );
}
