import { existsSync, readFileSync, writeFileSync } from "node:fs";

export function readEnvFile(path) {
  if (!existsSync(path)) {
    return {};
  }

  const entries = {};
  const lines = readFileSync(path, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    entries[key] = stripQuotes(value);
  }

  return entries;
}

export function getDatabaseUrl(rootDir) {
  return (
    process.env.DATABASE_URL ??
    readEnvFile(`${rootDir}/apps/web/.env.local`).DATABASE_URL ??
    readEnvFile(`${rootDir}/apps/web/.env.example`).DATABASE_URL
  );
}

export function upsertEnvFile(path, updates) {
  const existing = existsSync(path) ? readFileSync(path, "utf8") : "";
  const lines = existing ? existing.split(/\r?\n/) : [];
  const seen = new Set();
  const nextLines = lines.map((line) => {
    const trimmed = line.trim();
    const separatorIndex = trimmed.indexOf("=");

    if (!trimmed || trimmed.startsWith("#") || separatorIndex === -1) {
      return line;
    }

    const key = trimmed.slice(0, separatorIndex).trim();

    if (!(key in updates)) {
      return line;
    }

    seen.add(key);

    return `${key}=${quoteEnvValue(updates[key])}`;
  });

  for (const [key, value] of Object.entries(updates)) {
    if (!seen.has(key)) {
      nextLines.push(`${key}=${quoteEnvValue(value)}`);
    }
  }

  writeFileSync(path, `${nextLines.filter(Boolean).join("\n")}\n`);
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function quoteEnvValue(value) {
  return `"${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
}
