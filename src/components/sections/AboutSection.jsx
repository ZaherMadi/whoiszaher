import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './AboutSection.css';

const AboutSection = () => {
  const { language } = useLanguage();
  const sectionRef = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="about-section" id="about" ref={sectionRef}>
      <div className="about-inner">
        <span className="about-label reveal">04 — {language === 'fr' ? 'À propos' : 'About'}</span>

        <div className="about-quote-wrap reveal">
          <span className="about-qmark">"</span>
          <p className="about-quote">
            {language === 'fr'
              ? <>Zaher, c'est cette <em>énergie rare</em> : il apprend vite, livre proprement, et tire toute l'équipe vers le haut.</>
              : <>Zaher has that <em>rare energy</em>: he learns fast, delivers clean code, and lifts the whole team up.</>
            }
          </p>
          <p className="about-quote-by">
            {language === 'fr' ? "L'équipe — Agence ROM" : 'The team — Agence ROM'}
          </p>
        </div>

        <div className="about-grid">
          <div>
            <h3 className="about-h reveal">{language === 'fr' ? 'Au-delà du code, un équilibre.' : 'Beyond code, a balance.'}</h3>
            <p className="about-p reveal">
              {language === 'fr'
                ? <>Je crois qu'un bon développeur se construit autant <b>devant l'écran qu'en dehors</b>. Le sport me garde discipliné et concentré, la lecture en anglais nourrit ma curiosité et ma rigueur technique.</>
                : <>I believe a great developer is built as much <b>away from the screen as in front of it</b>. Sport keeps me disciplined and focused; reading in English feeds my curiosity and technical edge.</>
              }
            </p>
            <p className="about-p reveal">
              {language === 'fr'
                ? 'Toujours en mouvement, toujours en train d\'apprendre — c\'est ce qui rend chaque nouveau projet excitant.'
                : 'Always in motion, always learning — that\'s what makes every new project exciting.'
              }
            </p>
          </div>

          <div className="about-interests">
            <span className="about-it-head reveal">{language === 'fr' ? 'Ce qui me fait vibrer' : 'What drives me'}</span>
            <div className="about-it reveal">
              <span className="about-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18M3 12h18"/></svg>
              </span>
              <span className="about-tx"><b>{language === 'fr' ? 'Padel & Football' : 'Padel & Football'}</b><span>{language === 'fr' ? 'Esprit d\'équipe & compétition' : 'Team spirit & competition'}</span></span>
            </div>
            <div className="about-it reveal">
              <span className="about-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5a3 3 0 0 1 4 0l1.5 1.5 1.5-1.5a3 3 0 1 1 4 4L12 16l-5.5-5.5a3 3 0 0 1 0-4z"/></svg>
              </span>
              <span className="about-tx"><b>{language === 'fr' ? 'Boxe' : 'Boxing'}</b><span>{language === 'fr' ? 'Discipline & dépassement' : 'Discipline & surpassing limits'}</span></span>
            </div>
            <div className="about-it reveal">
              <span className="about-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </span>
              <span className="about-tx"><b>{language === 'fr' ? 'Lecture en anglais' : 'Reading in English'}</b><span>{language === 'fr' ? 'Tech, biographies & SF' : 'Tech, biographies & Sci-Fi'}</span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
