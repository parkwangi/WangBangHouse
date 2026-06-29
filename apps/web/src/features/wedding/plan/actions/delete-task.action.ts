"use server";

import { revalidatePath } from "next/cache";

import { deleteWeddingTask } from "@/features/wedding/plan/repositories/task.repository";
import { getCurrentHouseholdId } from "@/server/auth/get-current-household";

import type { ActionResult } from "@/features/wedding/shared/actions/action-result";

export async function deleteWeddingTaskAction(
  taskId: string,
): Promise<ActionResult> {
  try {
    const householdId = await getCurrentHouseholdId();

    await deleteWeddingTask({
      householdId,
      taskId,
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
