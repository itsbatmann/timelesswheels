import Hero from "./Hero";
import './Style/All.css'
import Featured from "./Featured";

import Gallery from "./Gallery";
import Welcome from "./Welcome";
import SmoothScroll from "./Smoothscroll";
import New from "./New";
import Footer from "./Footer";
const Home = () => {
  return (
    <div>
  <SmoothScroll>
  <Hero />
      <Featured />
      <Welcome/>
      <Gallery />
      <New/>
      <Footer/>
  </SmoothScroll>

  
    
    </div>
  );
};

export default Home;
