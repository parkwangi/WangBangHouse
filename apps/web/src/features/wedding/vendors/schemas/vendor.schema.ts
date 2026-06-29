import { z } from "zod";

import { emptyToUndefined } from "@/features/wedding/shared/schemas/form-utils";

export const createVendorSchema = z.object({
  name: z.string().trim().min(1, "업체명을 입력해주세요."),
  category: z.string().trim().min(1, "카테고리를 선택해주세요."),
  phone: z.preprocess(emptyToUndefined, z.string().optional()),
  address: z.preprocess(emptyToUndefined, z.string().optional()),
  memo: z.preprocess(emptyToUndefined, z.string().optional()),
});

export type CreateVendorFormInput = z.input<typeof createVendorSchema>;
export type CreateVendorInput = z.infer<typeof createVendorSchema>;
