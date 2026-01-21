"use client";

import { useState, useCallback, useRef } from "react";

type ConversionState = "idle" | "uploading" | "converting" | "success" | "error";

interface ConversionResult {
  filename: string;
  markdown: string;
}

const FileIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const DownloadIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const CopyIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    className="animate-spin"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1" />
  </svg>
);

export default function Home() {
  const [state, setState] = useState<ConversionState>("idle");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConvert = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF file");
      setState("error");
      return;
    }

    setState("uploading");
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setState("converting");
      const response = await fetch("http://localhost:8000/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Conversion failed");
      }

      const data = await response.json();
      setResult({
        filename: data.filename,
        markdown: data.markdown,
      });
      setState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setState("error");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleConvert(file);
      }
    },
    [handleConvert]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleConvert(file);
      }
    },
    [handleConvert]
  );

  const handleDownload = useCallback(() => {
    if (!result) return;

    const blob = new Blob([result.markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result]);

  const handleCopy = useCallback(async () => {
    if (!result) return;

    await navigator.clipboard.writeText(result.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const handleReset = useCallback(() => {
    setState("idle");
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--border)] py-6 animate-fade-in">
        <div className="max-w-4xl mx-auto px-6">
          <h1
            className="text-3xl font-medium tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            PDF to Markdown
          </h1>
          <p className="text-[var(--text-muted)] mt-1">
            Transform documents with precision
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        {state === "idle" || state === "error" ? (
          <div className="animate-fade-in stagger-1">
            <div
              className={`drop-zone border-2 border-dashed border-[var(--border)] rounded-2xl p-12 text-center cursor-pointer transition-all ${
                dragOver ? "drag-over" : ""
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="text-[var(--text-muted)] mb-4">
                <FileIcon />
              </div>

              <p className="text-lg font-medium mb-2">
                Drop your PDF here
              </p>
              <p className="text-[var(--text-muted)] text-sm">
                or click to browse
              </p>

              {error && (
                <p className="text-[var(--error)] mt-4 text-sm">{error}</p>
              )}
            </div>

            <div className="mt-8 text-center text-[var(--text-muted)] text-sm">
              <p>Powered by Docling</p>
              <p className="mt-1 text-xs">
                Supports complex layouts, tables, and formulas
              </p>
            </div>
          </div>
        ) : state === "uploading" || state === "converting" ? (
          <div className="animate-fade-in flex flex-col items-center justify-center py-24">
            <div className="text-[var(--accent)]">
              <SpinnerIcon />
            </div>
            <p className="mt-4 text-[var(--text-muted)]">
              {state === "uploading" ? "Uploading..." : "Converting..."}
            </p>
          </div>
        ) : state === "success" && result ? (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-medium">{result.filename}</h2>
                <p className="text-[var(--text-muted)] text-sm mt-1">
                  Conversion complete
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  <span className="text-sm">{copied ? "Copied" : "Copy"}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
                >
                  <DownloadIcon />
                  <span className="text-sm">Download</span>
                </button>
              </div>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
              <div className="border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">Preview</span>
                <button
                  onClick={handleReset}
                  className="text-sm text-[var(--accent)] hover:underline"
                >
                  Convert another
                </button>
              </div>
              <div className="p-6 max-h-[600px] overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                  {result.markdown}
                </pre>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <footer className="border-t border-[var(--border)] py-6">
        <div className="max-w-4xl mx-auto px-6 text-center text-[var(--text-muted)] text-sm">
          <p>Make sure the API server is running on port 8000</p>
          <code className="text-xs mt-1 block">task pdf2md:api</code>
        </div>
      </footer>
    </div>
  );
}
