"use server";

import { revalidatePath } from "next/cache";

import { createWeddingTask } from "@/features/wedding/plan/repositories/task.repository";
import {
  createWeddingTaskSchema,
  type CreateWeddingTaskInput,
} from "@/features/wedding/plan/schemas/task.schema";
import { getCurrentHouseholdId } from "@/server/auth/get-current-household";

import type { ActionResult } from "@/features/wedding/shared/actions/action-result";

export async function createWeddingTaskAction(
  weddingProjectId: string,
  input: CreateWeddingTaskInput,
): Promise<ActionResult> {
  const parsed = createWeddingTaskSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "입력값을 확인해주세요.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const householdId = await getCurrentHouseholdId();

    await createWeddingTask({
      householdId,
      weddingProjectId,
      ...parsed.data,
    });

    revalidatePath("/wedding/plan");

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "할 일을 추가하지 못했습니다.",
    };
  }
}
