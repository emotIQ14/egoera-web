/**
 * Egoera — Brújula Emocional ("/sentir").
 *
 * Catálogo de cartas y ejercicios que alimenta el deck swipeable.
 * Cada carta describe una experiencia interna en primera persona y
 * vota a una o varias regiones cerebrales del sistema editorial
 * (BRAIN_REGIONS en egoera-data.ts). El motor de scoring suma esos
 * votos con el peso del swipe (no = 0, quizá = 1, sí = 2, mucho = 3)
 * y al cerrar el deck devuelve la región dominante, el sentimiento
 * más afín de esa región y un ejercicio para acompañarlo.
 *
 * Notas:
 * - El texto va sin tildes para mantener consistencia con el resto
 *   del contenido editorial (vlog, sentimientos, regiones).
 * - Las cartas están escritas en primera persona, frase corta
 *   tipo "haiku diagnóstico", para que se lean rápido pero peguen.
 */

import { FEELINGS, BRAIN_REGIONS, type Feeling, type BrainRegion } from "./egoera-data";

export type RegionId = BrainRegion["id"];

/** Voto (peso) que un swipe asigna a una región. */
export type SwipeWeight = 0 | 1 | 2 | 3;

/** Tipos de respuesta que el usuario puede dar a una carta. */
export type SwipeAnswer = "no" | "skip" | "yes" | "mucho";

export const SWIPE_WEIGHT: Record<SwipeAnswer, SwipeWeight> = {
  no: 0,
  skip: 1,
  yes: 2,
  mucho: 3,
};

export interface SentirCard {
  /** id estable, util para tests y resume si interrumpe la sesion. */
  id: string;
  /** Frase principal que aparece grande en la carta. */
  prompt: string;
  /** Sub-texto que matiza la frase, en italica. */
  hint: string;
  /** Glifo tipografico (mismo set que FEELINGS para coherencia). */
  glyph: string;
  /** Pesos por region: cuanto vota un "yes" a esta carta a cada region. */
  weights: Partial<Record<RegionId, number>>;
}

/**
 * 14 cartas. El orden está pensado para alternar registros (cuerpo,
 * vinculos, identidad, memoria) y evitar que el deck se sienta
 * monocorde si alguien para a la mitad. La última carta es siempre
 * "estoy bien", una válvula de escape sin culpa.
 */
export const SENTIR_CARDS: SentirCard[] = [
  {
    id: "pecho-cierra",
    prompt: "El pecho se cierra antes de que entienda por qué.",
    hint: "Llega antes la sensación que la palabra.",
    glyph: "◌",
    weights: { amygdala: 1.5, insula: 0.8 },
  },
  {
    id: "vuelvo-misma-persona",
    prompt: "Vuelvo a la misma persona aunque sé que no me hace bien.",
    hint: "Hay vínculos que tiran más que la lógica.",
    glyph: "❋",
    weights: { accumbens: 1.5 },
  },
  {
    id: "no-se-decir-no",
    prompt: "Me cuesta decir que no aunque por dentro grite que sí.",
    hint: "El cuerpo lo sabe; la voz llega tarde.",
    glyph: "◐",
    weights: { cerebellum: 1.2, amygdala: 0.6 },
  },
  {
    id: "alguien-no-termina-irse",
    prompt: "Hay alguien que se fue y no termina de irse.",
    hint: "Lo recordado sigue ocupando lugar.",
    glyph: "◯",
    weights: { hippocampus: 1.5, accumbens: 0.5 },
  },
  {
    id: "fraude",
    prompt: "Me siento un fraude la mayoría de las veces.",
    hint: "Aunque por fuera funcione, por dentro dudo.",
    glyph: "◈",
    weights: { prefrontal: 1.5 },
  },
  {
    id: "cuerpo-cansancio",
    prompt: "Hay un cansancio que no se pasa con dormir.",
    hint: "El cuerpo lleva días intentando avisar.",
    glyph: "◎",
    weights: { insula: 1.3, cerebellum: 0.8 },
  },
  {
    id: "silencio-ruido",
    prompt: "Cuando estoy a solas, el silencio se hace ruido.",
    hint: "Estar contigo se vuelve incómodo.",
    glyph: "◉",
    weights: { prefrontal: 1.2, amygdala: 0.5 },
  },
  {
    id: "enfado-culpa",
    prompt: "Me enfado y luego me siento culpable por enfadarme.",
    hint: "Como si poner un límite te hiciera mala persona.",
    glyph: "◐",
    weights: { amygdala: 1.0, insula: 1.0 },
  },
  {
    id: "no-se-que-quiero",
    prompt: "Ya no sé bien lo que quiero.",
    hint: "Tantas voces dentro que la propia se confunde.",
    glyph: "◈",
    weights: { prefrontal: 1.5 },
  },
  {
    id: "pienso-demasiado",
    prompt: "Pienso demasiado, todo, todo el rato.",
    hint: "La cabeza no se apaga ni para dormir.",
    glyph: "◌",
    weights: { amygdala: 1.0, prefrontal: 1.0 },
  },
  {
    id: "alegria-culpa",
    prompt: "Me cuesta sentir alegría sin que aparezca culpa.",
    hint: "Como si disfrutar tuviera precio.",
    glyph: "◎",
    weights: { insula: 1.2, prefrontal: 0.8 },
  },
  {
    id: "patrones",
    prompt: "Repito patrones aunque ya no los reconozca como míos.",
    hint: "El cuerpo recuerda lo que la mente quiso olvidar.",
    glyph: "❋",
    weights: { cerebellum: 1.0, accumbens: 1.0 },
  },
  {
    id: "necesidad-aprobacion",
    prompt: "Necesito que me digan que está bien lo que siento.",
    hint: "La validación de fuera pesa más que la propia.",
    glyph: "◈",
    weights: { prefrontal: 1.0, accumbens: 1.0 },
  },
  {
    id: "estoy-bien",
    prompt: "Estoy bien, solo quería mirarme un rato.",
    hint: "También es válido pasar a comprobar cómo estás.",
    glyph: "✦",
    weights: { cerebellum: 0.8 },
  },
];

// ── Ejercicios por región ───────────────────────────────────────────

export interface SentirExercise {
  id: string;
  /** Region a la que pertenece. */
  region: RegionId;
  /** Titulo corto, accionable. */
  title: string;
  /** Tiempo estimado (literal). */
  time: string;
  /** Instruccion de 1-2 lineas. */
  body: string;
  /** Categoria interna: respiracion, escritura, cuerpo, vinculo, ritual. */
  kind: "respiracion" | "escritura" | "cuerpo" | "vinculo" | "ritual";
}

export const SENTIR_EXERCISES: SentirExercise[] = [
  // amygdala — miedo & ansiedad
  {
    id: "respiracion-478",
    region: "amygdala",
    title: "Respiración 4-7-8",
    time: "3 min",
    body: "Inhala por la nariz contando hasta 4. Retén el aire 7 segundos. Exhala lentamente por la boca contando hasta 8. Tres ciclos completos.",
    kind: "respiracion",
  },
  {
    id: "anclaje-54321",
    region: "amygdala",
    title: "Anclaje 5-4-3-2-1",
    time: "4 min",
    body: "Cinco cosas que ves, cuatro que tocas, tres que oyes, dos que hueles, una que saboreas. Devuelve el sistema nervioso al presente.",
    kind: "cuerpo",
  },
  {
    id: "cubito-hielo",
    region: "amygdala",
    title: "El cubito de hielo",
    time: "2 min",
    body: "Sostén un cubito de hielo en la mano hasta que el frío sea lo único que ocupe tu cabeza. Atajo somático cuando la rumiación se desborda.",
    kind: "cuerpo",
  },

  // prefrontal — autoconocimiento
  {
    id: "carta-yo-cinco-anos",
    region: "prefrontal",
    title: "Carta al yo de hace cinco años",
    time: "15 min",
    body: "Una hoja, sin pensar. Lo que te hubiera gustado saber entonces. Cuando termines, léela en voz alta. Vas a oírte distinto.",
    kind: "escritura",
  },
  {
    id: "tres-valores-traicion",
    region: "prefrontal",
    title: "Tres valores y una traición",
    time: "10 min",
    body: "Nombra tres valores que te definen y una vez en que los traicionaste sin darte cuenta. No es para flagelarte: es para verlos.",
    kind: "escritura",
  },
  {
    id: "testigo-silencioso",
    region: "prefrontal",
    title: "El testigo silencioso",
    time: "10 min",
    body: "Diez minutos observando tus pensamientos como nubes que pasan. No los persigues, no los empujas. Solo miras de qué color son hoy.",
    kind: "ritual",
  },

  // hippocampus — memoria & duelo
  {
    id: "capsula-recuerdo",
    region: "hippocampus",
    title: "Cápsula del recuerdo",
    time: "20 min",
    body: "Escribe una carta a quien (o a lo que) ya no está. No la enviarás. Lo importante es lo que se ordena dentro mientras escribes.",
    kind: "escritura",
  },
  {
    id: "ritual-despedida",
    region: "hippocampus",
    title: "Ritual de despedida",
    time: "10 min",
    body: "Enciende una vela, di en voz alta lo que no pudiste decir, sopla. El gesto importa más que la palabra exacta.",
    kind: "ritual",
  },
  {
    id: "linea-del-tiempo",
    region: "hippocampus",
    title: "Línea del tiempo del vínculo",
    time: "15 min",
    body: "Dibuja una línea horizontal. Marca los hitos del vínculo (encuentro, primer crisis, ruptura). Pon a cada uno una emoción. Mira el conjunto.",
    kind: "escritura",
  },

  // insula — cuerpo & emoción
  {
    id: "scaneo-corporal",
    region: "insula",
    title: "Escaneo corporal",
    time: "10 min",
    body: "Tumbada o tumbado, recorre el cuerpo desde la coronilla a los pies. No corriges, no juzgas. Solo notas dónde hay tensión y dónde no.",
    kind: "cuerpo",
  },
  {
    id: "tres-sensaciones",
    region: "insula",
    title: "Tres sensaciones, ningún nombre",
    time: "5 min",
    body: "Identifica tres sensaciones físicas ahora mismo, sin etiquetarlas como emociones. Calor, peso, vibración. Antes de la palabra, lo que ocurre.",
    kind: "cuerpo",
  },
  {
    id: "movimiento-minimo",
    region: "insula",
    title: "Movimiento mínimo",
    time: "4 min",
    body: "Pon una canción que te guste. Cierra los ojos. Deja que el cuerpo se mueva como necesite, no como creas que debería. Cuatro minutos.",
    kind: "cuerpo",
  },

  // accumbens — vínculos & apego
  {
    id: "mapa-vinculo",
    region: "accumbens",
    title: "Mapa del vínculo",
    time: "15 min",
    body: "Dibuja un círculo y sitúa dentro a las personas que te sostienen, fuera a las que te tensan. Mira quién está en el borde. Suele decir mucho.",
    kind: "escritura",
  },
  {
    id: "carta-sin-enviar",
    region: "accumbens",
    title: "Carta sin enviar",
    time: "20 min",
    body: "Escribe lo que no le has podido decir. Guárdala 24 horas. Pasado ese tiempo, decides si enviar, romper o conservar. Pero escríbela hoy.",
    kind: "escritura",
  },
  {
    id: "tres-cosas-propias",
    region: "accumbens",
    title: "Tres cosas que te das tú",
    time: "8 min",
    body: "Lista tres formas en que te acompañas sin necesitar a nadie. Si no encuentras tres, escribe una y comprométete a inventar las otras dos esta semana.",
    kind: "ritual",
  },

  // cerebellum — hábitos & ritmo
  {
    id: "micro-rutina",
    region: "cerebellum",
    title: "Micro-rutina de cinco minutos",
    time: "5 min",
    body: "Tres gestos pequeños que harás cada mañana esta semana. Estirar un minuto, beber un vaso de agua, abrir la ventana. Repetidos, importan.",
    kind: "ritual",
  },
  {
    id: "paseo-lento",
    region: "cerebellum",
    title: "Paseo lento",
    time: "10 min",
    body: "Diez minutos al sol, sin móvil, sin objetivo. Caminar despacio. El sistema nervioso lo agradece como pocas cosas.",
    kind: "cuerpo",
  },
  {
    id: "ritual-cierre",
    region: "cerebellum",
    title: "Ritual de cierre del día",
    time: "5 min",
    body: "Tres cosas que solo haces cuando termina el día (apagar la pantalla, anotar lo que sentiste, una respiración larga). Avisas al cuerpo de que puede descansar.",
    kind: "ritual",
  },
];

// ── Motor de scoring ────────────────────────────────────────────────

export interface SwipeRecord {
  cardId: string;
  answer: SwipeAnswer;
}

export interface SentirResult {
  /** Region dominante segun la suma ponderada. */
  region: BrainRegion;
  /** Sentimiento mas afin de la region dominante. */
  feeling: Feeling;
  /** Mapa de score por region (para barra de afinidad). */
  scores: Record<RegionId, number>;
  /** Score normalizado 0-1 por region. */
  normalized: Record<RegionId, number>;
  /** Ejercicio sugerido (rotando por kind para que no salga el mismo). */
  exercise: SentirExercise;
  /** Tres ejercicios alternativos para que pueda elegir. */
  alternatives: SentirExercise[];
}

/**
 * Devuelve el primer Feeling de la region que mas cartas con afinidad
 * positiva ha recibido. Es heuristico pero suficiente para una v1
 * (los FEELINGS estan ordenados por intensidad narrativa).
 */
function pickFeelingForRegion(regionId: RegionId): Feeling {
  const candidates = FEELINGS.filter((f) => f.region === regionId);
  return candidates[0] ?? FEELINGS[0];
}

/**
 * Selecciona un ejercicio de la region. Usa un seed sencillo para que
 * dos sesiones con resultados similares no devuelvan siempre el mismo.
 */
function pickExercise(regionId: RegionId, seed: number): {
  exercise: SentirExercise;
  alternatives: SentirExercise[];
} {
  const pool = SENTIR_EXERCISES.filter((ex) => ex.region === regionId);
  if (pool.length === 0) {
    // Fallback: cualquiera. No deberia ocurrir pero defendemos el render.
    const fallback = SENTIR_EXERCISES[0];
    return { exercise: fallback, alternatives: [] };
  }
  const idx = Math.abs(seed) % pool.length;
  const exercise = pool[idx];
  const alternatives = pool.filter((_, i) => i !== idx);
  return { exercise, alternatives };
}

export function scoreSwipes(records: SwipeRecord[]): SentirResult {
  const cardById = new Map(SENTIR_CARDS.map((c) => [c.id, c]));

  const scores: Record<RegionId, number> = {
    amygdala: 0,
    prefrontal: 0,
    hippocampus: 0,
    insula: 0,
    accumbens: 0,
    cerebellum: 0,
  };

  for (const rec of records) {
    const card = cardById.get(rec.cardId);
    if (!card) continue;
    const weight = SWIPE_WEIGHT[rec.answer];
    if (weight === 0) continue;
    for (const [region, value] of Object.entries(card.weights) as [RegionId, number][]) {
      scores[region] += weight * value;
    }
  }

  // Region dominante. Empate -> primer registro de BRAIN_REGIONS para
  // estabilidad de UX (no quieres saltos aleatorios entre re-renders).
  let topRegionId: RegionId = "prefrontal";
  let topScore = -Infinity;
  for (const region of BRAIN_REGIONS) {
    if (scores[region.id] > topScore) {
      topScore = scores[region.id];
      topRegionId = region.id;
    }
  }
  const region = BRAIN_REGIONS.find((r) => r.id === topRegionId) ?? BRAIN_REGIONS[0];

  // Si todos a 0 (usuario que ha dicho "no" a todo) -> calma/cerebellum.
  const totalSignal = Object.values(scores).reduce((a, b) => a + b, 0);
  const finalRegionId: RegionId = totalSignal === 0 ? "cerebellum" : region.id;
  const finalRegion =
    BRAIN_REGIONS.find((r) => r.id === finalRegionId) ?? region;

  // Normalizamos scores para barras de afinidad en la UI.
  const max = Math.max(1, ...Object.values(scores));
  const normalized = Object.fromEntries(
    BRAIN_REGIONS.map((r) => [r.id, max > 0 ? scores[r.id] / max : 0])
  ) as Record<RegionId, number>;

  const feeling = pickFeelingForRegion(finalRegion.id);

  // Seed: hash simple del orden de respuestas para variar el ejercicio.
  const seed = records.reduce((acc, r, i) => acc + (r.answer.charCodeAt(0) * (i + 1)), 0);
  const { exercise, alternatives } = pickExercise(finalRegion.id, seed);

  return {
    region: finalRegion,
    feeling,
    scores,
    normalized,
    exercise,
    alternatives,
  };
}
