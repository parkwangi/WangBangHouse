"use server";

import { revalidatePath } from "next/cache";

import { createVendor } from "@/features/wedding/vendors/repositories/vendor.repository";
import {
  createVendorSchema,
  type CreateVendorInput,
} from "@/features/wedding/vendors/schemas/vendor.schema";

import type { ActionResult } from "@/features/wedding/shared/actions/action-result";

export async function createVendorAction(
  input: CreateVendorInput,
): Promise<ActionResult> {
  const parsed = createVendorSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "입력값을 확인해주세요.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createVendor(parsed.data);

    revalidatePath("/wedding/vendors");
    revalidatePath("/wedding/budget");

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "업체를 추가하지 못했습니다.",
    };
  }
}
