"use client";

import { BookOpen } from "lucide-react";

interface Book {
  title: string;
  author: string;
  asin: string;
}

const booksByCategory: Record<string, Book[]> = {
  "relaciones-apego": [
    { title: "Apegos feroces", author: "Vivian Gornick", asin: "8418526076" },
    { title: "Reinventa tu vida", author: "J. Young & J. Klosko", asin: "844930764X" },
  ],
  "regulacion-emocional": [
    { title: "El cuerpo lleva la cuenta", author: "Bessel van der Kolk", asin: "8494759000" },
    { title: "El poder del ahora", author: "Eckhart Tolle", asin: "8484452069" },
  ],
  "autoconocimiento": [
    { title: "Pensar rapido, pensar despacio", author: "Daniel Kahneman", asin: "8499922163" },
    { title: "Tus zonas erroneas", author: "Wayne Dyer", asin: "8499085504" },
  ],
  "limites-asertividad": [
    { title: "Limites", author: "H. Cloud & J. Townsend", asin: "0829728961" },
    { title: "El arte de no amargarse la vida", author: "Rafael Santandreu", asin: "8425348897" },
  ],
  "desmitificacion": [
    { title: "El cuerpo lleva la cuenta", author: "Bessel van der Kolk", asin: "8494759000" },
    { title: "Pensar rapido, pensar despacio", author: "Daniel Kahneman", asin: "8499922163" },
  ],
  "psicologia-cotidiana": [
    { title: "El arte de no amargarse la vida", author: "Rafael Santandreu", asin: "8425348897" },
    { title: "Tus zonas erroneas", author: "Wayne Dyer", asin: "8499085504" },
  ],
};

interface Props {
  categorySlug: string;
}

export function AffiliateBooks({ categorySlug }: Props) {
  const books = booksByCategory[categorySlug] ?? booksByCategory["autoconocimiento"];

  return (
    <div className="bg-teal/5 rounded-xl p-6 my-8 border border-teal/10">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-teal" />
        <h3 className="text-base font-semibold text-dark-text">
          Lecturas recomendadas
        </h3>
      </div>
      <div className="space-y-3">
        {books.map((book) => (
          <a
            key={book.asin}
            href={`https://www.amazon.es/dp/${book.asin}?tag=abc01f7-21`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow group"
          >
            <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-teal" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-dark-text group-hover:text-teal transition-colors">
                {book.title}
              </p>
              <p className="text-xs text-grey-text">{book.author}</p>
            </div>
            <span className="text-xs text-teal font-medium shrink-0">Amazon →</span>
          </a>
        ))}
      </div>
      <p className="text-[10px] text-grey-text mt-3">
        * Enlace de afiliado. Sin coste adicional para ti.
      </p>
    </div>
  );
}
