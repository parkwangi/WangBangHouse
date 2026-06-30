import { createWeddingVendorsQueryOptions } from "@repo/query-kit/queries/vendors";

import { weddingVendorsApi } from "@/api/client/vendors";

export const weddingVendorsQueryOptions =
  createWeddingVendorsQueryOptions(weddingVendorsApi);
