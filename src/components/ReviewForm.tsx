"use client";

import { useActionState, useRef } from "react";
import type { FormState } from "@/lib/actions";

export default function ReviewForm({
  action,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    async (prev, fd) => {
      const result = await action(prev, fd);
      if (!result?.error) formRef.current?.reset();
      return result;
    },
    undefined,
  );

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3">
      <textarea
        name="body"
        rows={4}
        placeholder="What did this book do to you?"
        className="input-dark resize-y"
        required
        minLength={20}
      />
      {state?.error && <p className="text-sm text-ember">{state.error}</p>}
      <button type="submit" disabled={pending} className="pill-solid self-start disabled:opacity-60">
        {pending ? "Publishing…" : "Publish review"}
      </button>
    </form>
  );
}
