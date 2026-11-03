import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, onlyWithMotion } from "../anim/gsap";
import Rules from "./Rules";
import "./Style/Statement.css";

/**
 * The founder's statement — the one place on the site where a person speaks.
 *
 * It is set as a letter on ruled paper — the one section that keeps the
 * rules: an opening quotation mark hung in the margin, the quotation itself
 * in a serif italic with its first line indented,
 * then a rule, the signature and the name. The signature is a path, inked in
 * by DrawSVGPlugin at the speed a hand moves, after the words have arrived —
 * so the page is signed in front of you rather than showing a picture of a
 * signature.
 *
 * The name, the role and the words are sample content standing in for the
 * workshop's own, like the address in the footer.
 */
const Statement = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      onlyWithMotion(() => {
        const split = SplitText.create(".stat__quote", {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.9,
              ease: "coast",
              stagger: 0.08,
              scrollTrigger: {
                trigger: root.current,
                start: "top 72%",
                toggleActions: "play none none none",
              },
            }),
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".stat__sign",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        tl.fromTo(
          ".stat__dash",
          { scaleX: 0 },
          { scaleX: 1, transformOrigin: "left center", duration: 0.4, ease: "coast" }
        )
          .fromTo(
            ".stat__ink path",
            { drawSVG: "0%" },
            {
              drawSVG: "100%",
              duration: 1.6,
              // A hand does not accelerate out of a curve the way an eased
              // tween does; held at a constant speed it reads as writing.
              ease: "none",
              stagger: 0.25,
            },
            "-=0.1"
          )
          .from(
            ".stat__who > *",
            { y: 14, autoAlpha: 0, duration: 0.5, ease: "coast", stagger: 0.08 },
            "-=0.5"
          );

        return () => split.revert();
      });
    },
    { scope: root }
  );

  return (
    <section className="stat" ref={root}>
      <Rules count={6} tone="light" />


      <figure className="stat__card">
        <span className="stat__mark" aria-hidden="true">
          &ldquo;
        </span>

        <blockquote className="stat__quote">
          Forty years in, a car still arrives here that everyone else has given
          up on. That is the part I have never got used to. We are not
          preserving objects; we are keeping the knowledge of how they were
          made alive, in the hands of people who will outlast me.
        </blockquote>

        <figcaption className="stat__sign">
          <span className="stat__dash" aria-hidden="true" />

          <svg
            className="stat__ink"
            viewBox="0 0 420 110"
            fill="none"
            aria-hidden="true"
          >
            <path d="M20 94 C 30 56, 46 20, 62 20 C 74 20, 72 46, 58 68 C 48 84, 36 94, 34 84 C 32 70, 50 60, 72 62 C 90 64, 98 74, 92 82 C 86 89, 76 82, 80 70 C 86 54, 108 46, 126 54 C 140 60, 140 76, 132 80 C 124 84, 120 70, 130 58 C 144 42, 172 44, 190 58 C 202 67, 200 80, 192 80 C 183 80, 184 64, 202 56 C 228 45, 262 56, 290 68 C 318 80, 348 76, 372 58 C 382 50, 388 42, 390 34" />
          </svg>

          <div className="stat__who">
            <span className="stat__name">Alan Hartwell</span>
            <span className="stat__role">Founder</span>
          </div>
        </figcaption>
      </figure>
    </section>
  );
};

export default Statement;
