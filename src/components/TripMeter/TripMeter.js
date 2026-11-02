import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../../anim/gsap";
import { useReady } from "../../anim/ready";
import DigitReel from "../Preloader/DigitReel";
import "./TripMeter.css";

// A full scroll of the site covers exactly the distance back to the year in
// the hero. The page is the drive.
const FULL_TRIP = 1975;

const TripMeter = () => {
  const root = useRef(null);
  const reel = useRef(null);
  const bar = useRef(null);
  const ready = useReady();
  const last = useRef(-1);

  useGSAP(
    () => {
      if (!ready) return;

      gsap.fromTo(
        root.current,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.7, ease: "coast" }
      );

      const setBar = gsap.quickSetter(bar.current, "scaleX");

      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          setBar(self.progress);

          // The drum is only told to move when the whole-mile reading changes,
          // which keeps this off the critical path of every scroll frame.
          const miles = Math.round(self.progress * FULL_TRIP);
          if (miles !== last.current) {
            last.current = miles;
            reel.current?.to(miles, 0.3, "power2.out");
          }
        },
      });

      return () => st.kill();
    },
    { dependencies: [ready], scope: root }
  );

  return (
    <aside className="trip" ref={root} aria-hidden="true">
      <span className="trip__read">
        <DigitReel ref={reel} length={4} />
        <span className="trip__unit">miles</span>
      </span>
      <span className="trip__rail">
        <span className="trip__fill" ref={bar} />
      </span>
    </aside>
  );
};

export default TripMeter;
