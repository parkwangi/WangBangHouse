import { z } from "zod";

import { emptyToUndefined } from "@repo/api/wedding/shared/schemas/form-utils";

export const budgetItemSchema = z.object({
  id: z.string(),
  vendorId: z.string().nullable(),
  category: z.string(),
  title: z.string(),
  estimatedAmount: z.number(),
  contractedAmount: z.number().nullable(),
  paidAmount: z.number(),
  paymentDueDate: z.string().nullable(),
  memo: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const budgetSummarySchema = z.object({
  totalEstimatedAmount: z.number(),
  totalContractedAmount: z.number(),
  totalPaidAmount: z.number(),
  remainingAmount: z.number(),
});

export const weddingBudgetResponseSchema = z.object({
  items: z.array(budgetItemSchema),
  summary: budgetSummarySchema,
});

const optionalAmountSchema = z.preprocess(
  emptyToUndefined,
  z.coerce.number().int().min(0).optional(),
);

export const createBudgetItemSchema = z.object({
  category: z.string().trim().min(1, "카테고리를 선택해주세요."),
  title: z.string().trim().min(1, "예산 항목명을 입력해주세요."),
  estimatedAmount: z.coerce.number().int().min(0),
  contractedAmount: optionalAmountSchema,
  paidAmount: z.coerce.number().int().min(0).default(0),
  paymentDueDate: z.preprocess(emptyToUndefined, z.string().optional()),
  memo: z.preprocess(emptyToUndefined, z.string().optional()),
});

export type CreateBudgetItemFormInput = z.input<typeof createBudgetItemSchema>;
export type CreateBudgetItemInput = z.infer<typeof createBudgetItemSchema>;
