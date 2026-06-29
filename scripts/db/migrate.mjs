import { readdirSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import process from "node:process";
import pg from "pg";

import { getDatabaseUrl } from "../lib/env-file.mjs";

const rootDir = resolve(import.meta.dirname, "../..");
const migrationsDir = `${rootDir}/database/migrations`;
const databaseUrl = getDatabaseUrl(rootDir);

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required. Set it in apps/web/.env.local or the shell environment.",
  );
}

const client = new pg.Client({ connectionString: databaseUrl });

try {
  await client.connect();
  await client.query(`
    create table if not exists schema_migrations (
      filename text primary key,
      applied_at timestamptz not null default now()
    )
  `);

  const applied = await client.query("select filename from schema_migrations");
  const appliedFilenames = new Set(applied.rows.map((row) => row.filename));
  const migrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of migrationFiles) {
    if (appliedFilenames.has(file)) {
      console.log(`skip ${file}`);
      continue;
    }

    const sql = readFileSync(`${migrationsDir}/${file}`, "utf8");

    await client.query("begin");

    try {
      await client.query(sql);
      await client.query(
        "insert into schema_migrations (filename) values ($1)",
        [file],
      );
      await client.query("commit");
      console.log(`applied ${file}`);
    } catch (error) {
      await client.query("rollback");
      error.message = `Failed to apply ${basename(file)}: ${error.message}`;
      throw error;
    }
  }
} finally {
  await client.end();
}
