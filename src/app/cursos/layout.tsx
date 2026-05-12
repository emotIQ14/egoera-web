import type { Metadata } from "next";
import { buildHreflangAlternates } from "@/i18n/hreflang";

export const metadata: Metadata = {
  title: "Cursos · Egoera Psikología",
  description:
    "Programas de formación basada en evidencia para regular emociones, entender el apego y conocerte mejor. Cursos online de Egoera Psikología.",
  keywords: [
    "cursos psicología",
    "regulación emocional",
    "ansiedad",
    "apego",
    "autoconocimiento",
    "Egoera",
    "formación online",
  ],
  alternates: buildHreflangAlternates("/cursos"),
  openGraph: {
    title: "Cursos · Egoera Psikología",
    description:
      "Programas online basados en evidencia para regular emociones y conocerte mejor.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cursos · Egoera Psikología",
    description:
      "Programas online basados en evidencia para regular emociones.",
  },
};

export default function CursosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
