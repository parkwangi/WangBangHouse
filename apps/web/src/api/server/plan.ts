import "server-only";

import { WeddingPlanApi } from "@repo/api/wedding/plan";

import { httpServer } from "@/api/server/http";

export const weddingPlanApi = new WeddingPlanApi({ client: httpServer });
