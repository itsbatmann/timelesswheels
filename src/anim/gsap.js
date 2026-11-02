// Central GSAP setup. Import gsap from here (never from "gsap" directly) so that
// every plugin is registered exactly once and the custom eases always exist.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { CustomWiggle } from "gsap/CustomWiggle";

gsap.registerPlugin(
  ScrollTrigger,
  SplitText,
  DrawSVGPlugin,
  ScrambleTextPlugin,
  Flip,
  CustomEase,
  CustomWiggle
);

// The motion vocabulary of the site: everything moves like a machined part —
// heavy to start, decisive, and it never wobbles to a stop.
CustomEase.create("shutter", "0.76, 0, 0.24, 1"); // garage door / louvre slats
CustomEase.create("ignition", "0.16, 1, 0.3, 1"); // type and image reveals
CustomEase.create("piston", "0.87, 0, 0.13, 1"); // short, violent travel
CustomEase.create("coast", "0.22, 1, 0.36, 1"); // long settles

// A needle that overshoots its mark and shivers back, like a real tachometer.
CustomWiggle.create("needle", { wiggles: 7, type: "easeOut" });

export {
  gsap,
  ScrollTrigger,
  SplitText,
  DrawSVGPlugin,
  Flip,
  CustomEase,
};

/**
 * Runs `build` only when the visitor has not asked for reduced motion.
 *
 * Every entrance on this site starts from a hidden state (opacity 0, or a
 * masked line pushed out of view). If those tweens are created regardless of
 * preference, a reduced-motion visitor gets the hidden state and never the
 * animation that undoes it — so the content simply never appears. Gating the
 * whole build means the reduced page is the finished page.
 */
export const onlyWithMotion = (build) => {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", build);
  return mm;
};
