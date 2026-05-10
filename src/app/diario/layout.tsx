import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/diary/cobalt/BottomNav";
import "./diario.css";

export const metadata: Metadata = {
  title: "Diario · Egoera",
  description:
    "Diario emocional Egoera. Registra como te sientes, descubre tus patrones y vuelve a la semana con otras preguntas. Sin prisa, sin algoritmos.",
  manifest: "/manifest.json",
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
