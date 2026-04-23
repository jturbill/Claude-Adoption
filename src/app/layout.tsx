import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Deborah Jayne Designs",
  description:
    "Independent graphic design practice — editorial, identity, and illustration. Considered, atmospheric, restrained.",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  openGraph: {
    title: "Deborah Jayne Designs",
    description:
      "Independent graphic design practice — editorial, identity, and illustration.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-ink text-bone font-sans antialiased selection:bg-accent selection:text-bone">
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
