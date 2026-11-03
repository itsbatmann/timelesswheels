import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, onlyWithMotion } from "../anim/gsap";
import "./Style/Rules.css";

/**
 * The ruled page.
 *
 * A workshop keeps its records on ruled paper, so the closing stretch of the
 * site is set on one: faint vertical rules floor to ceiling behind the
 * content, at the same spacing in every section that uses them, so the
 * collection, the founder's statement and the footer read as one continuous
 * sheet rather than three unrelated bands.
 *
 * They rule themselves in from the middle outwards as the section arrives.
 * They are elements scaled on one axis rather than drawn SVG, because a line
 * stretched by a viewBox cannot hold a one-pixel stroke and a dash pattern at
 * the same time — the dash repeats instead of running once.
 */
const Rules = ({ count = 6, tone = "dark" }) => {
  const root = useRef(null);

  useGSAP(
    () => {
      onlyWithMotion(() => {
        gsap.from(".rules__line", {
          scaleY: 0,
          transformOrigin: "50% 50%",
          duration: 1.1,
          ease: "coast",
          stagger: 0.07,
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <div className={`rules rules--${tone}`} ref={root} aria-hidden="true">
      {Array.from({ length: count - 1 }, (_, i) => (
        <span
          className="rules__line"
          key={i}
          style={{ left: `${((i + 1) / count) * 100}%` }}
        />
      ))}
    </div>
  );
};

export default Rules;
