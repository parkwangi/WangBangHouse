"use server";

import { revalidatePath } from "next/cache";

import { updateWeddingTaskStatus } from "@/features/wedding/plan/repositories/task.repository";
import { weddingTaskStatusSchema } from "@/features/wedding/plan/schemas/task.schema";
import { getCurrentHouseholdId } from "@/server/auth/get-current-household";

import type { ActionResult } from "@/features/wedding/shared/actions/action-result";

export async function updateWeddingTaskStatusAction(input: {
  taskId: string;
  status: string;
}): Promise<ActionResult> {
  const parsedStatus = weddingTaskStatusSchema.safeParse(input.status);

  if (!parsedStatus.success) {
    return {
      ok: false,
      message: "상태값을 확인해주세요.",
      errors: {
        status: parsedStatus.error.issues.map((issue) => issue.message),
      },
    };
  }

  try {
    const householdId = await getCurrentHouseholdId();

    await updateWeddingTaskStatus({
      householdId,
      taskId: input.taskId,
      status: parsedStatus.data,
    });

    revalidatePath("/wedding/plan");

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "할 일 상태를 변경하지 못했습니다.",
    };
  }
}
