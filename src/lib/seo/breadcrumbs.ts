/**
 * Generador de migas de pan a partir de un pathname.
 *
 * Devuelve la secuencia de items que después se serializan con
 * `breadcrumbSchema()` (de `./schemas`) para JSON-LD, o se renderizan
 * en la UI directamente.
 *
 * Decisiones editoriales:
 *  - El primer item siempre es "Inicio" → "/".
 *  - "/blog" se etiqueta como "Cuaderno" (consistente con el copy del nav).
 *  - Las categorías se etiquetan con su nombre legible cuando lo conocemos
 *    (vía CATEGORIES de `@/lib/blog`); si no, se usa el slug capitalizado.
 *  - El último item de la lista no debe llevar URL de ruptura: aun así
 *    devolvemos la URL canónica para que `breadcrumbSchema()` pueda
 *    construir el ítem completo (Google espera `item` en todos los
 *    elementos excepto opcionalmente el último).
 */

import type { BreadcrumbItem } from "./schemas";
import type { BlogPost } from "@/lib/blog";
import { CATEGORIES } from "@/lib/blog";

/** Mapeo de slugs raíz a nombres legibles para las migas. */
const ROOT_LABELS: Record<string, string> = {
  blog: "Cuaderno",
  categoria: "Categoría",
  sentimiento: "Sentimiento",
  diario: "Diario emocional",
  apoya: "Apoya",
  contacto: "Contacto",
  manifiesto: "Manifiesto",
  "sobre-nosotros": "Sobre nosotros",
  boletin: "Boletín",
  descargas: "Descargas",
  recursos: "Recursos",
  servicios: "Servicios",
  "aviso-legal": "Aviso legal",
  privacidad: "Privacidad",
  cookies: "Cookies",
  cursos: "Cursos",
  tienda: "Tienda",
};

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");
}

function labelFor(segment: string): string {
  return ROOT_LABELS[segment] ?? capitalize(segment);
}

export interface BuildBreadcrumbsOptions {
  /** Post resuelto si la ruta corresponde a un artículo concreto. */
  post?: BlogPost;
  /** Override de etiqueta para el último segmento (si no es post). */
  finalLabel?: string;
}

/**
 * Construye los items de migas para un pathname y, opcionalmente, el post
 * resuelto. Para artículos del blog inserta:
 *   Inicio → Cuaderno → <Categoría> → <Título del artículo>
 */
export function buildBreadcrumbs(
  pathname: string,
  options: BuildBreadcrumbsOptions = {}
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ name: "Inicio", url: "/" }];

  // Caso especial: ruta raíz → solo "Inicio"
  if (!pathname || pathname === "/") return items;

  const segments = pathname.replace(/^\/+/, "").replace(/\/+$/, "").split("/");

  // Caso especial: post del blog
  if (segments[0] === "blog" && segments.length >= 2 && options.post) {
    items.push({ name: "Cuaderno", url: "/blog" });
    if (options.post.category && options.post.categorySlug) {
      items.push({
        name: options.post.category,
        url: `/categoria/${options.post.categorySlug}`,
      });
    }
    items.push({
      name: options.post.title,
      url: `/blog/${options.post.slug}`,
    });
    return items;
  }

  // Caso especial: categoría conocida
  if (segments[0] === "categoria" && segments[1]) {
    items.push({ name: "Cuaderno", url: "/blog" });
    const cat = CATEGORIES[segments[1]];
    items.push({
      name: cat?.name ?? capitalize(segments[1]),
      url: `/categoria/${segments[1]}`,
    });
    return items;
  }

  // Caso genérico: acumula por segmentos
  let acc = "";
  segments.forEach((segment, idx) => {
    acc += `/${segment}`;
    const isLast = idx === segments.length - 1;
    const name =
      isLast && options.finalLabel ? options.finalLabel : labelFor(segment);
    items.push({ name, url: acc });
  });

  return items;
}
