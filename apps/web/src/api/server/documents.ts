import "server-only";

import { WeddingDocumentsApi } from "@repo/api/wedding/documents";

import { httpServer } from "@/api/server/http";

export const weddingDocumentsApi = new WeddingDocumentsApi({
  client: httpServer,
});
