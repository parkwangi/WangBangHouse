import { WeddingVendorsApi } from "@repo/api/wedding/vendors";

import { httpClient } from "@/api/client/http";

export const weddingVendorsApi = new WeddingVendorsApi({ client: httpClient });
