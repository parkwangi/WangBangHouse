"use server";

import { revalidatePath } from "next/cache";

import { deleteWeddingScheduleItem } from "@/features/wedding/plan/repositories/schedule-item.repository";

import type { ActionResult } from "@/features/wedding/shared/actions/action-result";

export async function deleteWeddingScheduleItemAction(
  scheduleItemId: string,
): Promise<ActionResult> {
  try {
    await deleteWeddingScheduleItem({
      scheduleItemId,
    });

    revalidatePath("/wedding/plan");

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "일정을 삭제하지 못했습니다.",
    };
  }
}
