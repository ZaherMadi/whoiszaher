import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './PageMerci.css';

/* ─── Etheral shadow (same pattern as Page404) ─────────────────────── */
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
    <div className="merci-ether">
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="merciEtherFilter" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.011 0.013" numOctaves="3" seed="7" result="noise">
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

      <div className="merci-ether-disp">
        <div ref={maskRef} className="merci-ether-mask" />
      </div>
      <div className="merci-ether-tint" />
      <div className="merci-ether-noise" />
      <div className="merci-ether-vignette" />
    </div>
  );
};

/* ─── Liquid glass button ─────────────────────────────────────────── */
const LgBtn = ({ to, href, children, alt }) => {
  const shineRef = useRef(null);
  const onEnter  = () => { if (shineRef.current) shineRef.current.style.left = '130%'; };
  const onLeave  = () => { if (shineRef.current) shineRef.current.style.left = '-70%'; };
  const cls = `merci-lg-btn${alt ? ' merci-lg-btn--alt' : ''}`;
  const inner = <><span className="merci-shine" ref={shineRef} />{children}</>;

  return to
    ? <Link to={to} className={cls} onMouseEnter={onEnter} onMouseLeave={onLeave}>{inner}</Link>
    : <a href={href || '#'} className={cls} onMouseEnter={onEnter} onMouseLeave={onLeave}>{inner}</a>;
};

/* ─── Page /merci ─────────────────────────────────────────────────── */
const PageMerci = () => {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className="merci-stage">
      <EtheralShadow />

      <div className="merci-content">
        {/* Badge CV téléchargé */}
        <span className="merci-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {isFr ? 'CV téléchargé' : 'CV downloaded'}
        </span>

        {/* Title */}
        <div className="merci-title">
          {isFr
            ? <>Merci d'être passé,<br />et à <span className="merci-teal">très vite !</span></>
            : <>Thanks for stopping by,<br />see you <span className="merci-teal">very soon!</span></>
          }
        </div>

        {/* Sub */}
        <p className="merci-p">
          {isFr
            ? 'En attendant, on garde le contact ? Je suis disponible dès le 3 juin.'
            : "In the meantime, let's stay in touch? I'm available from June 3rd."
          }
        </p>

        {/* CTAs */}
        <div className="merci-ctas">
          <LgBtn href="mailto:zahermadi@yahoo.fr" alt>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, position: 'relative', zIndex: 2 }}>
              <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" />
            </svg>
            <span className="merci-btn-t">{isFr ? 'Me contacter' : 'Contact me'}</span>
          </LgBtn>

          <LgBtn to="/">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, position: 'relative', zIndex: 2 }}>
              <path d="M3 11l9-8 9 8M5 10v10h14V10" />
            </svg>
            <span className="merci-btn-t">{isFr ? 'Retour à l\'accueil' : 'Back home'}</span>
          </LgBtn>
        </div>
      </div>
    </div>
  );
};

export default PageMerci;
