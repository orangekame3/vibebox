"use client";

import Link from "next/link";
import { useState } from "react";
import { getIconByName, PlayIcon, StopIcon, ExternalLinkIcon, LoadingIcon, ChevronRightIcon } from "./Icons";
import StatusBadge from "./StatusBadge";

interface AppCardProps {
  id: string;
  name: string;
  description: string;
  port: number;
  url: string;
  icon: string;
  color: string;
  status: {
    running: boolean;
    managedByConsole: boolean;
  };
  onRefresh?: () => void;
}

export default function AppCard({
  id,
  name,
  description,
  port,
  url,
  icon,
  color,
  status,
  onRefresh,
}: AppCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const Icon = getIconByName(icon);

  const handleStart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/apps/${id}/start`, { method: "POST" });
      const data = await res.json();
      if (!data.success) {
        console.error(data.message);
      }
      // Wait a bit for the server to start
      await new Promise((r) => setTimeout(r, 2000));
      onRefresh?.();
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/apps/${id}/stop`, { method: "POST" });
      const data = await res.json();
      if (!data.success) {
        console.error(data.message);
      }
      await new Promise((r) => setTimeout(r, 500));
      onRefresh?.();
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenExternal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, "_blank");
  };

  return (
    <Link href={`/apps/${id}`}>
      <article className="group relative bg-surface rounded-2xl border border-border p-6 hover:shadow-lg hover:border-border-strong transition-all duration-300 cursor-pointer animate-fade-in-up">
        {/* Color accent bar */}
        <div
          className="absolute top-0 left-6 right-6 h-1 rounded-b-full opacity-60 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: color }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-4 mt-2">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <StatusBadge running={status.running} managedByConsole={status.managedByConsole} />
        </div>

        {/* Content */}
        <h3 className="font-display text-xl font-semibold text-text-primary mb-1">
          {name}
        </h3>
        <p className="text-sm text-text-muted mb-4 line-clamp-2">{description}</p>

        {/* Port info */}
        <div className="text-xs text-text-muted mb-4">
          Port: <span className="font-mono text-text-secondary">{port}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {status.running ? (
            <>
              {status.managedByConsole && (
                <button
                  onClick={handleStop}
                  disabled={isLoading}
                  className="btn btn-danger flex-1"
                >
                  {isLoading ? (
                    <LoadingIcon className="w-4 h-4 animate-spin" />
                  ) : (
                    <StopIcon className="w-4 h-4" />
                  )}
                  Stop
                </button>
              )}
              <button
                onClick={handleOpenExternal}
                className="btn btn-secondary"
                title="Open in new tab"
              >
                <ExternalLinkIcon className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={handleStart}
              disabled={isLoading}
              className="btn btn-success flex-1"
            >
              {isLoading ? (
                <LoadingIcon className="w-4 h-4 animate-spin" />
              ) : (
                <PlayIcon className="w-4 h-4" />
              )}
              Start
            </button>
          )}
          <div className="flex-1 flex justify-end">
            <ChevronRightIcon className="w-5 h-5 text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </article>
    </Link>
  );
}
