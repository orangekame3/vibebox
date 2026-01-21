import { NextRequest, NextResponse } from "next/server";
import { getApp } from "@/lib/app-registry";
import { startApp } from "@/lib/process-manager";

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

  const result = await startApp(app);
  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}
