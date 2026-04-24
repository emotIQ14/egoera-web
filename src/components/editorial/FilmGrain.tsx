/**
 * El grain vive globalmente en `body::before`. Este componente existe
 * por si alguna pagina necesita un overlay adicional con opacidad/tinte
 * propio (cover, hero a pantalla completa, etc.).
 */
interface Props {
  opacity?: number;
  className?: string;
}

export function FilmGrain({ opacity = 0.35, className = "" }: Props) {
  const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95 0 0 0 0 0.94 0 0 0 0 0.9 0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 mix-blend-overlay ${className}`}
      style={{
        backgroundImage: grain,
        opacity,
      }}
    />
  );
}
