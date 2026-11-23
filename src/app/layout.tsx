import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@fontsource-variable/outfit";
import "./globals.css";

const inter = localFont({
  src: "../fonts/InterTight.woff2",
  variable: "--f-inter",
  weight: "100 900",
  display: "swap",
});
const serif = localFont({
  src: [
    { path: "../fonts/InstrumentSerif.woff2", weight: "400", style: "normal" },
    { path: "../fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--f-serif",
  display: "swap",
});
const mono = localFont({
  src: "../fonts/JetBrainsMono.woff2",
  variable: "--f-mono",
  weight: "100 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Benbella Ghizlane — IA & Data",
  description:
    "Portfolio de Benbella Ghizlane, étudiante en Master Technologies Immersives (ENSAM Casablanca) : IA générative, LLM, RAG, développement Full Stack.",
  openGraph: {
    title: "Benbella Ghizlane — IA & Data",
    description: "Portfolio : agents IA, RAG, développement Full Stack.",
    locale: "fr_FR",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#F4EFFA" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
