import { resolve } from "node:path";
import pg from "pg";

import { getDatabaseUrl, upsertEnvFile } from "../lib/env-file.mjs";

const rootDir = resolve(import.meta.dirname, "../..");
const databaseUrl = getDatabaseUrl(rootDir);

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required. Set it in apps/web/.env.local or the shell environment.",
  );
}

const client = new pg.Client({ connectionString: databaseUrl });

try {
  await client.connect();
  await client.query("begin");

  await client.query("commit");
} catch (error) {
  await client.query("rollback");
  throw error;
} finally {
  await client.end();
}

upsertEnvFile(`${rootDir}/apps/web/.env.local`, {
  DATABASE_URL: databaseUrl,
});

console.log("seeded dev database");
