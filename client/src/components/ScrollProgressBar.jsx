import React, { useState, useEffect } from "react";

/**
 * Scroll Progress Bar Component.
 * Displays a thin, neon progress bar at the top of the viewport tracking scroll depth.
 */
const ScrollProgressBar = () => {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrolled = (window.scrollY / scrollHeight) * 100;
        setScrollWidth(scrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "3px",
        width: `${scrollWidth}%`,
        backgroundColor: "var(--purple-light, #a855f7)",
        zIndex: 999999,
        transition: "width 0.05s ease-out",
        boxShadow: "0 0 8px var(--purple, #7c3aed)",
      }}
    />
  );
};

export default ScrollProgressBar;
