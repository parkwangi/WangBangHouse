"use server";

import { revalidatePath } from "next/cache";

import { createDocument } from "@/features/wedding/documents/repositories/document.repository";
import {
  createDocumentSchema,
  type CreateDocumentInput,
} from "@/features/wedding/documents/schemas/document.schema";

import type { ActionResult } from "@/features/wedding/shared/actions/action-result";

export async function createDocumentAction(
  input: CreateDocumentInput,
): Promise<ActionResult> {
  const parsed = createDocumentSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "입력값을 확인해주세요.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createDocument(parsed.data);

    revalidatePath("/wedding/documents");

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "문서 메타데이터를 추가하지 못했습니다.",
    };
  }
}
