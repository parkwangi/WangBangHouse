import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import {
  createBudgetItem,
  getWeddingBudgetPageData,
} from "@/server/wedding/budget";
import { createBudgetItemSchema } from "@repo/api/wedding/budget/schema";

export async function GET() {
  try {
    return NextResponse.json(await getWeddingBudgetPageData());
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Budget 데이터를 불러오지 못했습니다.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const parsed = createBudgetItemSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "입력값을 확인해주세요.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    await createBudgetItem(parsed.data);

    revalidatePath("/wedding/budget");

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "예산 항목을 추가하지 못했습니다.",
      },
      { status: 500 },
    );
  }
}
