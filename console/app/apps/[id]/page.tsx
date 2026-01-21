"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  PlayIcon,
  StopIcon,
  ExternalLinkIcon,
  RefreshIcon,
  LoadingIcon,
  getIconByName,
} from "@/components/Icons";
import StatusBadge from "@/components/StatusBadge";

interface AppStatus {
  id: string;
  name: string;
  port: number;
  running: boolean;
  managedByConsole: boolean;
  startedAt?: string;
  logs?: string[];
}

interface AppConfig {
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

export default function AppDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [app, setApp] = useState<AppConfig | null>(null);
  const [status, setStatus] = useState<AppStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const fetchAppData = useCallback(async () => {
    try {
      const [appsRes, statusRes] = await Promise.all([
        fetch("/api/apps"),
        fetch(`/api/apps/${id}/status`),
      ]);
      const apps = await appsRes.json();
      const statusData = await statusRes.json();

      const currentApp = apps.find((a: AppConfig) => a.id === id);
      setApp(currentApp || null);
      setStatus(statusData);
    } catch (error) {
      console.error("Failed to fetch app data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAppData();
    const interval = setInterval(fetchAppData, 5000);
    return () => clearInterval(interval);
  }, [fetchAppData]);

  const handleStart = async () => {
    setIsActionLoading(true);
    try {
      const res = await fetch(`/api/apps/${id}/start`, { method: "POST" });
      const data = await res.json();
      if (!data.success) {
        console.error(data.message);
      }
      await new Promise((r) => setTimeout(r, 3000));
      await fetchAppData();
      setIframeKey((k) => k + 1);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleStop = async () => {
    setIsActionLoading(true);
    try {
      const res = await fetch(`/api/apps/${id}/stop`, { method: "POST" });
      const data = await res.json();
      if (!data.success) {
        console.error(data.message);
      }
      await new Promise((r) => setTimeout(r, 500));
      await fetchAppData();
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRefreshIframe = () => {
    setIframeKey((k) => k + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIcon className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-text-muted">App not found</p>
        <Link href="/" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const Icon = getIconByName(app.icon);
  const isRunning = status?.running ?? false;
  const isManagedByConsole = status?.managedByConsole ?? false;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-surface border-b border-border p-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-lg hover:bg-[var(--border)] transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-text-muted" />
            </Link>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${app.color}20` }}
            >
              <Icon className="w-5 h-5" style={{ color: app.color }} />
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold text-text-primary">
                {app.name}
              </h1>
              <p className="text-xs text-text-muted">
                Port: <span className="font-mono">{app.port}</span>
              </p>
            </div>
            <StatusBadge running={isRunning} managedByConsole={isManagedByConsole} />
          </div>

          <div className="flex items-center gap-2">
            {isRunning ? (
              <>
                {isManagedByConsole && (
                  <button
                    onClick={handleStop}
                    disabled={isActionLoading}
                    className="btn btn-danger"
                  >
                    {isActionLoading ? (
                      <LoadingIcon className="w-4 h-4 animate-spin" />
                    ) : (
                      <StopIcon className="w-4 h-4" />
                    )}
                    Stop
                  </button>
                )}
                <button onClick={handleRefreshIframe} className="btn btn-secondary">
                  <RefreshIcon className="w-4 h-4" />
                  Reload
                </button>
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                  Open
                </a>
              </>
            ) : (
              <button
                onClick={handleStart}
                disabled={isActionLoading}
                className="btn btn-success"
              >
                {isActionLoading ? (
                  <LoadingIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <PlayIcon className="w-4 h-4" />
                )}
                Start App
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 animate-fade-in">
        {isRunning ? (
          <iframe
            key={iframeKey}
            src={app.url}
            className="w-full h-full border-0"
            title={app.name}
            allow="clipboard-write"
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-6 p-8 bg-background">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center opacity-40"
              style={{ backgroundColor: `${app.color}20` }}
            >
              <Icon className="w-12 h-12" style={{ color: app.color }} />
            </div>
            <div className="text-center max-w-md">
              <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">
                {app.name} is not running
              </h2>
              <p className="text-text-muted mb-6">{app.description}</p>
              <button
                onClick={handleStart}
                disabled={isActionLoading}
                className="btn btn-success px-8 py-3 text-base"
              >
                {isActionLoading ? (
                  <LoadingIcon className="w-5 h-5 animate-spin" />
                ) : (
                  <PlayIcon className="w-5 h-5" />
                )}
                Start {app.name}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
