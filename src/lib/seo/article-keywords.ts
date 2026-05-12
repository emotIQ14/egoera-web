/**
 * article-keywords.ts
 * ---------------------------------------------------------------
 * Mapa curado de palabras clave por artículo del vlog de egoera.es.
 *
 * Cada slug se asocia con:
 *   - keywords: array de 8-15 términos (palabra clave principal + sinónimos
 *     + long-tail + intenciones de búsqueda) usado en `<meta keywords>`,
 *     en el JSON-LD `keywords` del Article schema y en OpenGraph `tags`.
 *   - seoTitle: título optimizado ≤ 60 caracteres, con la palabra clave
 *     principal al inicio. Sustituye el título editorial cuando se renderiza
 *     `<title>` en el navegador.
 *   - seoDescription: meta description ≤ 158 caracteres con palabra clave
 *     + propuesta de valor + CTA implícita.
 *
 * Rationale:
 *  - Construido a partir del slug + título + categoría + intención clínica
 *    de cada artículo (no scraping de Google Trends).
 *  - Cubre tres capas: head (búsqueda principal genérica), torso (long-tail
 *    informacional) y cola (intención específica: "cómo…", "qué es…",
 *    "ejercicios…", "técnicas…", "ejemplos…").
 *  - Los slugs `<tema>-2026-w<NN>` son versiones semanales (editorial)
 *    sobre el mismo tema que ya tiene una versión "siempre verde" con
 *    slug semántico. Comparten cluster de keywords para reforzar el silo
 *    temático pero diferencian el long-tail.
 *
 * Si un slug no aparece aquí, los helpers del page.tsx caen a defaults
 * razonables (categoría + "psicología" + título) sin romper el build.
 * ---------------------------------------------------------------
 */

export interface ArticleSeo {
  /** Palabras clave para `<meta keywords>`, JSON-LD y OG tags. */
  keywords: string[];
  /** Título optimizado SEO (≤ 60 chars). */
  seoTitle: string;
  /** Meta description optimizada (≤ 158 chars). */
  seoDescription: string;
}

export const ARTICLE_KEYWORDS: Record<string, ArticleSeo> = {
  // ── Autoconocimiento ─────────────────────────────────────────
  "rumiacion-4-pasos-cortar-bucle": {
    keywords: [
      "rumiación mental",
      "cómo cortar la rumiación",
      "pensamientos repetitivos",
      "ansiedad y rumiación",
      "técnicas contra la rumiación",
      "rumiación psicología",
      "qué es la rumiación",
      "rumiación TCC",
      "ejercicios para dejar de rumiar",
      "bucle mental",
      "pensar demasiado",
      "rumiación cognitiva",
      "parar pensamientos intrusivos",
    ],
    seoTitle: "Rumiación: cómo cortar el bucle mental en 4 pasos",
    seoDescription:
      "Rumiación mental: 4 pasos prácticos para cortar el bucle de pensamiento. Etiquetar, redirigir y volver al presente. Guía clínica de Egoera.",
  },
  "rumiacion-mental-pensar-demasiado": {
    keywords: [
      "rumiación mental",
      "pensar demasiado",
      "no parar de pensar",
      "rumiación ansiosa",
      "técnicas para dejar de pensar",
      "overthinking",
      "rumiación depresiva",
      "rumiación obsesiva",
      "cómo dejar de rumiar",
      "psicología rumiación",
      "rumiación y ansiedad",
      "ejercicios mindfulness rumiación",
    ],
    seoTitle: "Rumiación mental: cuando no puedes parar de pensar",
    seoDescription:
      "Si tu cabeza da vueltas a lo mismo, tienes rumiación mental. Por qué ocurre y 5 técnicas validadas para frenar el bucle. Análisis clínico Egoera.",
  },
  "critico-interno-bajar-voz": {
    keywords: [
      "crítico interno",
      "voz interior negativa",
      "autocrítica destructiva",
      "diálogo interno",
      "cómo bajar el crítico interno",
      "voz que me juzga",
      "psicología crítico interno",
      "autoestima crítico interno",
      "ejercicios crítico interno",
      "schema therapy",
      "self-compassion",
      "voz prestada",
    ],
    seoTitle: "Crítico interno: cómo bajar la voz que te juzga",
    seoDescription:
      "El crítico interno tiene biografía. Aprende a nombrarlo, distinguirlo de ti y bajarle el volumen sin discutir. Guía paso a paso de Egoera Psicología.",
  },
  "critico-interno-2026-w18": {
    keywords: [
      "crítico interno",
      "voz interior",
      "autocrítica",
      "diálogo interno destructivo",
      "cómo gestionar el crítico interno",
      "voz que te juzga",
      "psicología crítico interno",
      "self-talk negativo",
      "schema therapy",
      "voz prestada padres",
      "introyectos",
    ],
    seoTitle: "El crítico interno: la voz que te habla desde dentro",
    seoDescription:
      "La voz que te juzga por dentro tiene biografía. Cómo nombrarla, distinguirla de ti y bajarle el volumen sin discutir. Egoera, edición W18.",
  },
  "critico-interno-2026-w19": {
    keywords: [
      "crítico interno",
      "voz interior negativa",
      "autocrítica",
      "diálogo interno",
      "cómo callar al crítico interno",
      "voz prestada",
      "psicología crítico interno",
      "introyectos parentales",
      "schema therapy",
      "self-compassion",
    ],
    seoTitle: "La voz que te habla desde dentro: el crítico interno",
    seoDescription:
      "Tu crítico interno tiene voz prestada. Devuélvela. Cómo identificar de quién es esa voz y dejar de obedecerla. Egoera, edición W19.",
  },
  "autoestima-baja-senales-causas": {
    keywords: [
      "autoestima baja",
      "señales de autoestima baja",
      "causas autoestima baja",
      "cómo trabajar la autoestima",
      "autoestima psicología",
      "subir la autoestima",
      "autoestima en adultos",
      "test autoestima",
      "autoestima y autocrítica",
      "autoestima sana",
      "ejercicios autoestima",
      "terapia autoestima",
    ],
    seoTitle: "Autoestima baja: señales, causas y cómo trabajarla",
    seoDescription:
      "Autoestima baja: señales que pasan desapercibidas, causas profundas y por qué la autoayuda barata no funciona. Cómo trabajarla en terapia.",
  },

  // ── Regulación Emocional ─────────────────────────────────────
  "duelo-desautorizado-no-reconocido": {
    keywords: [
      "duelo desautorizado",
      "duelo no reconocido",
      "tipos de duelo",
      "duelo por mascota",
      "duelo por aborto",
      "duelo por ruptura",
      "duelo por suicidio",
      "cómo afrontar un duelo",
      "duelo psicología",
      "duelo Kenneth Doka",
      "duelo invisible",
      "elaborar un duelo",
    ],
    seoTitle: "Duelo desautorizado: ejemplos y cómo afrontarlo",
    seoDescription:
      "Duelo desautorizado: cuando pierdes y nadie lo reconoce. Ejemplos reales (mascotas, abortos, rupturas) y cómo elaborarlo. Guía Egoera.",
  },
  "ataques-de-panico-como-pararlos": {
    keywords: [
      "ataques de pánico",
      "cómo parar un ataque de pánico",
      "síntomas ataque de pánico",
      "ataque de ansiedad",
      "qué hacer en un ataque de pánico",
      "técnicas para ataques de pánico",
      "respiración ataque de pánico",
      "ataque de pánico nocturno",
      "diferencia pánico y ansiedad",
      "ataque de pánico psicología",
      "trastorno de pánico",
      "ejercicios ataque de pánico",
    ],
    seoTitle: "Ataques de pánico: qué son y cómo pararlos",
    seoDescription:
      "Un ataque de pánico no es un infarto. Qué le ocurre a tu cuerpo, por qué y 3 técnicas validadas para pararlo en minutos. Guía clínica Egoera.",
  },
  "sintomas-ansiedad-que-no-sabias": {
    keywords: [
      "síntomas de ansiedad",
      "ansiedad somática",
      "ansiedad física",
      "ansiedad disfrazada",
      "ansiedad cuerpo",
      "ansiedad psicología",
      "señales de ansiedad",
      "ansiedad oculta",
      "tipos de ansiedad",
      "cómo saber si tengo ansiedad",
      "ansiedad sin diagnosticar",
      "ansiedad invisible",
    ],
    seoTitle: "Ansiedad: 7 síntomas que no sabías que eran ansiedad",
    seoDescription:
      "La ansiedad no siempre parece ansiedad. 7 síntomas físicos y mentales que la mayoría no identifica y por qué pasan desapercibidos. Egoera.",
  },

  // ── Psicología Cotidiana (insomnio) ──────────────────────────
  "insomnio-ansiedad-no-puedo-dormir": {
    keywords: [
      "insomnio ansiedad",
      "no puedo dormir",
      "ansiedad por la noche",
      "insomnio crónico",
      "técnicas para dormir",
      "despertar de madrugada",
      "insomnio psicología",
      "insomnio sin pastillas",
      "higiene del sueño",
      "ansiedad nocturna",
      "rumiación nocturna",
      "trastorno del sueño",
      "cómo dormir mejor",
    ],
    seoTitle: "Insomnio y ansiedad: por qué no puedes dormir y qué hacer",
    seoDescription:
      "La ansiedad te despierta a las 4 AM y no te deja volver a dormir. Por qué ocurre y qué técnicas funcionan sin pastillas. Guía Egoera.",
  },
  "insomnio-ansiedad-2026-w18": {
    keywords: [
      "insomnio ansiedad",
      "despertar a las 5",
      "cortisol matutino",
      "rumiación nocturna",
      "insomnio matutino",
      "ansiedad de madrugada",
      "no poder volver a dormir",
      "insomnio psicología",
      "trastornos del sueño",
      "ansiedad nocturna",
    ],
    seoTitle: "Insomnio y ansiedad: el despertar de las 5 AM",
    seoDescription:
      "El despertar a las 5 con la frase de ayer no es casualidad: es cortisol y rumiación. Por qué pasa y qué hacer al instante. Egoera, edición W18.",
  },
  "insomnio-ansiedad-2026-w19": {
    keywords: [
      "insomnio ansiedad",
      "despertar a las 5",
      "insomnio matutino",
      "rumiación nocturna",
      "cortisol y ansiedad",
      "ansiedad de madrugada",
      "no poder dormir",
      "trastornos del sueño",
      "ansiedad psicología",
      "higiene del sueño",
    ],
    seoTitle: "Insomnio: el que se despierta a las 5 con la frase de ayer",
    seoDescription:
      "El insomnio ansioso es el cuerpo recordándote lo que de día callas. Por qué pasa y cómo cortar el bucle nocturno. Egoera, edición W19.",
  },

  // ── Relaciones y Apego ───────────────────────────────────────
  "como-superar-apego-ansioso": {
    keywords: [
      "apego ansioso",
      "cómo superar el apego ansioso",
      "estilos de apego",
      "apego ansioso en relaciones",
      "apego ansioso pareja",
      "test apego ansioso",
      "apego ansioso psicología",
      "miedo al abandono",
      "celos apego ansioso",
      "apego ansioso adulto",
      "Bowlby apego",
      "tratamiento apego ansioso",
      "apego seguro",
    ],
    seoTitle: "Cómo superar el apego ansioso en 5 pasos (guía práctica)",
    seoDescription:
      "Si revisas el móvil 40 veces y temes el abandono, tienes apego ansioso. Guía clínica de 5 pasos para reescribirlo hacia un apego seguro.",
  },
  "dependencia-emocional-10-signos": {
    keywords: [
      "dependencia emocional",
      "signos de dependencia emocional",
      "salir de la dependencia emocional",
      "dependencia afectiva",
      "dependencia emocional pareja",
      "test dependencia emocional",
      "dependencia emocional psicología",
      "amor o dependencia",
      "codependencia",
      "dependencia emocional síntomas",
      "tratamiento dependencia emocional",
      "miedo a la soledad",
    ],
    seoTitle: "Dependencia emocional: 10 signos y cómo salir",
    seoDescription:
      "No es amor, es dependencia emocional. Reconoce los 10 signos más claros, entiende su origen y empieza a salir con esta guía clínica de Egoera.",
  },
  "comunicacion-no-violenta-4-pasos": {
    keywords: [
      "comunicación no violenta",
      "CNV Marshall Rosenberg",
      "comunicación no violenta ejemplos",
      "los 4 pasos de la CNV",
      "comunicación asertiva",
      "comunicación en pareja",
      "expresar sin culpar",
      "comunicación no violenta familia",
      "observación sentimiento necesidad petición",
      "comunicación efectiva pareja",
      "CNV trabajo",
      "límites con comunicación",
    ],
    seoTitle: "Comunicación No Violenta: los 4 pasos con ejemplos",
    seoDescription:
      "CNV en 4 pasos: observación, sentimiento, necesidad, petición. Ejemplos prácticos para parejas, familia y trabajo. Sin culpar, sin callar.",
  },
  "comunicacion-no-violenta-2026-w19": {
    keywords: [
      "comunicación no violenta",
      "CNV en pareja",
      "el que se calla y explota",
      "comunicar sin atacar",
      "asertividad",
      "comunicación no violenta ejemplos",
      "Marshall Rosenberg",
      "los 4 pasos CNV",
      "comunicación efectiva",
      "discusiones de pareja",
    ],
    seoTitle: "El que se calla, después explota · CNV",
    seoDescription:
      "La comunicación no violenta no es ser blando. Es decir lo que pasa con tanta precisión que el otro no puede esquivarlo. Egoera, edición W19.",
  },
  "falsa-victima-2026-w18": {
    keywords: [
      "falsa víctima",
      "victimismo",
      "el que siempre sufre más",
      "victimismo psicológico",
      "manipulación emocional",
      "rol de víctima",
      "personalidad victimista",
      "cómo lidiar con un victimista",
      "victimismo crónico",
      "psicología victimismo",
      "triángulo de Karpman",
    ],
    seoTitle: "La falsa víctima: el que siempre sufre más",
    seoDescription:
      "El patrón del que siempre sufre más: cómo se sostiene, qué necesidad cubre y cómo dejar de alimentarlo sin entrar en conflicto. Egoera W18.",
  },

  // ── Límites y Asertividad ────────────────────────────────────
  "como-dejar-de-complacer": {
    keywords: [
      "síndrome del complaciente",
      "cómo dejar de complacer",
      "people pleaser español",
      "decir no sin culpa",
      "poner límites",
      "asertividad",
      "complaciente psicología",
      "miedo a decepcionar",
      "agradar a los demás",
      "personalidad complaciente",
      "fawn response",
      "ejercicios para poner límites",
    ],
    seoTitle: "Cómo dejar de complacer (síndrome del complaciente)",
    seoDescription:
      "Síndrome del complaciente: cómo dejar de decir sí cuando quieres decir no. 5 estrategias prácticas para poner límites sin culpa. Egoera.",
  },

  // ── Desmitificación ──────────────────────────────────────────
  "trauma-complejo-cptsd-sintomas": {
    keywords: [
      "trauma complejo",
      "CPTSD",
      "síntomas CPTSD",
      "trauma complejo síntomas",
      "diferencia TEPT y CPTSD",
      "trauma infantil",
      "CPTSD OMS",
      "trauma del desarrollo",
      "cómo reconocer trauma complejo",
      "CPTSD tratamiento",
      "trauma complejo adulto",
      "disregulación emocional CPTSD",
      "Pete Walker",
    ],
    seoTitle: "Trauma complejo (CPTSD): síntomas y cómo reconocerlo",
    seoDescription:
      "CPTSD: trauma complejo. Síntomas, diferencias con TEPT, cómo se manifiesta y cuándo buscar ayuda. Reconocido por la OMS. Guía clínica Egoera.",
  },
};

/**
 * Devuelve el SEO curado para un slug, o un fallback razonable si el slug
 * no está catalogado todavía. No bloquea el build: garantizamos siempre
 * keywords + title + description válidos.
 */
export function getArticleSeo(input: {
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
}): ArticleSeo {
  const curated = ARTICLE_KEYWORDS[input.slug];
  if (curated) return curated;

  // Fallback inteligente: deriva keywords desde categoría + título.
  const baseKeywords = [
    input.category ?? "psicología",
    "psicología",
    "salud mental",
    "Egoera",
  ];
  return {
    keywords: baseKeywords,
    seoTitle: truncate(input.title, 60),
    seoDescription: truncate(input.excerpt || input.title, 158),
  };
}

function truncate(value: string, max: number): string {
  if (!value) return value;
  if (value.length <= max) return value;
  return value.slice(0, max - 1).trimEnd() + "…";
}
