import "server-only";

import type { PoolClient } from "pg";

import { pool } from "@/server/db/pool";

export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
) {
  const client = await pool.connect();

  try {
    await client.query("begin");
    const result = await callback(client);
    await client.query("commit");

    return result;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
