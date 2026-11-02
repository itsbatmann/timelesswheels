import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, onlyWithMotion } from "../anim/gsap";
import "./Style/Footer.css";

/**
 * Footer — "Columns above, wordmark below".
 *
 * Ground and ink invert, four small columns sit at the top, and the name
 * returns at full width along the bottom as the close of the page.
 */
const COLUMNS = [
  {
    title: "Timeless Wheels",
    lines: ["14 Hartwell Lane", "Dorset DT2 8QA", "United Kingdom"],
  },
  {
    title: "The work",
    lines: ["Restoration", "Custom build", "Archive"],
  },
  {
    title: "Hours",
    lines: ["Tue – Fri, 8 – 18", "Sat, 9 – 13", "Otherwise by appointment"],
  },
  {
    title: "Get in touch",
    lines: ["+44 1305 770 175", "workshop@timelesswheels.example"],
  },
];

const Footer = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      onlyWithMotion(() => {
        gsap.from(".foot__col", {
          y: 20,
          autoAlpha: 0,
          duration: 0.7,
          ease: "coast",
          stagger: 0.07,
          scrollTrigger: {
            trigger: root.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
  
        gsap.from(".foot__word", {
          yPercent: 18,
          autoAlpha: 0,
          duration: 1.1,
          ease: "ignition",
          scrollTrigger: {
            trigger: root.current,
            start: "top 55%",
            toggleActions: "play none none none",
          },
        });
        });
    },
    { scope: root }
  );

  return (
    <footer className="foot" ref={root}>
      <h2 className="tw-visually-hidden">Timeless Wheels</h2>

      <div className="foot__cols">
        {COLUMNS.map((col) => (
          <div className="foot__col" key={col.title}>
            <p className="foot__col-title">{col.title}</p>
            {col.lines.map((line) => (
              <p className="foot__col-line" key={line}>
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div className="foot__close">
        <p className="foot__word" aria-hidden="true">
          Timeless Wheels
        </p>
        <p className="foot__legal">
          Restoring classic cars and bikes since 1975. &copy;{" "}
          {new Date().getFullYear()} Timeless Wheels.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
