import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "./gsap";

/**
 * Chassis flex: images lean into the direction of travel and spring back when
 * the page settles. Tied to scroll velocity rather than position, so it reads
 * as the weight of the thing moving rather than another parallax.
 */
export const useVelocitySkew = (selector, max = 5) => {
  useGSAP(() => {
    const targets = gsap.utils.toArray(selector);
    if (!targets.length) return;

    gsap.set(targets, { transformOrigin: "center center", force3D: true });

    const proxy = { skew: 0 };
    const setSkew = gsap.quickSetter(targets, "skewY", "deg");
    const clamp = gsap.utils.clamp(-max, max);

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const skew = clamp(self.getVelocity() / -480);
        // Only ever take the larger lean, then always relax back to zero. That
        // asymmetry is what makes it snap on impulse and settle smoothly.
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.7,
            ease: "power3",
            overwrite: true,
            onUpdate: () => setSkew(proxy.skew),
          });
        }
      },
    });

    return () => st.kill();
  }, []);
};

export default useVelocitySkew;
