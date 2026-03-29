import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './SpaceBackground.css';

const SpaceBackground = () => {
  const { scrollY } = useScroll();

  // Create intense parallax effect: moving things up faster as you scroll down
  const y1 = useTransform(scrollY, [0, 2000], [0, -800]);
  const y2 = useTransform(scrollY, [0, 2000], [0, -400]);
  const y3 = useTransform(scrollY, [0, 2000], [0, -1200]);

  // Abstract planet/bubble elements
  return (
    <div className="space-wrapper">
      <motion.div 
        className="space-element planet-1"
        style={{ y: y1 }}
        animate={{ y: ["0px", "-30px", "0px"], rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="space-element planet-2"
        style={{ y: y2 }}
        animate={{ y: ["0px", "40px", "0px"], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="space-element planet-3"
        style={{ y: y3 }}
        animate={{ scale: [1, 1.2, 1], rotate: [360, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <div className="space-grid" />
    </div>
  );
};

export default SpaceBackground;
