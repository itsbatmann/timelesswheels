import { useEffect, useRef, useState } from "react";

/**
 * Reports genuine load progress: every image decoded, plus the web fonts.
 * The fonts are counted because SplitText measures glyph boxes — splitting
 * before Kufam and Alex Brush arrive would mask the wrong line heights.
 *
 * `minDuration` keeps the ignition sequence legible on a warm cache, where the
 * real work finishes in under 100ms.
 */
export const useAssetPreload = (sources, minDuration = 2600) => {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [done, setDone] = useState(false);
  const srcRef = useRef(sources);

  useEffect(() => {
    const list = srcRef.current;
    const total = list.length + 1; // +1 for the font set
    const startedAt = performance.now();
    let loaded = 0;
    let cancelled = false;
    let timer;

    const settle = () => {
      const elapsed = performance.now() - startedAt;
      timer = window.setTimeout(
        () => !cancelled && setDone(true),
        Math.max(0, minDuration - elapsed)
      );
    };

    const bump = () => {
      if (cancelled) return;
      loaded += 1;
      setLoaded(loaded);
      // Hold the readout just short of 100 until the floor has elapsed, so the
      // needle never sits pinned at full while nothing appears to happen.
      setProgress(Math.min(loaded / total, 0.99));
      if (loaded >= total) settle();
    };

    list.forEach((src) => {
      const img = new Image();
      img.onload = bump;
      img.onerror = bump;
      img.src = src;
    });

    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    fonts.then(bump).catch(bump);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [minDuration]);

  return {
    progress: done ? 1 : progress,
    done,
    loaded,
    total: srcRef.current.length + 1,
  };
};

export default useAssetPreload;
