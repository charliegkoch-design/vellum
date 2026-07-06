import { cookies } from "next/headers";
import crypto from "node:crypto";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { sessions, users, type User } from "@/db/schema";

const COOKIE = "vellum_session";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function createSession(userId: number) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TTL_MS);
  db.insert(sessions).values({ id: token, userId, expiresAt }).run();
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const row = db
    .select({ user: users, session: sessions })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(eq(sessions.id, token))
    .get();
  if (!row) return null;
  if (row.session.expiresAt.getTime() < Date.now()) {
    db.delete(sessions).where(eq(sessions.id, token)).run();
    return null;
  }
  return row.user;
});

export async function destroySession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) db.delete(sessions).where(eq(sessions.id, token)).run();
  store.delete(COOKIE);
}
