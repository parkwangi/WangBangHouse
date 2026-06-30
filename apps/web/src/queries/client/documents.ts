import { createWeddingDocumentsQueryOptions } from "@repo/query-kit/queries/documents";

import { weddingDocumentsApi } from "@/api/client/documents";

export const weddingDocumentsQueryOptions =
  createWeddingDocumentsQueryOptions(weddingDocumentsApi);
