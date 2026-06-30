import { WeddingPlanApi } from "@repo/api/wedding/plan";

import { httpClient } from "@/api/client/http";

export const weddingPlanApi = new WeddingPlanApi({ client: httpClient });
