import type { WeddingDocumentsApi } from "@repo/api/wedding/documents";

export function createWeddingDocumentsQueryOptions(api: WeddingDocumentsApi) {
  const queries = {
    all: () => ["wedding", "documents"] as const,
    pageData: () => ({
      queryKey: [...queries.all(), "page-data"] as const,
      queryFn: (): ReturnType<WeddingDocumentsApi["getDocumentsPageData"]> =>
        api.getDocumentsPageData(),
    }),
  };

  return queries;
}
