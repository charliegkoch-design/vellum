import type { Metadata } from "next";
import { JoinForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Join — Vellum" };

export default function JoinPage() {
  return (
    <main className="page-enter flex flex-1 items-center justify-center px-6 pb-16 pt-32">
      <div className="w-full max-w-sm">
        <p className="eyebrow mb-4 justify-center before:hidden">Chapter one</p>
        <h1 className="heading-display mb-2 text-center text-6xl">
          Join <span className="italic text-ember">Vellum</span>
        </h1>
        <p className="mb-9 text-center text-cream-faint">
          Rate what you read. See what your friends love.
        </p>
        <div className="card p-7">
          <JoinForm />
        </div>
      </div>
    </main>
  );
}
