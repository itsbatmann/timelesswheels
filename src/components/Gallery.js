import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../anim/gsap";
import MaskedImage from "./MaskedImage";
import "../components/Style/Gallery.css";

import cars from "../Assets/Cars.jpg";
import amc from "../Assets/1969AMC.jpg";
import berlin from "../Assets/berlin.jpg";
import d32 from "../Assets/download32.jpg";
import d24 from "../Assets/download24.jpg";
import bik from "../Assets/bik.jpg";
import engine from "../Assets/engine.jpg";
import rover from "../Assets/rover.jpg";

/**
 * The collection — every photograph on the site, in this one section.
 *
 * It is laid out as a road rather than a grid: the section pins and the plates
 * travel past sideways, each one a square-cornered box on one of two lines, so
 * the rail reads like cars parked along a kerb instead of a flat matrix.
 *
 * The reveal is deliberately quiet, and it is all DrawSVGPlugin: a hairline
 * rectangle draws itself around the box, corner to corner, and the photograph
 * wipes up inside it once the line has gone round. No flashes, no shuffling
 * panels — the frame is ruled first and the picture is set into it, which is
 * the order a plate in a record book is made in.
 *
 * Below 64em, and wherever motion is not wanted, the same plates stack and the
 * same reveal runs on the page's own scroll.
 *
 * Makes and years are sample content standing in for the workshop's records.
 */
const PIECES = [
  { src: cars, kind: "Car", title: "Fastback, re-shelled", year: 1967 },
  { src: amc, kind: "Car", title: "AMC, two-door", year: 1969, tall: true },
  { src: bik, kind: "Motorcycle", title: "Tank, hand-painted", year: 1958 },
  { src: berlin, kind: "Car", title: "Berlin, kerbside", year: 1964, tall: true },
  { src: engine, kind: "Engine", title: "Rebuilt straight six", year: 1971 },
  { src: d32, kind: "Car", title: "Door, re-skinned", year: 1967, tall: true },
  { src: rover, kind: "Car", title: "Saloon, long chassis", year: 1954 },
  { src: d24, kind: "Motorcycle", title: "Frame, re-brazed", year: 1954, tall: true },
];

const pad = (n) => String(n).padStart(2, "0");

const Gallery = () => {
  const root = useRef(null);
  const stage = useRef(null);
  const track = useRef(null);
  const countRef = useRef(null);
  const runRef = useRef(null);

  useGSAP(
    () => {
      const plates = gsap.utils.toArray(".plate", root.current);

      // One plate: the rule goes round, then the picture wipes up inside it.
      // `container` is the sideways tween when there is one — that is what
      // lets ScrollTrigger measure a horizontal position against the page's
      // vertical scroll.
      const reveal = (plate, container) => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: container
            ? {
                trigger: plate,
                containerAnimation: container,
                start: "left 95%",
                end: "left 45%",
                scrub: true,
              }
            : {
                trigger: plate,
                start: "top 90%",
                end: "top 45%",
                scrub: true,
              },
        });

        tl.fromTo(
          plate.querySelector(".plate__rule rect"),
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 0.65 }
        ).fromTo(
          plate.querySelector(".img"),
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power2.out" },
          "-=0.18"
        );
      };

      const mm = gsap.matchMedia();

      // The rail. Desktop, and only where motion is wanted: a pin is itself a
      // motion effect, so it has no business running under reduced motion.
      mm.add(
        "(min-width: 64.0625em) and (prefers-reduced-motion: no-preference)",
        () => {
          const distance = () =>
            Math.max(0, track.current.scrollWidth - window.innerWidth);

          gsap.set(runRef.current, { drawSVG: "0%" });

          const drive = gsap.to(track.current, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: stage.current,
              pin: true,
              scrub: 0.6,
              start: "top top",
              end: () => "+=" + distance(),
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                // The gauge is drawn too, so the one moving line in this
                // section is made the same way as the frames.
                if (runRef.current) {
                  gsap.set(runRef.current, {
                    drawSVG: `0% ${(self.progress * 100).toFixed(2)}%`,
                  });
                }
                if (countRef.current) {
                  const n = Math.min(
                    PIECES.length,
                    1 + Math.floor(self.progress * PIECES.length * 0.999)
                  );
                  countRef.current.textContent = pad(n);
                }
              },
            },
          });

          plates.forEach((plate) => reveal(plate, drive));

          return () => ScrollTrigger.refresh();
        }
      );

      // Stacked, on a phone or a tablet.
      mm.add(
        "(max-width: 64em) and (prefers-reduced-motion: no-preference)",
        () => {
          plates.forEach((plate) => reveal(plate, null));
        }
      );

      // The heading arrives at both widths, and not at all without motion.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".coll__head > *", {
          y: 24,
          autoAlpha: 0,
          duration: 0.8,
          ease: "coast",
          stagger: 0.08,
          scrollTrigger: {
            trigger: root.current,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section className="coll" id="collection" ref={root}>
      <div className="coll__head">
        <h2 className="coll__title">Cars that were nearly scrapped</h2>
        <p className="coll__line">
          Forty years of them. Every one left here under its own power.
        </p>
      </div>

      <div className="coll__stage" ref={stage}>
        <div className="coll__track" ref={track}>
          {PIECES.map((p, i) => (
            <figure className={`plate${p.tall ? " is-tall" : ""}`} key={p.title}>
              <div className="plate__box">
                {/* The rule. It is drawn round the box before the picture
                    arrives, and stays as the frame afterwards. */}
                <svg
                  className="plate__rule"
                  viewBox={p.tall ? "0 0 300 400" : "0 0 400 300"}
                  aria-hidden="true"
                >
                  <rect
                    x="0.5"
                    y="0.5"
                    width={p.tall ? 299 : 399}
                    height={p.tall ? 399 : 299}
                  />
                </svg>

                <MaskedImage
                  src={p.src}
                  alt={`${p.title}, ${p.year}`}
                  index={i}
                  group="Collection"
                  manual
                />
              </div>

              <figcaption className="plate__meta">
                <span className="plate__no">{pad(i + 1)}</span>
                <span className="plate__name">{p.title}</span>
                <span className="plate__year">{p.year}</span>
                <span className="plate__kind">{p.kind}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="coll__gauge" aria-hidden="true">
          <span className="coll__count">
            <span ref={countRef}>01</span> / {pad(PIECES.length)}
          </span>
          <svg
            className="coll__run"
            viewBox="0 0 100 1"
            preserveAspectRatio="none"
          >
            <line x1="0" y1="0.5" x2="100" y2="0.5" ref={runRef} />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
