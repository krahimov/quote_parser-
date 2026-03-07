"use client";

import { useState } from "react";
import QuoteInput from "@/components/QuoteInput";
import QuoteResults from "@/components/QuoteResults";

interface ParseResult {
  data: {
    hotelName: string | null;
    eventName: string | null;
    checkInDate: string | null;
    checkOutDate: string | null;
    totalQuote: string | null;
    guestroomTotal: string | null;
    meetingRoomTotal: string | null;
    foodBeverageTotal: string | null;
    additionalDetails: {
      roomRate: string | null;
      numberOfRooms: string | null;
      taxesAndFees: string | null;
      attritionPolicy: string | null;
      cancellationPolicy: string | null;
      fbMinimum: string | null;
      concessions: string[] | null;
    } | null;
  };
  saved: boolean;
}

export default function Home() {
  const [result, setResult] = useState<ParseResult | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* Hero section */}
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Hotel Quote Parser
        </h1>
        <p className="mt-3 text-white/35 text-sm max-w-lg mx-auto leading-relaxed">
          Extract pricing data from hotel quote emails instantly. Paste content
          or upload files to analyze guestroom, meeting room, and F&B costs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Input */}
        <div>
          <QuoteInput
            onParse={(r) => setResult(r as unknown as ParseResult)}
            onLoading={setLoading}
          />
        </div>

        {/* Right: Results */}
        <div>
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/5 border border-amber-400/10 flex items-center justify-center mb-4">
                <svg
                  className="animate-spin h-6 w-6 text-amber-400/40"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="opacity-25"
                  />
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    className="opacity-75"
                  />
                </svg>
              </div>
              <p className="text-sm text-white/30">Analyzing quote with AI...</p>
              <p className="text-xs text-white/15 mt-1">
                This may take a few seconds
              </p>
            </div>
          )}

          {!loading && result && (
            <QuoteResults data={result.data} saved={result.saved} />
          )}

          {!loading && !result && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center mb-4">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/15"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <p className="text-sm text-white/25">
                Parsed results will appear here
              </p>
              <p className="text-xs text-white/12 mt-1">
                Paste or upload a hotel quote to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
