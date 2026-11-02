import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { gsap, Flip } from "../../anim/gsap";
import { useLenis } from "../../anim/SmoothScroll";
import "./Lightbox.css";

const LightboxContext = createContext(() => {});

/** open(element, index, group) — lifts that element to full screen. */
export const useLightbox = () => useContext(LightboxContext);

export const LightboxProvider = ({ children }) => {
  const overlay = useRef(null);
  const backdrop = useRef(null);
  const meta = useRef(null);
  const cloneRef = useRef(null);
  const sourceRef = useRef(null);
  const busy = useRef(false);
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    const clone = cloneRef.current;
    const source = sourceRef.current;
    if (!clone || busy.current) return;
    busy.current = true;

    gsap.to([backdrop.current, meta.current], {
      autoAlpha: 0,
      duration: 0.4,
      ease: "power2.in",
    });

    // Flip.fit animates the clone back onto the exact box of the thumbnail it
    // came from, so the picture returns to its place in the grid instead of
    // merely disappearing.
    Flip.fit(clone, source, {
      scale: true,
      duration: 0.65,
      ease: "expo.inOut",
      onComplete: () => {
        clone.remove();
        cloneRef.current = null;
        sourceRef.current = null;
        busy.current = false;
        overlay.current.classList.remove("is-open");
        if (lenis) lenis.start();
      },
    });
  }, [lenis]);

  const open = useCallback(
    (element, index = 0, group = "") => {
      if (!element || cloneRef.current || busy.current) return;

      const clone = element.cloneNode(true);
      // The thumbnail may carry inline sizing from its own component
      // and inline styles outrank every stylesheet rule, so the clone would
      // keep the grid cell's width in full screen. Drop the attribute and let
      // the lightbox stylesheet size it; Flip writes the transform it needs.
      clone.removeAttribute("style");
      clone.classList.add("lb__item");
      clone.removeAttribute("data-cursor");
      overlay.current.appendChild(clone);
      cloneRef.current = clone;
      sourceRef.current = element;
      overlay.current.classList.add("is-open");

      // Park the clone exactly over the original, then let it travel to the
      // full-screen box the stylesheet already gives it. Cloning rather than
      // reparenting means the grid keeps its cell and never collapses.
      Flip.fit(clone, element, { scale: true });

      if (lenis) lenis.stop();

      if (meta.current) {
        meta.current.textContent = `${String(index + 1).padStart(2, "0")} ${
          group ? "/ " + group : ""
        }`;
      }

      gsap.set([backdrop.current, meta.current], { autoAlpha: 0 });
      gsap.to(backdrop.current, { autoAlpha: 1, duration: 0.5 });
      gsap.to(meta.current, { autoAlpha: 1, duration: 0.5, delay: 0.35 });

      busy.current = true;
      gsap.to(clone, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.85,
        ease: "expo.inOut",
        onComplete: () => {
          busy.current = false;
        },
      });
    },
    [lenis]
  );

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <LightboxContext.Provider value={open}>
      {children}
      {mounted &&
        createPortal(
          <div className="lb" ref={overlay} onClick={close}>
            <div className="lb__backdrop" ref={backdrop} />
            <span className="lb__meta" ref={meta} />
            <span className="lb__hint">click anywhere to close</span>
          </div>,
          document.body
        )}
    </LightboxContext.Provider>
  );
};

export default LightboxProvider;
