import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, onlyWithMotion } from "../anim/gsap";
import "./Style/New.css";

import workshopImg from "../Assets/download32.jpg";

/**
 * About — "Inset panel, shaped portrait".
 *
 * A deep-toned panel inset from the page edges: the statement top-left, the
 * workshop photograph beneath it masked to one bold shape and cropped by the
 * panel's bottom edge, the two method blocks and the action on the right.
 */
const New = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      onlyWithMotion(() => {
        const statement = SplitText.create(".about__statement", {
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
                start: "top 72%",
                toggleActions: "play none none none",
              },
            }),
        });
  
        gsap.from(".about__block, .about__action", {
          y: 22,
          autoAlpha: 0,
          duration: 0.8,
          ease: "coast",
          stagger: 0.09,
          scrollTrigger: {
            trigger: ".about__side",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
  
        gsap.from(".about__figure", {
          scale: 0.94,
          autoAlpha: 0,
          duration: 1,
          ease: "coast",
          scrollTrigger: {
            trigger: ".about__figure",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
  
        return () => statement.revert();
        });
    },
    { scope: root }
  );

  return (
    <section className="about" id="about" ref={root}>
      <div className="about__panel">
        <h2 className="about__statement">From horsepower to brushstrokes</h2>

        <figure className="about__figure">
          <img
            className="about__img"
            src={workshopImg}
            alt="Work in progress on a stripped body shell in the workshop"
            loading="lazy"
            width="760"
            height="760"
          />
        </figure>

        <div className="about__side">
          <div className="about__block">
            <h3 className="about__sub">Stripped, not tidied</h3>
            <p className="about__copy">
              Every chassis goes back to bare metal before anything else
              happens. Rot is cut out and replaced with steel, not filler, so
              what you drive away is structure rather than paint.
            </p>
          </div>

          <div className="about__block">
            <h3 className="about__sub">Built to a tolerance</h3>
            <p className="about__copy">
              Engines are rebuilt to figures the factory never held, and every
              panel is worked by hand until the gaps are even. It takes longer.
              It is the only part of this we will not shorten.
            </p>
          </div>

          <a className="about__action tw-button" href="#visit">
            Talk to the workshop
          </a>
        </div>
      </div>
    </section>
  );
};

export default New;
