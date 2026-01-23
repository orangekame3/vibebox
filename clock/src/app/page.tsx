"use client";

import { useState, useEffect } from "react";

function ClockIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function formatTime(date: Date): { hours: string; minutes: string; seconds: string } {
  return {
    hours: date.getHours().toString().padStart(2, "0"),
    minutes: date.getMinutes().toString().padStart(2, "0"),
    seconds: date.getSeconds().toString().padStart(2, "0"),
  };
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[date.getDay()];
  return `${year}年${month}月${day}日 (${weekday})`;
}

export default function ClockPage() {
  const [time, setTime] = useState<Date | null>(null);
  const [is24Hour, setIs24Hour] = useState(true);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-text-muted">Loading...</div>
      </main>
    );
  }

  const { hours, minutes, seconds } = formatTime(time);
  const displayHours = is24Hour
    ? hours
    : (parseInt(hours) % 12 || 12).toString().padStart(2, "0");
  const period = parseInt(hours) >= 12 ? "PM" : "AM";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background p-8">
      <div className="animate-fade-in flex flex-col items-center gap-8">
        {/* Header */}
        <div className="flex items-center gap-3 text-text-muted">
          <ClockIcon />
          <span className="font-body text-sm tracking-widest uppercase">Clock</span>
        </div>

        {/* Date Display */}
        <div className="text-text-secondary font-body text-lg tracking-wide">
          {formatDate(time)}
        </div>

        {/* Time Display */}
        <div className="flex items-baseline gap-2">
          <div className="flex items-baseline">
            <span className="font-display text-[8rem] md:text-[12rem] font-light leading-none tracking-tight text-text-primary">
              {displayHours}
            </span>
            <span className="font-display text-[8rem] md:text-[12rem] font-light leading-none text-accent animate-tick">
              :
            </span>
            <span className="font-display text-[8rem] md:text-[12rem] font-light leading-none tracking-tight text-text-primary">
              {minutes}
            </span>
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="font-display text-[2rem] md:text-[3rem] font-light leading-none tracking-tight text-text-muted">
              {seconds}
            </span>
            {!is24Hour && (
              <span className="font-body text-sm text-text-muted tracking-widest">
                {period}
              </span>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIs24Hour(!is24Hour)}
          className="mt-8 px-6 py-3 bg-surface border border-border rounded-2xl
                     font-body text-sm text-text-secondary tracking-wide
                     hover:border-border-strong hover:bg-surface-elevated
                     transition-all duration-200 ease-out
                     focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
        >
          {is24Hour ? "12時間表示に切替" : "24時間表示に切替"}
        </button>

        {/* Keyboard Shortcut Hint */}
        <div className="flex items-center gap-2 text-text-muted text-xs">
          <kbd className="px-2 py-1 bg-surface border border-border rounded font-mono text-[10px]">
            T
          </kbd>
          <span>で表示切替</span>
        </div>
      </div>

      {/* Keyboard Handler */}
      <KeyboardHandler onToggle={() => setIs24Hour(!is24Hour)} />
    </main>
  );
}

function KeyboardHandler({ onToggle }: { onToggle: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "t" || e.key === "T") &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        onToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onToggle]);

  return null;
}
