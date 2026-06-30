import { createWeddingBudgetQueryOptions } from "@repo/query-kit/queries/budget";

import { weddingBudgetApi } from "@/api/client/budget";

export const weddingBudgetQueryOptions =
  createWeddingBudgetQueryOptions(weddingBudgetApi);
