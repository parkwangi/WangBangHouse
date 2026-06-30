import { z } from "zod";

import { emptyToUndefined } from "@repo/api/wedding/shared/schemas/form-utils";

export const weddingScheduleItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  scheduledDate: z.string().nullable(),
  memo: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

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

export const koreaHolidayItems = z.object({
  item: z.array(
    z.object({
      dateKind: z.string(),
      dateName: z.string(),
      isHoliday: z.string(),
      locdate: z.number(),
      seq: z.number(),
    }),
  ),
});

export const getKoreanHolidayResponse = z.object({
  response: z.object({
    body: z.object({
      items: koreaHolidayItems,
      numOfRows: z.number(),
      pageNo: z.number(),
      totalCount: z.number(),
    }),
    header: z.object({
      resultCode: z.string(),
      resultMsg: z.string(),
    }),
  }),
});

export type KoreanHoliday = z.infer<typeof getKoreanHolidayResponse>;
