import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { DarkNav } from "@/components/layout/DarkNav";
import { DarkFooter } from "@/components/layout/DarkFooter";
import { ExitIntentPopup } from "@/components/monetization/ExitIntentPopup";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://egoera.es"),
  title: {
    default: "Egoera — El vlog",
    template: "%s | Egoera",
  },
  description:
    "El vlog de psicologia de Ander Bilbao desde Donostia. Un espacio para detenerse, mirar hacia dentro y volver a la semana con otras preguntas.",
  keywords: [
    "psicologia",
    "vlog",
    "salud mental",
    "bienestar emocional",
    "ansiedad",
    "apego",
    "autoconocimiento",
    "regulacion emocional",
    "donostia",
    "ander bilbao",
    "egoera",
  ],
  authors: [{ name: "Ander Bilbao Castejon" }],
  creator: "Ander Bilbao Castejon",
  icons: {
    icon: [
      { url: "/egoera-logo.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/egoera-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Egoera",
    title: "Egoera — El vlog",
    description:
      "Psicologia, despacio. Un vlog personal de Ander Bilbao desde Donostia.",
    images: [{ url: "/egoera-social.png" }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@egoerapsikolog",
    images: ["/egoera-social.png"],
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
    <html
      lang="es"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} h-full`}
      style={{ backgroundColor: "#141815" }}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#141815" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="icon" type="image/png" href="/egoera-logo.png" />
      </head>
      <body
        className="min-h-full flex flex-col antialiased overflow-x-hidden"
        style={{ backgroundColor: "#141815" }}
      >
        <DarkNav />
        <main className="flex-1 overflow-x-hidden">{children}</main>
        <DarkFooter />
        <ExitIntentPopup />
      </body>
    </html>
  );
}
