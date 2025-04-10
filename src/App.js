import { Routes, Route } from "react-router-dom";
import Featured from "./components/Featured";

import Home from "./components/Home";


import { useSmoothScroll } from "./hooks/useSmoothScroll";
import MaskedImage from "./components/MaskedImage";
import Welcome from "./components/Welcome";

const App = () => {
  useSmoothScroll();
  return (
    <div>
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/featured" element={<Featured />} />
        <Route path="/Welcome"  element={<Welcome/> }/>
        <Route path="/gallery" element={<MaskedImage />} />
       
      </Routes>
    
    </div>
  );
};

export default App;
