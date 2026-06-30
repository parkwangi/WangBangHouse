import { z } from "zod";
import ky from "ky";
import type { KyInstance } from "ky";

import {
  createVendorSchema,
  vendorSchema,
  type CreateVendorInput,
} from "@repo/api/wedding/vendors/schema";
import type { ApiActionResult } from "@repo/api/common/action-result";

const vendorsResponseSchema = z.object({
  vendors: z.array(vendorSchema),
});

export class WeddingVendorsApi {
  private client: KyInstance;

  constructor(options?: { client?: KyInstance }) {
    this.client = options?.client ?? ky;
  }

  async getVendors() {
    const result = await this.client.get("vendors").json();

    return vendorsResponseSchema.parse(result);
  }

  async createVendor(input: CreateVendorInput) {
    const payload = createVendorSchema.parse(input);

    return this.client.post("vendors", { json: payload }).json<ApiActionResult>();
  }
}
