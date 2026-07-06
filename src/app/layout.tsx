import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vellum — rate, review & shelve books with friends",
  description:
    "A social library. Rate the books you love, write reviews, follow your friends' reading lives, and browse the best-rated books on Vellum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        <div className="flex flex-col flex-1">{children}</div>
        <div className="vignette-overlay" aria-hidden="true" />
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
