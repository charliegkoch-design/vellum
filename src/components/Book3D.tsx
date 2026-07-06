import type { CSSProperties } from "react";

type Props = {
  coverUrl: string;
  title: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * A hardcover book as a true CSS-3D box. Dimensions come from the CSS
 * variables --bw / --bh / --bt set on an ancestor, so the same component
 * scales from the hero shelf to the detail page.
 */
export default function Book3D({ coverUrl, title, className = "", style }: Props) {
  return (
    <div
      className={`book-3d ${className}`}
      style={{ width: "var(--bw)", height: "var(--bh)", ...style }}
    >
      {/* back cover */}
      <div
        className="face"
        style={{ transform: "translateZ(calc(var(--bt) / -2))", background: "#221e18" }}
      />
      {/* left: page block (fore-edge faces the camera on the shelf) */}
      <div
        className="face page-edge"
        style={{
          left: "50%",
          width: "var(--bt)",
          marginLeft: "calc(var(--bt) / -2)",
          transform: "rotateY(-90deg) translateZ(calc(var(--bw) / 2)) scaleY(0.985)",
        }}
      />
      {/* right: spine */}
      <div
        className="face"
        style={{
          left: "50%",
          width: "var(--bt)",
          marginLeft: "calc(var(--bt) / -2)",
          transform: "rotateY(90deg) translateZ(calc(var(--bw) / 2))",
          background: "linear-gradient(180deg, #2c261d, #171310)",
        }}
      />
      {/* top: page block */}
      <div
        className="face page-edge-top"
        style={{
          top: "50%",
          height: "var(--bt)",
          marginTop: "calc(var(--bt) / -2)",
          transform: "rotateX(90deg) translateZ(calc(var(--bh) / 2)) scaleX(0.985)",
        }}
      />
      {/* bottom */}
      <div
        className="face"
        style={{
          top: "50%",
          height: "var(--bt)",
          marginTop: "calc(var(--bt) / -2)",
          transform: "rotateX(-90deg) translateZ(calc(var(--bh) / 2))",
          background: "#141110",
        }}
      />
      {/* front cover (last = painted on top within the box) */}
      <div className="face" style={{ transform: "translateZ(calc(var(--bt) / 2))" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverUrl} alt={title} className="book-cover-img" draggable={false} />
        <div className="cover-shade" />
      </div>
    </div>
  );
}
