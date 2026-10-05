import type { Metadata } from "next";
import { Zalando_Sans_Expanded } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ZT Nature (Zelow Type) — the Figma body/UI font (nav, paragraphs, buttons).
// Same three faces the prototype serves: Regular (body), Medium, SemiBold.
// The .otf (CFF) builds, as in the prototype — the .ttf builds carry TrueType
// hinting, which Windows renders with visibly different letter shapes.
const ztNature = localFont({
  variable: "--font-zt-nature",
  display: "swap",
  // Only the faces a page actually renders are fetched.
  preload: false,
  src: [
    { path: "./font/ZTNature-Regular.otf", weight: "400", style: "normal" },
    { path: "./font/ZTNature-Medium.otf", weight: "500", style: "normal" },
    { path: "./font/ZTNature-SemiBold.otf", weight: "600", style: "normal" },
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
