import { z } from "zod";
import ky from "ky";
import type { KyInstance } from "ky";

import {
  createDocumentSchema,
  documentMetadataSchema,
  type CreateDocumentInput,
} from "@repo/api/wedding/documents/schema";
import { vendorSchema } from "@repo/api/wedding/vendors/schema";
import type { ApiActionResult } from "@repo/api/common/action-result";

const documentsPageResponseSchema = z.object({
  documents: z.array(documentMetadataSchema),
  vendors: z.array(vendorSchema),
});

export class WeddingDocumentsApi {
  private client: KyInstance;

  constructor(options?: { client?: KyInstance }) {
    this.client = options?.client ?? ky;
  }

  async getDocumentsPageData() {
    const result = await this.client.get("documents").json();

    return documentsPageResponseSchema.parse(result);
  }

  async createDocument(input: CreateDocumentInput) {
    const payload = createDocumentSchema.parse(input);

    return this.client.post("documents", { json: payload }).json<ApiActionResult>();
  }
}
