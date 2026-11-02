import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../anim/gsap";
import "./Cursor.css";

/**
 * A machined ring that trails the pointer and spins like a wheel — the faster
 * you move, the faster it turns. Over anything marked `data-cursor="view"` it
 * opens up and names the action.
 */
const Cursor = () => {
  const ring = useRef(null);
  const dot = useRef(null);
  const spinner = useRef(null);
  const label = useRef(null);

  useGSAP(() => {
    // Touch and pen users keep their own pointer behaviour.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.documentElement.classList.add("has-cursor");

    gsap.set([ring.current, dot.current], {
      xPercent: -50,
      yPercent: -50,
      autoAlpha: 0,
    });

    const ringX = gsap.quickTo(ring.current, "x", {
      duration: 0.5,
      ease: "power3",
    });
    const ringY = gsap.quickTo(ring.current, "y", {
      duration: 0.5,
      ease: "power3",
    });
    const dotX = gsap.quickTo(dot.current, "x", {
      duration: 0.12,
      ease: "power2",
    });
    const dotY = gsap.quickTo(dot.current, "y", {
      duration: 0.12,
      ease: "power2",
    });

    const spin = gsap.to(spinner.current, {
      rotation: 360,
      duration: 9,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 50%",
    });

    const speedTo = gsap.quickTo(spin, "timeScale", {
      duration: 0.4,
      ease: "power2",
    });

    let last = { x: 0, y: 0, t: performance.now() };
    let shown = false;
    const clampSpeed = gsap.utils.clamp(1, 14);

    const onMove = (e) => {
      if (!shown) {
        shown = true;
        gsap.to([ring.current, dot.current], {
          autoAlpha: 1,
          duration: 0.3,
        });
        gsap.set([ring.current, dot.current], { x: e.clientX, y: e.clientY });
      }

      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);

      const now = performance.now();
      const dt = Math.max(now - last.t, 1);
      const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y);
      // Pixels per millisecond mapped onto the spin rate.
      speedTo(clampSpeed(1 + (dist / dt) * 4));
      last = { x: e.clientX, y: e.clientY, t: now };
    };

    const onOver = (e) => {
      const hit = e.target.closest && e.target.closest("[data-cursor]");
      const active = Boolean(hit);
      gsap.to(ring.current, {
        scale: active ? 2.4 : 1,
        borderColor: active ? "rgba(213,63,65,0.9)" : "rgba(255,247,217,0.55)",
        duration: 0.45,
        ease: "coast",
      });
      gsap.to(label.current, { autoAlpha: active ? 1 : 0, duration: 0.3 });
      gsap.to(dot.current, { scale: active ? 0 : 1, duration: 0.3 });
      if (active) label.current.textContent = hit.dataset.cursor;
    };

    const onLeave = () =>
      gsap.to([ring.current, dot.current], { autoAlpha: 0, duration: 0.25 });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
    };
  });

  return (
    <>
      <div className="cursor__ring" ref={ring} aria-hidden="true">
        <svg className="cursor__spin" viewBox="0 0 100 100" ref={spinner}>
          <circle cx="50" cy="50" r="46" />
        </svg>
        <span className="cursor__label" ref={label} />
      </div>
      <div className="cursor__dot" ref={dot} aria-hidden="true" />
    </>
  );
};

export default Cursor;
