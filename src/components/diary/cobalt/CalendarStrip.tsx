"use client";

import { useMemo } from "react";

interface CalendarStripProps {
  selected: string; // YYYY-MM-DD
  onSelect: (d: string) => void;
  daysWithEntries?: Set<string>;
}

const DAY_NAMES = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

export function CalendarStrip({ selected, onSelect, daysWithEntries }: CalendarStripProps) {
  const days = useMemo(() => {
    const arr: { iso: string; day: number; dow: number; label: string }[] = [];
    const today = new Date();
    // Show last 14 days, oldest first
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      arr.push({
        iso,
        day: d.getDate(),
        dow: d.getDay(),
        label: DAY_NAMES[d.getDay()],
      });
    }
    return arr;
  }, []);

  return (
    <div className="cal-strip" role="listbox" aria-label="Dias">
      {days.map((d) => {
        const active = d.iso === selected;
        const has = daysWithEntries?.has(d.iso);
        return (
          <button
            key={d.iso}
            role="option"
            aria-selected={active}
            className={`cal-day ${active ? "active" : ""} ${has ? "has-entry" : ""}`}
            onClick={() => onSelect(d.iso)}
          >
            <span className="cal-day-name">{d.label}</span>
            <span className="cal-day-num">{d.day}</span>
          </button>
        );
      })}
    </div>
  );
}
