import type { Metadata } from "next";
import { Hanken_Grotesk, Zalando_Sans_Expanded } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const bodyFont = Hanken_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

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
      className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-stone-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
