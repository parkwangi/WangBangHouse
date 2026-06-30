import "server-only";

import { baseHttp } from "@/api/base-http";

export const httpServer = baseHttp.extend({
  baseUrl: process.env.INTERNAL_API_URL ?? "http://localhost:3000",
});
