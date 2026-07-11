"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skipMotion } from "@/lib/motion";

type Scene = { src: string; from: number; to: number };

/**
 * Three-act cinematic scroll intro. Three Higgsfield-generated films are
 * scrubbed by scroll position and crossfaded like cuts in a title sequence,
 * inside letterbox bars with chaptered serif typography, ending on a fade
 * to ink that hands off to the 3D shelf hero below.
 */
export default function IntroScroll({
  scenes,
  posterSrc,
}: {
  scenes: [string, string, string];
  posterSrc: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useLayoutEffect(() => {
    if (skipMotion()) return; // static poster fallback, no pin
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current!;
    const videos = videoRefs.current.filter(Boolean) as HTMLVideoElement[];

    // each scene owns a slice of the overall scroll progress
    const windows: Scene[] = [
      { src: scenes[0], from: 0.0, to: 0.32 },
      { src: scenes[1], from: 0.28, to: 0.6 },
      { src: scenes[2], from: 0.54, to: 0.94 },
    ];

    // scrub targets with an rAF lerp — direct currentTime writes stutter
    const targets = [0, 0, 0];
    let rafId = 0;
    const tick = () => {
      videos.forEach((v, i) => {
        if (!v.duration) return;
        const cur = v.currentTime;
        const next = cur + (targets[i] - cur) * 0.14;
        if (Math.abs(next - cur) > 0.001) v.currentTime = next;
      });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=420%",
          pin: true,
          scrub: 0.6,
          onUpdate(self) {
            const p = self.progress;
            windows.forEach((w, i) => {
              const v = videos[i];
              if (!v?.duration) return;
              const local = gsap.utils.clamp(0, 1, (p - w.from) / (w.to - w.from));
              targets[i] = local * (v.duration - 0.05);
            });
          },
        },
      });

      // ---- act I: title over the library, bars close in ----
      tl.to(".cine-bar-top", { yPercent: 0, duration: 0.06, ease: "none" }, 0.01)
        .to(".cine-bar-bottom", { yPercent: 0, duration: 0.06, ease: "none" }, 0.01)
        .to(".intro-eyebrow", { opacity: 0, y: -24, duration: 0.08 }, 0.03)
        .fromTo(".intro-title", { scale: 1 }, { scale: 0.86, ease: "none", duration: 0.24 }, 0)
        .to(".intro-title", { opacity: 0, y: -70, duration: 0.1 }, 0.23)
        .fromTo(".cine-credit", { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.08);

      // ---- cut to act II: the page turn ----
      tl.fromTo(
        ".scene-1",
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 0.07, ease: "power1.inOut" },
        0.28,
      )
        .to(".cine-chapter", { textContent: "II", duration: 0 }, 0.55)
        .fromTo(".intro-line-1", { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.09 }, 0.36)
        .to(".intro-line-1", { opacity: 0, y: -70, duration: 0.09 }, 0.5);

      // ---- cut to act III: the ascent ----
      tl.fromTo(
        ".scene-2",
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 0.07, ease: "power1.inOut" },
        0.54,
      )
        .fromTo(".intro-line-2", { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.09 }, 0.62)
        .to(".intro-line-2", { opacity: 0, y: -70, duration: 0.09 }, 0.76);

      // ---- finale: the films sink into ink, bars open ----
      tl.to(".cine-stage", { opacity: 0.1, scale: 1.05, filter: "blur(8px)", duration: 0.14 }, 0.82)
        .fromTo(".intro-line-3", { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.09 }, 0.84)
        .to(".intro-line-3 .intro-hint", { opacity: 1, duration: 0.06 }, 0.92)
        .to(".cine-bar-top", { yPercent: -100, duration: 0.06 }, 0.94)
        .to(".cine-bar-bottom", { yPercent: 100, duration: 0.06 }, 0.94)
        .to(".cine-credit", { opacity: 0, duration: 0.04 }, 0.94);

      // gold hairline progress in the bottom bar
      gsap.to(".cine-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "+=420%", scrub: true },
      });
    }, root);

    return () => {
      cancelAnimationFrame(rafId);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={rootRef} className="relative h-[100svh] overflow-hidden bg-ink">
      {/* stacked films */}
      <div className="cine-stage absolute inset-0">
        {scenes.map((src, i) => (
          <video
            key={src}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            src={src}
            poster={i === 0 ? posterSrc : undefined}
            muted
            playsInline
            preload="auto"
            className={`absolute inset-0 h-full w-full object-cover ${
              i > 0 ? `scene-${i} opacity-0` : ""
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_45%,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      {/* letterbox bars */}
      <div className="cine-bar-top absolute inset-x-0 top-0 z-20 h-[9svh] -translate-y-full bg-black">
        <p className="cine-credit absolute left-6 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.5em] text-cream-faint opacity-0">
          Vellum presents
        </p>
      </div>
      <div className="cine-bar-bottom absolute inset-x-0 bottom-0 z-20 h-[9svh] translate-y-full bg-black">
        <p className="cine-credit absolute right-6 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.5em] text-cream-faint opacity-0">
          Chapter <span className="cine-chapter">I</span>
        </p>
        <div className="cine-progress absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gold/70" />
      </div>

      {/* act I title */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
        <p className="intro-eyebrow eyebrow mb-6 justify-center before:hidden">A social library</p>
        <h1 className="intro-title wordmark relative drop-shadow-[0_10px_60px_rgba(0,0,0,0.8)]">
          Vellum
        </h1>
      </div>

      {/* chapter copy */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
        <p className="intro-line-1 heading-display absolute max-w-3xl text-4xl italic leading-tight opacity-0 md:text-6xl">
          Every book you ever loved
          <span className="text-ember">.</span>
        </p>
        <p className="intro-line-2 heading-display absolute max-w-3xl text-4xl italic leading-tight opacity-0 md:text-6xl">
          Every argument in the margins
          <span className="text-ember">.</span>
        </p>
        <p className="intro-line-3 heading-display absolute max-w-3xl text-4xl italic leading-tight opacity-0 md:text-6xl">
          Shelved with your friends
          <span className="text-ember">.</span>
          <span className="intro-hint mt-8 block text-xs uppercase tracking-[0.4em] text-cream-faint opacity-0 [font-family:var(--font-sans)]">
            keep scrolling
          </span>
        </p>
      </div>
    </div>
  );
}
