import "server-only";

import { WeddingBudgetApi } from "@repo/api/wedding/budget";

import { httpServer } from "@/api/server/http";

export const weddingBudgetApi = new WeddingBudgetApi({ client: httpServer });
