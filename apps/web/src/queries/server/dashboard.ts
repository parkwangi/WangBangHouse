import "server-only";

import { createWeddingDashboardQueryOptions } from "@repo/query-kit/queries/dashboard";

import { weddingDashboardApi } from "@/api/server/dashboard";

export const weddingDashboardQueryOptions =
  createWeddingDashboardQueryOptions(weddingDashboardApi);
