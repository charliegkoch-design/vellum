"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Shelf3D, { type ShelfBook } from "./Shelf3D";
import { skipMotion } from "@/lib/motion";

export type ShelfSet = { key: string; label: string; books: ShelfBook[] };

export default function Hero({ sets, greeting }: { sets: ShelfSet[]; greeting?: string }) {
  const [activeKey, setActiveKey] = useState(sets[0]?.key);
  const shelfWrapRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const active = sets.find((s) => s.key === activeKey) ?? sets[0];

  // entrance: wordmark chars rise, caption + pills fade in
  useLayoutEffect(() => {
    const root = rootRef.current!;
    if (skipMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".wm-char",
        { yPercent: 112, rotate: 5 },
        { yPercent: 0, rotate: 0, duration: 1.25, ease: "power4.out", stagger: 0.055 },
      );
      gsap.fromTo(
        [".hero-caption", ".hero-pill"],
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.05, delay: 0.55 },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const changeSet = (key: string) => {
    if (key === activeKey) return;
    const wrap = shelfWrapRef.current!;
    if (skipMotion()) {
      setActiveKey(key);
      return;
    }
    gsap.to(wrap, {
      opacity: 0,
      x: -70,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setActiveKey(key);
        gsap.fromTo(wrap, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" });
      },
    });
  };

  return (
    <section ref={rootRef} className="relative h-[100svh] overflow-hidden">
      {/* giant wordmark, behind the books */}
      <h1
        className="wordmark absolute inset-x-0 top-[13%] z-0 text-center md:top-[9%]"
        aria-label="Vellum"
      >
        {"Vellum".split("").map((c, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em]" aria-hidden="true">
            <span className="wm-char inline-block will-change-transform">{c}</span>
          </span>
        ))}
      </h1>

      <p className="hero-caption absolute left-1/2 top-[13%] z-10 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.28em] text-cream-faint md:top-[7%] md:text-xs md:tracking-[0.35em]">
        {greeting ? `${greeting} · ${active.label}` : active.label}
      </p>

      {/* the shelf */}
      <div ref={shelfWrapRef} className="absolute inset-0 z-10">
        <Shelf3D key={active.key} books={active.books} />
      </div>

      {/* genre pills */}
      <div className="absolute inset-x-0 bottom-6 z-20 flex flex-wrap items-center justify-center gap-2.5 px-4 md:bottom-9">
        {sets.map((s) => (
          <button
            key={s.key}
            onClick={() => changeSet(s.key)}
            data-active={s.key === activeKey}
            className="hero-pill pill cursor-pointer"
          >
            {s.key === "mine" || s.key === "top" ? s.label : s.key}
          </button>
        ))}
      </div>

      {/* drag hint */}
      <p className="pointer-events-none absolute bottom-24 right-6 z-10 hidden text-xs uppercase tracking-[0.3em] text-cream-faint/70 md:block">
        drag · click a book
      </p>
    </section>
  );
}
