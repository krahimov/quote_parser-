"use client";

import { useState } from "react";

interface AdditionalDetails {
  roomRate: string | null;
  numberOfRooms: string | null;
  taxesAndFees: string | null;
  attritionPolicy: string | null;
  cancellationPolicy: string | null;
  fbMinimum: string | null;
  concessions: string[] | null;
}

interface QuoteData {
  hotelName: string | null;
  eventName: string | null;
  checkInDate: string | null;
  checkOutDate: string | null;
  totalQuote: string | null;
  guestroomTotal: string | null;
  meetingRoomTotal: string | null;
  foodBeverageTotal: string | null;
  additionalDetails: AdditionalDetails | null;
}

interface QuoteResultsProps {
  data: QuoteData;
  saved: boolean;
}

function MetricCard({
  label,
  value,
  icon,
  delay,
}: {
  label: string;
  value: string | null;
  icon: React.ReactNode;
  delay: number;
}) {
  return (
    <div
      className="metric-card rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-xs text-white/40 uppercase tracking-wider font-medium">
          {label}
        </span>
      </div>
      <p
        className={`text-xl font-display font-semibold ${
          value && value !== "null" && !value.toLowerCase().includes("not available")
            ? "text-white"
            : "text-white/20"
        }`}
      >
        {value && value !== "null" ? value : "Not available"}
      </p>
    </div>
  );
}

export default function QuoteResults({ data, saved }: QuoteResultsProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const metrics = [
    {
      label: "Total Quote",
      value: data.totalQuote,
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d4a574"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
    },
    {
      label: "Guestroom Total",
      value: data.guestroomTotal,
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d4a574"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: "Meeting Room Total",
      value: data.meetingRoomTotal,
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d4a574"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
        </svg>
      ),
    },
    {
      label: "F&B Total",
      value: data.foodBeverageTotal,
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d4a574"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8h1a4 4 0 010 8h-1" />
          <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      ),
    },
  ];

  const details = data.additionalDetails;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header info */}
      <div
        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 animate-slide-up"
        style={{ animationDelay: "0ms" }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-lg text-white font-semibold">
              {data.hotelName || "Unknown Hotel"}
            </h3>
            {data.eventName && (
              <p className="text-sm text-white/40 mt-1">{data.eventName}</p>
            )}
          </div>
          {saved && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Saved
            </span>
          )}
        </div>
        {(data.checkInDate || data.checkOutDate) && (
          <div className="flex items-center gap-2 mt-3 text-sm text-white/50">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {data.checkInDate && <span>{data.checkInDate}</span>}
            {data.checkInDate && data.checkOutDate && <span>-</span>}
            {data.checkOutDate && <span>{data.checkOutDate}</span>}
          </div>
        )}
      </div>

      {/* 4 metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((m, i) => (
          <MetricCard
            key={m.label}
            label={m.label}
            value={m.value}
            icon={m.icon}
            delay={(i + 1) * 100}
          />
        ))}
      </div>

      {/* Additional details accordion */}
      {details && (
        <div
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden animate-slide-up"
          style={{ animationDelay: "500ms" }}
        >
          <button
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="w-full px-5 py-4 flex items-center justify-between text-sm text-white/50 hover:text-white/70 transition-colors"
          >
            <span className="font-medium">Additional Details</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${
                detailsOpen ? "rotate-180" : ""
              }`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {detailsOpen && (
            <div className="px-5 pb-5 space-y-3 border-t border-white/[0.04] pt-4">
              {[
                { label: "Room Rate", value: details.roomRate },
                { label: "Room Nights", value: details.numberOfRooms },
                { label: "Taxes & Fees", value: details.taxesAndFees },
                { label: "F&B Minimum", value: details.fbMinimum },
                { label: "Attrition Policy", value: details.attritionPolicy },
                {
                  label: "Cancellation Policy",
                  value: details.cancellationPolicy,
                },
              ].map(
                (item) =>
                  item.value && (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-white/30">{item.label}</span>
                      <span className="text-white/70 text-right max-w-[60%]">
                        {item.value}
                      </span>
                    </div>
                  )
              )}

              {details.concessions && details.concessions.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs text-white/30 uppercase tracking-wider">
                    Concessions
                  </span>
                  <ul className="mt-2 space-y-1.5">
                    {details.concessions.map((c, i) => (
                      <li
                        key={i}
                        className="text-sm text-white/60 flex items-start gap-2"
                      >
                        <span className="text-amber-400/60 mt-1">-</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
