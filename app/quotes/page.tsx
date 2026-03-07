import QuoteHistory from "@/components/QuoteHistory";

export default function QuotesPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white tracking-tight">
          Quote History
        </h1>
        <p className="mt-2 text-white/30 text-sm">
          Previously parsed hotel quotes
        </p>
      </div>
      <QuoteHistory />
    </main>
  );
}
