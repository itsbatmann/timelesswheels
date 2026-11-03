import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

const LenisContext = createContext(null);

/** The one Lenis instance for the whole app. Null until the provider mounts. */
export const useLenis = () => useContext(LenisContext);

/**
 * Drives Lenis off GSAP's ticker instead of its own requestAnimationFrame loop.
 * One clock means scroll position and every ScrollTrigger are resolved in the
 * same frame, so scrubbed animations cannot lag a frame behind the page.
 */
// Smooth scroll hijacks programmatic scrolling, so an automated tool that
// jumps the page and screenshots sees the same screen over and over. The same
// ?nopreload flag that skips the loader also leaves scrolling native, so
// inspectors and QA measure the real page.
const nativeScroll =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("nopreload");

export const SmoothScrollProvider = ({ children }) => {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    if (nativeScroll) return undefined;

    const instance = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    instance.on("scroll", ScrollTrigger.update);

    // index.js has already put the window at the top; Lenis keeps its own
    // position and would otherwise start from whatever it reads, so it is
    // told to begin at the top as well, without animating there.
    instance.scrollTo(0, { immediate: true, force: true });

    const tick = (time) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
};

export default SmoothScrollProvider;
