import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-enter flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-32 text-center">
      <p className="heading-display text-8xl italic">404</p>
      <p className="mt-4 max-w-sm text-cream-dim">
        This page was returned to the library. Perhaps it&apos;s overdue somewhere else.
      </p>
      <Link href="/" className="pill-solid mt-8">
        Back to the shelf
      </Link>
    </main>
  );
}
