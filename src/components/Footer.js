import React from "react";
import "./Style/Footer.css";
import f1 from "../Assets/f1.jpg";
import Parallax from "./Parallax";

const Footer = () => {
  return (
   
    <div className="footer-container">
      <section className="footer-left">
        <h1 className="footer-heading about">About</h1>
        <h1 className="footer-heading contact">Contact</h1>
        <p className="footer-tagline">
          Get your dream <span className="highlight">classic</span> car from us
        </p>
      </section>

      <section className="footer-right">
        <div className="image-container">
          <Parallax src={f1} alt="f1 car" className="footer-image" />
          <div className="f1text">
            <p>
              Ride hard, because life is
              beautiful and meant to be felt 
              at full speed.
               Let the road 
              teach you what comfort never 
              will.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;

