import type { Metadata } from "next";
import { LoginForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Log in — Vellum" };

export default function LoginPage() {
  return (
    <main className="page-enter flex flex-1 items-center justify-center px-6 pb-16 pt-32">
      <div className="w-full max-w-sm">
        <p className="eyebrow mb-4 justify-center before:hidden">Chapter two</p>
        <h1 className="heading-display mb-2 text-center text-6xl">
          Welcome <span className="italic text-cream-dim">back</span>
        </h1>
        <p className="mb-9 text-center text-cream-faint">Your shelf missed you.</p>
        <div className="card p-7">
          <LoginForm />
        </div>
        <div className="mt-6 text-center text-xs text-cream-faint">
          Demo account:{" "}
          <span className="rounded-md border border-line bg-ink-raised px-2 py-1 font-mono text-cream-dim">
            charlie
          </span>{" "}
          <span className="rounded-md border border-line bg-ink-raised px-2 py-1 font-mono text-cream-dim">
            books123
          </span>
        </div>
      </div>
    </main>
  );
}
