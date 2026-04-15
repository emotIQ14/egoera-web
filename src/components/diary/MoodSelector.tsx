"use client";

import { motion } from "framer-motion";
import { MOODS, type MoodOption } from "./types";

interface Props {
  selected: MoodOption | null;
  onSelect: (mood: MoodOption) => void;
}

export function MoodSelector({ selected, onSelect }: Props) {
  return (
    <div className="flex justify-center gap-4 sm:gap-6">
      {MOODS.map((mood) => {
        const isSelected = selected?.value === mood.value;
        return (
          <button
            key={mood.value}
            onClick={() => onSelect(mood)}
            className="flex flex-col items-center gap-2 group"
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-all emoji-btn ${
                isSelected ? "selected shadow-lg" : "bg-white shadow-sm"
              }`}
              style={
                isSelected
                  ? { backgroundColor: `${mood.color}30`, boxShadow: `0 0 0 3px ${mood.color}60` }
                  : undefined
              }
            >
              {mood.emoji}
            </motion.div>
            <span
              className={`text-xs font-medium transition-colors ${
                isSelected ? "text-dark-text" : "text-grey-text group-hover:text-dark-text"
              }`}
            >
              {mood.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
