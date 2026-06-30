import type { WeddingDashboardApi } from "@repo/api/wedding/dashboard";

export function createWeddingDashboardQueryOptions(api: WeddingDashboardApi) {
  const queries = {
    all: () => ["wedding", "dashboard"] as const,
    data: () => ({
      queryKey: [...queries.all(), "data"] as const,
      queryFn: (): ReturnType<WeddingDashboardApi["getDashboardData"]> =>
        api.getDashboardData(),
    }),
  };

  return queries;
}
