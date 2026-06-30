import { WeddingDashboardApi } from "@repo/api/wedding/dashboard";

import { httpClient } from "@/api/client/http";

export const weddingDashboardApi = new WeddingDashboardApi({
  client: httpClient,
});
