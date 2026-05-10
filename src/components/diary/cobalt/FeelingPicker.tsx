"use client";

import { FEELINGS, type FeelingId } from "@/lib/diary-store";

interface FeelingPickerProps {
  selectedId?: FeelingId;
  onSelect: (id: FeelingId) => void;
}

export function FeelingPicker({ selectedId, onSelect }: FeelingPickerProps) {
  return (
    <div className="feel-picker" role="radiogroup" aria-label="Como te sientes">
      {FEELINGS.map((f) => (
        <button
          key={f.id}
          role="radio"
          aria-checked={selectedId === f.id}
          className={`feel-chip ${selectedId === f.id ? "selected" : ""}`}
          onClick={() => onSelect(f.id)}
        >
          <span className="feel-chip-name">
            <em>{f.name}</em>.
          </span>
          <span className="feel-chip-meta">{f.meta}</span>
        </button>
      ))}
    </div>
  );
}
