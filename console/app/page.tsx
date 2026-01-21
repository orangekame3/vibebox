"use client";

import { useEffect, useState, useCallback } from "react";
import AppCard from "@/components/AppCard";
import { RefreshIcon, PlayIcon, StopIcon, LoadingIcon } from "@/components/Icons";

interface AppData {
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
}

export default function DashboardPage() {
  const [apps, setApps] = useState<AppData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isStartingAll, setIsStartingAll] = useState(false);
  const [isStoppingAll, setIsStoppingAll] = useState(false);

  const fetchApps = useCallback(async () => {
    try {
      const res = await fetch("/api/apps");
      const data = await res.json();
      setApps(data);
    } catch (error) {
      console.error("Failed to fetch apps:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
    // Poll for status updates every 5 seconds
    const interval = setInterval(fetchApps, 5000);
    return () => clearInterval(interval);
  }, [fetchApps]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchApps();
  };

  const handleStartAll = async () => {
    setIsStartingAll(true);
    const stoppedApps = apps.filter((app) => !app.status.running);

    for (const app of stoppedApps) {
      try {
        await fetch(`/api/apps/${app.id}/start`, { method: "POST" });
        // Wait a bit between starts to avoid port conflicts
        await new Promise((r) => setTimeout(r, 1000));
      } catch (error) {
        console.error(`Failed to start ${app.name}:`, error);
      }
    }

    // Wait for servers to be ready
    await new Promise((r) => setTimeout(r, 2000));
    await fetchApps();
    setIsStartingAll(false);
  };

  const handleStopAll = async () => {
    setIsStoppingAll(true);
    const runningApps = apps.filter((app) => app.status.running && app.status.managedByConsole);

    for (const app of runningApps) {
      try {
        await fetch(`/api/apps/${app.id}/stop`, { method: "POST" });
      } catch (error) {
        console.error(`Failed to stop ${app.name}:`, error);
      }
    }

    await new Promise((r) => setTimeout(r, 500));
    await fetchApps();
    setIsStoppingAll(false);
  };

  const runningCount = apps.filter((app) => app.status.running).length;
  const managedRunningCount = apps.filter((app) => app.status.running && app.status.managedByConsole).length;
  const stoppedCount = apps.filter((app) => !app.status.running).length;

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <header className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display text-4xl font-bold text-text-primary">
            Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartAll}
              disabled={isStartingAll || isStoppingAll || stoppedCount === 0}
              className="btn btn-success"
            >
              {isStartingAll ? (
                <LoadingIcon className="w-4 h-4 animate-spin" />
              ) : (
                <PlayIcon className="w-4 h-4" />
              )}
              Start All
            </button>
            <button
              onClick={handleStopAll}
              disabled={isStoppingAll || isStartingAll || managedRunningCount === 0}
              className="btn btn-danger"
            >
              {isStoppingAll ? (
                <LoadingIcon className="w-4 h-4 animate-spin" />
              ) : (
                <StopIcon className="w-4 h-4" />
              )}
              Stop All
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="btn btn-secondary"
            >
              <RefreshIcon
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
        <p className="text-text-muted">
          Manage your Vibebox applications from one place.
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-surface rounded-xl border border-border p-4 animate-fade-in">
          <p className="text-sm text-text-muted mb-1">Total Apps</p>
          <p className="text-2xl font-display font-bold text-text-primary">
            {apps.length}
          </p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 animate-fade-in delay-100">
          <p className="text-sm text-text-muted mb-1">Running</p>
          <p className="text-2xl font-display font-bold text-success">
            {runningCount}
          </p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 animate-fade-in delay-200">
          <p className="text-sm text-text-muted mb-1">Stopped</p>
          <p className="text-2xl font-display font-bold text-text-muted">
            {stoppedCount}
          </p>
        </div>
      </div>

      {/* Apps Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-surface rounded-2xl border border-border p-6 animate-pulse"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-border" />
                <div className="w-16 h-6 rounded-full bg-border" />
              </div>
              <div className="h-6 w-32 rounded bg-border mb-2" />
              <div className="h-4 w-full rounded bg-border mb-4" />
              <div className="h-10 w-full rounded bg-border" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {apps.map((app, index) => (
            <div key={app.id} style={{ animationDelay: `${index * 100}ms` }}>
              <AppCard {...app} onRefresh={handleRefresh} />
            </div>
          ))}
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <footer className="mt-12 text-center animate-fade-in delay-400">
        <p className="text-xs text-text-muted">
          Press{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-text-secondary font-mono">
            R
          </kbd>{" "}
          to refresh
        </p>
      </footer>
    </div>
  );
}
