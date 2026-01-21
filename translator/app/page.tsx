"use client";

import { useState, useCallback } from "react";

type TranslationDirection = "ja-en" | "en-ja";

// SVG Flag components
const JapanFlag = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className="rounded-sm">
    <rect width="36" height="36" fill="#F5F5F5" />
    <circle cx="18" cy="18" r="9" fill="#BC002D" />
  </svg>
);

const UKFlag = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className="rounded-sm">
    <rect width="36" height="36" fill="#012169" />
    <path d="M0 0L36 36M36 0L0 36" stroke="#FFF" strokeWidth="6" />
    <path d="M0 0L36 36M36 0L0 36" stroke="#C8102E" strokeWidth="2" />
    <path d="M18 0V36M0 18H36" stroke="#FFF" strokeWidth="10" />
    <path d="M18 0V36M0 18H36" stroke="#C8102E" strokeWidth="6" />
  </svg>
);

const Sparkles = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 36 36">
    <path
      fill="#F4900C"
      d="M18 0c-.5 5.5-2.5 8.5-5 11-2.5 2.5-5.5 4.5-11 5 5.5.5 8.5 2.5 11 5s4.5 5.5 5 11c.5-5.5 2.5-8.5 5-11s5.5-4.5 11-5c-5.5-.5-8.5-2.5-11-5S18.5 5.5 18 0z"
    />
    <path
      fill="#FFCC4D"
      d="M8 17c-.3 3-1.4 4.6-2.7 5.9C4 24.3 2.3 25.4 0 25.7c2.3.3 4 1.4 5.3 2.7 1.3 1.4 2.4 3 2.7 5.3.3-2.3 1.4-4 2.7-5.3 1.4-1.3 3-2.4 5.3-2.7-2.3-.3-4-1.4-5.3-2.7C9.4 21.6 8.3 20 8 17zM28 6c-.2 2-.9 3.1-1.8 4-1 .9-2 1.6-4 1.8 2 .2 3.1.9 4 1.8.9 1 1.6 2 1.8 4 .2-2 .9-3.1 1.8-4 1-.9 2-1.6 4-1.8-2-.2-3.1-.9-4-1.8-.9-1-1.6-2-1.8-4z"
    />
  </svg>
);

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [direction, setDirection] = useState<TranslationDirection>("ja-en");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, direction }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Translation failed");
      }

      setOutputText(data.translation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [inputText, direction]);

  const handleSwap = useCallback(() => {
    setDirection((d) => (d === "ja-en" ? "en-ja" : "ja-en"));
    setInputText(outputText);
    setOutputText(inputText);
  }, [inputText, outputText]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [outputText]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        handleTranslate();
      }
    },
    [handleTranslate]
  );

  const SourceFlag = direction === "ja-en" ? JapanFlag : UKFlag;
  const TargetFlag = direction === "ja-en" ? UKFlag : JapanFlag;
  const sourceLang = direction === "ja-en" ? "Japanese" : "English";
  const targetLang = direction === "ja-en" ? "English" : "Japanese";

  return (
    <>
      <div className="noise-overlay" />
      <div className="min-h-screen bg-[var(--background)] px-4 py-12 md:py-20">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <header className="mb-12 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-[var(--border-strong)]" />
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-[var(--text-subtle)]">
                Language Bridge
              </span>
              <div className="h-px w-8 bg-[var(--border-strong)]" />
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl font-medium tracking-tight text-[var(--foreground)] mb-3">
              Translator
            </h1>
            <p className="text-[var(--text-muted)] text-sm font-light">
              Powered by local AI
            </p>
          </header>

          {/* Main Card */}
          <main className="animate-fade-in-delay">
            <div
              className="relative bg-[var(--surface)] rounded-2xl overflow-hidden
                          border border-[var(--border)]
                          shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.02)]
                          dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_4px_16px_rgba(0,0,0,0.1)]"
            >
              {/* Language Selector Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-3 group">
                  <div className="relative transition-transform duration-300 group-hover:scale-110">
                    <SourceFlag />
                  </div>
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {sourceLang}
                  </span>
                </div>

                <button
                  onClick={handleSwap}
                  className="group relative p-3 -my-1 rounded-full
                             transition-all duration-300
                             hover:bg-[var(--accent-soft)]
                             active:scale-95"
                  title="Swap languages"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-[var(--text-muted)] transition-all duration-300 group-hover:text-[var(--accent)] group-hover:rotate-180"
                  >
                    <path
                      d="M7 16L3 12M3 12L7 8M3 12H21M17 8L21 12M21 12L17 16M21 12H3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div className="flex items-center gap-3 group">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {targetLang}
                  </span>
                  <div className="relative transition-transform duration-300 group-hover:scale-110">
                    <TargetFlag />
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Input Column */}
                <div className="relative p-6 md:border-r border-[var(--border)]">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-xs font-medium tracking-wide uppercase text-[var(--text-subtle)]">
                      Original
                    </label>
                    <span className="text-xs tabular-nums text-[var(--text-subtle)]">
                      {inputText.length.toLocaleString()}
                    </span>
                  </div>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      direction === "ja-en"
                        ? "Enter Japanese text..."
                        : "Enter English text..."
                    }
                    className="w-full h-56 p-0 bg-transparent border-0
                               text-[var(--foreground)] text-lg leading-relaxed
                               placeholder:text-[var(--text-subtle)]
                               focus:outline-none focus:ring-0
                               resize-none"
                  />
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                    <span className="text-xs text-[var(--text-subtle)]">
                      <kbd className="px-1.5 py-0.5 rounded bg-[var(--background)] border border-[var(--border)] text-[10px] font-mono">
                        {typeof navigator !== "undefined" &&
                        navigator.userAgent.includes("Mac")
                          ? "⌘"
                          : "Ctrl"}
                      </kbd>{" "}
                      +{" "}
                      <kbd className="px-1.5 py-0.5 rounded bg-[var(--background)] border border-[var(--border)] text-[10px] font-mono">
                        Enter
                      </kbd>{" "}
                      to translate
                    </span>
                    <button
                      onClick={handleTranslate}
                      disabled={isLoading || !inputText.trim()}
                      className="group inline-flex items-center gap-2 px-5 py-2.5
                                 bg-[var(--foreground)] text-[var(--background)]
                                 text-sm font-medium rounded-lg
                                 transition-all duration-200
                                 hover:opacity-90
                                 disabled:opacity-40 disabled:cursor-not-allowed
                                 active:scale-[0.98]"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="3"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span>Translating</span>
                        </>
                      ) : (
                        <>
                          <span>Translate</span>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="transition-transform duration-200 group-hover:translate-x-0.5"
                          >
                            <path
                              d="M5 12H19M19 12L12 5M19 12L12 19"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Output Column */}
                <div className="relative p-6 bg-[var(--background)]">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-xs font-medium tracking-wide uppercase text-[var(--text-subtle)]">
                      Translation
                    </label>
                    {outputText && (
                      <button
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]
                                   hover:text-[var(--accent)] transition-colors"
                      >
                        {copied ? (
                          <>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M20 6L9 17L4 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <rect
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <path
                                d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                            </svg>
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="h-56 overflow-auto">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-4">
                          <div className="animate-float">
                            <Sparkles />
                          </div>
                          <span className="text-sm text-[var(--text-subtle)] animate-pulse-subtle">
                            Thinking...
                          </span>
                        </div>
                      </div>
                    ) : outputText ? (
                      <p className="text-[var(--foreground)] text-lg leading-relaxed whitespace-pre-wrap">
                        {outputText}
                      </p>
                    ) : (
                      <p className="text-[var(--text-subtle)] italic">
                        Translation will appear here...
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                    <span className="text-xs tabular-nums text-[var(--text-subtle)]">
                      {outputText.length.toLocaleString()} characters
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mx-6 mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}
            </div>
          </main>

          {/* Footer */}
          <footer className="mt-8 text-center animate-fade-in-delay">
            <p className="text-xs text-[var(--text-subtle)]">
              gpt-oss:20b via Ollama
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
