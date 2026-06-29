"use server";

import { revalidatePath } from "next/cache";

import { createBudgetItem } from "@/features/wedding/budget/repositories/budget.repository";
import {
  createBudgetItemSchema,
  type CreateBudgetItemInput,
} from "@/features/wedding/budget/schemas/budget-item.schema";

import type { ActionResult } from "@/features/wedding/shared/actions/action-result";

export async function createBudgetItemAction(
  input: CreateBudgetItemInput,
): Promise<ActionResult> {
  const parsed = createBudgetItemSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "입력값을 확인해주세요.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createBudgetItem(parsed.data);

    revalidatePath("/wedding/budget");

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "예산 항목을 추가하지 못했습니다.",
    };
  }
}
