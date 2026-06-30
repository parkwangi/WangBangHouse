import type { WeddingBudgetApi } from "@repo/api/wedding/budget";

export function createWeddingBudgetQueryOptions(api: WeddingBudgetApi) {
  const queries = {
    all: () => ["wedding", "budget"] as const,
    pageData: () => ({
      queryKey: [...queries.all(), "page-data"] as const,
      queryFn: (): ReturnType<WeddingBudgetApi["getBudgetPageData"]> =>
        api.getBudgetPageData(),
    }),
  };

  return queries;
}
