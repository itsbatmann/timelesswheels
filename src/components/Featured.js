/*import { useRef } from "react";
import './Style/All.css'
import {
  useGsapFeatureLeftShutterUnveil,
  useGsapFeatureRightShutterUnveil,
} from "../hooks/gsap";
import img1 from '../Assets/henrry.jpg'
import img2 from '../Assets/kick.jpg'

const Featured = () => {
  const featureRef = useRef(null);
  const featureLeftShutterRef = useRef(null);
  const featureRightShutterRef = useRef(null);

  useGsapFeatureLeftShutterUnveil(featureLeftShutterRef, featureRef);
  useGsapFeatureRightShutterUnveil(featureRightShutterRef, featureRef);

  return (
    <section className="featured wrapper" ref={featureRef}>
      <h2 className="section-title">Featured</h2>
      <div className="features">
        <div className="feature-l">
          <span className="feature-text">Kick Buttowski Daredevil</span>
          <img
            src={img2}
            alt="90's telephone"
          />
          <span
            className="feature-shutter-l"
            ref={featureLeftShutterRef}
          ></span>
        </div>
        <div className="feature-r">
          <span className="feature-text">Horrid Henry</span>
          <img
            src={img1}
            alt="90's cassette"
          />
          <span
            className="feature-shutter-r"
            ref={featureRightShutterRef}
          ></span>
        </div>
      </div>
    </section>
  );
};

export default Featured;*/

import React from 'react';
import img1 from '../Assets/Cars.jpg';
import img2 from '../Assets/1969AMC.jpg';
import '../components/Style/Featured.css';

const Featured = () => {
  return (
    <div className="featured-container">
      <img src={img1} alt="Classic Car" className="featured-img" />
      <img src={img2} alt="1969 AMC" className="featured-img" />
    </div>
  );
};

export default Featured;
