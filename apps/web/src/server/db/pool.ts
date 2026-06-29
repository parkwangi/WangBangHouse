import "server-only";

import { Pool } from "pg";

const globalForPostgres = globalThis as typeof globalThis & {
  postgresPool?: Pool;
};

function getPool() {
  if (globalForPostgres.postgresPool) {
    return globalForPostgres.postgresPool;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required to connect to PostgreSQL.");
  }

  const pool = new Pool({
    connectionString,
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPostgres.postgresPool = pool;
  }

  return pool;
}

export const pool = new Proxy({} as Pool, {
  get(_target, property: keyof Pool) {
    const value = getPool()[property];

    if (typeof value === "function") {
      return value.bind(getPool());
    }

    return value;
  },
});
