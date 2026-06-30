import "server-only";

import { WeddingVendorsApi } from "@repo/api/wedding/vendors";

import { httpServer } from "@/api/server/http";

export const weddingVendorsApi = new WeddingVendorsApi({ client: httpServer });
