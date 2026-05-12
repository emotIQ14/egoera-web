/**
 * article-v6-transform.ts
 * ----------------------------------------------------------------------
 * Utilidades pequeñas para preparar el HTML de WordPress antes de
 * pasarlo a `<ArticleV6 bodyHtml={…} />`.
 *
 * Decisión de arquitectura: NO transformamos el HTML a nodos React.
 * Mantenemos un único `dangerouslySetInnerHTML` en el body y dejamos
 * que el CSS scoped (`ArticleV6.module.css`) haga el trabajo visual
 * para h2/h3/p/blockquote/ul/ol/img/etc.
 *
 * El autor del artículo en WP puede usar markup estándar y, para los
 * bloques especiales, envolver con `<aside class="callout-…">` o
 * `<aside class="pullquote">`. Esos selectores ya están estilizados
 * en el módulo CSS.
 *
 * Lo único que hace esta capa es:
 *   1. Garantizar que cada <h2> tiene un id slug estable, para que el
 *      TOC sticky lateral haga scroll a anclas reales.
 *   2. Devolver el listado de pares { id, label } extraídos.
 * ----------------------------------------------------------------------
 */

export interface TocEntry {
  id: string;
  label: string;
}

export function prepareArticleHtml(html: string): {
  html: string;
  toc: TocEntry[];
} {
  if (!html) return { html: "", toc: [] };

  const toc: TocEntry[] = [];
  const seen = new Set<string>();
  const h2Re = /<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi;

  const next = html.replace(h2Re, (_match, rawAttrs: string, inner: string) => {
    const attrs = rawAttrs || "";
    const text = inner.replace(/<[^>]+>/g, "").trim();
    const existingId = attrs.match(/\bid=["']([^"']+)["']/i)?.[1];
    let id = existingId;
    if (!id) id = makeUniqueSlug(text || `seccion-${toc.length + 1}`, seen);
    else seen.add(id);

    toc.push({ id, label: text });

    const attrsClean = attrs.replace(/\s*id=["'][^"']+["']/i, "");
    return `<h2${attrsClean} id="${id}">${inner}</h2>`;
  });

  return { html: next, toc };
}

function makeUniqueSlug(text: string, seen: Set<string>): string {
  const base =
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60) || "seccion";

  let candidate = base;
  let n = 2;
  while (seen.has(candidate)) {
    candidate = `${base}-${n}`;
    n++;
  }
  seen.add(candidate);
  return candidate;
}
