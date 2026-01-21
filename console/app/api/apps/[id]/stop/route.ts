import { NextRequest, NextResponse } from "next/server";
import { getApp } from "@/lib/app-registry";
import { stopApp, getAppStatus } from "@/lib/process-manager";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const app = getApp(id);

  if (!app) {
    return NextResponse.json(
      { success: false, message: "App not found" },
      { status: 404 }
    );
  }

  const status = getAppStatus(id);
  if (!status.running) {
    return NextResponse.json(
      { success: false, message: "App is not running (or not managed by console)" },
      { status: 400 }
    );
  }

  const result = await stopApp(id);
  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}
