/**
 * Preview aislado del CuadernoCierre para iteración visual rápida.
 * Sólo accesible en /blog/preview-cuaderno. No se enlaza desde nada.
 * No indexable (robots noindex).
 */
import type { Metadata } from "next";
import { CuadernoCierre, CUADERNO_DICT_ES } from "@/components/article";
import { EgoeraNav } from "@/components/egoera/EgoeraNav";
import { EgoeraFooter } from "@/components/egoera/EgoeraFooter";

export const metadata: Metadata = {
  title: "Preview · Cuaderno de cierre",
  robots: { index: false, follow: false },
};

const SAMPLE_LEARNINGS = [
  {
    tipo: "idea" as const,
    texto:
      "Quedarse no es la prueba del amor: a veces lo es la honestidad de irse.",
  },
  {
    tipo: "cuerpo" as const,
    texto:
      "Cuando aprieta, mira la mandíbula primero. La cabeza viene después.",
  },
  {
    tipo: "pregunta" as const,
    texto: "¿Me estoy quedando o me estoy dejando?",
  },
  {
    tipo: "practica" as const,
    texto:
      "Escribe tres preguntas en un papel y léelas siete días seguidos al despertar.",
  },
];

export default function PreviewCuadernoPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <EgoeraNav active="cuaderno" />
      <main style={{ flex: 1 }}>
        <CuadernoCierre
          editionNumber="014"
          slug="preview-cuaderno"
          tema="Apego"
          fechaLectura="12 may 2026"
          learnings={SAMPLE_LEARNINGS}
          dict={CUADERNO_DICT_ES}
        />
      </main>
      <EgoeraFooter />
    </div>
  );
}
