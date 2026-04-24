/**
 * Egoera — datos compartidos del vlog.
 *
 * Regiones cerebrales (cada "categoria" es un area del cerebro) y
 * sentimientos (estados emocionales seleccionables en la consola).
 *
 * Las regiones funcionan como categorias narrativas: cada post de
 * WordPress se mapea a una region mediante `wordpressSlugs`.
 *
 * Nota: todo el texto va sin tildes para mantener consistencia con el
 * resto del contenido publicado.
 */

export interface BrainRegion {
  /** id estable usado en URLs: /categoria/[id]. */
  id: string;
  /** Nombre narrativo mostrado en la UI (ej. "Miedo & Ansiedad"). */
  name: string;
  /** Nombre anatomico (ej. "Amigdala"). */
  cat: string;
  /** Descripcion editorial de la region. */
  desc: string;
  /** Color primario (gradientes, halos). */
  color: string;
  /** Color secundario para gradientes degradados. */
  c2: string;
  /** Coordenadas % para posicionamiento sobre el mapa del cerebro. */
  x: number;
  y: number;
  /** Meta corta (una linea) para headers. */
  meta: string;
  /** Categorias de WordPress que alimentan esta region. */
  wordpressSlugs: string[];
}

export interface Feeling {
  /** id estable usado en URLs: /sentimiento/[id]. */
  id: string;
  /** Nombre en lowercase que aparece en la consola (ej. "tristeza"). */
  name: string;
  /** Region cerebral asociada (id de BrainRegion). */
  region: string;
  /** Descripcion en una frase. */
  desc: string;
  /** Glifo tipografico del estado. */
  glyph: string;
  /** Meta UI (ej. "04 archivados"). */
  meta: string;
  /** Color principal del sentimiento. */
  c1: string;
  /** Color secundario. */
  c2: string;
  /** Conteo aproximado de articulos. */
  count: number;
  /** Tags relacionados (para chips en la ficha). */
  related: string[];
}

// ── Regiones del cerebro = "categorias" ───────────────────────────────

export const BRAIN_REGIONS: BrainRegion[] = [
  {
    id: "amygdala",
    name: "Miedo & Ansiedad",
    cat: "Amigdala",
    desc: "El radar del peligro. Aqui viven las emociones de alerta, el miedo y la ansiedad que nos mantiene a salvo pero tambien nos paraliza.",
    color: "#e89b7a",
    c2: "#b8501a",
    x: 58,
    y: 62,
    meta: "radar del peligro",
    wordpressSlugs: ["regulacion-emocional"],
  },
  {
    id: "prefrontal",
    name: "Autoconocimiento",
    cat: "Corteza prefrontal",
    desc: "Pensar sobre pensar. El lugar donde se observa el observador, donde aprendemos quienes somos cuando nadie esta mirando.",
    color: "#a8c2b6",
    c2: "#5a7a6e",
    x: 32,
    y: 30,
    meta: "pensar sobre pensar",
    wordpressSlugs: ["autoconocimiento"],
  },
  {
    id: "hippocampus",
    name: "Memoria & Duelo",
    cat: "Hipocampo",
    desc: "Lo que recordamos nos habita. La memoria no es un archivo, es un lugar al que volvemos para seguir entendiendonos.",
    color: "#c9a8b8",
    c2: "#7a5a6a",
    x: 55,
    y: 48,
    meta: "lo que recordamos nos habita",
    wordpressSlugs: ["desmitificacion"],
  },
  {
    id: "insula",
    name: "Cuerpo & Emocion",
    cat: "Insula",
    desc: "El cuerpo que avisa antes que la mente. Interocepcion, sensaciones fisicas y la forma en que la emocion habla en forma de sintoma.",
    color: "#8fa8bf",
    c2: "#3a4a5c",
    x: 42,
    y: 55,
    meta: "el cuerpo primero",
    wordpressSlugs: ["psicologia-cotidiana"],
  },
  {
    id: "accumbens",
    name: "Vinculos & Apego",
    cat: "Nucleo accumbens",
    desc: "La quimica del vinculo. Amor, apego, deseo y todo lo que nos hace volver a donde tal vez no deberiamos quedarnos.",
    color: "#d4b896",
    c2: "#7a6048",
    x: 48,
    y: 68,
    meta: "quimica del vinculo",
    wordpressSlugs: ["relaciones-apego"],
  },
  {
    id: "cerebellum",
    name: "Habitos & Ritmo",
    cat: "Cerebelo",
    desc: "Lo que repetimos nos forma. Rutinas, cuerpo en movimiento y el papel de la regulacion diaria en la salud emocional.",
    color: "#b8a8c9",
    c2: "#5a4a6b",
    x: 70,
    y: 78,
    meta: "lo que repetimos nos forma",
    wordpressSlugs: ["limites-asertividad"],
  },
];

// ── Sentimientos (consola) ────────────────────────────────────────────

export const FEELINGS: Feeling[] = [
  {
    id: "ansiedad",
    name: "ansiedad",
    region: "amygdala",
    desc: "Cuando el pecho se cierra antes que la cabeza entienda por que.",
    glyph: "◌",
    meta: "alerta",
    c1: "#e89b7a",
    c2: "#b8501a",
    count: 8,
    related: ["miedo", "cuerpo", "rumiacion"],
  },
  {
    id: "tristeza",
    name: "tristeza",
    region: "hippocampus",
    desc: "Lo que queda cuando algo se va. Habitar el hueco sin rellenarlo.",
    glyph: "◯",
    meta: "duelo",
    c1: "#8fa8bf",
    c2: "#3a4a5c",
    count: 6,
    related: ["duelo", "memoria", "despedida"],
  },
  {
    id: "apego",
    name: "apego",
    region: "accumbens",
    desc: "Los vinculos que nos sostienen y los que nos atan al mismo tiempo.",
    glyph: "❋",
    meta: "vinculo",
    c1: "#d4b896",
    c2: "#7a6048",
    count: 11,
    related: ["relaciones", "vinculo", "dependencia"],
  },
  {
    id: "autoestima",
    name: "autoestima",
    region: "prefrontal",
    desc: "Como nos miramos cuando nadie mas nos esta mirando.",
    glyph: "◈",
    meta: "identidad",
    c1: "#a8c2b6",
    c2: "#5a7a6e",
    count: 9,
    related: ["identidad", "yo", "valor"],
  },
  {
    id: "enfado",
    name: "enfado",
    region: "amygdala",
    desc: "La frontera que llega tarde. Enfado como aviso de un limite que faltaba.",
    glyph: "◐",
    meta: "limite",
    c1: "#f39237",
    c2: "#b8501a",
    count: 5,
    related: ["limites", "asertividad", "rabia"],
  },
  {
    id: "calma",
    name: "calma",
    region: "cerebellum",
    desc: "Lo que aparece cuando el sistema nervioso deja de empujar.",
    glyph: "✦",
    meta: "regulacion",
    c1: "#b8a8c9",
    c2: "#5a4a6b",
    count: 7,
    related: ["rutina", "cuerpo", "respiracion"],
  },
  {
    id: "soledad",
    name: "soledad",
    region: "prefrontal",
    desc: "Estar con uno mismo sin huir. A veces elegida, a veces no.",
    glyph: "◉",
    meta: "introspeccion",
    c1: "#c9a8b8",
    c2: "#7a5a6a",
    count: 4,
    related: ["silencio", "yo", "companania"],
  },
  {
    id: "culpa",
    name: "culpa",
    region: "insula",
    desc: "El peso de creer que haber hecho algo mal te convierte en algo malo.",
    glyph: "◎",
    meta: "vergueenza",
    c1: "#8fa8bf",
    c2: "#3a4a5c",
    count: 5,
    related: ["vergueenza", "perdon", "yo"],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────

export function getRegionById(id: string): BrainRegion | undefined {
  return BRAIN_REGIONS.find((r) => r.id === id);
}

export function getFeelingById(id: string): Feeling | undefined {
  return FEELINGS.find((f) => f.id === id);
}

export function getRegionByWpSlug(wpSlug: string): BrainRegion | undefined {
  return BRAIN_REGIONS.find((r) => r.wordpressSlugs.includes(wpSlug));
}

/** Mapa WP slug -> region id. Util para categorizar rapido posts. */
export const WP_TO_REGION: Record<string, string> = BRAIN_REGIONS.reduce(
  (acc, region) => {
    for (const slug of region.wordpressSlugs) {
      acc[slug] = region.id;
    }
    return acc;
  },
  {} as Record<string, string>
);
