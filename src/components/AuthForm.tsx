"use client";

import { useActionState } from "react";
import Link from "next/link";
import { logIn, signUp, type FormState } from "@/lib/actions";

function SubmitButton({ label, pending }: { label: string; pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="pill-solid w-full !py-3 disabled:opacity-60"
    >
      {pending ? "One moment…" : label}
    </button>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(logIn, undefined);
  return (
    <form action={action} className="flex flex-col gap-4">
      <input
        name="handle"
        placeholder="Username or email"
        autoComplete="username"
        required
        className="input-dark"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        required
        className="input-dark"
      />
      {state?.error && <p className="text-sm text-ember">{state.error}</p>}
      <SubmitButton label="Log in" pending={pending} />
      <p className="text-center text-sm text-cream-faint">
        New here?{" "}
        <Link href="/join" className="text-cream-dim underline underline-offset-4 hover:text-cream">
          Join Vellum
        </Link>
      </p>
    </form>
  );
}

export function JoinForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(signUp, undefined);
  return (
    <form action={action} className="flex flex-col gap-4">
      <input name="displayName" placeholder="Your name" required className="input-dark" />
      <input
        name="username"
        placeholder="Username"
        autoComplete="username"
        required
        pattern="[a-zA-Z0-9_]{2,24}"
        className="input-dark"
      />
      <input name="email" type="email" placeholder="Email" autoComplete="email" required className="input-dark" />
      <input
        name="password"
        type="password"
        placeholder="Password (8+ characters)"
        autoComplete="new-password"
        required
        minLength={8}
        className="input-dark"
      />
      {state?.error && <p className="text-sm text-ember">{state.error}</p>}
      <SubmitButton label="Create account" pending={pending} />
      <p className="text-center text-sm text-cream-faint">
        Already reading with us?{" "}
        <Link href="/login" className="text-cream-dim underline underline-offset-4 hover:text-cream">
          Log in
        </Link>
      </p>
    </form>
  );
}
