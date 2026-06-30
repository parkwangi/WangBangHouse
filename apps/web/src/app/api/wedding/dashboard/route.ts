import { NextResponse } from "next/server";

import { getWeddingDashboardData } from "@/server/wedding/dashboard";

export async function GET() {
  try {
    return NextResponse.json(await getWeddingDashboardData());
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Dashboard 데이터를 불러오지 못했습니다.",
      },
      { status: 500 },
    );
  }
}
