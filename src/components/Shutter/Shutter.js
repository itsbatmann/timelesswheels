import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap } from "../../anim/gsap";
import "./Shutter.css";

/**
 * Horizontal louvre slats, like a garage door or a radiator grille.
 *
 * The site's one transition device: it covers the screen for the preloader and
 * for route changes, so arriving anywhere feels like the same shutter lifting.
 * Returns timelines rather than playing them, so callers can nest the motion
 * inside a larger sequence.
 */
const Shutter = forwardRef(
  ({ count = 14, closed = true, className = "" }, ref) => {
    const root = useRef(null);

    useImperativeHandle(ref, () => {
      const slats = () => gsap.utils.toArray(".shutter__slat", root.current);

      return {
        element: () => root.current,

        /** Slats thin out from the middle and vanish — the reveal. */
        open: ({ duration = 1.1, each = 0.04, from = "center" } = {}) =>
          gsap.timeline().to(slats(), {
            scaleY: 0,
            duration,
            ease: "shutter",
            stagger: { each, from },
          }),

        /** Slats swell shut from the edges inward — the cover. */
        close: ({ duration = 0.75, each = 0.03, from = "edges" } = {}) =>
          gsap.timeline().to(slats(), {
            scaleY: 1,
            duration,
            ease: "piston",
            stagger: { each, from },
          }),
      };
    }, []);

    return (
      <div
        className={`shutter ${className}`}
        ref={root}
        aria-hidden="true"
        style={{ "--slat-count": count }}
      >
        {Array.from({ length: count }, (_, i) => (
          <span
            className="shutter__slat"
            key={i}
            style={{
              top: `${(i * 100) / count}%`,
              transform: closed ? "scaleY(1)" : "scaleY(0)",
            }}
          />
        ))}
      </div>
    );
  }
);

Shutter.displayName = "Shutter";

export default Shutter;
