/**
 * <JsonLd /> — Renderiza un bloque <script type="application/ld+json">.
 *
 * Acepta un único objeto JSON-LD o un array de objetos. Cuando se pasan
 * varios, se serializan como un array (Google los acepta así).
 *
 * Es un Server Component puro: sin estado, sin efectos. Se puede incluir
 * en cualquier page o layout. No depende del DOM, por lo que no necesita
 * "use client".
 */

import type { JsonLdObject } from "@/lib/seo/schemas";

export interface JsonLdProps {
  data: JsonLdObject | JsonLdObject[];
  /** id opcional para deduplicar bloques en una misma página. */
  id?: string;
}

export function JsonLd({ data, id }: JsonLdProps) {
  // Eliminamos `</` por seguridad básica frente a inyección — las cadenas
  // serializadas no deberían contener este patrón en condiciones normales,
  // pero el escapado evita romper el cierre del <script>.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
