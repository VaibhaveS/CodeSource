import React from 'react';
import './Homepage.css';
import banner from '../../assets/banner.png';

const Homepage = () => {
  return (
    <div className="container">
      <section className="section-hero">
        <div className="hero-gauche">
          <h1>
            Codebase <strong>Clarity</strong> <br /> Made easy!
          </h1>

          <p>
            We are simplifying open-source collaboration, one explanation at a time. <br />
            <br /> Join our community today!
          </p>
        </div>

        <div className="hero-droite">
          <img src={banner} alt="banner" />
        </div>
      </section>
    </div>
  );
};

export default Homepage;
