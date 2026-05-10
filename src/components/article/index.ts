/**
 * Barrel exports — V5 article module.
 *
 * Uso típico desde una ruta:
 *
 *   import { V5ArticleShell } from "@/components/article";
 *
 * El shell ya monta internamente V5Hud, V5MoodCheckpoint, V5Schema
 * y V5BreathingTimer. Solo se exportan los demás componentes por si
 * algún día se quieren reutilizar fuera del shell.
 */
export { V5ArticleShell } from "./V5ArticleShell";
export { V5Hud } from "./V5Hud";
export { V5MoodCheckpoint } from "./V5MoodCheckpoint";
export { V5BreathingTimer } from "./V5BreathingTimer";
export { V5Schema } from "./V5Schema";
