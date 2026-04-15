"use client";

import { useMemo } from "react";
import { MOODS, type DiaryEntry } from "./types";

interface Props {
  entries: DiaryEntry[];
}

export function StatsView({ entries }: Props) {
  const stats = useMemo(() => {
    if (entries.length === 0) return null;

    const moodCounts = [0, 0, 0, 0, 0];
    const tagCounts: Record<string, number> = {};
    const activityCounts: Record<string, number> = {};
    const last30 = entries.filter(
      (e) => new Date(e.date).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
    );

    entries.forEach((e) => {
      moodCounts[e.moodValue - 1]++;
      e.tags.forEach((t) => (tagCounts[t] = (tagCounts[t] || 0) + 1));
      e.activities.forEach((a) => (activityCounts[a] = (activityCounts[a] || 0) + 1));
    });

    const avgMood = entries.reduce((s, e) => s + e.moodValue, 0) / entries.length;
    const avg30 = last30.length > 0
      ? last30.reduce((s, e) => s + e.moodValue, 0) / last30.length
      : 0;

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topActivities = Object.entries(activityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const maxMoodCount = Math.max(...moodCounts);

    return { moodCounts, avgMood, avg30, topTags, topActivities, maxMoodCount, last30Count: last30.length };
  }, [entries]);

  if (!stats) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">📊</p>
        <p className="text-grey-text">
          Necesitas al menos un registro para ver estadisticas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {/* Overall mood */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
        <h3 className="text-sm font-semibold text-dark-text mb-4">
          Tu estado general
        </h3>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-4xl">{MOODS[Math.round(stats.avgMood) - 1]?.emoji ?? "😐"}</p>
            <p className="text-2xl font-bold text-dark-text mt-1">
              {stats.avgMood.toFixed(1)}
            </p>
            <p className="text-xs text-grey-text">Media global</p>
          </div>
          {stats.avg30 > 0 && (
            <div className="text-center">
              <p className="text-4xl">{MOODS[Math.round(stats.avg30) - 1]?.emoji ?? "😐"}</p>
              <p className="text-2xl font-bold text-dark-text mt-1">
                {stats.avg30.toFixed(1)}
              </p>
              <p className="text-xs text-grey-text">Ultimos 30 dias</p>
            </div>
          )}
        </div>
      </div>

      {/* Mood distribution */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
        <h3 className="text-sm font-semibold text-dark-text mb-4">
          Distribucion de animo
        </h3>
        <div className="space-y-3">
          {MOODS.map((mood, i) => {
            const count = stats.moodCounts[i];
            const pct = stats.maxMoodCount > 0 ? (count / stats.maxMoodCount) * 100 : 0;
            return (
              <div key={mood.value} className="flex items-center gap-3">
                <span className="text-xl w-8 text-center">{mood.emoji}</span>
                <div className="flex-1">
                  <div className="h-6 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: mood.color,
                        minWidth: count > 0 ? "12px" : "0",
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-dark-text w-8 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top emotions */}
      {stats.topTags.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
          <h3 className="text-sm font-semibold text-dark-text mb-4">
            Emociones mas frecuentes
          </h3>
          <div className="space-y-2">
            {stats.topTags.map(([tag, count]) => (
              <div key={tag} className="flex items-center justify-between">
                <span className="text-sm text-dark-text">{tag}</span>
                <span className="text-sm font-medium text-teal">{count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top activities */}
      {stats.topActivities.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
          <h3 className="text-sm font-semibold text-dark-text mb-4">
            Actividades mas registradas
          </h3>
          <div className="space-y-2">
            {stats.topActivities.map(([activity, count]) => (
              <div key={activity} className="flex items-center justify-between">
                <span className="text-sm text-dark-text">{activity}</span>
                <span className="text-sm font-medium text-sage">{count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mood calendar (last 30 days) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
        <h3 className="text-sm font-semibold text-dark-text mb-4">
          Ultimos 30 dias
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 30 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            const entry = entries.find(
              (e) => new Date(e.date).toDateString() === date.toDateString()
            );
            return (
              <div
                key={i}
                className="aspect-square rounded-lg flex items-center justify-center text-sm"
                style={{
                  backgroundColor: entry
                    ? `${MOODS[entry.moodValue - 1]?.color}40`
                    : "#f0f4f2",
                }}
                title={`${date.toLocaleDateString("es-ES")}${entry ? ` - ${entry.moodLabel}` : ""}`}
              >
                {entry ? (
                  <span className="text-base">{entry.emoji}</span>
                ) : (
                  <span className="text-xs text-grey-text/40">{date.getDate()}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
