import "server-only";

import { WeddingDashboardApi } from "@repo/api/wedding/dashboard";

import { httpServer } from "@/api/server/http";

export const weddingDashboardApi = new WeddingDashboardApi({
  client: httpServer,
});
