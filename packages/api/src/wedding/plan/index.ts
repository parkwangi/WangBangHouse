import { z } from "zod";
import ky from "ky";
import type { KyInstance } from "ky";

import {
  createWeddingScheduleItemSchema,
  getKoreanHolidayResponse,
  weddingScheduleItemSchema,
  type CreateWeddingScheduleItemInput,
} from "@repo/api/wedding/plan/schema";
import type { WeddingScheduleItem } from "@repo/api/wedding/plan/types";
import type { ApiActionResult } from "@repo/api/common/action-result";

const weddingPlanResponseSchema = z.object({
  tasks: z.array(weddingScheduleItemSchema),
});

export class WeddingPlanApi {
  private client: KyInstance;

  constructor(options?: { client?: KyInstance }) {
    this.client = options?.client ?? ky;
  }

  async getPlanData() {
    const result = await this.client.get("/api/wedding/plan").json();

    return weddingPlanResponseSchema.parse(result);
  }

  async createScheduleItem(input: CreateWeddingScheduleItemInput) {
    const payload = createWeddingScheduleItemSchema.parse(input);

    return this.client
      .post("plan", { json: payload })
      .json<ApiActionResult<WeddingScheduleItem>>();
  }

  async deleteScheduleItem(scheduleItemId: string) {
    return this.client
      .delete("plan", {
        json: {
          scheduleItemId,
        },
      })
      .json<ApiActionResult>();
  }

  async getKoreanHolidays(year: number) {
    const result = await this.client
      .get(
        "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo",
        {
          searchParams: {
            solYear: String(year),
            numOfRows: "100",
            ServiceKey: process.env.KASI_SPECIAL_DAY_SERVICE_KEY,
          },
        },
      )
      .json();

    return getKoreanHolidayResponse.parse(result);
  }
}
