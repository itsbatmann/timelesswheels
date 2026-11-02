import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, onlyWithMotion } from "../anim/gsap";
import "../components/Style/Welcome.css";

/**
 * The beige room — the client's own words, set exactly as the client had them:
 * one centred paragraph with "modern craftsmanship" on its own line in the
 * script face.
 *
 * What is added sits behind the words and nowhere else: one wire wheel off a
 * pre-war car, centred under the paragraph and set faint — tyre, tread, the
 * double rim band, forty-eight spokes laced in two crossing sets, and the
 * knock-off spinner at the hub. DrawSVGPlugin inks it in as the section is
 * scrolled into and it turns with the scroll, so the one light field on the
 * page carries the brand's own object instead of being a box of centred text.
 */
const C = 110; // the wheel's centre, in the 220-unit square it is drawn in

const onCircle = (deg, r) => {
  const rad = (deg * Math.PI) / 180;
  return [C + r * Math.cos(rad), C + r * Math.sin(rad)];
};

// Laced in two sets, each leaning the opposite way, which is how a wire wheel
// is actually built and what stops it reading as a bicycle wheel.
const lace = (count, lean) =>
  Array.from({ length: count }, (_, i) => {
    const a = (360 * i) / count;
    const [x1, y1] = onCircle(a, 15);
    const [x2, y2] = onCircle(a + lean, 68);
    return { key: `${lean}-${i}`, x1, y1, x2, y2 };
  });

const SPOKES = [...lace(24, 9), ...lace(24, -9)];

// Tread blocks, cut across the crown of the tyre.
const TREAD = Array.from({ length: 48 }, (_, i) => {
  const a = (360 * i) / 48;
  const [x1, y1] = onCircle(a, 92);
  const [x2, y2] = onCircle(a, 103);
  return { key: i, x1, y1, x2, y2 };
});

// The knock-off spinner: three ears off the hub.
const EARS = [0, 120, 240].map((a) => {
  const [x1, y1] = onCircle(a, 8);
  const [x2, y2] = onCircle(a, 22);
  return { key: a, x1, y1, x2, y2 };
});

const r2 = (n) => n.toFixed(1);

const Wheel = () => (
  <svg className="wel-wheel" viewBox="0 0 220 220" aria-hidden="true">
    <circle className="wel-tyre" cx={C} cy={C} r="104" />
    <circle className="wel-tyre" cx={C} cy={C} r="91" />

    <g className="wel-tread">
      {TREAD.map((t) => (
        <line
          key={t.key}
          x1={r2(t.x1)}
          y1={r2(t.y1)}
          x2={r2(t.x2)}
          y2={r2(t.y2)}
        />
      ))}
    </g>

    <circle className="wel-rim" cx={C} cy={C} r="74" />
    <circle className="wel-rim" cx={C} cy={C} r="68" />

    <g className="wel-spokes">
      {SPOKES.map((s) => (
        <line
          key={s.key}
          x1={r2(s.x1)}
          y1={r2(s.y1)}
          x2={r2(s.x2)}
          y2={r2(s.y2)}
        />
      ))}
    </g>

    <circle className="wel-hub" cx={C} cy={C} r="17" />
    <g className="wel-ears">
      {EARS.map((e) => (
        <line
          key={e.key}
          x1={r2(e.x1)}
          y1={r2(e.y1)}
          x2={r2(e.x2)}
          y2={r2(e.y2)}
        />
      ))}
    </g>
    <circle className="wel-cap" cx={C} cy={C} r="7" />
  </svg>
);

const Welcome = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      onlyWithMotion(() => {
        // autoSplit re-splits whenever the fonts land or the box reflows: this
        // copy wraps, and a line split measured against a fallback font would
        // light the wrong words.
        const split = SplitText.create(".wel-copy", {
          type: "words",
          autoSplit: true,
          ignore: ".wel-swash",
          onSplit: (self) =>
            gsap.from(self.words, {
              opacity: 0.15,
              duration: 0.6,
              ease: "none",
              stagger: 0.35,
              scrollTrigger: {
                trigger: root.current,
                start: "top 85%",
                end: "center center",
                scrub: 0.6,
              },
            }),
        });

        // Only the rotation is set here. The centring stays in CSS: GSAP
        // parses the existing translate(-50%, -50%) into pixel x/y and keeps
        // it, so adding xPercent/yPercent on top would shift the wheel a
        // second half-width off centre.
        gsap.set(".wel-wheel", { rotate: -46 });
        gsap.to(".wel-wheel", {
          rotate: 46,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        // Tyre and rim first, then the spokes out of the hub.
        gsap.fromTo(
          ".wel-wheel circle, .wel-wheel line",
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            ease: "none",
            stagger: 0.012,
            scrollTrigger: {
              trigger: root.current,
              start: "top 92%",
              end: "center 58%",
              scrub: 0.6,
            },
          }
        );

        gsap.fromTo(
          ".wel-swash path",
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            duration: 1.4,
            ease: "coast",
            scrollTrigger: {
              trigger: ".craftsmanship",
              start: "top 62%",
              toggleActions: "play none none none",
            },
          }
        );

        return () => split.revert();
      });
    },
    { scope: root }
  );

  return (
    <section className="welcontainer" id="work" ref={root}>
      <Wheel />

      <p className="wel-copy">
        Welcome to Timeless Wheels, where vintage dreams are reborn. Explore our
        collection of restored classic cars and bikes, blending heritage with
        <br />
        <span className="craftsmanship">
          modern craftsmanship
          <svg
            className="wel-swash"
            viewBox="0 0 400 24"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M4 15 C 70 4, 150 22, 214 11 S 338 3, 396 14" />
          </svg>
        </span>
      </p>
    </section>
  );
};

export default Welcome;
