"use client";

import { useState, useCallback, useRef } from "react";

type Tab = "paste" | "upload";

interface QuoteInputProps {
  onParse: (result: Record<string, unknown>) => void;
  onLoading: (loading: boolean) => void;
}

export default function QuoteInput({ onParse, onLoading }: QuoteInputProps) {
  const [activeTab, setActiveTab] = useState<Tab>("paste");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleParse = async () => {
    setError("");
    setLoading(true);
    onLoading(true);

    try {
      const formData = new FormData();

      if (activeTab === "paste") {
        if (!content.trim()) {
          setError("Please paste some email content first.");
          setLoading(false);
          onLoading(false);
          return;
        }
        formData.append("content", content);
      } else {
        if (!file) {
          setError("Please upload a file first.");
          setLoading(false);
          onLoading(false);
          return;
        }
        formData.append("file", file);
      }

      const res = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to parse");
      }

      const result = await res.json();
      onParse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
      onLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError("");
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  return (
    <div className="quote-input-card rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-white/[0.06]">
        <button
          onClick={() => setActiveTab("paste")}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-all relative ${
            activeTab === "paste"
              ? "text-amber-400"
              : "text-white/40 hover:text-white/60"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
            Paste Content
          </span>
          {activeTab === "paste" && (
            <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-amber-400 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-all relative ${
            activeTab === "upload"
              ? "text-amber-400"
              : "text-white/40 hover:text-white/60"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload File
          </span>
          {activeTab === "upload" && (
            <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-amber-400 rounded-full" />
          )}
        </button>
      </div>

      {/* Content area */}
      <div className="p-6">
        {activeTab === "paste" ? (
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError("");
            }}
            placeholder="Paste the hotel quote email content here (HTML or plain text)..."
            className="w-full h-64 bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 text-sm text-white/80 placeholder-white/20 resize-none focus:outline-none focus:border-amber-400/30 focus:ring-1 focus:ring-amber-400/20 transition-all font-mono"
          />
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
              dragOver
                ? "border-amber-400/60 bg-amber-400/5"
                : file
                ? "border-amber-400/30 bg-amber-400/[0.03]"
                : "border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".html,.htm,.pdf,.txt"
              className="hidden"
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) {
                  setFile(selected);
                  setError("");
                }
              }}
            />
            {file ? (
              <>
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center mb-3">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#d4a574"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <p className="text-sm text-white/70 font-medium">{file.name}</p>
                <p className="text-xs text-white/30 mt-1">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="mt-3 text-xs text-white/30 hover:text-red-400 transition-colors"
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center mb-3">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white/30"
                  >
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="text-sm text-white/40">
                  Drop a file here or{" "}
                  <span className="text-amber-400/80">browse</span>
                </p>
                <p className="text-xs text-white/20 mt-1">
                  Supports HTML, PDF, and text files
                </p>
              </>
            )}
          </div>
        )}

        {error && (
          <p className="mt-3 text-sm text-red-400/80 flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </p>
        )}

        <button
          onClick={handleParse}
          disabled={loading}
          className="mt-5 w-full py-3.5 rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-amber-500 to-amber-600 text-[#1a1a2e] hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
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
              Analyzing quote...
            </span>
          ) : (
            "Parse Quote"
          )}
        </button>
      </div>
    </div>
  );
}
