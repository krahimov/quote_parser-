"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-white/[0.06] backdrop-blur-md bg-[#1a1a2e]/80 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1a1a2e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="font-display text-lg tracking-tight text-white/90">
            QuoteParser
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              pathname === "/"
                ? "bg-white/[0.08] text-amber-400"
                : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
            }`}
          >
            Parse
          </Link>
          <Link
            href="/quotes"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              pathname === "/quotes"
                ? "bg-white/[0.08] text-amber-400"
                : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
            }`}
          >
            History
          </Link>
        </nav>
      </div>
    </header>
  );
}
