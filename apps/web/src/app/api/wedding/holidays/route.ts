import { NextResponse } from "next/server";

import { getKoreanHolidays } from "@/features/wedding/plan/holidays/kasi-special-day";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const year = Number(url.searchParams.get("year"));

  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    return NextResponse.json(
      { message: "year는 1900부터 2100 사이의 정수여야 합니다." },
      { status: 400 },
    );
  }

  try {
    const holidays = await getKoreanHolidays(year);

    return NextResponse.json({ holidays });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "공휴일 정보를 불러오지 못했습니다.",
      },
      { status: 502 },
    );
  }
}
