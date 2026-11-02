import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, onlyWithMotion } from "../anim/gsap";
import { useLightbox } from "./Lightbox/Lightbox";
import "../components/Style/Featured.css";

import carsImg from "../Assets/Cars.jpg";
import amcImg from "../Assets/1969AMC.jpg";
import berlinImg from "../Assets/berlin.jpg";

/**
 * Showcase — "Portrait on its own ground".
 *
 * One car per screen. Each chapter is a full-bleed field whose flat colour is
 * taken from the darkest large tone of its own photograph, so picture and page
 * read as one surface rather than a slide on a deck.
 *
 * Years, models and the line of text under each are sample content standing in
 * for the workshop's real records — listed in the handover to be replaced.
 */
const CHAPTERS = [
  {
    id: "cars",
    src: carsImg,
    field: "#1c1410",
    title: "The ones that came back",
    line: "Eighteen months on the ramp. The shell was cut back to sound metal and rebuilt panel by panel.",
    alt: "A restored classic car, front three-quarter view",
  },
  {
    id: "amc",
    src: amcImg,
    field: "#141a18",
    title: "1969, saved twice",
    line: "Found under a tarpaulin with the engine seized. Everything below the paint is new work.",
    alt: "A 1969 American muscle car after restoration",
  },
  {
    id: "berlin",
    src: berlinImg,
    field: "#161711",
    title: "Back on the street",
    line: "A car is finished when it is driven, not when it is photographed. This one goes to work.",
    alt: "A restored classic car parked on a city street",
  },
];

const Featured = () => {
  const root = useRef(null);
  const open = useLightbox();

  useGSAP(
    () => {
      onlyWithMotion(() => {
        gsap.utils.toArray(".chapter", root.current).forEach((chapter) => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: chapter,
                start: "top 70%",
                toggleActions: "play none none none",
              },
            })
            // The field grows from an inset panel to full bleed, so the change
            // reads as the room changing rather than a new slide arriving.
            .from(chapter, { scale: 0.96, duration: 0.6, ease: "coast" })
            .from(
              chapter.querySelector(".chapter__img"),
              { scale: 0.92, duration: 0.8, ease: "coast" },
              0
            )
            .from(
              chapter.querySelectorAll(".chapter__title, .chapter__line"),
              {
                y: 20,
                autoAlpha: 0,
                duration: 0.7,
                ease: "coast",
                stagger: 0.08,
              },
              0.15
            );
        });
        });
    },
    { scope: root }
  );

  return (
    <section className="chapters" id="cars" ref={root}>
      <h2 className="tw-visually-hidden">Restored cars</h2>
      {CHAPTERS.map((c, i) => (
        <article
          className="chapter"
          key={c.id}
          style={{ backgroundColor: c.field }}
        >
          <h3 className="chapter__title">{c.title}</h3>

          <figure
            className="chapter__figure"
            data-cursor="view"
            onClick={(e) => open(e.currentTarget, i, "Restorations")}
          >
            <img
              className="chapter__img"
              src={c.src}
              alt={c.alt}
              loading="lazy"
              width="506"
              height="675"
            />
          </figure>

          <p className="chapter__line">{c.line}</p>
        </article>
      ))}
    </section>
  );
};

export default Featured;
