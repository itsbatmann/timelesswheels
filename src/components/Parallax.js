import React, { useRef, useEffect } from "react";

const lerp = (start, end, factor) => start + (end - start) * factor;

const Parallax = ({ src, alt }) => {
  const mediaRef = useRef(null);
  const bounds = useRef(null);
  const currentTranslateY = useRef(0);
  const targetTranslateY = useRef(0);
  const rafId = useRef(null);

  useEffect(() => {
    const updateBounds = () => {
      if (mediaRef.current) {
        const rect = mediaRef.current.getBoundingClientRect();
        bounds.current = {
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY,
          height: rect.height,
        };
      }
    };

    const animate = () => {
      currentTranslateY.current = lerp(
        currentTranslateY.current,
        targetTranslateY.current,
        0.1
      );

      if (mediaRef.current) {
        mediaRef.current.style.transform = `translateY(${currentTranslateY.current}px) scale(1.05)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    updateBounds();
    animate();

    window.addEventListener("resize", updateBounds);

    return () => {
      window.removeEventListener("resize", updateBounds);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!bounds.current) return;
      const scrollY = window.scrollY;
      const relativeScroll = scrollY - bounds.current.top;
      targetTranslateY.current = relativeScroll * 0.2;
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isVideo = src.endsWith(".mp4") || src.endsWith(".webm") || src.endsWith(".ogg");

  // Updated inline styles for both images and videos
  const mediaStyles = {
    willChange: "transform",
    transform: "translateY(0) scale(1.25)",
    width: "100%",
    height: "100%", // Fill the container
    objectFit: "cover", // Preserve aspect ratio and fill container without stretching
    display: "block",
    borderRadius: "20px"
  };

  return isVideo ? (
    <video
      ref={mediaRef}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      style={mediaStyles}
    />
  ) : (
    <img
      ref={mediaRef}
      src={src}
      alt={alt}
      style={mediaStyles}
    />
  );
};

export default Parallax;
