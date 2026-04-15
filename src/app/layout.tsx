import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://egoera.es"),
  title: {
    default: "Egoera Psikologia | Blog de Psicologia y Bienestar Emocional",
    template: "%s | Egoera Psikologia",
  },
  description:
    "Blog de psicologia con contenidos sobre regulacion emocional, ansiedad, relaciones, autoconocimiento y bienestar. Tu estado importa.",
  keywords: [
    "psicologia",
    "salud mental",
    "bienestar emocional",
    "ansiedad",
    "terapia",
    "autoestima",
    "regulacion emocional",
    "psicologia positiva",
    "diario emocional",
    "egoera",
  ],
  authors: [{ name: "Egoera Psikologia" }],
  creator: "Egoera Psikologia",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Egoera Psikologia",
    title: "Egoera Psikologia | Blog de Psicologia y Bienestar Emocional",
    description:
      "Contenidos de psicologia para entenderte mejor. Regulacion emocional, relaciones, autoconocimiento y herramientas practicas.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@egoerapsikolog",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${cormorant.variable} h-full`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6BA3BE" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
