"use client";

import type { Habit } from "@/lib/diary-store";

interface HabitItemProps {
  habit: Habit;
  current: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function HabitItem({ habit, current, onIncrement, onDecrement }: HabitItemProps) {
  const pct = Math.min(100, (current / habit.target) * 100);
  const done = current >= habit.target;

  return (
    <div className="habit-row">
      <div className="habit-icon" aria-hidden="true">{habit.icon}</div>
      <div className="habit-body">
        <p className="habit-label">{habit.label}</p>
        <div className="habit-progress">
          {current}/{habit.target} {habit.unit}
        </div>
        <div className="habit-bar"><div className="habit-bar-fill" style={{ width: `${pct}%` }} /></div>
      </div>
      <button
        className="habit-action"
        onClick={onDecrement}
        aria-label="Reducir"
        disabled={current === 0}
        style={{ opacity: current === 0 ? 0.4 : 1 }}
      >
        −
      </button>
      <button
        className={`habit-action ${done ? "done" : ""}`}
        onClick={onIncrement}
        aria-label={done ? "Hecho" : "Sumar"}
      >
        {done ? "✓" : "+"}
      </button>
    </div>
  );
}
