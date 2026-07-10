"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skipMotion } from "@/lib/motion";

/**
 * Cinematic scroll intro: a pinned viewport where a generated library film
 * is scrubbed by scroll while lines of copy trade places, ending on a fade
 * to ink that hands off to the shelf hero below.
 */
export default function IntroScroll({
  videoSrc,
  posterSrc,
}: {
  videoSrc: string;
  posterSrc: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    if (skipMotion()) return; // static poster + copy, no pin
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current!;
    const video = videoRef.current!;

    // scrub target with rAF lerp — direct currentTime writes every scroll
    // event stutter on sparse-keyframe mp4s
    let targetTime = 0;
    let rafId = 0;
    const tick = () => {
      if (video.duration) {
        const cur = video.currentTime;
        const next = cur + (targetTime - cur) * 0.12;
        if (Math.abs(next - cur) > 0.001) video.currentTime = next;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=280%",
          pin: true,
          scrub: 0.6,
          onUpdate(self) {
            if (video.duration) targetTime = self.progress * (video.duration - 0.05);
          },
        },
      });

      // stage A — title over the film, slowly receding
      tl.fromTo(".intro-title", { scale: 1 }, { scale: 0.82, ease: "none", duration: 0.4 }, 0)
        .to(".intro-eyebrow", { opacity: 0, y: -20, duration: 0.12 }, 0.08)
        .to(".intro-title", { opacity: 0, y: -60, duration: 0.18 }, 0.26);

      // stage B — copy lines trade places over the push-in
      tl.fromTo(".intro-line-1", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.12 }, 0.34)
        .to(".intro-line-1", { opacity: 0, y: -60, duration: 0.12 }, 0.52)
        .fromTo(".intro-line-2", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.12 }, 0.56)
        .to(".intro-line-2", { opacity: 0, y: -60, duration: 0.12 }, 0.74);

      // stage C — the film sinks into ink; the shelf waits below
      tl.to(".intro-film", { opacity: 0.12, scale: 1.06, filter: "blur(6px)", duration: 0.2 }, 0.78)
        .fromTo(
          ".intro-line-3",
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.12 },
          0.8,
        )
        .to(".intro-line-3 .intro-hint", { opacity: 1, duration: 0.08 }, 0.9);
    }, root);

    return () => {
      cancelAnimationFrame(rafId);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="relative h-[100svh] overflow-hidden bg-ink">
      {/* the film */}
      <div className="intro-film absolute inset-0">
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink" />
      </div>

      {/* stage A */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="intro-eyebrow eyebrow mb-6 justify-center before:hidden">A social library</p>
        <h1 className="intro-title wordmark relative z-10 drop-shadow-[0_10px_60px_rgba(0,0,0,0.8)]">
          Vellum
        </h1>
      </div>

      {/* stage B + C copy */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center">
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
