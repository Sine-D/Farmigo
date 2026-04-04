import React from "react";

const VideoHero = () => {
  return (
    <section id="home" className="relative w-full h-screen overflow-hidden flex items-center justify-center z-[1] select-none">
      <video
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover -z-[1]"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/home.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 z-0" />
    </section>
  );
};

export default VideoHero;
