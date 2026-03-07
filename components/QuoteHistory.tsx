"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

interface Quote {
  id: string;
  hotel_name: string | null;
  event_name: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  total_quote: string | null;
  guestroom_total: string | null;
  meeting_room_total: string | null;
  food_beverage_total: string | null;
  source_type: string | null;
  created_at: string;
}

export default function QuoteHistory() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotes() {
      const supabase = getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching quotes:", error);
      } else {
        setQuotes(data || []);
      }
      setLoading(false);
    }

    fetchQuotes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg
          className="animate-spin h-6 w-6 text-amber-400/50"
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
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-white/20"
          >
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <p className="text-white/30 text-sm">No quotes parsed yet</p>
        <p className="text-white/15 text-xs mt-1">
          Parsed quotes will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {quotes.map((quote, i) => (
        <div
          key={quote.id}
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-colors animate-slide-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-display text-base text-white font-medium">
                {quote.hotel_name || "Unknown Hotel"}
              </h3>
              {quote.event_name && (
                <p className="text-xs text-white/35 mt-0.5">
                  {quote.event_name}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/20 uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.04]">
                {quote.source_type?.replace("_", " ")}
              </span>
              <span className="text-xs text-white/20">
                {new Date(quote.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total", value: quote.total_quote },
              { label: "Rooms", value: quote.guestroom_total },
              { label: "Meeting", value: quote.meeting_room_total },
              { label: "F&B", value: quote.food_beverage_total },
            ].map((item) => (
              <div key={item.label}>
                <span className="text-[10px] text-white/25 uppercase tracking-wider">
                  {item.label}
                </span>
                <p
                  className={`text-sm mt-0.5 ${
                    item.value ? "text-white/70" : "text-white/15"
                  }`}
                >
                  {item.value || "N/A"}
                </p>
              </div>
            ))}
          </div>

          {(quote.check_in_date || quote.check_out_date) && (
            <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center gap-2 text-xs text-white/30">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
              </svg>
              {quote.check_in_date}
              {quote.check_in_date && quote.check_out_date && " - "}
              {quote.check_out_date}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
