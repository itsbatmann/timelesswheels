import Hero from "./Hero";
import Welcome from "./Welcome";
import Gallery from "./Gallery";
import Statement from "./Statement";
import New from "./New";
import Footer from "./Footer";

/**
 * The page: the hero and the beige room open it, the collection carries the
 * work, and the statement and the workshop close it before the footer.
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
