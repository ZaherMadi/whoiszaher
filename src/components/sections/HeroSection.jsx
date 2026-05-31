import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './HeroSection.css';

const HeroSection = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const photoRef = useRef(null);
  const contentRef = useRef(null);
  const cueRef = useRef(null);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const p = Math.min(1, y / (vh * 0.85));
      if (photoRef.current) {
        photoRef.current.style.transform = `scale(${1 - p * 0.16})`;
        photoRef.current.style.opacity = `${1 - p * 0.85}`;
        photoRef.current.style.filter = `blur(${p * 6}px)`;
      }
      if (contentRef.current) {
        contentRef.current.style.transform = `translateY(${-p * 70}px)`;
        contentRef.current.style.opacity = `${1 - p * 1.15}`;
      }
      if (cueRef.current) {
        cueRef.current.style.opacity = `${1 - p * 2}`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCvClick = (e) => {
    e.preventDefault();
    // Open CV in background tab, briefly show toast, then redirect to /merci
    window.open('/docs/CV_Zaher_Madi.pdf', '_blank');
    setToast(true);
    setTimeout(() => {
      setToast(false);
      navigate('/merci');
    }, 1400);
  };

  return (
    <>
      <div className="hero-wrap" id="hero">
        <div className="hero-sticky">
          <div className="hero-fallback" />
          <img
            ref={photoRef}
            className="hero-photo"
            src="/assets/hero-1.jpg"
            alt="Zaher Madi"
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="scrim-l" />
          <div className="scrim-b" />
          <div className="scrim-vig" />

          <div className="hero-content" ref={contentRef}>
            <span className="hero-eyebrow">
              <span className="hero-live" />
              {language === 'fr' ? 'Développeur fullstack · cloud' : 'Fullstack developer · cloud'}
            </span>

            <h1 className="hero-title">
              {language === 'fr' ? (
                <>On fait<br /><span className="hero-line2"><span className="hero-serif">connaissance</span> <span className="hero-teal">?</span></span></>
              ) : (
                <>Getting to<br /><span className="hero-line2"><span className="hero-serif">know me</span> <span className="hero-teal">?</span></span></>
              )}
            </h1>

            <p className="hero-sub">
              {language === 'fr'
                ? <>Je construis des apps de A à Z — de l'<b>API edge</b> au client mobile — avec une obsession pour le <b>cloud</b> et le détail qui change tout.</>
                : <>I build apps end-to-end — from <b>edge APIs</b> to mobile clients — with an obsession for <b>cloud</b> and the details that matter.</>
              }
            </p>

            <div className="hero-ctas">
              <a href="#projects" className="hero-btn hero-btn-primary">
                {language === 'fr' ? 'Voir les projets' : 'View projects'}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </a>
              <a href="#contact" className="hero-btn hero-btn-glass">
                {language === 'fr' ? 'Me contacter' : 'Contact me'}
              </a>
              <a href="/docs/CV_Zaher_Madi.pdf" className="hero-btn hero-btn-ghost" onClick={handleCvClick}>
                {language === 'fr' ? 'Télécharger mon CV' : 'Download CV'}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" /></svg>
              </a>
            </div>
          </div>

          <div className="scroll-cue" ref={cueRef}>
            <div className="scroll-mouse" />
            scroll
          </div>
        </div>
      </div>

      <div className={`hero-toast ${toast ? 'show' : ''}`}>
        <span className="hero-toast-dot" />
        <span>{language === 'fr' ? 'CV ouvert — à très vite !' : 'CV opened — see you soon!'}</span>
      </div>
    </>
  );
};

export default HeroSection;
