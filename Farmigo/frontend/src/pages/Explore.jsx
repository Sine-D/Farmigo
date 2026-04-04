import React from "react";
import Marketplace from "./Marketplace";
import ColdStorage from "./ColdStorage";

const Explore = () => {
  return (
    <div className="explore-page">
      <h1 className="explore-title">Explore Opportunities</h1>
      
      {/* Marketplace Section */}
      <section className="explore-section">
        <Marketplace />
      </section>

      {/* Cold Storage Section */}
      <section className="explore-section">
        <ColdStorage />
      </section>
    </div>
  );
};

export default Explore;
