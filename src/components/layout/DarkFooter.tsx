"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BRAIN_REGIONS } from "@/lib/egoera-data";

export function DarkFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/diario")) return null;

  return (
    <footer
      className="border-t"
      style={{
        background: "var(--bg-2)",
        borderColor: "var(--rule)",
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 py-14 md:px-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/egoera-logo.png"
                alt="Egoera"
                width={40}
                height={40}
                className="rounded-full"
                style={{
                  filter: "drop-shadow(0 0 10px rgba(168,194,182,0.3))",
                }}
              />
              <span
                className="text-2xl tracking-tight"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                egoera
                <em
                  className="not-italic ml-0.5"
                  style={{ color: "var(--accent)" }}
                >
                  .
                </em>
              </span>
            </Link>
            <p
              className="mt-5 max-w-md text-sm leading-relaxed"
              style={{
                color: "var(--ink-dim)",
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "15px",
              }}
            >
              Un vlog para detenerse, mirar hacia dentro y volver a la semana
              con otras preguntas. Desde Donostia, por Ander Bilbao.
            </p>
          </div>

          {/* Regiones */}
          <div>
            <h3
              className="mb-5 text-[11px] uppercase tracking-[0.22em]"
              style={{
                color: "var(--accent)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Mapa emocional
            </h3>
            <ul className="space-y-2.5">
              {BRAIN_REGIONS.slice(0, 6).map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/categoria/${r.id}`}
                    className="text-sm transition-colors hover:text-[color:var(--accent)]"
                    style={{
                      color: "var(--ink-soft)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enlaces */}
          <div>
            <h3
              className="mb-5 text-[11px] uppercase tracking-[0.22em]"
              style={{
                color: "var(--accent)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Navegar
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/blog", label: "Todos los articulos" },
                { href: "/diario", label: "Diario emocional" },
                { href: "/apoya", label: "Apoya el proyecto" },
                { href: "/contacto", label: "Contacto" },
                { href: "https://anderbilbao.com", label: "Ander Bilbao" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-[color:var(--accent)]"
                    style={{
                      color: "var(--ink-soft)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-[12px] md:flex-row"
          style={{
            borderColor: "var(--rule)",
            color: "var(--ink-faint)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.08em",
          }}
        >
          <div>© {new Date().getFullYear()} Egoera · Donostia</div>
          <div className="flex flex-wrap gap-6">
            <a
              href="https://www.instagram.com/egoera.psikologia/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[color:var(--accent)] transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@egoera.psikologia"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[color:var(--accent)] transition-colors"
            >
              TikTok
            </a>
            <a
              href="https://www.youtube.com/@egoera.psikologia"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[color:var(--accent)] transition-colors"
            >
              YouTube
            </a>
            <Link
              href="/privacidad"
              className="hover:text-[color:var(--accent)] transition-colors"
            >
              Privacidad
            </Link>
            <Link
              href="/aviso-legal"
              className="hover:text-[color:var(--accent)] transition-colors"
            >
              Aviso legal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
