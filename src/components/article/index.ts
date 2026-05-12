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
export { ArticleV6 } from "./ArticleV6";
export { prepareArticleHtml } from "./article-v6-transform";
export type { TocEntry } from "./article-v6-transform";
export type {
  ArticleV6Step,
  ArticleV6NextSuggestion,
} from "./ArticleV6";
export {
  CuadernoCierre,
  CUADERNO_DICT_ES,
  CUADERNO_DICT_EU,
  CUADERNO_DICT_EN,
} from "./CuadernoCierre";
export type { CuadernoDict } from "./CuadernoCierre";
