import type { WeddingVendorsApi } from "@repo/api/wedding/vendors";

export function createWeddingVendorsQueryOptions(api: WeddingVendorsApi) {
  const queries = {
    all: () => ["wedding", "vendors"] as const,
    list: () => ({
      queryKey: [...queries.all(), "list"] as const,
      queryFn: (): ReturnType<WeddingVendorsApi["getVendors"]> =>
        api.getVendors(),
    }),
  };

  return queries;
}
