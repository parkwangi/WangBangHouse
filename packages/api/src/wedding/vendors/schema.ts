import { z } from "zod";

import { emptyToUndefined } from "@repo/api/wedding/shared/schemas/form-utils";

export const vendorSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  memo: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createVendorSchema = z.object({
  name: z.string().trim().min(1, "업체명을 입력해주세요."),
  category: z.string().trim().min(1, "카테고리를 선택해주세요."),
  phone: z.preprocess(emptyToUndefined, z.string().optional()),
  address: z.preprocess(emptyToUndefined, z.string().optional()),
  memo: z.preprocess(emptyToUndefined, z.string().optional()),
});

export type CreateVendorFormInput = z.input<typeof createVendorSchema>;
export type CreateVendorInput = z.infer<typeof createVendorSchema>;
