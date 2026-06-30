import ky from "ky";
import type { KyInstance } from "ky";

import {
  createBudgetItemSchema,
  weddingBudgetResponseSchema,
  type CreateBudgetItemInput,
} from "@repo/api/wedding/budget/schema";
import type { ApiActionResult } from "@repo/api/common/action-result";

export class WeddingBudgetApi {
  private client: KyInstance;

  constructor(options?: { client?: KyInstance }) {
    this.client = options?.client ?? ky;
  }

  async getBudgetPageData() {
    const result = await this.client.get("budget").json();

    return weddingBudgetResponseSchema.parse(result);
  }

  async createBudgetItem(input: CreateBudgetItemInput) {
    const payload = createBudgetItemSchema.parse(input);

    return this.client.post("budget", { json: payload }).json<ApiActionResult>();
  }
}
