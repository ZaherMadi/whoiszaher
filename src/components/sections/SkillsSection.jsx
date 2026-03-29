import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import AnimatedSection from '../AnimatedSection';
import './SkillsSection.css';

const techVisuals = {
  typescript: { color: '#3178c6', symbol: 'TS',  img: null },
  react:       { color: '#61dafb', symbol: 'R',   img: null },
  cloudflare:  { color: '#f38020', symbol: null,  img: '/assets/logo-cloudflare.png' },
  postgres:    { color: '#00e5bf', symbol: null,  img: '/assets/logo-neon.png' },
  redis:       { color: '#00bfa5', symbol: null,  img: '/assets/logo-upstash.png' },
  aws:         { color: '#ff9900', symbol: 'AWS', img: null },
  leadership:  { color: '#d900ff', symbol: '★',   img: null },
};

// All techs shown in the right-column legend
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

// Decorative floating orbs in the background
const decorativeFloats = [
  { id: 'expo',        img: '/assets/logo-expo.png',        color: '#000000' },
  { id: 'firebase',    img: '/assets/logo-firebase.png',    color: '#FFA000' },
  { id: 'mapbox',      img: '/assets/logo-mapbox.png',      color: '#4264fb' },
  { id: 'tripadvisor', img: '/assets/logo-tripadvisor.png', color: '#34E0A1' },
  { id: 'render',      img: '/assets/logo-render.png',      color: '#46E3B7' },
  { id: 'neon-dark',   img: '/assets/logo-neon-dark.png',   color: '#00e5bf' },
];

const SkillsSection = () => {
  const { t } = useLanguage();
  const [hoveredTech, setHoveredTech] = useState(null);
  const [clickedTech, setClickedTech] = useState(null);

  const handleMouseEnter = (id) => { if (!clickedTech) setHoveredTech(id); };
  const handleMouseLeave = () => { if (!clickedTech) setHoveredTech(null); };
  const handleClick = (id) => {
    setClickedTech(prev => (prev === id ? null : id));
    setHoveredTech(null);
  };

  const getFloatPos = (index) => {
    const xs = ['8%', '75%', '18%', '65%', '35%', '50%', '82%'];
    const ys = ['8%', '18%', '55%', '68%', '78%', '38%', '82%'];
    return { left: xs[index % xs.length], top: ys[index % ys.length] };
  };

  const getDecoPos = (index) => {
    const xs = ['25%', '60%', '5%', '88%', '42%', '72%'];
    const ys = ['25%', '50%', '70%', '15%', '90%', '60%'];
    return { left: xs[index % xs.length], top: ys[index % ys.length] };
  };

  return (
    <section id="skills" className="skills-section">

      {/* BACKGROUND FLOATING ORBS */}
      <div className="skills-universe">
        {t.skills.list.map((tech, index) => {
          const isHovered = hoveredTech === tech.id;
          const isClicked = clickedTech === tech.id;
          const isDimmed = (hoveredTech || clickedTech) && !isHovered && !isClicked;
          const visual = techVisuals[tech.id];

          return (
            <motion.div
              key={`float-${tech.id}`}
              className="floating-tech"
              style={{
                ...getFloatPos(index),
                borderColor: visual?.color || '#7000ff',
                boxShadow: (isHovered || isClicked)
                  ? `0 0 30px ${visual?.color || '#7000ff'}80, 0 0 60px ${visual?.color || '#7000ff'}40`
                  : 'none',
                zIndex: isClicked ? 50 : 1,
              }}
              animate={{
                y: isHovered || isClicked ? 0 : [0, -28, 0],
                x: isHovered || isClicked ? 0 : [0, 12, 0],
                opacity: isDimmed ? 0.06 : isHovered || isClicked ? 1 : 0.5,
                scale: isClicked ? 2.2 : isHovered ? 1.3 : 1,
                rotateZ: isClicked ? [0, 360] : 0,
              }}
              transition={{
                y: { duration: 4 + index * 0.7, repeat: isHovered || isClicked ? 0 : Infinity, ease: 'easeInOut' },
                x: { duration: 5 + index * 0.5, repeat: isHovered || isClicked ? 0 : Infinity, ease: 'easeInOut' },
                scale: { type: 'spring', stiffness: 300, damping: 18 },
                rotateZ: { duration: 0.6 },
                opacity: { duration: 0.3 },
              }}
            >
              {visual?.img ? (
                <img src={visual.img} alt={tech.name} className="tech-logo-img" />
              ) : (
                <div className="tech-symbol" style={{ color: visual?.color || '#fff' }}>
                  {visual?.symbol}
                </div>
              )}
            </motion.div>
          );
        })}

        {decorativeFloats.map((item, index) => (
          <motion.div
            key={`deco-${item.id}`}
            className="floating-tech floating-deco"
            style={{ ...getDecoPos(index), borderColor: item.color }}
            animate={{
              y: [0, -18 - index * 3, 0],
              x: [0, 6 + index * 2, 0],
              opacity: hoveredTech || clickedTech ? 0.04 : [0.28, 0.42, 0.28],
            }}
            transition={{
              y: { duration: 6 + index, repeat: Infinity, ease: 'easeInOut' },
              x: { duration: 7 + index * 0.8, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 3 + index, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <img src={item.img} alt="" className="tech-logo-img" />
          </motion.div>
        ))}
      </div>

      {/* CONTENT */}
      <div className="container relative-z">

        <AnimatedSection className="skills-header">
          <h2 className="section-title text-gradient">{t.skills.title}</h2>
        </AnimatedSection>

        <div className="skills-body">

          {/* LEFT: interactive skill words */}
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
                    className={`skill-word ${hoveredTech === tech.id || clickedTech === tech.id ? 'active' : ''}`}
                    style={{ '--tech-color': visual?.color || '#7000ff' }}
                    onMouseEnter={() => handleMouseEnter(tech.id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(tech.id)}
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
                {legendTechs.map((tech) => (
                  <div key={tech.id} className="tech-legend-item">
                    <img src={tech.img} alt={tech.name} className="legend-logo" />
                    <span className="legend-name">{tech.name}</span>
                  </div>
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
