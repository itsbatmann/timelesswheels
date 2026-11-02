import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { gsap } from "../../anim/gsap";
import "./DigitReel.css";

// Each strip carries 0-9 plus a repeat of 0 at the end. That eleventh cell is
// what makes the drum honest: rolling 9 -> 0 keeps travelling downward into the
// duplicate and we wrap back silently, so a digit never spins in reverse.
const CELLS = 11;
const CELL = 100 / CELLS;

const wrapStrip = gsap.utils.wrap(-10 * CELL, 0);

/**
 * A mechanical odometer. Driven imperatively rather than by React state so it
 * can be slaved to a scroll position without re-rendering every frame.
 *
 *   reel.current.to(42, 0.8)  // roll to 42
 *   reel.current.set(0)       // snap
 */
const DigitReel = forwardRef(({ length = 3, className = "" }, ref) => {
  const strips = useRef([]);
  // The true, unwrapped offset of each drum. Read-back from the DOM would only
  // ever return the wrapped value, which would corrupt the next roll distance.
  const positions = useRef([]);

  const places = useMemo(
    () => Array.from({ length }, (_, i) => Math.pow(10, length - 1 - i)),
    [length]
  );

  useImperativeHandle(
    ref,
    () => {
      const apply = (value, duration, ease) => {
        places.forEach((place, i) => {
          const strip = strips.current[i];
          if (!strip) return;

          const proxy =
            positions.current[i] || (positions.current[i] = { pos: 0 });

          // Each drum steps to a whole digit rather than sitting at a fraction
          // of the way to the next one. Positioning them continuously is what
          // a cheap geared odometer does, and it reads as nonsense: at 878 the
          // thousands drum would be 87.8% of the way to "1" and the counter
          // would show 1988. Flooring per place is the Geneva-stop behaviour
          // of a real counter -- a drum only advances once the one below it
          // has come all the way round.
          const target = -Math.floor(value / place) * CELL;

          if (!duration) {
            gsap.killTweensOf(proxy);
            proxy.pos = target;
            gsap.set(strip, { yPercent: wrapStrip(target) });
            return;
          }

          gsap.to(proxy, {
            pos: target,
            // Lower drums lag a touch behind higher ones, the way gear slop
            // staggers a real counter.
            duration: duration + (places.length - 1 - i) * 0.05,
            ease,
            overwrite: true,
            onUpdate: () => gsap.set(strip, { yPercent: wrapStrip(proxy.pos) }),
          });
        });
      };

      return {
        set: (value) => apply(value, 0),
        to: (value, duration = 0.7, ease = "coast") =>
          apply(value, duration, ease),
      };
    },
    [places]
  );

  return (
    <span className={`reel ${className}`} aria-hidden="true">
      {places.map((_, i) => (
        <span className="reel__slot" key={i}>
          <span
            className="reel__strip"
            ref={(el) => {
              strips.current[i] = el;
            }}
          >
            {Array.from({ length: CELLS }, (_, n) => (
              <span className="reel__cell" key={n}>
                {n % 10}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
});

DigitReel.displayName = "DigitReel";

export default DigitReel;
