import { NextResponse } from "next/server";
import { apps, getAppUrl } from "@/lib/app-registry";
import { getAppStatus, checkPortInUse } from "@/lib/process-manager";

export const dynamic = "force-dynamic";

export async function GET() {
  const appsWithStatus = await Promise.all(
    apps.map(async (app) => {
      const status = getAppStatus(app.id);
      const portInUse = await checkPortInUse(app.port);

      return {
        ...app,
        url: getAppUrl(app),
        status: {
          running: status.running || portInUse,
          managedByConsole: status.running,
          startedAt: status.startedAt,
        },
      };
    })
  );

  return NextResponse.json(appsWithStatus);
}
