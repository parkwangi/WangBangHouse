import { WeddingDocumentsApi } from "@repo/api/wedding/documents";

import { httpClient } from "@/api/client/http";

export const weddingDocumentsApi = new WeddingDocumentsApi({
  client: httpClient,
});
