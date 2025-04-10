

import React from "react";
import MaskedImage from "./MaskedImage";
import img1 from "../Assets/berlin.jpg";
import img3 from "../Assets/download32.jpg";
import img6 from "../Assets/download24.jpg";
import img8 from "../Assets/imgf.jpg";
import img9 from "../Assets/imgc.jpg";
import img4 from "../Assets/bik.jpg";
import img11 from '../Assets/rover.jpg';
import img12 from '../Assets/engine.jpg';
import img5 from "../Assets/car-7385281.jpg"
import "../components/Style/Gallery.css";
import Parallax from "./Parallax";



const images = [
  'https://via.placeholder.com/400x600?text=Image+1',
  'https://via.placeholder.com/800x600?text=Image+2', // spans 2 columns
  'https://via.placeholder.com/400x600?text=Image+3',
  'https://via.placeholder.com/400x600?text=Image+4',
  'https://via.placeholder.com/400x600?text=Image+5',
];

const Gallery = () => {
  return (
    <section>
     
      <article>
        <MaskedImage src={img4} alt="Image 1"  />
    
        <MaskedImage src={img1} alt="Image 2" className="span-two" />

        <MaskedImage src={img6} alt="Image 3" />
        <MaskedImage src={img3} alt="Image 4" />
        <MaskedImage src={img12} alt="Image 5" />
      </article>
    </section>
  );
};

export default Gallery;
/*
const Gallery = () => {
  return (
    <div className="gallery-container">
  
      <div className="image-group first-group">
        <div className="single-image">
          <MaskedImage src={img1} width="800px" height="450px" />
        </div>
        <div className="stacked-images">
          <MaskedImage src={img3} width="530px" height="220px" />
          <MaskedImage src={img6} width="530px" height="220px" />
        </div>
      </div>

    <div className="image-group second-group">
        <MaskedImage src={img9} width="500px"
         height="550px"/>
        <MaskedImage src={img8}
         width="500px"
          height="550px"/>
      </div>
   

    <div className="image-group fourth-group">   
    <MaskedImage src={img4} width="400px" height="350px" />
        <MaskedImage src={img11} width="500px" height="350px" />
        <MaskedImage src={img12 } width="500px" height="350px" />
    </div>
   



    
    </div>
  );
};

export default Gallery;*/
/*
const Gallery = () => {
  return (
    <div className="gallery-container">
  
      <div className="image-group first-group">
        <div className="single-image">
          <MaskedImage src={img1} width="800px" height="450px" />
        </div>
        <div className="stacked-images">
          <MaskedImage src={img3} width="530px" height="220px" />
          <MaskedImage src={img6} width="530px" height="220px" />
        </div>
      </div>

    <div className="image-group second-group">
        <MaskedImage src={img9} width="500px"
         height="550px"/>
        <MaskedImage src={img8}
         width="500px"
          height="550px"/>
      </div>
   

    <div className="image-group fourth-group">   
    <MaskedImage src={img4} width="400px" height="350px" />
        <MaskedImage src={img11} width="500px" height="350px" />
        <MaskedImage src={img12 } width="500px" height="350px" />
    </div>
   



    
    </div>
  );
};

export default Gallery;*/
