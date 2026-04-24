import type { ReactNode } from "react";

interface Props {
  /** Un nodo React que empezara con una letra estilizada en Fraunces italico. */
  children: ReactNode;
  className?: string;
}

/**
 * Parrafo de entrada con drop cap editorial. Usa la primera letra del
 * primer nodo string como capital decorativa.
 *
 * Pensado para notas en las que NO usamos `prose-egoera` (en prose ya
 * hay un selector ::first-letter que hace lo mismo automaticamente).
 */
export function DropCap({ children, className = "" }: Props) {
  return (
    <p className={`drop-cap-paragraph ${className}`}>
      <style>{`
        .drop-cap-paragraph::first-letter {
          font-family: var(--font-serif, "Fraunces", serif);
          font-style: italic;
          font-weight: 300;
          font-size: 5.2em;
          line-height: 0.85;
          float: left;
          padding-right: 14px;
          padding-top: 6px;
          color: var(--accent);
        }
      `}</style>
      {children}
    </p>
  );
}
