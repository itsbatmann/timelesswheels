import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";


const SmoothScroll = ({ children }) => {
  const lenis = useRef(null);

  useEffect(() => {
    lenis.current = new Lenis({
      duration: 3.5, // Adjust smoothness
      smooth: true,
    });

    function raf(time) {
      lenis.current.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.current.destroy(); // Cleanup
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
