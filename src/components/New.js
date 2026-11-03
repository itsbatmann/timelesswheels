import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, onlyWithMotion } from "../anim/gsap";
import "./Style/New.css";

import workshopImg from "../Assets/download32.jpg";

/**
 * The workshop — how the work is done.
 *
 * Set as a plate in a catalogue of the period: the title in the serif italic,
 * the photograph hung inside a ruled mount with its caption below, and the
 * method given as two numbered notes in the margin beside it. Nothing is
 * boxed, tinted or rounded; the only colour is on the numerals.
 *
 * The motion is all plugin work, and all of it quiet: SplitText brings the
 * title up a line at a time behind a mask, DrawSVGPlugin rules the mount and
 * the two margin rules in, and the photograph drifts inside its mount on a
 * scrub so the plate has depth without anything sliding about.
 */
const NOTES = [
  {
    num: "I",
    head: "Stripped, not tidied",
    copy: "Every chassis goes back to bare metal before anything else happens. Rot is cut out and replaced with steel, not filler, so what you drive away is structure rather than paint.",
  },
  {
    num: "II",
    head: "Built to a tolerance",
    copy: "Engines are rebuilt to figures the factory never held, and every panel is worked by hand until the gaps are even. It takes longer. It is the only part of this we will not shorten.",
  },
];

const New = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      onlyWithMotion(() => {
        const title = SplitText.create(".about__title", {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 115,
              duration: 1,
              ease: "ignition",
              stagger: 0.1,
              scrollTrigger: {
                trigger: root.current,
                start: "top 74%",
                toggleActions: "play none none none",
              },
            }),
        });

        // The mount is ruled before the photograph is hung in it.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".about__figure",
              start: "top 82%",
              toggleActions: "play none none none",
            },
          })
          .fromTo(
            ".about__mount rect",
            { drawSVG: "0%" },
            { drawSVG: "100%", duration: 1.1, ease: "none" }
          )
          .from(
            ".about__media",
            { autoAlpha: 0, duration: 0.8, ease: "coast" },
            "-=0.55"
          )
          .from(
            ".about__cap",
            { y: 10, autoAlpha: 0, duration: 0.5, ease: "coast" },
            "-=0.3"
          );

        // Drift inside the mount: the picture is taller than its opening, so
        // it can move without ever showing an edge.
        gsap.fromTo(
          ".about__img",
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: ".about__figure",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );

        gsap.fromTo(
          ".note__rule line",
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            duration: 0.9,
            ease: "coast",
            stagger: 0.18,
            scrollTrigger: {
              trigger: ".about__notes",
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );

        gsap.from(".note__body, .about__action", {
          y: 20,
          autoAlpha: 0,
          duration: 0.8,
          ease: "coast",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".about__notes",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        return () => title.revert();
      });
    },
    { scope: root }
  );

  return (
    <section className="about" id="about" ref={root}>

      <div className="about__inner">
        <header className="about__head">
          <h2 className="about__title">From horsepower to brushstrokes</h2>
          <p className="about__lead">
            Nothing leaves this building until it would pass the inspection it
            was built for.
          </p>
        </header>

        <div className="about__spread">
          <figure className="about__figure">
            {/* The mount: a rule set out from the picture, the way a plate is
                mounted on a catalogue page. */}
            <svg
              className="about__mount"
              viewBox="0 0 400 500"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <rect x="0.5" y="0.5" width="399" height="499" />
            </svg>

            <div className="about__media">
              <img
                className="about__img"
                src={workshopImg}
                alt="A stripped body shell under work in the Hartwell Lane workshop"
                loading="lazy"
                width="760"
                height="950"
              />
            </div>

            <figcaption className="about__cap">
              Hartwell Lane, bay two
            </figcaption>
          </figure>

          <ol className="about__notes">
            {NOTES.map((n) => (
              <li className="note" key={n.num}>
                <span className="note__num" aria-hidden="true">
                  {n.num}
                </span>

                <svg
                  className="note__rule"
                  viewBox="0 0 100 1"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <line x1="0" y1="0.5" x2="100" y2="0.5" />
                </svg>

                <div className="note__body">
                  <h3 className="note__head">{n.head}</h3>
                  <p className="note__copy">{n.copy}</p>
                </div>
              </li>
            ))}

            <li className="about__ask">
              <a className="about__action" href="#visit">
                Talk to the workshop
              </a>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default New;
