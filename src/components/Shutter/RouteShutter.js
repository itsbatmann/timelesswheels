import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../../anim/gsap";
import { useLenis } from "../../anim/SmoothScroll";
import Shutter from "./Shutter";

/**
 * Route changes reuse the preloader's louvre: the slats snap shut, the new
 * route swaps in behind them, then they lift. Arriving anywhere on the site
 * feels like the same door opening.
 */
const RouteShutter = () => {
  const shutter = useRef(null);
  const first = useRef(true);
  const { pathname } = useLocation();
  const lenis = useLenis();

  useGSAP(
    () => {
      // The preloader already owns the very first arrival.
      if (first.current) {
        first.current = false;
        return;
      }

      const el = shutter.current.element();

      gsap
        .timeline({
          onStart: () => {
            el.style.pointerEvents = "auto";
            if (lenis) lenis.stop();
          },
          onComplete: () => {
            el.style.pointerEvents = "none";
            if (lenis) lenis.start();
          },
        })
        .add(shutter.current.close({ duration: 0.6, each: 0.025 }))
        .call(() => {
          if (lenis) lenis.scrollTo(0, { immediate: true });
          ScrollTrigger.refresh();
        })
        .add(shutter.current.open({ duration: 0.85, each: 0.03 }), "+=0.12");
    },
    { dependencies: [pathname] }
  );

  return <Shutter ref={shutter} count={14} closed={false} className="shutter--route" />;
};

export default RouteShutter;
