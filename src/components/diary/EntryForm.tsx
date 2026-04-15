"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoodSelector } from "./MoodSelector";
import { MOODS, EMOTION_TAGS, ACTIVITIES, type MoodOption, type DiaryEntry } from "./types";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Props {
  onSave: (entry: DiaryEntry) => void;
}

export function EntryForm({ onSave }: Props) {
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState<MoodOption | null>(null);
  const [note, setNote] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleActivity = (activity: string) => {
    setActivities((prev) =>
      prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity]
    );
  };

  const handleSave = () => {
    if (!mood) return;
    const entry: DiaryEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      moodValue: mood.value,
      moodLabel: mood.label,
      emoji: mood.emoji,
      note,
      tags,
      activities,
    };
    onSave(entry);
  };

  return (
    <div className="space-y-6 py-4">
      {/* Step indicator */}
      <div className="flex gap-2 justify-center mb-2">
        {[0, 1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all ${
              s === step ? "w-8 bg-teal" : s < step ? "w-4 bg-teal/40" : "w-4 bg-border"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Mood */}
        {step === 0 && (
          <motion.div
            key="mood"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark-text">
                Como te sientes?
              </h2>
              <p className="text-sm text-grey-text mt-1">
                Selecciona tu estado de animo
              </p>
            </div>

            <MoodSelector selected={mood} onSelect={(m) => { setMood(m); }} />

            {mood && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <p className="text-4xl mb-2">{mood.emoji}</p>
                <p className="text-lg font-semibold text-dark-text">{mood.label}</p>
              </motion.div>
            )}

            <button
              onClick={() => mood && setStep(1)}
              disabled={!mood}
              className="w-full py-3 bg-teal text-white rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal/90 transition-colors"
            >
              Siguiente
            </button>
          </motion.div>
        )}

        {/* Step 1: Emotions */}
        {step === 1 && (
          <motion.div
            key="emotions"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark-text">
                Que emociones sientes?
              </h2>
              <p className="text-sm text-grey-text mt-1">
                Selecciona todas las que apliquen
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {EMOTION_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    tags.includes(tag)
                      ? "bg-teal text-white"
                      : "bg-white text-grey-text border border-border hover:border-teal hover:text-teal"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="flex-1 py-3 border-2 border-border text-grey-text rounded-xl font-medium hover:border-teal hover:text-teal transition-colors"
              >
                Atras
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 bg-teal text-white rounded-xl font-medium hover:bg-teal/90 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Activities */}
        {step === 2 && (
          <motion.div
            key="activities"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark-text">
                Que has hecho hoy?
              </h2>
              <p className="text-sm text-grey-text mt-1">
                Opcional — ayuda a encontrar patrones
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {ACTIVITIES.map((act) => (
                <button
                  key={act.label}
                  onClick={() => toggleActivity(act.label)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${
                    activities.includes(act.label)
                      ? "bg-teal/10 text-teal border-2 border-teal/30"
                      : "bg-white text-grey-text border-2 border-transparent shadow-sm hover:border-teal/20"
                  }`}
                >
                  <span className="text-xl">{act.emoji}</span>
                  {act.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border-2 border-border text-grey-text rounded-xl font-medium hover:border-teal hover:text-teal transition-colors"
              >
                Atras
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-teal text-white rounded-xl font-medium hover:bg-teal/90 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Note + Save */}
        {step === 3 && (
          <motion.div
            key="note"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark-text">
                Quieres añadir algo?
              </h2>
              <p className="text-sm text-grey-text mt-1">
                Escribe lo que necesites. Es solo para ti.
              </p>
            </div>

            <Textarea
              placeholder="Hoy me siento... Algo que quiero recordar es..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-32 rounded-xl resize-none bg-white border-border focus:ring-teal"
            />

            {/* Summary */}
            <div className="bg-white rounded-xl p-4 space-y-3 border border-border">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{mood?.emoji}</span>
                <div>
                  <p className="font-semibold text-dark-text">{mood?.label}</p>
                  <p className="text-xs text-grey-text">
                    {new Date().toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              {activities.length > 0 && (
                <p className="text-xs text-grey-text">
                  Actividades: {activities.join(", ")}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 border-2 border-border text-grey-text rounded-xl font-medium hover:border-teal hover:text-teal transition-colors"
              >
                Atras
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-teal text-white rounded-xl font-medium hover:bg-teal/90 transition-colors"
              >
                Guardar registro
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
