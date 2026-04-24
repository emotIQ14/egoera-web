"use client";

import Image from "next/image";
import { BookOpen, Headphones } from "lucide-react";
import { track } from "@/lib/analytics";
import { amazonCoverUrl, MONETIZATION_CONFIG } from "@/lib/monetization-config";

export interface AffiliateBook {
  title: string;
  author: string;
  asin: string;
  /** Formato del enlace: amazon (papel/kindle) o audible (audiolibro). */
  format?: "amazon" | "audible";
  /** Motivo breve de la recomendacion (contextual). */
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
  /** Identificador del articulo o seccion — se usa para tracking. */
  source?: string;
  /** Estilo: card completa (default) o insercion nativa en texto. */
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
    return (
      <NativeRecommendation book={primary} source={source} />
    );
  }

  return (
    <aside className="my-10 rounded-2xl border border-teal/15 bg-gradient-to-br from-teal/5 via-mint/5 to-sage/5 p-6">
      <div className="mb-5 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-teal" />
        <h3 className="text-base font-semibold text-dark-text">
          Lecturas recomendadas
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {books.map((book) => (
          <BookCard key={book.asin} book={book} source={source} />
        ))}
      </div>

      <p className="mt-4 text-[10px] text-grey-text">
        Enlaces de afiliado. Si compras a traves de ellos, Egoera recibe una
        pequena comision sin coste adicional para ti.
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
      className="group flex gap-4 rounded-xl bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
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
        <p className="line-clamp-2 text-sm font-medium text-dark-text transition-colors group-hover:text-teal">
          {book.title}
        </p>
        <p className="mt-0.5 text-xs text-grey-text">{book.author}</p>
        {book.note && (
          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-grey-text/80">
            {book.note}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-medium text-teal">
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
    <p className="my-6 border-l-4 border-teal/40 bg-teal/5 px-4 py-3 text-sm italic text-grey-text">
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
        className="font-medium text-teal underline decoration-teal/40 underline-offset-2 hover:decoration-teal"
      >
        {book.title}
      </a>
      , de {book.author}. {book.note}
    </p>
  );
}

/** Recomendacion de audiolibro via Audible (home, sidebar). */
export function AudibleRecommendation({ source = "sidebar" }: { source?: string }) {
  return (
    <a
      href={MONETIZATION_CONFIG.audible.baseUrl}
      target="_blank"
      rel="noopener sponsored nofollow noreferrer"
      onClick={() => track("affiliate_click", { network: "audible", source })}
      className="flex items-center gap-3 rounded-xl border border-sage/20 bg-sage/5 p-4 transition-colors hover:bg-sage/10"
    >
      <Headphones className="h-6 w-6 text-sage" />
      <div className="flex-1">
        <p className="text-sm font-medium text-dark-text">
          30 dias gratis en Audible
        </p>
        <p className="text-xs text-grey-text">
          Miles de audiolibros de psicologia y desarrollo personal.
        </p>
      </div>
      <span className="text-xs font-medium text-sage">Probar →</span>
    </a>
  );
}
