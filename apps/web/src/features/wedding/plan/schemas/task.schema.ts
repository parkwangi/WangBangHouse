import { z } from "zod";

import { emptyToUndefined } from "@/features/wedding/shared/schemas/form-utils";

export const weddingTaskStatusSchema = z.enum(["todo", "in_progress", "done"]);

export const createWeddingTaskSchema = z.object({
  title: z.string().trim().min(1, "할 일 제목을 입력해주세요."),
  category: z.string().trim().min(1, "카테고리를 선택해주세요."),
  dueDate: z.preprocess(emptyToUndefined, z.string().optional()),
  memo: z.preprocess(emptyToUndefined, z.string().optional()),
});

export type WeddingTaskStatus = z.infer<typeof weddingTaskStatusSchema>;
export type CreateWeddingTaskFormInput = z.input<
  typeof createWeddingTaskSchema
>;
export type CreateWeddingTaskInput = z.infer<typeof createWeddingTaskSchema>;
