import Hero from "./Hero";
import Welcome from "./Welcome";
import Gallery from "./Gallery";
import New from "./New";
import Footer from "./Footer";

/**
 * The page. The hero and the footer are the client's and are left alone; the
 * beige room, the collection and the workshop story sit between them.
 *
 * Every photograph on the site lives in the one collection section, so the
 * page has a single place where the work is shown. The velocity skew that used
 * to lean the pictures into the scroll was taken off them: in a section this
 * quiet it was the one showy thing left.
 */
const Home = () => (
  <div>
    <Hero />
    <Welcome />
    <Gallery />
    <New />
    <Footer />
  </div>
);

export default Home;
