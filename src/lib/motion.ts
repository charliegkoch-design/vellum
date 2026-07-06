/**
 * True when entrance animations should be skipped: the user prefers reduced
 * motion, or the page was loaded with ?instant (used by automated checks,
 * where hidden-tab rAF throttling would freeze GSAP timelines).
 */
export function skipMotion(): boolean {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    new URLSearchParams(window.location.search).has("instant")
  );
}
