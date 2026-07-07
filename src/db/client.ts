import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import * as schema from "./schema";

/**
 * Local dev / build: the database lives in .data/vellum.db.
 * Serverless (read-only filesystem, e.g. Vercel): copy the build-time seeded
 * database into the writable tmp dir on cold start. Writes work per instance
 * but are ephemeral — fine for a demo deployment.
 */
function resolveDbPath(): string {
  const dataDir = path.join(process.cwd(), ".data");
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.accessSync(dataDir, fs.constants.W_OK);
    return path.join(dataDir, "vellum.db");
  } catch {
    const src = path.join(dataDir, "vellum.db");
    const dest = path.join(os.tmpdir(), "vellum.db");
    if (!fs.existsSync(dest) && fs.existsSync(src)) fs.copyFileSync(src, dest);
    return dest;
  }
}

const sqlite = new Database(resolveDbPath());
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });
