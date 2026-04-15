export interface DiaryEntry {
  id: string;
  date: string;
  moodValue: number; // 1-5
  moodLabel: string;
  emoji: string;
  note: string;
  tags: string[];
  activities: string[];
}

export interface MoodOption {
  value: number;
  label: string;
  emoji: string;
  color: string;
}

export const MOODS: MoodOption[] = [
  { value: 1, label: "Muy mal", emoji: "😢", color: "#E57373" },
  { value: 2, label: "Mal", emoji: "😟", color: "#FFB74D" },
  { value: 3, label: "Normal", emoji: "😐", color: "#FFF176" },
  { value: 4, label: "Bien", emoji: "😊", color: "#A8D5C8" },
  { value: 5, label: "Excelente", emoji: "😄", color: "#6BA3BE" },
];

export const EMOTION_TAGS = [
  "Ansiedad", "Tristeza", "Alegria", "Calma", "Frustracion",
  "Gratitud", "Enfado", "Esperanza", "Soledad", "Amor",
  "Estres", "Motivacion", "Culpa", "Orgullo", "Miedo",
];

export const ACTIVITIES = [
  { label: "Trabajo", emoji: "💼" },
  { label: "Ejercicio", emoji: "🏃" },
  { label: "Social", emoji: "👥" },
  { label: "Descanso", emoji: "🛋️" },
  { label: "Naturaleza", emoji: "🌿" },
  { label: "Lectura", emoji: "📚" },
  { label: "Meditacion", emoji: "🧘" },
  { label: "Familia", emoji: "👨‍👩‍👧" },
  { label: "Creatividad", emoji: "🎨" },
  { label: "Estudios", emoji: "📝" },
];
