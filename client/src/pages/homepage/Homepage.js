import React from 'react';
import './Homepage.css';
import banner from '../../assets/banner.png';

const Homepage = () => {
  return (
    <div class="container">
      <section class="section-hero">
        <div class="hero-gauche">
          <h1>
            Codebase <strong>clarity</strong> <br /> made easy!
          </h1>

          <p>
            We are simplifying open-source collaboration, one explanation at a time. <br />
            <br /> Join our community today!
          </p>
        </div>

        <div class="hero-droite">
          <img src={banner} alt="rocket maaan" />
        </div>
      </section>
    </div>
  );
};

export default Homepage;
