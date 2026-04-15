import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Diario Emocional | Egoera",
  description:
    "Registra tu estado de animo diario, detecta patrones emocionales y entiende mejor como te sientes. Tu herramienta personal de bienestar.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#6BA3BE",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function DiarioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-warm-bg">
      {children}
    </div>
  );
}
