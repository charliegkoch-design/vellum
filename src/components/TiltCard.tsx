"use client";

import { useRef } from "react";
import gsap from "gsap";

/** Wraps children in a card that tilts toward the cursor. */
export default function TiltCard({
  children,
  className = "",
  max = 7,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const quick = useRef<{ rx: gsap.QuickToFunc; ry: gsap.QuickToFunc } | null>(null);

  const ensure = () => {
    if (!quick.current && ref.current) {
      quick.current = {
        rx: gsap.quickTo(ref.current, "rotationX", { duration: 0.5, ease: "power2.out" }),
        ry: gsap.quickTo(ref.current, "rotationY", { duration: 0.5, ease: "power2.out" }),
      };
    }
    return quick.current;
  };

  const onMove = (e: React.PointerEvent) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    const q = ensure()!;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    q.ry(px * max * 2);
    q.rx(-py * max * 2);
  };

  const onLeave = () => {
    const q = ensure();
    q?.rx(0);
    q?.ry(0);
  };

  return (
    <div style={{ perspective: 700 }}>
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={className}
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {children}
      </div>
    </div>
  );
}
