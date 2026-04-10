import React from "react";
import Marketplace from "./Marketplace";

const Explore = () => {
  return (
    <div className="explore-page pt-[140px] min-h-screen bg-[#fcfcfc] pb-20">
      {/* Marketplace Section */}
      <section className="explore-section">
        <Marketplace />
      </section>
    </div>
  );
};

export default Explore;
