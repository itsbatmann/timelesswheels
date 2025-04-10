import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../components/Style/MaskedImage.css";

gsap.registerPlugin(ScrollTrigger);

const MaskedImage = ({ src, width = "100%", height = "auto" ,className}) => {
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    const masks = img.querySelectorAll(".mask");

    // Initial Clip Paths
    const initialClipPaths = [
      "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
      "polygon(33% 0%, 33% 0%, 33% 0%, 33% 0%)",
      "polygon(66% 0%, 66% 0%, 66% 0%, 66% 0%)",
      "polygon(0% 33%, 0% 33%, 0% 33%, 0% 33%)",
      "polygon(33% 33%, 33% 33%, 33% 33%, 33% 33%)",
      "polygon(66% 33%, 66% 33%, 66% 33%, 66% 33%)",
      "polygon(0% 66%, 0% 66%, 0% 66%, 0% 66%)",
      "polygon(33% 66%, 33% 66%, 33% 66%, 33% 66%)",
      "polygon(66% 66%, 66% 66%, 66% 66%, 66% 66%)",
    ];

    // Final Clip Paths
    const finalClipPaths = [
      "polygon(0% 0%, 33.5% 0%, 33.5% 33%, 0% 33.5%)",
      "polygon(33% 0%, 66.5% 0%, 66.5% 33%, 33% 33.5%)",
      "polygon(66% 0%, 100% 0%, 100% 33%, 66% 33.5%)",
      "polygon(0% 33%, 33.5% 33%, 33.5% 66%, 0% 66.5%)",
      "polygon(33% 33%, 66.5% 33%, 66.5% 66%, 33% 66.5%)",
      "polygon(66% 33%, 100% 33%, 100% 66%, 66% 66.5%)",
      "polygon(0% 66%, 33.5% 66%, 33.5% 100%, 0% 100%)",
      "polygon(33% 66%, 66.5% 66%, 66.5% 100%, 33% 100%)",
      "polygon(66% 66%, 100% 66%, 100% 100%, 66% 100%)",
    ];

    // Set Initial Clip Paths
    masks.forEach((mask, index) => {
      gsap.set(mask, {
        clipPath: initialClipPaths[index],
      });
    });

    // Animation Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: img,
        start: "top 75%",
        end: "top 20%",
        scrub: true,
      },
    });

    const animationOrder = [
      [".m-0"],
      [".m-1", ".m-3"],
      [".m-2", ".m-4", ".m-6"],
      [".m-5", ".m-7"],
      [".m-8"],
    ];

    // Animate Each Mask in Order
    animationOrder.forEach((targets, index) => {
      tl.to(
        targets.map((cls) => img.querySelector(cls)),
        {
          clipPath: (i, el) => finalClipPaths[Array.from(masks).indexOf(el)],
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.1,
        },
        index * 0.15
      );
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      className={`img ${className || ""}`}
      ref={imgRef}
      style={{ width:width }}
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className={`mask m-${i}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
    </div>
  );
  
    
};

export default MaskedImage;
