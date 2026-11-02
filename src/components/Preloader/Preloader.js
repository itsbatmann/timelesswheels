import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../../anim/gsap";
import { useLenis } from "../../anim/SmoothScroll";
import useAssetPreload from "../../anim/useAssetPreload";
import Shutter from "../Shutter/Shutter";
import Car, { DASH_PITCH, WHEEL_ORIGINS } from "./Car";
import "./Preloader.css";

import cars from "../../Assets/Cars.jpg";
import amc from "../../Assets/1969AMC.jpg";
import berlin from "../../Assets/berlin.jpg";
import d32 from "../../Assets/download32.jpg";
import d24 from "../../Assets/download24.jpg";
import bik from "../../Assets/bik.jpg";
import engine from "../../Assets/engine.jpg";
import f1 from "../../Assets/f1.jpg";

// Everything the first scroll-through will actually need.
const ASSETS = [cars, amc, berlin, d32, d24, bik, engine, f1];

/**
 * The car is the whole preloader: it draws itself onto the road, drives while
 * the assets land, then leaves and the shutter lifts into the site.
 *
 * There is no readout, because the car is the readout — the wheels turn faster
 * as more of the page arrives.
 */
const Preloader = ({ onReveal, onComplete }) => {
  const root = useRef(null);
  const shutter = useRef(null);
  // Everything that turns: both wheels and the road beneath them.
  const drive = useRef(null);
  const buzz = useRef(null);

  // Fires once the car is complete and driving — only then may it leave.
  const [introDone, setIntroDone] = useState(false);
  const lenis = useLenis();
  const { progress, done } = useAssetPreload(ASSETS, 2400);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Hold the page still underneath us.
  useEffect(() => {
    if (!lenis) return;
    lenis.stop();
  }, [lenis]);

  /* ---------------------------------------------------------------- intro */
  useGSAP(
    () => {
      gsap.set(".car__streak", { autoAlpha: 0 });
      gsap.set(".car__dash", { autoAlpha: 0 });

      // One timeline holds every moving part of the car, held at a standstill.
      // From then on the only thing that changes is how fast it is allowed to
      // run, so the wheels and the road can never drift out of step.
      drive.current = gsap
        .timeline({ repeat: -1, paused: true })
        .to(
          ".car__wheel--front",
          {
            rotation: 360,
            duration: 1,
            ease: "none",
            svgOrigin: WHEEL_ORIGINS.front,
          },
          0
        )
        .to(
          ".car__wheel--rear",
          {
            rotation: 360,
            duration: 1,
            ease: "none",
            svgOrigin: WHEEL_ORIGINS.rear,
          },
          0
        )
        // Exactly one dash pitch of travel, so the loop is seamless.
        .fromTo(
          ".car__road",
          { x: 0 },
          { x: -DASH_PITCH, duration: 0.5, ease: "none" },
          0
        );
      drive.current.timeScale(0);

      // A little road buzz through the body, independent of road speed.
      buzz.current = gsap.to(".car__body", {
        y: 1.6,
        duration: 0.19,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true,
      });

      if (reduced) {
        gsap.set(
          [".car__line", ".car__ground", ".car__rim", ".car__spoke", ".car__hub"],
          { drawSVG: "100%" }
        );
        gsap.set(".car__dash", { autoAlpha: 1 });
        setIntroDone(true);
        return;
      }

      gsap
        .timeline({ onComplete: () => setIntroDone(true) })
        // Road first, then the car is drawn onto it.
        .fromTo(
          ".car__ground",
          { drawSVG: "50% 50%" },
          { drawSVG: "0% 100%", duration: 0.6, ease: "piston" }
        )
        // The traced contours ink themselves on, longest first (carData is
        // sorted that way) so the big forms arrive before the fine detail.
        .fromTo(
          ".car__line",
          { drawSVG: 0 },
          {
            drawSVG: "100%",
            duration: 0.9,
            ease: "coast",
            stagger: { each: 0.055, from: "start" },
          },
          "-=0.35"
        )
        .fromTo(
          ".car__rim",
          { drawSVG: 0 },
          { drawSVG: "100%", duration: 0.5, ease: "coast", stagger: 0.08 },
          "-=0.75"
        )
        .fromTo(
          ".car__spoke",
          { drawSVG: 0 },
          { drawSVG: "100%", duration: 0.26, ease: "none", stagger: 0.006 },
          "-=0.5"
        )
        .fromTo(
          ".car__hub",
          { drawSVG: 0 },
          { drawSVG: "100%", duration: 0.3 },
          "-=0.2"
        )
        // And it pulls away. From here, the turning wheels are the loader.
        .call(() => {
          drive.current.play();
          buzz.current.play();
        })
        .to(
          ".car__dash",
          { autoAlpha: 1, duration: 0.4, stagger: 0.015 },
          "-=0.25"
        )
        .to(drive.current, { timeScale: 1, duration: 0.8, ease: "coast" }, "<");

      return () => buzz.current?.kill();
    },
    { scope: root }
  );

  /* ------------------------------------------------- progress follows load */
  useGSAP(
    () => {
      if (!introDone || !drive.current || done) return;
      // The car gathers pace as the assets land — the wheels are the gauge.
      gsap.to(drive.current, {
        timeScale: 1 + progress * 3,
        duration: 0.7,
        ease: "coast",
        overwrite: "auto",
      });
    },
    { dependencies: [progress, introDone, done], scope: root }
  );

  /* --------------------------------------------------------- it drives off */
  useGSAP(
    () => {
      if (!introDone || !done) return;

      const release = () => {
        if (lenis) lenis.start();
        ScrollTrigger.refresh();
        drive.current?.kill();
        buzz.current?.kill();
        onComplete?.();
      };

      if (reduced) {
        gsap
          .timeline({ onComplete: release })
          .call(() => onReveal?.())
          .to(root.current, { autoAlpha: 0, duration: 0.4 });
        return;
      }

      gsap
        .timeline({ onComplete: release })
        .to(drive.current, { timeScale: 11, duration: 0.5, ease: "power2.in" })
        .to(".car__streak", { autoAlpha: 1, duration: 0.12, stagger: 0.03 }, 0.2)
        .to(
          ".car__streak",
          {
            x: 520,
            autoAlpha: 0,
            duration: 0.5,
            ease: "power2.in",
            stagger: 0.03,
          },
          0.3
        )
        .to(".car__body", { x: 1500, duration: 0.6, ease: "power3.in" }, 0.3)
        .to(".car__dash", { autoAlpha: 0, duration: 0.3 }, 0.55)
        .to(
          ".car__ground",
          { drawSVG: "50% 50%", duration: 0.45, ease: "piston" },
          0.65
        )
        .addLabel("reveal")
        // Drop our own backdrop so the slats become the only thing still
        // covering the hero as they thin out.
        .set(root.current, { backgroundColor: "transparent" }, "reveal")
        .set(".pre__grain, .pre__vignette", { opacity: 0 }, "reveal")
        .add(shutter.current.open({ duration: 1.15, each: 0.045 }), "reveal")
        // The hero starts moving while the shutter is still opening, so the
        // two read as one continuous gesture rather than a handover.
        .call(() => onReveal?.(), null, "reveal+=0.1");
    },
    { dependencies: [introDone, done], scope: root }
  );

  return (
    <div
      className="pre"
      ref={root}
      role="progressbar"
      aria-label="Loading Timeless Wheels"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <Shutter ref={shutter} count={14} closed />

      <div className="pre__vignette" />
      <div className="pre__grain" />

      <div className="pre__stage">
        <Car />
      </div>
    </div>
  );
};

export default Preloader;
