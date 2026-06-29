import { z } from "zod";

import { emptyToUndefined } from "@/features/wedding/shared/schemas/form-utils";

export const createWeddingScheduleItemSchema = z.object({
  title: z.string().trim().min(1, "일정명을 입력해주세요."),
  category: z.string().trim().min(1, "카테고리를 선택해주세요."),
  scheduledDate: z.preprocess(emptyToUndefined, z.string().optional()),
  memo: z.preprocess(emptyToUndefined, z.string().optional()),
});

export type CreateWeddingScheduleItemFormInput = z.input<
  typeof createWeddingScheduleItemSchema
>;
export type CreateWeddingScheduleItemInput = z.infer<
  typeof createWeddingScheduleItemSchema
>;
