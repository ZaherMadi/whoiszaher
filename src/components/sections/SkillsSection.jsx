import React, { useRef, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useAnimationFrame,
} from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import AnimatedSection from '../AnimatedSection';
import './SkillsSection.css';

// ── Per-tech visual config ─────────────────────────────────────────────────────
const techVisuals = {
  typescript: { color: '#3178c6', symbol: 'TS',  img: null },
  react:       { color: '#61dafb', symbol: 'R',   img: null },
  cloudflare:  { color: '#f38020', symbol: null,  img: '/assets/logo-cloudflare.png' },
  postgres:    { color: '#00e5bf', symbol: null,  img: '/assets/logo-neon.png' },
  redis:       { color: '#00bfa5', symbol: null,  img: '/assets/logo-upstash.png' },
  aws:         { color: '#ff9900', symbol: 'AWS', img: null },
  leadership:  { color: '#d900ff', symbol: '★',   img: null },
};

const legendTechs = [
  { id: 'cloudflare',  name: 'Cloudflare',   img: '/assets/logo-cloudflare.png' },
  { id: 'expo',        name: 'Expo',          img: '/assets/logo-expo.png' },
  { id: 'firebase',    name: 'Firebase',      img: '/assets/logo-firebase.png' },
  { id: 'neon',        name: 'Neon DB',       img: '/assets/logo-neon.png' },
  { id: 'upstash',     name: 'Upstash Redis', img: '/assets/logo-upstash.png' },
  { id: 'mapbox',      name: 'Mapbox',        img: '/assets/logo-mapbox.png' },
  { id: 'tripadvisor', name: 'TripAdvisor',   img: '/assets/logo-tripadvisor.png' },
  { id: 'render',      name: 'Render',        img: '/assets/logo-render.png' },
];

const decorativeFloats = [
  { id: 'expo',        img: '/assets/logo-expo.png',        color: '#888888' },
  { id: 'firebase',    img: '/assets/logo-firebase.png',    color: '#FFA000' },
  { id: 'mapbox',      img: '/assets/logo-mapbox.png',      color: '#4264fb' },
  { id: 'tripadvisor', img: '/assets/logo-tripadvisor.png', color: '#34E0A1' },
  { id: 'render',      img: '/assets/logo-render.png',      color: '#46E3B7' },
  { id: 'neon-dark',   img: '/assets/logo-neon-dark.png',   color: '#00e5bf' },
];

// ── Per-orb orbit parameters (stable, not randomised per render) ───────────────
const ORBIT_PARAMS = [
  { rx: 14, ry: 28, dur: 6.2, phase: 0.0 },
  { rx: 10, ry: 20, dur: 7.8, phase: 1.1 },
  { rx: 20, ry: 14, dur: 5.5, phase: 2.3 },
  { rx: 8,  ry: 32, dur: 8.4, phase: 0.7 },
  { rx: 18, ry: 10, dur: 6.9, phase: 1.8 },
  { rx: 12, ry: 24, dur: 7.2, phase: 3.0 },
  { rx: 22, ry: 16, dur: 5.9, phase: 0.4 },
];

const DECO_ORBIT_PARAMS = [
  { rx: 8,  ry: 18, dur: 9.0,  phase: 0.5 },
  { rx: 14, ry: 10, dur: 10.5, phase: 1.9 },
  { rx: 6,  ry: 22, dur: 8.3,  phase: 2.7 },
  { rx: 18, ry: 8,  dur: 11.2, phase: 0.2 },
  { rx: 10, ry: 16, dur: 9.8,  phase: 3.1 },
  { rx: 16, ry: 12, dur: 10.1, phase: 1.3 },
];

// ── Fixed positions ────────────────────────────────────────────────────────────
const FLOAT_POS = [
  { left: '8%',  top: '8%'  },
  { left: '75%', top: '18%' },
  { left: '18%', top: '55%' },
  { left: '65%', top: '68%' },
  { left: '35%', top: '78%' },
  { left: '50%', top: '38%' },
  { left: '82%', top: '82%' },
];

const DECO_POS = [
  { left: '25%', top: '25%' },
  { left: '60%', top: '50%' },
  { left: '5%',  top: '70%' },
  { left: '88%', top: '15%' },
  { left: '42%', top: '90%' },
  { left: '72%', top: '60%' },
];

// ── 3 sizes for depth illusion ─────────────────────────────────────────────────
const SIZES = [88, 72, 56];
const getSizeByIndex = (i) => SIZES[i % SIZES.length];
const getOpacityBySize = (size) => size === 88 ? 0.7 : size === 72 ? 0.5 : 0.32;

// ── MagneticOrb ───────────────────────────────────────────────────────────────
// Combines elliptical orbit + cursor repulsion into a single spring channel
// so there's never a conflict between animate and style MotionValues.
const MagneticOrb = ({ pos, orbitParams, size, color, img, symbol, techName, delay, isActive }) => {
  const ref = useRef(null);
  const repulse = useRef({ x: 0, y: 0 });

  // Single target channel updated by useAnimationFrame (orbit + repulsion summed)
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);

  // Spring smoothing — slightly different stiffness per size to vary "weight" feel
  const stiffness = size === 88 ? 55 : size === 72 ? 70 : 90;
  const x = useSpring(targetX, { stiffness, damping: 18 });
  const y = useSpring(targetY, { stiffness, damping: 18 });

  // Mouse repulsion — push orb away when cursor is within 130px
  useEffect(() => {
    const onMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const threshold = 130;
      if (dist < threshold && dist > 0) {
        const strength = ((threshold - dist) / threshold) * 32;
        repulse.current.x = (-dx / dist) * strength;
        repulse.current.y = (-dy / dist) * strength;
      } else {
        repulse.current.x = 0;
        repulse.current.y = 0;
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Animation frame: orbit path (sinusoidal ellipse) + repulsion offset
  const { rx, ry, dur, phase } = orbitParams;
  useAnimationFrame((time) => {
    const t = time / 1000;
    const angle = (t / dur) * Math.PI * 2 + phase;
    targetX.set(Math.cos(angle) * rx + repulse.current.x);
    targetY.set(Math.sin(angle) * ry + repulse.current.y);
  });

  const targetOpacity = getOpacityBySize(size);

  return (
    <motion.div
      ref={ref}
      className="floating-tech"
      style={{
        ...pos,
        width: size,
        height: size,
        borderColor: isActive ? color : 'rgba(255,255,255,0.12)',
        boxShadow: isActive
          ? `0 0 28px ${color}70, 0 0 56px ${color}30`
          : 'none',
        x,
        y,
      }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: targetOpacity }}
      viewport={{ once: true, margin: '-5% 0px' }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 18,
        delay,
      }}
    >
      {img ? (
        <img
          src={img}
          alt={techName || ''}
          className="tech-logo-img"
          style={{ width: size * 0.52, height: size * 0.52 }}
        />
      ) : (
        <div
          className="tech-symbol"
          style={{ color, fontSize: size > 70 ? '0.85rem' : '0.72rem' }}
        >
          {symbol}
        </div>
      )}

      {/* Tooltip label (slides up on hover / active) */}
      <AnimatePresence>
        {isActive && techName && (
          <motion.span
            className="orb-label"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.16 }}
          >
            {techName}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── DecoOrb: lightweight background orb, no spring needed ─────────────────────
const DecoOrb = ({ pos, orbitParams, color, img, delay }) => {
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 40, damping: 14 });
  const y = useSpring(targetY, { stiffness: 40, damping: 14 });
  const { rx, ry, dur, phase } = orbitParams;

  useAnimationFrame((time) => {
    const t = time / 1000;
    const angle = (t / dur) * Math.PI * 2 + phase;
    targetX.set(Math.cos(angle) * rx);
    targetY.set(Math.sin(angle) * ry);
  });

  return (
    <motion.div
      className="floating-tech floating-deco"
      style={{ ...pos, width: 48, height: 48, borderColor: color, x, y }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 0.22 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <img src={img} alt="" className="tech-logo-img" style={{ width: 26, height: 26 }} />
    </motion.div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────
const SkillsSection = () => {
  const { t } = useLanguage();

  return (
    <section id="skills" className="skills-section">

      {/* BACKGROUND FLOATING UNIVERSE */}
      <div className="skills-universe">

        {/* Primary orbs — one per skill */}
        {t.skills.list.map((tech, index) => {
          const visual = techVisuals[tech.id];
          const size = getSizeByIndex(index);
          return (
            <MagneticOrb
              key={`orb-${tech.id}`}
              pos={FLOAT_POS[index % FLOAT_POS.length]}
              orbitParams={ORBIT_PARAMS[index % ORBIT_PARAMS.length]}
              size={size}
              color={visual?.color || '#7000ff'}
              img={visual?.img || null}
              symbol={visual?.symbol || null}
              techName={tech.name}
              isActive={false}
              delay={0.08 * index}
            />
          );
        })}

        {/* Decorative background orbs */}
        {decorativeFloats.map((item, index) => (
          <DecoOrb
            key={`deco-${item.id}`}
            pos={DECO_POS[index % DECO_POS.length]}
            orbitParams={DECO_ORBIT_PARAMS[index % DECO_ORBIT_PARAMS.length]}
            color={item.color}
            img={item.img}
            delay={0.05 * index + 0.5}
          />
        ))}
      </div>

      {/* CONTENT */}
      <div className="container relative-z">

        <AnimatedSection className="skills-header">
          <h2 className="section-title text-gradient">{t.skills.title}</h2>
        </AnimatedSection>

        <div className="skills-body">

          {/* LEFT: skill word buttons */}
          <AnimatedSection className="skills-left" delay={0.1}>
            <p className="skills-instruction">
              {t.skills.instruction || 'Hover to focus · Click to invoke ✦'}
            </p>

            <div className="skills-list">
              {t.skills.list.map((tech) => {
                const visual = techVisuals[tech.id];
                return (
                  <motion.button
                    key={tech.id}
                    className="skill-word"
                    style={{ '--tech-color': visual?.color || '#7000ff' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tech.name}
                  </motion.button>
                );
              })}
            </div>

            <AnimatedSection delay={0.3} className="skills-details glass-panel">
              <p className="aws-detail text-gradient">{t.skills.awsDetails}</p>
              <p className="lang-detail">{t.skills.languages}</p>
            </AnimatedSection>
          </AnimatedSection>

          {/* RIGHT: tech legend */}
          <AnimatedSection className="skills-right" delay={0.2}>
            <div className="skills-tech-legend glass-panel">
              <h3>{t.language === 'fr' ? 'Stack utilisé en production' : 'Production stack'}</h3>
              <div className="tech-legend-grid">
                {legendTechs.map((tech, i) => (
                  <motion.div
                    key={tech.id}
                    className="tech-legend-item"
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * i + 0.3, duration: 0.4 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <img src={tech.img} alt={tech.name} className="legend-logo" />
                    <span className="legend-name">{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>

        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
