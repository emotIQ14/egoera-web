/**
 * extract-learnings.ts · extrae automáticamente 4 "post-its" para el
 * bloque CuadernoCierre de cada artículo.
 *
 * El bloque tiene cuatro tipos fijos (mantenidos por design: 4 colores,
 * 4 esquinas, 4 rotaciones predefinidas):
 *
 *   - idea      → washi amarillo  → la afirmación clave del artículo
 *   - cuerpo    → washi verde     → señal somática a observar
 *   - pregunta  → washi azulado   → pregunta para llevarse
 *   - practica  → washi salmón    → acción concreta de 48 h
 *
 * Estrategia de extracción (en cascada, primer match gana):
 *
 *  1. Buscar bloques explícitos en el HTML con marcas que el editor
 *     puede añadir desde WordPress:
 *       <!-- cuaderno-idea: ... -->
 *       <!-- cuaderno-cuerpo: ... -->
 *       <!-- cuaderno-pregunta: ... -->
 *       <!-- cuaderno-practica: ... -->
 *     (estos prevalecen sobre todo lo demás)
 *
 *  2. Buscar la sección final tipo "Para llevarte" / "Llevarte" / "Si
 *     te quedas con algo" / "Te llevas" — si existe, los primeros 4
 *     `<li>` (o `<strong>` iniciales) se mapean a los 4 tipos.
 *
 *  3. Fallback heurístico: del cuerpo del artículo extraemos:
 *       - idea     → primer `<blockquote>` o primer `<p>` con `<strong>`
 *                    cerca del cierre.
 *       - cuerpo   → primera frase que mencione "cuerpo", "respiración",
 *                    "pecho", "tensión", "mandíbula", "estómago".
 *       - pregunta → primera frase que termine en `?` (preferentemente
 *                    cerca del cierre).
 *       - practica → primera frase imperativa con verbos de acción
 *                    ("escribe", "respira", "prueba", "anota", "haz",
 *                    "siéntate", "para", "siente", "nombra", "vuelve a").
 *
 *  4. Si después de todo no hay material, devuelve `null` y el
 *     componente no se renderiza (mejor ausente que vacío).
 *
 * El extractor es PURE FUNCTION: no toca el HTML original, sólo lee
 * cadenas. Se ejecuta server-side dentro de `app/blog/[slug]/page.tsx`.
 */

export type LearningType = "idea" | "cuerpo" | "pregunta" | "practica";

export interface Learning {
  tipo: LearningType;
  texto: string;
}

const LEARNING_TYPES: LearningType[] = ["idea", "cuerpo", "pregunta", "practica"];

const SOMATIC_KEYWORDS = [
  "cuerpo",
  "respiración",
  "respiracion",
  "respira",
  "pecho",
  "tensión",
  "tension",
  "mandíbula",
  "mandibula",
  "estómago",
  "estomago",
  "garganta",
  "hombros",
  "diafragma",
  "pulso",
  "latido",
  "piel",
  "espalda",
  "cuello",
];

const ACTION_VERBS = [
  "escribe",
  "respira",
  "prueba",
  "anota",
  "haz",
  "siéntate",
  "sientate",
  "para",
  "siente",
  "nombra",
  "vuelve a",
  "vuelves a",
  "mira",
  "observa",
  "pregunta",
  "pregúntate",
  "preguntate",
  "elige",
  "ponte",
  "cuenta",
  "respeta",
  "cierra",
  "abre",
  "describe",
  "dibuja",
  "camina",
  "llora",
  "habla",
  "dile",
  "permite",
];

/**
 * Patrones que descartan una frase como "post-it válido": son señal
 * de UI auxiliar (bios, CTAs, formularios, breadcrumbs, etc.) que
 * nunca queremos en el cuaderno.
 */
const EXCLUDE_PATTERNS: RegExp[] = [
  /editor de egoera/i,
  /escribe sobre psicolog[ií]a/i,
  /escribir un comentario/i,
  /descargar la plantilla/i,
  /suscr[íi]bete/i,
  /reservar consulta/i,
  /\bpreguntas\s+frecuentes\b/i,
  /\bfaq[s]?\b/i,
  /\beditorial\b.*\bbilbao\b/i,
  /preguntas frecuentes/i,
  /^este art[íi]culo habla de/i,
  /^en este art[íi]culo/i,
  /^en este post/i,
  /\bsi\s+llevas\s+tiempo\s+as[ií]\b/i,
];

/** Devuelve true si la frase parece UI/CTA/bio y no contenido. */
function looksLikeChrome(s: string): boolean {
  if (!s || s.length < 12) return true;
  for (const p of EXCLUDE_PATTERNS) {
    if (p.test(s)) return true;
  }
  return false;
}

/**
 * Limpia un fragmento de HTML a texto plano, normaliza espacios y
 * recorta a longitud razonable para un post-it (máx ~140 caracteres,
 * sin cortar palabras).
 *
 * Limpiezas extra que neutralizan ruido típico del HTML de WordPress
 * inyectado por plantillas legacy:
 *  - "Egoera · <Categoría>" al final de un blockquote (firma editorial).
 *  - Saltos de línea inyectados como espacios sobrantes.
 *  - Comillas tipográficas mezcladas con HTML entities.
 */
function toPlainText(html: string, maxLen = 140): string {
  if (!html) return "";
  let t = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
  // Strip "Egoera · <Categoría>" o "Egoera · A · B" sello editorial al
  // final de blockquotes. Soporta hasta 4 segmentos separados por ·.
  t = t
    .replace(
      /\s*Egoera\s*·\s*[^·]+(?:\s*·\s*[^·]+){0,3}\s*$/,
      "",
    )
    .trim();
  // Strip un eventual "—" o "–" largo al final si sólo precede al sello.
  t = t.replace(/[\s—–-]+$/, "").trim();
  if (t.length <= maxLen) return t;
  const cut = t.slice(0, maxLen + 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut.slice(0, maxLen)) + "…";
}

/**
 * Paso 1 — marcas explícitas del editor desde WordPress.
 * Soporta tanto comentarios HTML como atributos data-* en cualquier
 * elemento (para los temas que stripear los comentarios HTML).
 */
function extractExplicit(html: string): Partial<Record<LearningType, string>> {
  const out: Partial<Record<LearningType, string>> = {};
  for (const t of LEARNING_TYPES) {
    // Variante comentario: <!-- cuaderno-idea: ... -->
    const cre = new RegExp(
      `<!--\\s*cuaderno-${t}\\s*:\\s*([\\s\\S]*?)\\s*-->`,
      "i",
    );
    const cm = html.match(cre);
    if (cm && cm[1]) {
      out[t] = toPlainText(cm[1]);
      continue;
    }
    // Variante data-attr: <p data-cuaderno-idea>texto</p>
    const dre = new RegExp(
      `data-cuaderno-${t}\\s*(?:=\\s*["'][^"']*["'])?[^>]*>([\\s\\S]*?)<`,
      "i",
    );
    const dm = html.match(dre);
    if (dm && dm[1]) {
      out[t] = toPlainText(dm[1]);
    }
  }
  return out;
}

/**
 * Paso 2 — sección final con 4 ítems.
 * Localiza un H2/H3 cuyo texto contenga "para llevarte", "te llevas",
 * "si te quedas con algo", "lo que te llevas", "claves" y toma los
 * primeros 4 `<li>` de la lista que sigue, mapeándolos por orden a
 * los 4 tipos.
 */
function extractFinalSection(
  html: string,
): Partial<Record<LearningType, string>> | null {
  const headingRe =
    /<h[23][^>]*>\s*((?:[^<]*?)(?:para\s+llevarte|te\s+llevas|si\s+te\s+quedas\s+con\s+algo|lo\s+que\s+te\s+llevas|claves|conclusiones))[^<]*<\/h[23]>([\s\S]*?)(?=<h[23][^>]*>|<\/article>|$)/i;
  const m = html.match(headingRe);
  if (!m) return null;
  const section = m[2];
  const lis = Array.from(section.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi));
  if (lis.length < 1) return null;
  const out: Partial<Record<LearningType, string>> = {};
  for (let i = 0; i < Math.min(4, lis.length); i++) {
    const text = toPlainText(lis[i][1]);
    if (text.length < 6) continue;
    out[LEARNING_TYPES[i]] = text;
  }
  return Object.keys(out).length > 0 ? out : null;
}

/**
 * Paso 3 — extracción heurística sobre el cuerpo entero.
 * Recorre frases ordenadas; intenta llenar los 4 tipos pendientes.
 */
function extractHeuristic(
  html: string,
  alreadyFilled: Set<LearningType>,
): Partial<Record<LearningType, string>> {
  const out: Partial<Record<LearningType, string>> = {};

  // Toda la lista de "frases" del artículo, en orden.
  // - <blockquote> → ideas-cita potenciales
  // - <p> y <li> → frases para troceo
  const blockquotes = Array.from(
    html.matchAll(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi),
  );
  const paragraphs = Array.from(
    html.matchAll(/<(?:p|li)[^>]*>([\s\S]*?)<\/(?:p|li)>/gi),
  );

  // —— idea ——
  if (!alreadyFilled.has("idea")) {
    // 3a. Si hay <blockquote>, primera cita LARGA (no encabezados breves)
    if (blockquotes.length > 0) {
      for (const bq of blockquotes) {
        const text = toPlainText(bq[1]);
        if (text.length >= 20 && text.length <= 200 && !looksLikeChrome(text)) {
          out.idea = text;
          break;
        }
      }
    }
    // 3b. Si no, primer <p> con <strong> destacado
    if (!out.idea) {
      for (const m of paragraphs) {
        const inner = m[1];
        const sm = inner.match(/<strong[^>]*>([\s\S]*?)<\/strong>/i);
        if (sm) {
          const text = toPlainText(sm[1]);
          if (text.length >= 20 && text.length < 200 && !looksLikeChrome(text)) {
            out.idea = text;
            break;
          }
        }
      }
    }
    // 3c. Si todavía no hay, primer <p> con `<em>` destacado (cursivas
    //     editoriales que el editor usa para frases-clave)
    if (!out.idea) {
      for (const m of paragraphs) {
        const inner = m[1];
        const sm = inner.match(/<em[^>]*>([\s\S]*?)<\/em>/i);
        if (sm) {
          const text = toPlainText(sm[1]);
          if (text.length >= 20 && text.length < 200 && !looksLikeChrome(text)) {
            out.idea = text;
            break;
          }
        }
      }
    }
  }

  // —— pregunta —— (primera frase que termine en ?)
  if (!alreadyFilled.has("pregunta")) {
    for (const m of paragraphs) {
      const plain = toPlainText(m[1], 600);
      const sentences = plain.split(/(?<=[.!?…])\s+/);
      for (const s of sentences) {
        if (
          s.endsWith("?") &&
          s.length > 18 &&
          s.length < 160 &&
          !looksLikeChrome(s)
        ) {
          out.pregunta = s;
          break;
        }
      }
      if (out.pregunta) break;
    }
  }

  // —— cuerpo —— (frase que mencione un término somático)
  if (!alreadyFilled.has("cuerpo")) {
    for (const m of paragraphs) {
      const plain = toPlainText(m[1], 600);
      const sentences = plain.split(/(?<=[.!?…])\s+/);
      for (const s of sentences) {
        const lower = s.toLowerCase();
        const hit = SOMATIC_KEYWORDS.some((k) => lower.includes(k));
        if (
          hit &&
          s.length > 18 &&
          s.length < 160 &&
          !looksLikeChrome(s)
        ) {
          out.cuerpo = s;
          break;
        }
      }
      if (out.cuerpo) break;
    }
  }

  // —— practica —— (primera frase imperativa con verbo de acción).
  //
  // Estrategia: dividir los párrafos en dos mitades — primero buscamos
  // en la SEGUNDA mitad (donde habita lo "para llevarte"), y sólo si
  // no encontramos nada caemos a la primera. Evita pillar la primera
  // frase del párrafo intro como "práctica".
  //
  // Filtro fuerte: la frase NO puede empezar con "porque", "cuando",
  // "si", "aunque", "pero" — son explicativas, no imperativas. Tampoco
  // puede llevar "se" justo antes del verbo (es voz pasiva refleja:
  // "se siente útil" no es una práctica que pueda hacer el lector).
  const NON_IMPERATIVE_OPENERS = /^(porque|cuando|si|aunque|pero|y\s|o\s|no\s|nunca|jam[áa]s|tampoco|adem[áa]s|por\s+eso|de\s+hecho|tambi[éeé]n|es\s|son\s|esto\s|eso\s|aqu[ií]\s|all[ií]\s|lo\s|la\s|el\s|las\s|los\s|hay\s|existe)\b/i;
  if (!alreadyFilled.has("practica")) {
    const half = Math.floor(paragraphs.length / 2);
    const secondHalf = paragraphs.slice(half);
    const firstHalf = paragraphs.slice(0, half);
    const order = [...secondHalf, ...firstHalf];
    outer: for (const m of order) {
      const plain = toPlainText(m[1], 600);
      const sentences = plain.split(/(?<=[.!?…])\s+/);
      for (const s of sentences) {
        const lower = s.toLowerCase().trim();
        if (NON_IMPERATIVE_OPENERS.test(lower)) continue;
        const hit = ACTION_VERBS.some((v) => {
          // Verb at start of sentence (imperative position).
          if (lower.startsWith(v + " ")) return true;
          // Verb in middle, but NOT preceded by "se " (reflexive passive).
          const mid = lower.indexOf(" " + v + " ");
          if (mid < 0) return false;
          const before = lower.slice(0, mid + 1).trim();
          if (/\bse$/.test(before)) return false;
          return true;
        });
        if (
          hit &&
          s.length > 14 &&
          s.length < 160 &&
          !looksLikeChrome(s)
        ) {
          out.practica = s;
          break outer;
        }
      }
    }
  }

  return out;
}

/**
 * Punto de entrada. Devuelve un array de 1 a 4 learnings, o null si
 * no hay material suficiente (umbral mínimo: 2 tipos).
 */
export function extractLearnings(html: string): Learning[] | null {
  if (!html || html.length < 200) return null;

  // 1. Explícitos del editor
  const explicit = extractExplicit(html);

  // 2. Sección final
  let merged: Partial<Record<LearningType, string>> = { ...explicit };
  if (Object.keys(merged).length < 4) {
    const final = extractFinalSection(html);
    if (final) {
      for (const t of LEARNING_TYPES) {
        if (!merged[t] && final[t]) merged[t] = final[t];
      }
    }
  }

  // 3. Heurística sobre el cuerpo
  if (Object.keys(merged).length < 4) {
    const filled = new Set<LearningType>(
      Object.keys(merged) as LearningType[],
    );
    const heur = extractHeuristic(html, filled);
    merged = { ...heur, ...merged }; // explicit > heur, pero heur llena huecos
  }

  // 4. Construcción del array en orden canónico
  const learnings: Learning[] = [];
  for (const t of LEARNING_TYPES) {
    const txt = merged[t];
    if (txt && txt.length >= 6) {
      learnings.push({ tipo: t, texto: txt });
    }
  }

  // Umbral mínimo: al menos 2 tipos llenos para que el bloque tenga
  // sentido visual. Si no hay material, mejor no renderizarlo.
  return learnings.length >= 2 ? learnings : null;
}
