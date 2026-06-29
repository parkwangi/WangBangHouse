import { z } from "zod";

import { emptyToUndefined } from "@/features/wedding/shared/schemas/form-utils";

export const createDocumentSchema = z.object({
  title: z.string().trim().min(1, "문서 제목을 입력해주세요."),
  documentType: z.string().trim().min(1, "문서 종류를 입력해주세요."),
  vendorId: z.preprocess(emptyToUndefined, z.string().uuid().optional()),
  relatedType: z.string().trim().min(1, "관련 유형을 입력해주세요."),
  relatedId: z.preprocess(emptyToUndefined, z.string().uuid().optional()),
  memo: z.preprocess(emptyToUndefined, z.string().optional()),
});

export type CreateDocumentFormInput = z.input<typeof createDocumentSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
