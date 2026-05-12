import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/diary/cobalt/BottomNav";
import { buildHreflangAlternates } from "@/i18n/hreflang";
import "./diario.css";

export const metadata: Metadata = {
  title: "Diario emocional · Egoera Psikología",
  description:
    "Diario emocional Egoera. Registra como te sientes, descubre tus patrones y vuelve a la semana con otras preguntas. Sin prisa, sin algoritmos.",
  keywords: [
    "diario emocional",
    "journaling",
    "salud mental",
    "Egoera",
    "registro de emociones",
    "diario online",
    "PWA diario",
  ],
  manifest: "/manifest.json",
  alternates: buildHreflangAlternates("/diario"),
  openGraph: {
    title: "Diario emocional · Egoera",
    description:
      "Tres minutos al día. Diario emocional sin gamificación invasiva.",
    type: "website",
    siteName: "Egoera",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diario emocional · Egoera",
    description:
      "Tres minutos al día. Diario emocional sin gamificación invasiva.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f1ead8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function DiarioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="diario-shell">
      <main className="diario-main">{children}</main>
      <BottomNav />
    </div>
  );
}
