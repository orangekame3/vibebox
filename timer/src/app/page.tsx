"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type TimerMode = "countdown" | "stopwatch";

const PlayIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 5.14v14l11-7-11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const ResetIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const presetTimes = [
  { label: "5m", seconds: 5 * 60 },
  { label: "15m", seconds: 15 * 60 },
  { label: "25m", seconds: 25 * 60 },
  { label: "45m", seconds: 45 * 60 },
  { label: "60m", seconds: 60 * 60 },
];

export default function TimerPage() {
  const [mode, setMode] = useState<TimerMode>("countdown");
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(25 * 60); // Default 25 minutes
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [showComplete, setShowComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const playCompletionSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch {
      // Audio not supported
    }
  }, []);

  const handleComplete = useCallback(() => {
    setIsRunning(false);
    setShowComplete(true);
    playCompletionSound();
    setTimeout(() => setShowComplete(false), 3000);
  }, [playCompletionSound]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (mode === "countdown") {
            if (prev <= 1) {
              handleComplete();
              return 0;
            }
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode, handleComplete]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setShowComplete(false);
    if (mode === "countdown") {
      setTime(initialTime);
    } else {
      setTime(0);
    }
  }, [mode, initialTime]);

  const handleModeToggle = useCallback(() => {
    setIsRunning(false);
    setShowComplete(false);
    if (mode === "countdown") {
      setMode("stopwatch");
      setTime(0);
    } else {
      setMode("countdown");
      setTime(initialTime);
    }
  }, [mode, initialTime]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          setIsRunning((prev) => !prev);
          break;
        case "r":
          e.preventDefault();
          handleReset();
          break;
        case "m":
          e.preventDefault();
          handleModeToggle();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleReset, handleModeToggle]);

  const handlePresetClick = (seconds: number) => {
    setInitialTime(seconds);
    setTime(seconds);
    setIsRunning(false);
    setShowComplete(false);
  };

  const progress =
    mode === "countdown" && initialTime > 0
      ? ((initialTime - time) / initialTime) * 100
      : 0;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <header className="text-center mb-12">
          <h1
            className="text-4xl font-semibold tracking-tight mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Timer
          </h1>
          <p className="text-[var(--text-muted)] text-sm">
            Focus on what matters
          </p>
        </header>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div
            className="inline-flex rounded-full p-1"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <button
              onClick={() => {
                if (mode !== "countdown") handleModeToggle();
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                mode === "countdown"
                  ? "text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
              style={{
                backgroundColor:
                  mode === "countdown" ? "var(--accent)" : "transparent",
              }}
            >
              Countdown
            </button>
            <button
              onClick={() => {
                if (mode !== "stopwatch") handleModeToggle();
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                mode === "stopwatch"
                  ? "text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
              style={{
                backgroundColor:
                  mode === "stopwatch" ? "var(--accent)" : "transparent",
              }}
            >
              Stopwatch
            </button>
          </div>
        </div>

        {/* Timer Display */}
        <div className="relative flex justify-center items-center mb-8">
          {/* Progress Ring (Countdown only) */}
          {mode === "countdown" && (
            <svg
              className="absolute w-72 h-72"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--border)"
                strokeWidth="2"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                transform="rotate(-90 50 50)"
                className="transition-all duration-1000 ease-linear"
                style={{ opacity: isRunning ? 1 : 0.5 }}
              />
            </svg>
          )}

          {/* Time Display */}
          <div
            className={`relative z-10 flex flex-col items-center justify-center w-64 h-64 rounded-full transition-all duration-300 ${
              isRunning ? "animate-pulse-ring" : ""
            }`}
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: isRunning
                ? "0 0 60px var(--shadow-strong)"
                : "0 4px 20px var(--shadow)",
            }}
          >
            <span
              className={`text-6xl font-light tracking-tight tabular-nums ${
                showComplete ? "text-[var(--accent)]" : ""
              }`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {formatTime(time)}
            </span>
            {showComplete && (
              <span className="text-[var(--accent)] text-sm mt-2 font-medium animate-fade-in">
                Complete!
              </span>
            )}
          </div>
        </div>

        {/* Preset Times (Countdown only) */}
        {mode === "countdown" && !isRunning && (
          <div className="flex justify-center gap-2 mb-8 animate-fade-in">
            {presetTimes.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePresetClick(preset.seconds)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  initialTime === preset.seconds
                    ? "text-white"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
                style={{
                  backgroundColor:
                    initialTime === preset.seconds
                      ? "var(--accent)"
                      : "var(--surface)",
                  border: `1px solid ${
                    initialTime === preset.seconds
                      ? "var(--accent)"
                      : "var(--border)"
                  }`,
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-16 h-16 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
            style={{
              backgroundColor: "var(--accent)",
            }}
            aria-label={isRunning ? "Pause" : "Start"}
          >
            {isRunning ? <PauseIcon /> : <PlayIcon />}
          </button>

          <button
            onClick={handleReset}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
            aria-label="Reset"
          >
            <ResetIcon />
          </button>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mt-12 text-center">
          <p className="text-[var(--text-muted)] text-xs">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              Space
            </span>{" "}
            Start/Pause{" "}
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded ml-2"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              R
            </span>{" "}
            Reset{" "}
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded ml-2"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              M
            </span>{" "}
            Mode
          </p>
        </div>
      </div>
    </main>
  );
}
