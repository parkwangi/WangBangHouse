import { createWeddingDashboardQueryOptions } from "@repo/query-kit/queries/dashboard";

import { weddingDashboardApi } from "@/api/client/dashboard";

export const weddingDashboardQueryOptions =
  createWeddingDashboardQueryOptions(weddingDashboardApi);
