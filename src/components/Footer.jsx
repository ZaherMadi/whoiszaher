import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { language } = useLanguage();
  const svgRef = useRef(null);
  const drawRef = useRef(null);
  const maskRef = useRef(null);

  useEffect(() => {
    // Stroke draw-in animation
    const draw = drawRef.current;
    if (draw) {
      requestAnimationFrame(() => {
        draw.style.transition = 'stroke-dashoffset 4s ease-in-out';
        draw.style.strokeDashoffset = '0';
      });
    }
    // Cursor-tracked radial reveal
    const svg = svgRef.current;
    const mask = maskRef.current;
    if (!svg || !mask) return;
    const onMove = e => {
      const r = svg.getBoundingClientRect();
      mask.setAttribute('cx', ((e.clientX - r.left) / r.width * 100) + '%');
      mask.setAttribute('cy', ((e.clientY - r.top)  / r.height * 100) + '%');
    };
    const onEnter = () => svg.classList.add('hovered');
    const onLeave = () => { svg.classList.remove('hovered'); mask.setAttribute('cx','50%'); mask.setAttribute('cy','50%'); };
    svg.addEventListener('pointermove', onMove);
    svg.addEventListener('pointerenter', onEnter);
    svg.addEventListener('pointerleave', onLeave);
    return () => { svg.removeEventListener('pointermove', onMove); svg.removeEventListener('pointerenter', onEnter); svg.removeEventListener('pointerleave', onLeave); };
  }, []);

  return (
    <footer className="site-footer">
      <div className="footer-bg" />
      <div className="footer-inner">
        <nav className="footer-nav">
          <a href="#about">{language === 'fr' ? 'À propos' : 'About'}</a>
          <a href="#projects">{language === 'fr' ? 'Projets' : 'Projects'}</a>
          <a href="#skills">{language === 'fr' ? 'Compétences' : 'Skills'}</a>
          <a href="#contact">Contact</a>
          <a href="https://github.com/ZaherMadi" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://fr.linkedin.com/in/zaher-madi-b78625184" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </nav>

        {/* TextHoverEffect — MERCI */}
        <svg ref={svgRef} className="merci-svg" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="ftextGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="300" y2="0">
              <stop offset="0%"   stopColor="#eab308"/>
              <stop offset="25%"  stopColor="#ef4444"/>
              <stop offset="50%"  stopColor="#80eeb4"/>
              <stop offset="75%"  stopColor="#06b6d4"/>
              <stop offset="100%" stopColor="#8b5cf6"/>
            </linearGradient>
            <radialGradient id="frevealMask" ref={maskRef} gradientUnits="userSpaceOnUse" r="20%" cx="50%" cy="50%">
              <stop offset="0%"   stopColor="white"/>
              <stop offset="100%" stopColor="black"/>
            </radialGradient>
            <mask id="ftextMask">
              <rect x="0" y="0" width="100%" height="100%" fill="url(#frevealMask)"/>
            </mask>
          </defs>
          {/* Outline (appears on hover) */}
          <text className="merci-outline" x="50%" y="50%">MERCI</text>
          {/* Stroke draw-in */}
          <text ref={drawRef} className="merci-draw" x="50%" y="50%" style={{strokeDasharray:1000,strokeDashoffset:1000}}>MERCI</text>
          {/* Rainbow reveal follows cursor */}
          <text className="merci-reveal" x="50%" y="50%" mask="url(#ftextMask)">MERCI</text>
        </svg>

        <div className="footer-base">
          <span className="footer-brand">whoiszaher — © {new Date().getFullYear()}</span>
          <span>Zaher Madi</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
