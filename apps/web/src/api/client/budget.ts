import { WeddingBudgetApi } from "@repo/api/wedding/budget";

import { httpClient } from "@/api/client/http";

export const weddingBudgetApi = new WeddingBudgetApi({ client: httpClient });
