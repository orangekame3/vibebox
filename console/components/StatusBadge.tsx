"use client";

interface StatusBadgeProps {
  running: boolean;
  managedByConsole?: boolean;
}

export default function StatusBadge({ running, managedByConsole }: StatusBadgeProps) {
  if (running) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-success-light text-success">
        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
        {managedByConsole ? "Running" : "Active"}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-[var(--border)] text-text-muted">
      <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
      Stopped
    </span>
  );
}
