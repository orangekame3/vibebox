import { spawn, ChildProcess } from "child_process";
import path from "path";
import treeKill from "tree-kill";
import { AppConfig } from "./app-registry";

interface ManagedProcess {
  process: ChildProcess;
  app: AppConfig;
  startedAt: Date;
  logs: string[];
}

const processes: Map<string, ManagedProcess> = new Map();
const MAX_LOG_LINES = 100;

export function isAppRunning(appId: string): boolean {
  const managed = processes.get(appId);
  if (!managed) return false;
  return managed.process.exitCode === null;
}

export async function checkPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const net = require("net");
    const server = net.createServer();
    server.once("error", () => resolve(true));
    server.once("listening", () => {
      server.close();
      resolve(false);
    });
    server.listen(port, "127.0.0.1");
  });
}

export async function startApp(app: AppConfig): Promise<{ success: boolean; message: string }> {
  if (isAppRunning(app.id)) {
    return { success: false, message: `${app.name} is already running` };
  }

  const portInUse = await checkPortInUse(app.port);
  if (portInUse) {
    return { success: false, message: `Port ${app.port} is already in use` };
  }

  // Use process.cwd() as base (console directory when server is running)
  const workingDir = path.resolve(process.cwd(), app.directory);

  try {
    // Use shell: true to properly resolve commands through PATH (required for mise/asdf)
    const child = spawn(app.command, app.args, {
      cwd: workingDir,
      env: { ...process.env, FORCE_COLOR: "1" },
      stdio: ["ignore", "pipe", "pipe"],
      detached: false,
      shell: true,
    });

    const managed: ManagedProcess = {
      process: child,
      app,
      startedAt: new Date(),
      logs: [],
    };

    const addLog = (data: Buffer, stream: "stdout" | "stderr") => {
      const lines = data.toString().split("\n").filter(Boolean);
      lines.forEach((line) => {
        managed.logs.push(`[${stream}] ${line}`);
        if (managed.logs.length > MAX_LOG_LINES) {
          managed.logs.shift();
        }
      });
    };

    child.stdout?.on("data", (data) => addLog(data, "stdout"));
    child.stderr?.on("data", (data) => addLog(data, "stderr"));

    child.on("exit", (code) => {
      managed.logs.push(`[system] Process exited with code ${code}`);
    });

    processes.set(app.id, managed);
    return { success: true, message: `${app.name} started on port ${app.port}` };
  } catch (error) {
    return { success: false, message: `Failed to start ${app.name}: ${error}` };
  }
}

export function stopApp(appId: string): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    const managed = processes.get(appId);
    if (!managed) {
      resolve({ success: false, message: "App is not running" });
      return;
    }

    const pid = managed.process.pid;
    if (!pid) {
      processes.delete(appId);
      resolve({ success: false, message: "Process has no PID" });
      return;
    }

    treeKill(pid, "SIGTERM", (err) => {
      if (err) {
        treeKill(pid, "SIGKILL", () => {
          processes.delete(appId);
          resolve({ success: true, message: `${managed.app.name} force stopped` });
        });
      } else {
        processes.delete(appId);
        resolve({ success: true, message: `${managed.app.name} stopped` });
      }
    });
  });
}

export function getAppStatus(appId: string): {
  running: boolean;
  startedAt?: Date;
  logs?: string[];
} {
  const managed = processes.get(appId);
  if (!managed || managed.process.exitCode !== null) {
    return { running: false };
  }
  return {
    running: true,
    startedAt: managed.startedAt,
    logs: managed.logs.slice(-20),
  };
}

export function getAllAppStatuses(): Record<string, boolean> {
  const statuses: Record<string, boolean> = {};
  processes.forEach((managed, appId) => {
    statuses[appId] = managed.process.exitCode === null;
  });
  return statuses;
}
