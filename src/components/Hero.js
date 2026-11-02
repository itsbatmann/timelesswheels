import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, onlyWithMotion } from "../anim/gsap";
import { useReady } from "../anim/ready";
import "./Style/Hero.css";

/**
 * The home screen, left as the client designed it: "Timeless / since 1975"
 * against the three Wheels. The redesign deliberately stops at this section's
 * edge — only the entrance and the scroll departure are ours.
 */
const Hero = () => {
  const root = useRef(null);
  const intro = useRef(null);
  const ready = useReady();

  useGSAP(
    () => {
      onlyWithMotion(() => {
        // Masked character split: each letter rides up out of its own slot, so
        // the title arrives built rather than faded.
        const title = SplitText.create(".title-word", {
          type: "chars",
          mask: "chars",
          charsClass: "hero__char",
        });
        const since = SplitText.create(".since-year", {
          type: "chars",
          mask: "chars",
          charsClass: "hero__since-char",
        });
  
        const wheels = gsap.utils.toArray(".wheels p", root.current);
  
        const tl = gsap.timeline({ paused: true });
  
        tl.from(title.chars, {
          yPercent: 120,
          duration: 1.1,
          ease: "ignition",
          stagger: 0.045,
        })
          // The three Wheels slide in from the right out of one stack, which is
          // the pose the scroll parallax then pulls apart.
          .from(
            wheels,
            {
              xPercent: 120,
              opacity: 0,
              duration: 1,
              ease: "ignition",
              stagger: 0.08,
            },
            "-=0.85"
          )
          .from(
            since.chars,
            { yPercent: 110, duration: 0.7, ease: "ignition", stagger: 0.02 },
            "-=0.6"
          );
  
        intro.current = tl;
  
        /* ------------------------------------------------- scroll departure */
        // Leaving the hero, the three Wheels fan apart at different rates and the
        // title sinks slower than the page — the stack opens as you drive past.
        gsap.to(wheels, {
          yPercent: (i) => [-52, 0, 52][i],
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
  
        gsap.to(".content", {
          yPercent: -14,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
  
        return () => {
          title.revert();
          since.revert();
        };
        });
    },
    { scope: root }
  );

  // Held until the preloader's shutter begins to lift.
  useGSAP(
    () => {
      if (ready) intro.current?.play();
    },
    { dependencies: [ready], scope: root }
  );

  return (
    <div className="container" ref={root}>
      <div className="content">
        <div className="left">
          <h1 className="title">
            <span className="title-word">Timeless</span>
            <span className="since-year">
              <span className="since">since</span>{" "}
              <span className="year">1975</span>
            </span>
          </h1>
        </div>

        <div className="right wheels">
          <p>Wheels</p>
          <p>Wheels</p>
          <p>Wheels</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
