import "server-only";

import { createWeddingPlanQueryOptions } from "@repo/query-kit/queries/plan";

import { weddingPlanApi } from "@/api/server/plan";

export const weddingPlanQueryOptions =
  createWeddingPlanQueryOptions(weddingPlanApi);
