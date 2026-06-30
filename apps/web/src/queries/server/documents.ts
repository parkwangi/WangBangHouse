import "server-only";

import { createWeddingDocumentsQueryOptions } from "@repo/query-kit/queries/documents";

import { weddingDocumentsApi } from "@/api/server/documents";

export const weddingDocumentsQueryOptions =
  createWeddingDocumentsQueryOptions(weddingDocumentsApi);
