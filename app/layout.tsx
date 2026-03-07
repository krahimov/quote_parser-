import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hotel Quote Parser",
  description:
    "Extract pricing data from hotel quote emails. Built for event planners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${playfair.variable} ${dmSans.variable} antialiased bg-[#0f0f1a] text-white min-h-screen font-body`}
      >
        {/* Background texture */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,165,116,0.04)_0%,_transparent_50%)] pointer-events-none" />
        <div className="relative">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
