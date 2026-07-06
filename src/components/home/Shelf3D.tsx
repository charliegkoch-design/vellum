"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import Book3D from "../Book3D";
import Stars from "../Stars";
import { formatMean } from "@/lib/ranking";
import { skipMotion } from "@/lib/motion";

export type ShelfBook = {
  id: number;
  slug: string;
  title: string;
  author: string;
  coverUrl: string;
  mean: number;
  votes: number;
  myStars?: number | null;
};

const TRACK_ANGLE = -30; // counter-rotation for focus; mirrors .shelf-rot rotateY(30deg)

export default function Shelf3D({ books }: { books: ShelfBook[] }) {
  const shelfRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable | null>(null);
  const wasDraggedRef = useRef(false);
  const boundsRef = useRef({ minX: 0, maxX: 0 });
  const slotWRef = useRef(178);
  const [focused, setFocused] = useState<number | null>(null);
  const focusedRef = useRef<number | null>(null);
  focusedRef.current = focused;

  // ---- clear focus: tween the focused slot back into the shelf line ----
  const clearFocus = () => {
    const idx = focusedRef.current;
    if (idx === null) return;
    const slots = trackRef.current?.children;
    const d = skipMotion() ? 0 : 1;
    if (slots?.[idx]) {
      gsap.to(slots[idx], {
        rotationY: 0,
        z: 0,
        y: 0,
        scale: 1,
        duration: 0.7 * d,
        ease: "power3.inOut",
      });
      gsap.to(Array.from(slots).filter((_, i) => i !== idx), {
        opacity: 1,
        duration: 0.5 * d,
      });
    }
    setFocused(null);
  };

  const focusBook = (idx: number) => {
    if (wasDraggedRef.current) return;
    const slots = trackRef.current?.children;
    if (!slots) return;
    if (focusedRef.current === idx) return; // second click handled by the panel link
    const d = skipMotion() ? 0 : 1;
    if (focusedRef.current !== null) {
      const prev = slots[focusedRef.current];
      gsap.to(prev, { rotationY: 0, z: 0, y: 0, scale: 1, duration: 0.7 * d, ease: "power3.inOut" });
    }
    gsap.to(slots[idx], {
      rotationY: TRACK_ANGLE,
      z: 170,
      y: -26,
      scale: 1.06,
      duration: 0.85 * d,
      ease: "power3.inOut",
    });
    gsap.to(
      Array.from(slots).filter((_, i) => i !== idx),
      { opacity: 0.4, duration: 0.6 * d },
    );
    // slide the shelf so the focused book sits near center stage
    const shelf = shelfRef.current;
    const track = trackRef.current;
    if (shelf && track) {
      const target = gsap.utils.clamp(
        boundsRef.current.minX,
        boundsRef.current.maxX,
        shelf.clientWidth * 0.34 - idx * slotWRef.current,
      );
      gsap.to(track, { x: target, duration: 0.85 * d, ease: "power3.inOut", overwrite: "auto" });
      if (draggableRef.current) {
        gsap.set(draggableRef.current.target, { x: target });
        draggableRef.current.update();
      }
    }
    setFocused(idx);
  };

  // ---- drag + inertia + entrance ----
  useLayoutEffect(() => {
    gsap.registerPlugin(Draggable, InertiaPlugin);
    const shelf = shelfRef.current!;
    const track = trackRef.current!;
    const slots = Array.from(track.children) as HTMLElement[];
    const slotW = parseFloat(getComputedStyle(shelf).getPropertyValue("--slot")) || 178;
    const reduced = skipMotion();

    const setX = gsap.quickSetter(track, "x", "px");
    slotWRef.current = slotW;
    let bounds = { minX: 0, maxX: 0 };
    const computeBounds = () => {
      const total = books.length * slotW;
      bounds = { minX: Math.min(0, -(total - shelf.clientWidth * 0.72)), maxX: slotW * 0.4 };
      boundsRef.current = bounds;
    };
    computeBounds();

    const proxy = document.createElement("div");
    const drag = Draggable.create(proxy, {
      type: "x",
      trigger: shelf,
      inertia: !reduced,
      dragResistance: 0.06,
      onPress() {
        wasDraggedRef.current = false;
        gsap.killTweensOf(track, "x");
        this.update();
      },
      onDragStart() {
        wasDraggedRef.current = true;
        clearFocus();
      },
      onDrag() {
        setX(gsap.utils.clamp(bounds.minX, bounds.maxX, this.x));
      },
      onThrowUpdate() {
        setX(gsap.utils.clamp(bounds.minX, bounds.maxX, this.x));
      },
      snap: (v) => Math.round(gsap.utils.clamp(bounds.minX, bounds.maxX, v) / slotW) * slotW,
    })[0];
    draggableRef.current = drag;

    // horizontal wheel / trackpad swipe
    let wheelX = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // let vertical scroll pass
      e.preventDefault();
      wheelX = gsap.utils.clamp(
        bounds.minX,
        bounds.maxX,
        (gsap.getProperty(track, "x") as number) - e.deltaX * 1.4,
      );
      gsap.to(track, { x: wheelX, duration: reduced ? 0 : 0.5, ease: "power3.out", overwrite: "auto" });
      gsap.set(proxy, { x: wheelX });
      drag.update();
    };
    shelf.addEventListener("wheel", onWheel, { passive: false });

    // arrow keys
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return clearFocus();
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const cur = gsap.getProperty(track, "x") as number;
      const next = gsap.utils.clamp(
        bounds.minX,
        bounds.maxX,
        cur + (e.key === "ArrowLeft" ? slotW : -slotW),
      );
      gsap.to(track, { x: next, duration: reduced ? 0 : 0.6, ease: "power3.out", overwrite: "auto" });
      gsap.set(proxy, { x: next });
      drag.update();
    };
    window.addEventListener("keydown", onKey);

    const onResize = () => computeBounds();
    window.addEventListener("resize", onResize);

    // entrance: books cascade in along the shelf line
    if (!reduced) {
      gsap.fromTo(
        slots,
        { x: 780, opacity: 0, rotationY: 24 },
        {
          x: 0,
          opacity: 1,
          rotationY: 0,
          duration: 1.5,
          ease: "power4.out",
          stagger: 0.06,
          delay: 0.25,
          clearProps: "rotationY",
        },
      );
    }

    return () => {
      drag.kill();
      shelf.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      gsap.killTweensOf([track, ...slots]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books]);

  // clicking the empty shelf background clears focus
  useEffect(() => {
    const shelf = shelfRef.current!;
    const onClick = (e: MouseEvent) => {
      if (wasDraggedRef.current) return;
      if ((e.target as HTMLElement).closest(".shelf-slot")) return;
      clearFocus();
    };
    shelf.addEventListener("click", onClick);
    return () => shelf.removeEventListener("click", onClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusedBook = focused !== null ? books[focused] : null;

  return (
    <div ref={shelfRef} className="hero-shelf">
      <div className="shelf-rot">
        <div ref={trackRef} className="shelf-track">
          {books.map((b, i) => (
            <div
              key={b.id}
              className="shelf-slot"
              onClick={() => focusBook(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && focusBook(i)}
              aria-label={`${b.title} by ${b.author}`}
            >
              <Book3D coverUrl={b.coverUrl} title={b.title} />
            </div>
          ))}
        </div>
      </div>

      {/* focused-book info panel; pointer events must not reach the drag trigger */}
      <div
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className={`absolute bottom-[16%] left-6 z-20 max-w-sm transition-all duration-500 md:left-[6%] ${
          focusedBook
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        {focusedBook && (
          <div className="card border-cream/15 bg-ink/80 p-6 backdrop-blur-md">
            <p className="heading-display text-3xl italic leading-tight">{focusedBook.title}</p>
            <p className="mt-1 text-sm text-cream-dim">
              {focusedBook.author}
            </p>
            <div className="mt-3 flex items-center gap-2 text-lg">
              <Stars value={focusedBook.mean} />
              <span className="text-sm text-cream-dim">
                {formatMean(focusedBook.mean)} · {focusedBook.votes} ratings
              </span>
            </div>
            {focusedBook.myStars != null && (
              <p className="mt-1 text-xs text-gold">You rated it {focusedBook.myStars}★</p>
            )}
            <div className="mt-4 flex items-center gap-3">
              <Link href={`/books/${focusedBook.slug}`} className="pill-solid !py-2 text-sm">
                Open book →
              </Link>
              <button
                onClick={clearFocus}
                className="cursor-pointer text-sm text-cream-faint hover:text-cream"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
