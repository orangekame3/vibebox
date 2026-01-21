import { NextRequest, NextResponse } from "next/server";
import { getApp } from "@/lib/app-registry";
import { getAppStatus, checkPortInUse } from "@/lib/process-manager";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const app = getApp(id);

  if (!app) {
    return NextResponse.json(
      { error: "App not found" },
      { status: 404 }
    );
  }

  const status = getAppStatus(id);
  const portInUse = await checkPortInUse(app.port);

  return NextResponse.json({
    id: app.id,
    name: app.name,
    port: app.port,
    running: status.running || portInUse,
    managedByConsole: status.running,
    startedAt: status.startedAt,
    logs: status.logs,
  });
}
