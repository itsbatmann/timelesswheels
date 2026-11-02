import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, onlyWithMotion } from "../anim/gsap";
import { useLightbox } from "./Lightbox/Lightbox";
import "../components/Style/MaskedImage.css";

/**
 * A photograph that assembles from nine square panels.
 *
 * Each panel is a copy of the picture clipped to its own cell and collapsed to
 * a point; they open on a scrub, walking the diagonal from the top-left, so
 * the picture builds as a grid of boxes rather than fading in. Square corners
 * throughout — nothing here is rounded.
 */
export const INITIAL = [
  "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
  "polygon(33% 0%, 33% 0%, 33% 0%, 33% 0%)",
  "polygon(66% 0%, 66% 0%, 66% 0%, 66% 0%)",
  "polygon(0% 33%, 0% 33%, 0% 33%, 0% 33%)",
  "polygon(33% 33%, 33% 33%, 33% 33%, 33% 33%)",
  "polygon(66% 33%, 66% 33%, 66% 33%, 66% 33%)",
  "polygon(0% 66%, 0% 66%, 0% 66%, 0% 66%)",
  "polygon(33% 66%, 33% 66%, 33% 66%, 33% 66%)",
  "polygon(66% 66%, 66% 66%, 66% 66%, 66% 66%)",
];

export const FINAL = [
  "polygon(0% 0%, 33.5% 0%, 33.5% 33.5%, 0% 33.5%)",
  "polygon(33% 0%, 66.5% 0%, 66.5% 33.5%, 33% 33.5%)",
  "polygon(66% 0%, 100% 0%, 100% 33.5%, 66% 33.5%)",
  "polygon(0% 33%, 33.5% 33%, 33.5% 66.5%, 0% 66.5%)",
  "polygon(33% 33%, 66.5% 33%, 66.5% 66.5%, 33% 66.5%)",
  "polygon(66% 33%, 100% 33%, 100% 66.5%, 66% 66.5%)",
  "polygon(0% 66%, 33.5% 66%, 33.5% 100%, 0% 100%)",
  "polygon(33% 66%, 66.5% 66%, 66.5% 100%, 33% 100%)",
  "polygon(66% 66%, 100% 66%, 100% 100%, 66% 100%)",
];

// Diagonal order: one, then two, then three, then two, then one.
export const ORDER = [[0], [1, 3], [2, 4, 6], [5, 7], [8]];

const MaskedImage = ({
  src,
  alt = "",
  className = "",
  index = 0,
  group = "",
  // When the picture sits inside something that travels on its own axis (the
  // collection rail), its owner drives the panels, so the reveal can be keyed
  // to that movement instead of to the page.
  manual = false,
}) => {
  const root = useRef(null);
  const open = useLightbox();

  useGSAP(
    () => {
      if (manual) return;
      const masks = gsap.utils.toArray(".mask", root.current);

      onlyWithMotion(() => {
        masks.forEach((mask, i) => gsap.set(mask, { clipPath: INITIAL[i] }));

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            end: "top 35%",
            scrub: true,
          },
        });

        ORDER.forEach((step, i) => {
          tl.to(
            step.map((n) => masks[n]),
            {
              clipPath: (j, el) => FINAL[masks.indexOf(el)],
              duration: 0.4,
              ease: "power2.out",
              stagger: 0.1,
            },
            i * 0.15
          );
        });
      });
    },
    { dependencies: [manual], scope: root }
  );

  return (
    <div
      className={`img ${className}`}
      ref={root}
      data-cursor="view"
      onClick={(e) => open(e.currentTarget, index, group)}
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className={`mask m-${i}`}
          role={i === 0 ? "img" : undefined}
          aria-label={i === 0 ? alt : undefined}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
    </div>
  );
};

export default MaskedImage;
