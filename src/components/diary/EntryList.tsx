"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DiaryEntry } from "./types";

interface Props {
  entries: DiaryEntry[];
  onDelete: (id: string) => void;
}

export function EntryList({ entries, onDelete }: Props) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">📝</p>
        <p className="text-grey-text text-sm">
          Aun no tienes registros. Empieza hoy!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, i) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-border group"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">{entry.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm text-dark-text">
                  {entry.moodLabel}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-grey-text">
                    {formatDate(entry.date)}
                  </span>
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-grey-text hover:text-red-500 transition-all"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {entry.note && (
                <p className="text-sm text-grey-text mt-1 line-clamp-2">
                  {entry.note}
                </p>
              )}
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {entry.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[10px] px-2 py-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {entry.tags.length > 3 && (
                    <span className="text-[10px] text-grey-text">
                      +{entry.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Hoy";
  if (date.toDateString() === yesterday.toDateString()) return "Ayer";

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}
