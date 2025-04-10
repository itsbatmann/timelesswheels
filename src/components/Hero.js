import React from 'react';
import './Style/Hero.css';

const Hero = () => {
  return (
    <div className="container">
      <div className="content">
       
        <div className="left">
        <h1 className="title">
  <span className="title-word">Timeless</span>
  <span className="since-year">
    <span className="since">since</span> <span className="year">1975</span>
  </span>
</h1>

</div>

        <div className="right wheels">
          <p>Wheels</p>
          <p>Wheels</p>
          <p>Wheels</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
