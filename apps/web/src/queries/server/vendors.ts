import "server-only";

import { createWeddingVendorsQueryOptions } from "@repo/query-kit/queries/vendors";

import { weddingVendorsApi } from "@/api/server/vendors";

export const weddingVendorsQueryOptions =
  createWeddingVendorsQueryOptions(weddingVendorsApi);
