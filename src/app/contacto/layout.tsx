import type { Metadata } from "next";
import { EgoeraNav } from "@/components/egoera/EgoeraNav";
import { EgoeraFooter } from "@/components/egoera/EgoeraFooter";
import { buildHreflangAlternates } from "@/i18n/hreflang";

export const metadata: Metadata = {
  title: "Contacto · Egoera Psikología — Ander Bilbao",
  description:
    "Escribe a Ander Bilbao: colaboraciones editoriales, prensa, sugerencias para el cuaderno, brújula y diario emocional. Castellano y euskara.",
  keywords: [
    "contacto Egoera",
    "Ander Bilbao",
    "Egoera Psikología",
    "psicología despacio",
    "cuaderno psicología",
    "diario emocional",
  ],
  alternates: buildHreflangAlternates("/contacto"),
  openGraph: {
    title: "Contacto · Egoera",
    description:
      "Escríbenos. Colaboraciones, prensa, comentarios al cuaderno o sugerencias al diario emocional.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contacto · Egoera",
    description: "Escríbenos. Cuaderno · Brújula · Diario · Boletín.",
  },
};

/**
 * Layout server-only que envuelve la página de contacto con el shell
 * cobalto + crema (EgoeraNav + EgoeraFooter). La page.tsx interna es
 * client y maneja el estado del formulario.
 */
export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <EgoeraNav />
      {children}
      <EgoeraFooter />
    </>
  );
}
