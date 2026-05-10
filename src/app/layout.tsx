import type { Metadata } from "next";
import { Caveat, Fraunces, Inter, JetBrains_Mono } from "next/font/google";
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

const caveat = Caveat({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      { url: "/icons/logo-brain-tree-512.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/icons/logo-brain-tree-512.png",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Egoera",
    title: "Egoera — El vlog",
    description:
      "Psicologia, despacio. Un vlog personal de Ander Bilbao desde Donostia.",
    images: [{ url: "/icons/logo-brain-tree-512.png" }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@egoerapsikolog",
    images: ["/icons/logo-brain-tree-512.png"],
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
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} ${caveat.variable} h-full`}
      style={{ backgroundColor: "#f1ead8" }}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1d2bdb" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Egoera",
              url: "https://egoera.es",
              logo: "https://egoera.es/wp-content/uploads/2026/04/egoera-logo-brain-tree.png",
              founder: { "@type": "Person", name: "Ander Bilbao Castejón" },
              sameAs: [
                "https://www.instagram.com/egoera.psikologia/",
                "https://www.linkedin.com/in/anderbilbaoc/",
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Bilbao",
                addressCountry: "ES",
              },
            }),
          }}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="icon" type="image/png" href="/icons/logo-brain-tree-512.png" />
      </head>
      <body
        className="min-h-full flex flex-col antialiased overflow-x-hidden"
        style={{ backgroundColor: "#f1ead8" }}
      >
        <DarkNav />
        <main className="flex-1 overflow-x-hidden">{children}</main>
        <DarkFooter />
        <ExitIntentPopup />
      </body>
    </html>
  );
}
