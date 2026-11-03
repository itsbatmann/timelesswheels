import Hero from "./Hero";
import Welcome from "./Welcome";
import Gallery from "./Gallery";
import Statement from "./Statement";
import New from "./New";
import Footer from "./Footer";

/**
 * The page. The hero and the beige room open it; from the collection on, it is
 * set on one ruled sheet — the record book — which the statement and the
 * footer stand on too, so the closing stretch reads as one document.
 *
 * Every photograph on the site lives in the one collection section.
 */
const Home = () => (
  <div>
    <Hero />
    <Welcome />
    <Gallery />
    <Statement />
    <New />
    <Footer />
  </div>
);

export default Home;
