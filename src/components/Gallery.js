import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../anim/gsap";
import MaskedImage from "./MaskedImage";
import Rules from "./Rules";
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
 * A row of standing cards that travels sideways while the section is pinned.
 * Each card is a full-bleed photograph with its name set over the bottom-left
 * corner.
 *
 * Standing still, the row is a flat straight line. The moment you scroll it
 * wraps round a drum lying on its side, with the near face of the drum at the
 * middle of the screen: the middle card stays square to you and closest, and
 * towards either edge the cards turn away, fall back and drop. The faster you
 * scroll the deeper it wraps, and it eases flat again when you stop.
 *
 * Below 64em, and wherever motion is not wanted, the same cards stack with no
 * lean at all.
 *
 * Makes and years are sample content standing in for the workshop's records.
 */
const PIECES = [
  { src: cars, kind: "Car", title: "Fastback, re-shelled", year: 1967 },
  { src: amc, kind: "Car", title: "AMC, two-door", year: 1969 },
  { src: bik, kind: "Motorcycle", title: "Tank, hand-painted", year: 1958 },
  { src: berlin, kind: "Car", title: "Berlin, kerbside", year: 1964 },
  { src: engine, kind: "Engine", title: "Rebuilt straight six", year: 1971 },
  { src: d32, kind: "Car", title: "Door, re-skinned", year: 1967 },
  { src: rover, kind: "Car", title: "Saloon, long chassis", year: 1954 },
  { src: d24, kind: "Motorcycle", title: "Frame, re-brazed", year: 1954 },
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
      const cards = gsap.utils.toArray(".card", root.current);

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 64.0625em) and (prefers-reduced-motion: no-preference)",
        () => {
          const distance = () =>
            Math.max(0, track.current.scrollWidth - window.innerWidth);

          gsap.set(runRef.current, { drawSVG: "0%" });

          // The row's travel. Nothing is keyed off this tween any more — the
          // curve is read from where each card actually is — so it is not
          // kept.
          gsap.to(track.current, {
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
                gsap.set(runRef.current, {
                  drawSVG: `0% ${(self.progress * 100).toFixed(2)}%`,
                });
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

          // ---- the curve ------------------------------------------------
          // The row is wrapped round a drum lying on its side, with the near
          // face of the drum at the middle of the screen. A card in the
          // middle is square to you and closest; towards either edge it is
          // turned away, pushed back and dropped, so the row bulges out of
          // the page at the centre and falls away at the sides.
          //
          // n is where the card sits across the screen: -1 at the left edge,
          // 0 in the middle, 1 at the right. The turn goes as n, which is
          // the angle round the drum; the depth and the drop go as n
          // squared, which is the drum's surface. Nothing here is a loop —
          // it is read from the card's real position, so the same scroll
          // position always gives the same shape.
          //
          // On top of that, the whole curve deepens while the page is being
          // scrolled and eases back when it stops, so it answers the scroll
          // as well as describing it.
          const TURN = 30; // degrees at the screen edge, at full speed
          const DEPTH = 230; // pixels pushed back at the edge, at full speed
          const DROP = 54; // pixels fallen at the edge, at full speed

          const setters = cards.map((card) => ({
            card,
            y: gsap.quickSetter(card, "y", "px"),
            z: gsap.quickSetter(card, "z", "px"),
            rotationY: gsap.quickSetter(card, "rotationY", "deg"),
          }));

          const bend = { amount: 0 };
          const clamp = gsap.utils.clamp(-1, 1);

          const place = () => {
            const half = window.innerWidth / 2;
            // Nothing at rest: every term is scaled by how hard the page is
            // being scrolled, so the drum only exists while you are moving.
            const k = Math.abs(bend.amount);
            setters.forEach((s) => {
              const r = s.card.getBoundingClientRect();
              // Clamped to the screen's own edges: the row runs well past
              // them, and squaring an n of 4 would throw the far cards
              // hundreds of pixels back instead of continuing the curve.
              const n = clamp((r.left + r.width / 2 - half) / half);
              const a = n * n;
              s.rotationY(n * TURN * k);
              s.z(-a * DEPTH * k);
              s.y(a * DROP * k);
            });
          };

          const flex = (self) => {
            const v = clamp(self.getVelocity() / 2600);
            // Only ever take the deeper bow, then always relax back to flat.
            // That asymmetry is what makes it answer an impulse and settle
            // smoothly, instead of jittering with every velocity reading.
            if (Math.abs(v) > Math.abs(bend.amount)) {
              bend.amount = v;
              gsap.to(bend, {
                amount: 0,
                duration: 0.9,
                ease: "power3",
                overwrite: true,
                onUpdate: place,
              });
            }
            place();
          };

          // The row also moves under its own pin, so the bend is recomputed
          // on that scroll as well as on the page's.
          const velocity = ScrollTrigger.create({ onUpdate: flex });

          place();

          return () => {
            velocity.kill();
            gsap.set(cards, { clearProps: "y,z,rotationY" });
            ScrollTrigger.refresh();
          };
        }
      );

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
      <Rules count={6} tone="dark" />

      <div className="coll__head">
        <h2 className="coll__title">Cars that were nearly scrapped</h2>
        <p className="coll__line">
          Forty years of them. Every one left here under its own power.
        </p>
      </div>

      <div className="coll__stage" ref={stage}>
        <div className="coll__track" ref={track}>
          {PIECES.map((p, i) => (
            <figure className="card" key={p.title}>
              <MaskedImage
                src={p.src}
                alt={`${p.title}, ${p.year}`}
                index={i}
                group="Collection"
                manual
              />

              <figcaption className="card__label">
                {/* Non-breaking hyphens: at this measure a browser will break
                    "re-shelled" after the hyphen and leave "shelled" alone on
                    the second line, which reads as a typo. */}
                <span className="card__name">
                  {p.title.replace(/-/g, "‑")}
                </span>
                <span className="card__meta">
                  {p.kind} · {p.year}
                </span>
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
