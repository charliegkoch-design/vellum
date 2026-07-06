import type { Metadata } from "next";
import { LoginForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Log in — Vellum" };

export default function LoginPage() {
  return (
    <main className="page-enter flex flex-1 items-center justify-center px-6 pb-16 pt-32">
      <div className="w-full max-w-sm">
        <h1 className="heading-display mb-2 text-center text-5xl">Welcome back</h1>
        <p className="mb-8 text-center text-cream-faint">Your shelf missed you.</p>
        <LoginForm />
        <div className="card mt-8 px-4 py-3 text-center text-xs text-cream-faint">
          Demo account: <span className="text-cream-dim">charlie</span> ·{" "}
          <span className="text-cream-dim">books123</span>
        </div>
      </div>
    </main>
  );
}
