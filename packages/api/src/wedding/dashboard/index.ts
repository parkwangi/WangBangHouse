import ky from "ky";
import type { KyInstance } from "ky";

import { weddingDashboardDataSchema } from "@repo/api/wedding/dashboard/schema";

export class WeddingDashboardApi {
  private client: KyInstance;

  constructor(options?: { client?: KyInstance }) {
    this.client = options?.client ?? ky;
  }

  async getDashboardData() {
    const result = await this.client.get("dashboard").json();

    return weddingDashboardDataSchema.parse(result);
  }
}
