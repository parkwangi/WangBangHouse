import type { WeddingPlanApi } from "@repo/api/wedding/plan";

export function createWeddingPlanQueryOptions(api: WeddingPlanApi) {
  const queries = {
    all: () => ["wedding", "plan"] as const,
    data: () => ({
      queryKey: [...queries.all(), "data"] as const,
      queryFn: (): ReturnType<WeddingPlanApi["getPlanData"]> =>
        api.getPlanData(),
    }),
  };

  return queries;
}
