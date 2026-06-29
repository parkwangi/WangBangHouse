import { resolve } from "node:path";
import pg from "pg";

import { getDatabaseUrl, upsertEnvFile } from "../lib/env-file.mjs";

const rootDir = resolve(import.meta.dirname, "../..");
const databaseUrl = getDatabaseUrl(rootDir);

const seed = {
  userId: "00000000-0000-4000-8000-000000000001",
  householdId: "00000000-0000-4000-8000-000000000002",
  weddingProjectId: "00000000-0000-4000-8000-000000000003",
};

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required. Set it in apps/web/.env.local or the shell environment.",
  );
}

const client = new pg.Client({ connectionString: databaseUrl });

try {
  await client.connect();
  await client.query("begin");

  await client.query(
    `
      insert into users (id, email, name)
      values ($1, 'dev@wangbanghouse.local', 'Dev User')
      on conflict (id) do update
      set email = excluded.email,
          name = excluded.name,
          updated_at = now()
    `,
    [seed.userId],
  );

  await client.query(
    `
      insert into households (id, name)
      values ($1, '우리 집')
      on conflict (id) do update
      set name = excluded.name,
          updated_at = now()
    `,
    [seed.householdId],
  );

  await client.query(
    `
      insert into household_members (household_id, user_id, role)
      values ($1, $2, 'owner')
      on conflict (household_id, user_id) do update
      set role = excluded.role
    `,
    [seed.householdId, seed.userId],
  );

  await client.query(
    `
      insert into wedding_projects (
        id,
        household_id,
        wedding_date,
        venue_name,
        memo
      )
      values ($1, $2, current_date + interval '180 days', '미정', '개발용 결혼 준비 프로젝트')
      on conflict (id) do update
      set household_id = excluded.household_id,
          wedding_date = excluded.wedding_date,
          venue_name = excluded.venue_name,
          memo = excluded.memo,
          updated_at = now()
    `,
    [seed.weddingProjectId, seed.householdId],
  );

  await client.query("commit");
} catch (error) {
  await client.query("rollback");
  throw error;
} finally {
  await client.end();
}

upsertEnvFile(`${rootDir}/apps/web/.env.local`, {
  DATABASE_URL: databaseUrl,
  DEV_HOUSEHOLD_ID: seed.householdId,
  DEV_WEDDING_PROJECT_ID: seed.weddingProjectId,
});

console.log("seeded dev household and wedding project");
console.log(`DEV_HOUSEHOLD_ID=${seed.householdId}`);
console.log(`DEV_WEDDING_PROJECT_ID=${seed.weddingProjectId}`);
