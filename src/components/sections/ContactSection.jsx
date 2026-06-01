import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './ContactSection.css';

const ContactSection = () => {
  const { language } = useLanguage();
  const btnRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);} }),
      { threshold: 0.12 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Shine sweep on hover
  useEffect(() => {
    const btn = btnRef.current; if (!btn) return;
    const shine = btn.querySelector('.lg-shine');
    const enter = () => { if (shine) shine.style.left = '130%'; };
    const leave = () => { if (shine) shine.style.left = '-70%'; };
    btn.addEventListener('mouseenter', enter);
    btn.addEventListener('mouseleave', leave);
    return () => { btn.removeEventListener('mouseenter', enter); btn.removeEventListener('mouseleave', leave); };
  }, []);

  return (
    <section className="contact-section" id="contact" ref={sectionRef}>
      <div className="contact-glow" />
      <div className="contact-inner">
        <span className="contact-label reveal">05 — {language === 'fr' ? 'Contact' : 'Contact'}</span>
        <h2 className="contact-h reveal">
          {language === 'fr' ? <>Restons <span className="contact-serif">en contact</span></> : <>Let's <span className="contact-serif">stay in touch</span></>}
        </h2>
        <p className="contact-sub reveal">
          {language === 'fr'
            ? <>Une idée, un projet, ou juste envie d'échanger ? Je suis <b>disponible dès le 3 juin</b>.</>
            : <>An idea, a project, or just want to chat? I'm <b>available from June 3rd</b>.</>
          }
        </p>

        {/* Liquid glass button */}
        <a href="mailto:zahermadi@yahoo.fr" className="lg-btn reveal" ref={btnRef}>
          <span className="lg-shine" />
          <span>{language === 'fr' ? 'Contactez-moi' : 'Contact me'}</span>
        </a>

        {/* Contact cards */}
        <div className="contact-cards reveal">
          <a href="mailto:zahermadi@yahoo.fr" className="contact-cc">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>
            zahermadi@yahoo.fr
          </a>
          <a href="https://github.com/ZaherMadi" target="_blank" rel="noopener noreferrer" className="contact-cc">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.49-1.11-1.49-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.36 9.36 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/></svg>
            ZaherMadi
          </a>
          <a href="https://fr.linkedin.com/in/zaher-madi-b78625184" target="_blank" rel="noopener noreferrer" className="contact-cc">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.97H5.67v8.37h2.67zM7 8.8a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.54v-4.59c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.39 1.32v-1.13h-2.67c.04.75 0 8.37 0 8.37h2.67v-4.67c0-.24.02-.48.09-.65.19-.48.63-.98 1.37-.98.96 0 1.35.73 1.35 1.81v4.49h2.64z"/></svg>
            zaher-madi
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
