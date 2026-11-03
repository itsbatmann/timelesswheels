import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, onlyWithMotion } from "../anim/gsap";
import "./Style/Footer.css";

/**
 * Footer — the last page of the record book.
 *
 * The name is stacked large in the left columns with the details beside it,
 * and the legal line sits under everything. Ground and ink invert, so the
 * page ends on paper. No rules here: the sheet they are drawn on stops at
 * the statement, and the last page is plain.
 *
 * The address, hours and telephone are sample content standing in for the
 * workshop's own.
 */
const COLUMNS = [
  {
    title: "Workshop",
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
        // The name is set in two lines; each is masked and brought up on its
        // own, so the close has the weight of something being set in type.
        const split = SplitText.create(".foot__word", {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 115,
              duration: 1.1,
              ease: "ignition",
              stagger: 0.09,
              scrollTrigger: {
                trigger: root.current,
                start: "top 72%",
                toggleActions: "play none none none",
              },
            }),
        });

        gsap.from(".foot__col", {
          y: 20,
          autoAlpha: 0,
          duration: 0.7,
          ease: "coast",
          stagger: 0.07,
          scrollTrigger: {
            trigger: root.current,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        });

        gsap.from(".foot__legal", {
          autoAlpha: 0,
          duration: 0.6,
          ease: "none",
          scrollTrigger: {
            trigger: ".foot__legal",
            start: "top 96%",
            toggleActions: "play none none none",
          },
        });

        return () => split.revert();
      });
    },
    { scope: root }
  );

  return (
    <footer className="foot" ref={root}>
      <h2 className="tw-visually-hidden">Timeless Wheels</h2>

      <div className="foot__sheet">
        <p className="foot__word" aria-hidden="true">
          Timeless
          <br />
          Wheels
        </p>

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
      </div>

      <p className="foot__legal">
        <span>
          Restoring classic cars and bikes since 1975.
        </span>
        <span>&copy; {new Date().getFullYear()} Timeless Wheels.</span>
      </p>
    </footer>
  );
};

export default Footer;
