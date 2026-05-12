import type { Metadata } from "next";
import { EgoeraNav } from "@/components/egoera/EgoeraNav";
import { EgoeraFooter } from "@/components/egoera/EgoeraFooter";
import { buildHreflangAlternates } from "@/i18n/hreflang";

export const metadata: Metadata = {
  title: "Recursos gratis · Egoera Psikología",
  description:
    "Guías, audios y plantillas gratuitas de psicología basadas en evidencia. Descárgalos para regular emociones, entender el apego y conocerte mejor.",
  keywords: [
    "recursos gratuitos psicología",
    "guías PDF",
    "meditación grounding",
    "test apego",
    "regulación emocional",
    "Egoera",
  ],
  alternates: buildHreflangAlternates("/recursos"),
  openGraph: {
    title: "Recursos gratis · Egoera",
    description:
      "Guías, audios y plantillas para regular emociones y conocerte mejor.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recursos gratis · Egoera",
    description:
      "Guías, audios y plantillas para regular emociones y conocerte mejor.",
  },
};

export default function RecursosLayout({
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
