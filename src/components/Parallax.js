import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../anim/gsap";

/**
 * Parallax media.
 *
 * This used to run its own requestAnimationFrame loop with a hand-rolled lerp
 * off window.scrollY. Under Lenis that meant three clocks disagreeing — smooth
 * scroll, this loop, and GSAP — so the image lagged the page it sits in.
 * ScrollTrigger scrubs it on the same ticker as everything else instead.
 */
const Parallax = ({ src, alt, className = "", strength = 8 }) => {
  const mediaRef = useRef(null);

  useGSAP(() => {
    const el = mediaRef.current;
    // Oversized so there is room to travel without baring an edge.
    gsap.set(el, { scale: 1.25 });

    gsap.fromTo(
      el,
      { yPercent: -strength },
      {
        yPercent: strength,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      }
    );
  }, []);

  const isVideo = /\.(mp4|webm|ogg)$/i.test(src);

  const mediaStyles = {
    willChange: "transform",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    borderRadius: "20px",
  };

  return isVideo ? (
    <video
      ref={mediaRef}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      className={className}
      style={mediaStyles}
    />
  ) : (
    <img
      ref={mediaRef}
      src={src}
      alt={alt}
      className={className}
      style={mediaStyles}
    />
  );
};

export default Parallax;
