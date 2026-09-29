import type { Metadata } from "next";
import { Zalando_Sans_Expanded } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ZT Nature (Zelow Type) — the Figma body/UI font (nav, paragraphs, buttons).
// Only Thin/Medium/Black are available locally, so Medium stands in for the
// 400–600 range the design uses (Regular + SemiBold) until those files are added.
const ztNature = localFont({
  variable: "--font-zt-nature",
  display: "swap",
  // Only the faces a page actually renders are fetched; preloading all six
  // would download ~670KB of TTF on every route.
  preload: false,
  src: [
    { path: "./font/ZTNature-Thin.ttf", weight: "100", style: "normal" },
    { path: "./font/ZTNature-ThinItalic.ttf", weight: "100", style: "italic" },
    { path: "./font/ZTNature-Medium.ttf", weight: "400 600", style: "normal" },
    { path: "./font/ZTNature-MediumItalic.ttf", weight: "400 600", style: "italic" },
    { path: "./font/ZTNature-Black.ttf", weight: "900", style: "normal" },
    { path: "./font/ZTNature-BlackItalic.ttf", weight: "900", style: "italic" },
  ],
});

// Figma heading font (h1–h4 and a few display accents).
const headingFont = Zalando_Sans_Expanded({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VastuNord — See What's Possible",
  description:
    "Turn your ideas into visuals. Reimagine spaces, transform details, and explore possibilities before deciding what comes next.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${ztNature.variable} ${headingFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-stone-900">
        {/* Scroll-reveal blocks rely on JS to appear; show them outright without it. */}
        <noscript>
          <style>{`.reveal{opacity:1;transform:none}`}</style>
        </noscript>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
