import React, { useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import './SpaceBackground.css';

const SpaceBackground = () => {
  const { scrollY } = useScroll();

  // ── Scroll parallax (vertical only) ────────────────────────────────────────
  const y1 = useTransform(scrollY, [0, 2000], [0, -800]);
  const y2 = useTransform(scrollY, [0, 2000], [0, -400]);
  const y3 = useTransform(scrollY, [0, 2000], [0, -1200]);

  // ── Mouse parallax ──────────────────────────────────────────────────────────
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring smoothing — slower stiffness for a gentle, floaty feel
  const smoothX = useSpring(rawX, { stiffness: 35, damping: 15 });
  const smoothY = useSpring(rawY, { stiffness: 35, damping: 15 });

  // Each blob moves a different amount — creates depth illusion
  const p1mx = useTransform(smoothX, [-0.5, 0.5], [-45, 45]);
  const p1my = useTransform(smoothY, [-0.5, 0.5], [-30, 30]);
  const p2mx = useTransform(smoothX, [-0.5, 0.5], [35, -35]);
  const p2my = useTransform(smoothY, [-0.5, 0.5], [22, -22]);
  const p3mx = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const p3my = useTransform(smoothY, [-0.5, 0.5], [-14, 14]);

  useEffect(() => {
    const onMove = (e) => {
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [rawX, rawY]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-wrapper">
      {/* planet-1: scroll-y + mouse-x/y + slow rotation */}
      <motion.div
        className="space-element planet-1"
        style={{ y: y1, x: p1mx, translateY: p1my }}
        animate={{ rotate: [0, 360] }}
        transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' } }}
      />

      {/* planet-2: scroll-y + mouse-x/y + opacity breathe */}
      <motion.div
        className="space-element planet-2"
        style={{ y: y2, x: p2mx, translateY: p2my }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ opacity: { duration: 15, repeat: Infinity, ease: 'easeInOut' } }}
      />

      {/* planet-3: scroll-y + mouse-x/y + scale pulse */}
      <motion.div
        className="space-element planet-3"
        style={{ y: y3, x: p3mx, translateY: p3my }}
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ scale: { duration: 25, repeat: Infinity, ease: 'easeInOut' } }}
      />

      <div className="space-grid" />
    </div>
  );
};

export default SpaceBackground;
