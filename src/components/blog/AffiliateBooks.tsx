"use client";

import Image from "next/image";
import { BookOpen, Headphones } from "lucide-react";
import { track } from "@/lib/analytics";
import { amazonCoverUrl, MONETIZATION_CONFIG } from "@/lib/monetization-config";

export interface AffiliateBook {
  title: string;
  author: string;
  asin: string;
  format?: "amazon" | "audible";
  note?: string;
}

const booksByCategory: Record<string, AffiliateBook[]> = {
  "relaciones-apego": [
    {
      title: "Apegos feroces",
      author: "Vivian Gornick",
      asin: "8418526076",
      note: "Memoria que ilumina los vinculos primarios.",
    },
    {
      title: "Reinventa tu vida",
      author: "J. Young & J. Klosko",
      asin: "844930764X",
      note: "Manual clasico de esquemas disfuncionales.",
    },
  ],
  "regulacion-emocional": [
    {
      title: "El cuerpo lleva la cuenta",
      author: "Bessel van der Kolk",
      asin: "8494759000",
      note: "Referencia sobre trauma y sistema nervioso.",
    },
    {
      title: "El poder del ahora",
      author: "Eckhart Tolle",
      asin: "8484452069",
      format: "audible",
      note: "Audiolibro para regular la atencion.",
    },
  ],
  autoconocimiento: [
    {
      title: "Pensar rapido, pensar despacio",
      author: "Daniel Kahneman",
      asin: "8499922163",
      note: "La arquitectura de tus decisiones.",
    },
    {
      title: "Tus zonas erroneas",
      author: "Wayne Dyer",
      asin: "8499085504",
      note: "Un clasico accesible sobre creencias.",
    },
  ],
  "limites-asertividad": [
    {
      title: "Limites",
      author: "H. Cloud & J. Townsend",
      asin: "0829728961",
      note: "Marco practico para decir no sin culpa.",
    },
    {
      title: "El arte de no amargarse la vida",
      author: "Rafael Santandreu",
      asin: "8425348897",
      note: "Terapia cognitiva en lenguaje cotidiano.",
    },
  ],
  desmitificacion: [
    {
      title: "El cuerpo lleva la cuenta",
      author: "Bessel van der Kolk",
      asin: "8494759000",
      note: "Desmonta mitos sobre el trauma.",
    },
    {
      title: "Pensar rapido, pensar despacio",
      author: "Daniel Kahneman",
      asin: "8499922163",
      note: "Sesgos cognitivos al descubierto.",
    },
  ],
  "psicologia-cotidiana": [
    {
      title: "El arte de no amargarse la vida",
      author: "Rafael Santandreu",
      asin: "8425348897",
      note: "Herramientas para el dia a dia.",
    },
    {
      title: "Tus zonas erroneas",
      author: "Wayne Dyer",
      asin: "8499085504",
      note: "Creencias que nos limitan sin saberlo.",
    },
  ],
};

function buildClickUrl(book: AffiliateBook, source: string): string {
  const network = book.format === "audible" ? "audible" : "amazon";
  const params = new URLSearchParams({
    network,
    asin: book.asin,
    source,
  });
  return `/api/affiliate-click?${params.toString()}`;
}

interface Props {
  categorySlug: string;
  source?: string;
  variant?: "card" | "native";
}

export function AffiliateBooks({
  categorySlug,
  source = "article",
  variant = "card",
}: Props) {
  const books =
    booksByCategory[categorySlug] ?? booksByCategory["autoconocimiento"];

  if (variant === "native") {
    const primary = books[0];
    return <NativeRecommendation book={primary} source={source} />;
  }

  return (
    <aside
      className="my-12 rounded-sm border p-7"
      style={{
        borderColor: "var(--rule)",
        background: "rgba(168,194,182,0.03)",
      }}
    >
      <div className="mb-6 flex items-center gap-2.5">
        <BookOpen className="h-5 w-5" style={{ color: "var(--accent)" }} />
        <h3
          className="tracking-[-0.01em]"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 22,
            fontWeight: 400,
            color: "var(--ink)",
          }}
        >
          Lecturas recomendadas
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {books.map((book) => (
          <BookCard key={book.asin} book={book} source={source} />
        ))}
      </div>

      <p
        className="mt-5 text-[10px] uppercase tracking-[0.18em]"
        style={{
          color: "var(--ink-faint)",
          fontFamily: "var(--font-mono)",
        }}
      >
        Enlaces de afiliado · Egoera recibe una pequena comision sin coste
        adicional para ti
      </p>
    </aside>
  );
}

function BookCard({ book, source }: { book: AffiliateBook; source: string }) {
  const href = buildClickUrl(book, source);
  const network = book.format === "audible" ? "Audible" : "Amazon";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener sponsored nofollow noreferrer"
      onClick={() =>
        track("affiliate_click", {
          asin: book.asin,
          network: network.toLowerCase(),
          source,
        })
      }
      className="group flex gap-4 rounded-sm border p-3 transition-all hover:-translate-y-0.5"
      style={{
        borderColor: "var(--rule)",
        background: "var(--bg-2)",
      }}
    >
      <div
        className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-sm"
        style={{ background: "rgba(168,194,182,0.05)" }}
      >
        <Image
          src={amazonCoverUrl(book.asin)}
          alt={`Portada de ${book.title}`}
          fill
          sizes="64px"
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <p
          className="line-clamp-2 text-[14px] font-medium leading-[1.3] transition-colors group-hover:text-[color:var(--accent)]"
          style={{ color: "var(--ink)" }}
        >
          {book.title}
        </p>
        <p
          className="mt-0.5 text-[12px]"
          style={{ color: "var(--ink-dim)" }}
        >
          {book.author}
        </p>
        {book.note && (
          <p
            className="mt-1 line-clamp-2 text-[11px] leading-[1.4]"
            style={{ color: "var(--ink-faint)" }}
          >
            {book.note}
          </p>
        )}
        <span
          className="mt-auto inline-flex items-center gap-1 pt-2 text-[11px] uppercase tracking-[0.18em]"
          style={{
            color: "var(--accent)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {book.format === "audible" ? (
            <>
              <Headphones className="h-3 w-3" /> {network}
            </>
          ) : (
            <>
              {network} <span aria-hidden>→</span>
            </>
          )}
        </span>
      </div>
    </a>
  );
}

function NativeRecommendation({
  book,
  source,
}: {
  book: AffiliateBook;
  source: string;
}) {
  const href = buildClickUrl(book, source);
  return (
    <p
      className="my-6 border-l-2 px-5 py-4 text-[14px] italic leading-[1.6]"
      style={{
        borderLeftColor: "rgba(168,194,182,0.35)",
        background: "rgba(168,194,182,0.04)",
        color: "var(--ink-dim)",
        fontFamily: "var(--font-serif)",
      }}
    >
      Lectura recomendada:{" "}
      <a
        href={href}
        target="_blank"
        rel="noopener sponsored nofollow noreferrer"
        onClick={() =>
          track("affiliate_click", {
            asin: book.asin,
            network: "amazon",
            source: `${source}:native`,
          })
        }
        className="font-medium underline underline-offset-4"
        style={{
          color: "var(--accent)",
          textDecorationColor: "rgba(168,194,182,0.4)",
        }}
      >
        {book.title}
      </a>
      , de {book.author}. {book.note}
    </p>
  );
}

export function AudibleRecommendation({
  source = "sidebar",
}: {
  source?: string;
}) {
  return (
    <a
      href={MONETIZATION_CONFIG.audible.baseUrl}
      target="_blank"
      rel="noopener sponsored nofollow noreferrer"
      onClick={() => track("affiliate_click", { network: "audible", source })}
      className="flex items-center gap-3 rounded-sm border p-4 transition-colors"
      style={{
        borderColor: "var(--rule)",
        background: "var(--bg-2)",
      }}
    >
      <Headphones className="h-6 w-6" style={{ color: "var(--accent)" }} />
      <div className="flex-1">
        <p
          className="text-[14px] font-medium"
          style={{ color: "var(--ink)" }}
        >
          30 dias gratis en Audible
        </p>
        <p className="text-[12px]" style={{ color: "var(--ink-dim)" }}>
          Miles de audiolibros de psicologia y desarrollo personal.
        </p>
      </div>
      <span
        className="text-[11px] uppercase tracking-[0.18em]"
        style={{
          color: "var(--accent)",
          fontFamily: "var(--font-mono)",
        }}
      >
        Probar →
      </span>
    </a>
  );
}
