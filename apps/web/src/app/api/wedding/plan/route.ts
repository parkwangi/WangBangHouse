import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import {
  createWeddingScheduleItem,
  deleteWeddingScheduleItem,
  getWeddingScheduleItems,
} from "@/server/wedding/plan";
import { createWeddingScheduleItemSchema } from "@repo/api/wedding/plan/schema";

export async function GET() {
  try {
    const tasks = await getWeddingScheduleItems();

    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Wedding Plan 데이터를 불러오지 못했습니다.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const parsed = createWeddingScheduleItemSchema.safeParse(await request.json());

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
    const scheduleItem = await createWeddingScheduleItem(parsed.data);

    revalidatePath("/wedding/plan");

    return NextResponse.json({ ok: true, data: scheduleItem });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "일정을 추가하지 못했습니다.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as { scheduleItemId?: unknown };

  if (typeof body.scheduleItemId !== "string" || !body.scheduleItemId) {
    return NextResponse.json(
      {
        ok: false,
        message: "삭제할 일정 ID를 확인하지 못했습니다.",
      },
      { status: 400 },
    );
  }

  try {
    await deleteWeddingScheduleItem({
      scheduleItemId: body.scheduleItemId,
    });

    revalidatePath("/wedding/plan");

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "일정을 삭제하지 못했습니다.",
      },
      { status: 500 },
    );
  }
}
