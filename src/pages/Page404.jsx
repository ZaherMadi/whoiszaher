import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Page404.css';

/* ─── Etheral shadow background ──────────────────────────────────────
   Faithful port of the design:
   - SVG feTurbulence + feDisplacementMap (animated baseFrequency)
   - Framer mask image (smoke texture) with sin/cos drift + scale pulse
   - Noise overlay + vignette + brand tint wash (teal / violet)
──────────────────────────────────────────────────────────────────── */
const EtheralShadow = () => {
  const maskRef = useRef(null);
  const rafRef  = useRef(null);

  useEffect(() => {
    let t = 0;
    const drift = () => {
      t += 0.0016;
      const x = Math.sin(t) * 3;
      const y = Math.cos(t * 0.8) * 3;
      const s = 1.06 + Math.sin(t * 0.5) * 0.04;
      if (maskRef.current) {
        maskRef.current.style.transform = `translate(${x}%, ${y}%) scale(${s})`;
      }
      rafRef.current = requestAnimationFrame(drift);
    };
    rafRef.current = requestAnimationFrame(drift);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <div className="p404-ether">
      {/* SVG filter definition */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="p404EtherFilter" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.011 0.013" numOctaves="3" seed="4" result="noise">
              <animate
                attributeName="baseFrequency"
                dur="22s"
                values="0.011 0.013;0.015 0.009;0.009 0.015;0.011 0.013"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="70" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Displaced smoke */}
      <div className="p404-ether-disp">
        <div
          ref={maskRef}
          className="p404-ether-mask"
        />
      </div>

      {/* Brand colour tint (teal left + violet right) */}
      <div className="p404-ether-tint" />
      {/* Noise texture overlay */}
      <div className="p404-ether-noise" />
      {/* Edge vignette */}
      <div className="p404-ether-vignette" />
    </div>
  );
};

/* ─── Liquid glass button ─────────────────────────────────────────── */
const LgBtn = ({ to, href, children, alt, onClick }) => {
  const shineRef = useRef(null);

  const handleEnter = () => { if (shineRef.current) shineRef.current.style.left = '130%'; };
  const handleLeave = () => { if (shineRef.current) shineRef.current.style.left = '-70%'; };

  const inner = (
    <>
      <span className="p404-shine" ref={shineRef} />
      {children}
    </>
  );

  const cls = `p404-lg-btn${alt ? ' p404-lg-btn--alt' : ''}`;

  if (to) {
    return (
      <Link to={to} className={cls} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href || '#'} className={cls} onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={onClick}>
      {inner}
    </a>
  );
};

/* ─── Page 404 ────────────────────────────────────────────────────── */
const Page404 = () => {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  // Lock body scroll (full-screen fixed stage)
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className="p404-stage">
      <EtheralShadow />

      <div className="p404-content">
        {/* Giant serif 404 */}
        <div className="p404-num">404</div>

        {/* Heading */}
        <h1 className="p404-h">
          {isFr
            ? <>On est un peu <span className="p404-serif">perdu…</span></>
            : <>Looks like you're <span className="p404-serif">lost…</span></>
          }
        </h1>

        {/* Sub */}
        <p className="p404-p">
          {isFr
            ? "La page que tu cherches n'existe pas (ou plus). Où veux-tu aller ?"
            : "The page you're looking for doesn't exist (or no longer does). Where do you want to go?"
          }
        </p>

        {/* CTAs */}
        <div className="p404-ctas">
          <LgBtn to="/" alt>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, position: 'relative', zIndex: 2 }}>
              <path d="M3 11l9-8 9 8M5 10v10h14V10" />
            </svg>
            <span className="p404-btn-t">{isFr ? 'Retour à l\'accueil' : 'Back home'}</span>
          </LgBtn>

          <LgBtn href="/#contact">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, position: 'relative', zIndex: 2 }}>
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 6l-10 7L2 6" />
            </svg>
            <span className="p404-btn-t">{isFr ? 'Me contacter' : 'Contact me'}</span>
          </LgBtn>
        </div>
      </div>
    </div>
  );
};

export default Page404;
