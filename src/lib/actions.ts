"use server";

import bcrypt from "bcryptjs";
import { and, eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { friendships, ratings, reviews, users } from "@/db/schema";
import { createSession, destroySession, getCurrentUser } from "./session";

export type FormState = { error?: string } | undefined;

const AVATAR_COLORS = [
  "#e2582a", "#d9a441", "#7fc2ac", "#5fb7d4",
  "#8aa8e2", "#b79ce0", "#e28aa0", "#d45f5f",
];

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

// ---------------- auth ----------------

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const displayName = String(formData.get("displayName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!/^[a-z0-9_]{2,24}$/.test(username))
    return { error: "Username must be 2–24 characters: letters, numbers, underscores." };
  if (!displayName) return { error: "Please tell us your name." };
  if (!email.includes("@")) return { error: "That email doesn't look right." };
  if (password.length < 8) return { error: "Password needs at least 8 characters." };

  const taken = db
    .select({ id: users.id })
    .from(users)
    .where(or(eq(users.username, username), eq(users.email, email)))
    .get();
  if (taken) return { error: "That username or email is already on Vellum." };

  const created = db
    .insert(users)
    .values({
      username,
      displayName,
      email,
      passwordHash: bcrypt.hashSync(password, 10),
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    })
    .returning()
    .get();

  await createSession(created.id);
  revalidatePath("/", "layout");
  redirect("/");
}

export async function logIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const handle = String(formData.get("handle") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = db
    .select()
    .from(users)
    .where(or(eq(users.username, handle), eq(users.email, handle)))
    .get();
  if (!user || !bcrypt.compareSync(password, user.passwordHash))
    return { error: "Wrong username or password." };
  await createSession(user.id);
  revalidatePath("/", "layout");
  redirect("/");
}

export async function logOut() {
  await destroySession();
  revalidatePath("/", "layout");
  redirect("/");
}

// ---------------- ratings & reviews ----------------

export async function rateBook(bookId: number, stars: number) {
  const user = await requireUser();
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) return;
  db.insert(ratings)
    .values({ userId: user.id, bookId, stars })
    .onConflictDoUpdate({
      target: [ratings.userId, ratings.bookId],
      set: { stars, createdAt: new Date() },
    })
    .run();
  revalidatePath("/", "layout");
}

export async function removeRating(bookId: number) {
  const user = await requireUser();
  db.delete(ratings)
    .where(and(eq(ratings.userId, user.id), eq(ratings.bookId, bookId)))
    .run();
  revalidatePath("/", "layout");
}

export async function postReview(bookId: number, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 20) return { error: "Say a little more — reviews need at least 20 characters." };
  if (body.length > 4000) return { error: "That's a dissertation. Keep it under 4000 characters." };
  db.insert(reviews).values({ userId: user.id, bookId, body }).run();
  revalidatePath("/", "layout");
  return undefined;
}

export async function deleteReview(reviewId: number) {
  const user = await requireUser();
  db.delete(reviews)
    .where(and(eq(reviews.id, reviewId), eq(reviews.userId, user.id)))
    .run();
  revalidatePath("/", "layout");
}

// ---------------- friendships ----------------

export async function sendFriendRequest(otherId: number) {
  const user = await requireUser();
  if (otherId === user.id) return;
  const existing = db
    .select()
    .from(friendships)
    .where(
      or(
        and(eq(friendships.requesterId, user.id), eq(friendships.addresseeId, otherId)),
        and(eq(friendships.requesterId, otherId), eq(friendships.addresseeId, user.id)),
      ),
    )
    .get();
  if (existing) return;
  db.insert(friendships).values({ requesterId: user.id, addresseeId: otherId }).run();
  revalidatePath("/", "layout");
}

export async function acceptFriendRequest(friendshipId: number) {
  const user = await requireUser();
  db.update(friendships)
    .set({ status: "accepted", acceptedAt: new Date() })
    .where(
      and(
        eq(friendships.id, friendshipId),
        eq(friendships.addresseeId, user.id),
        eq(friendships.status, "pending"),
      ),
    )
    .run();
  revalidatePath("/", "layout");
}

export async function declineFriendRequest(friendshipId: number) {
  const user = await requireUser();
  db.delete(friendships)
    .where(
      and(
        eq(friendships.id, friendshipId),
        eq(friendships.addresseeId, user.id),
        eq(friendships.status, "pending"),
      ),
    )
    .run();
  revalidatePath("/", "layout");
}

export async function cancelFriendRequest(friendshipId: number) {
  const user = await requireUser();
  db.delete(friendships)
    .where(
      and(
        eq(friendships.id, friendshipId),
        eq(friendships.requesterId, user.id),
        eq(friendships.status, "pending"),
      ),
    )
    .run();
  revalidatePath("/", "layout");
}

export async function removeFriend(otherId: number) {
  const user = await requireUser();
  db.delete(friendships)
    .where(
      and(
        eq(friendships.status, "accepted"),
        or(
          and(eq(friendships.requesterId, user.id), eq(friendships.addresseeId, otherId)),
          and(eq(friendships.requesterId, otherId), eq(friendships.addresseeId, user.id)),
        ),
      ),
    )
    .run();
  revalidatePath("/", "layout");
}
