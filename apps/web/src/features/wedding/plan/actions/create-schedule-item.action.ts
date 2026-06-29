"use server";

import { revalidatePath } from "next/cache";

import { createWeddingScheduleItem } from "@/features/wedding/plan/repositories/schedule-item.repository";
import {
  createWeddingScheduleItemSchema,
  type CreateWeddingScheduleItemInput,
} from "@/features/wedding/plan/schemas/schedule-item.schema";

import type { ActionResult } from "@/features/wedding/shared/actions/action-result";
import type { WeddingScheduleItem } from "@/features/wedding/plan/types";

export async function createWeddingScheduleItemAction(
  input: CreateWeddingScheduleItemInput,
): Promise<ActionResult<WeddingScheduleItem>> {
  const parsed = createWeddingScheduleItemSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "입력값을 확인해주세요.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const scheduleItem = await createWeddingScheduleItem(parsed.data);

    revalidatePath("/wedding/plan");

    return { ok: true, data: scheduleItem };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "일정을 추가하지 못했습니다.",
    };
  }
}
