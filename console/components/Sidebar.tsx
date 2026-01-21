"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, TranslateIcon, ClockIcon, DocumentIcon, ServerIcon } from "./Icons";

const navItems = [
  { href: "/", label: "Dashboard", icon: HomeIcon },
  { href: "/apps/translator", label: "Translator", icon: TranslateIcon },
  { href: "/apps/timer", label: "Timer", icon: ClockIcon },
  { href: "/apps/pdf2md-ui", label: "PDF to MD", icon: DocumentIcon },
  { href: "/apps/pdf2md-api", label: "PDF2MD API", icon: ServerIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border flex flex-col z-10">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <span className="text-white font-display font-bold text-xl">V</span>
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-text-primary">Vibebox</h1>
            <p className="text-xs text-text-muted">Console</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-accent-light text-accent"
                      : "text-text-secondary hover:bg-[var(--border)] hover:text-text-primary"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-text-muted text-center">
          Vibebox v0.1.0
        </p>
      </div>
    </aside>
  );
}
