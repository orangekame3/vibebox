export interface AppConfig {
  id: string;
  name: string;
  description: string;
  port: number;
  directory: string;
  command: string;
  args: string[];
  icon: string;
  color: string;
}

export const apps: AppConfig[] = [
  {
    id: "translator",
    name: "Translator",
    description: "Multi-language text translator with support for Japanese, English, and more",
    port: 3001,
    directory: "../translator",
    command: "npm",
    args: ["run", "dev", "--", "-p", "3001"],
    icon: "translate",
    color: "#0ea5e9",
  },
  {
    id: "timer",
    name: "Timer",
    description: "Countdown and stopwatch timer with elegant interface",
    port: 3002,
    directory: "../timer",
    command: "npm",
    args: ["run", "dev", "--", "-p", "3002"],
    icon: "clock",
    color: "#8b5cf6",
  },
  {
    id: "pdf2md-ui",
    name: "PDF to Markdown",
    description: "Convert PDF documents to Markdown format using AI-powered OCR",
    port: 3003,
    directory: "../pdf2md-ui",
    command: "npm",
    args: ["run", "dev", "--", "-p", "3003"],
    icon: "document",
    color: "#10b981",
  },
  {
    id: "pdf2md-api",
    name: "PDF2MD API",
    description: "Backend API server for PDF to Markdown conversion",
    port: 8000,
    directory: "../pdf2md",
    command: "uv",
    args: ["run", "python", "api.py"],
    icon: "server",
    color: "#f59e0b",
  },
  {
    id: "clock",
    name: "Clock",
    description: "Minimal clock display with Japanese-inspired design",
    port: 3004,
    directory: "../clock",
    command: "npm",
    args: ["run", "dev", "--", "-p", "3004"],
    icon: "clock",
    color: "#d97706",
  },
];

export function getApp(id: string): AppConfig | undefined {
  return apps.find((app) => app.id === id);
}

export function getAppUrl(app: AppConfig): string {
  return `http://localhost:${app.port}`;
}
