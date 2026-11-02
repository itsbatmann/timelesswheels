import { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Registers every GSAP plugin and the custom eases exactly once, before any
// component gets a chance to animate.
import "./anim/gsap";
import SmoothScrollProvider from "./anim/SmoothScroll";
import { ReadyContext } from "./anim/ready";

import Featured from "./components/Featured";
import Home from "./components/Home";
import Welcome from "./components/Welcome";
import Gallery from "./components/Gallery";
import Preloader from "./components/Preloader/Preloader";
import Cursor from "./components/Cursor/Cursor";
import RouteShutter from "./components/Shutter/RouteShutter";
import { LightboxProvider } from "./components/Lightbox/Lightbox";

// Visiting /?nopreload drops straight to the page. The preloader holds the
// screen for several seconds by design, which otherwise makes the site
// impossible to screenshot, inspect or QA without waiting it out every time.
const skipPreloader =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("nopreload");

const App = () => {
  // `ready` flips as the shutter starts lifting, which is what releases the
  // hero entrance. `booted` unmounts the preloader once it is fully gone.
  const [ready, setReady] = useState(skipPreloader);
  const [booted, setBooted] = useState(skipPreloader);

  return (
    <SmoothScrollProvider>
      <ReadyContext.Provider value={ready}>
        <LightboxProvider>
          {!booted && (
            <Preloader
              onReveal={() => setReady(true)}
              onComplete={() => setBooted(true)}
            />
          )}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/featured" element={<Featured />} />
            <Route path="/Welcome" element={<Welcome />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>

          <RouteShutter />
          <Cursor />
        </LightboxProvider>
      </ReadyContext.Provider>
    </SmoothScrollProvider>
  );
};

export default App;
