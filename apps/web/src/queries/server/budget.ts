import "server-only";

import { createWeddingBudgetQueryOptions } from "@repo/query-kit/queries/budget";

import { weddingBudgetApi } from "@/api/server/budget";

export const weddingBudgetQueryOptions =
  createWeddingBudgetQueryOptions(weddingBudgetApi);
