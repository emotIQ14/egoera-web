/**
 * Utilidades para dividir HTML de WordPress en segmentos insertables.
 * Usadas para intercalar componentes (ads, CTAs) sin romper el markup.
 */

/**
 * Divide el HTML en 3 partes:
 *  - intro: antes del primer <h2>
 *  - middle: desde el primer <h2> hasta el ultimo <h2>
 *  - end: tras el ultimo <h2>
 *
 * Si no hay h2 suficientes, se reparte en 3 bloques por parrafos.
 */
export function splitContentForAds(html: string): {
  intro: string;
  middle: string;
  end: string;
} {
  if (!html) return { intro: "", middle: "", end: "" };

  const h2Pattern = /<h2(\s[^>]*)?>/gi;
  const matches = [...html.matchAll(h2Pattern)].map((m) => m.index ?? 0);

  if (matches.length >= 2) {
    const firstH2 = matches[0];
    const middleH2 = matches[Math.floor(matches.length / 2)];
    return {
      intro: html.slice(0, firstH2),
      middle: html.slice(firstH2, middleH2),
      end: html.slice(middleH2),
    };
  }

  // Fallback: divide por parrafos en 3 bloques
  const pPattern = /<\/p>/gi;
  const pIndices = [...html.matchAll(pPattern)].map(
    (m) => (m.index ?? 0) + m[0].length
  );

  if (pIndices.length >= 3) {
    const third = Math.floor(pIndices.length / 3);
    const twoThirds = Math.floor((pIndices.length * 2) / 3);
    return {
      intro: html.slice(0, pIndices[third]),
      middle: html.slice(pIndices[third], pIndices[twoThirds]),
      end: html.slice(pIndices[twoThirds]),
    };
  }

  return { intro: html, middle: "", end: "" };
}
