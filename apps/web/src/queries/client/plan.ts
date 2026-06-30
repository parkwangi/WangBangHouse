import { createWeddingPlanQueryOptions } from "@repo/query-kit/queries/plan";

import { weddingPlanApi } from "@/api/client/plan";

export const weddingPlanQueryOptions =
  createWeddingPlanQueryOptions(weddingPlanApi);
