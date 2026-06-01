import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './RecommendationSection.css';

/* Closing flourish: a "letter of recommendation" that opens on click to reveal
 * the PDF. Placed right before the contact CTA. */
const RecommendationSection = () => {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const [open, setOpen] = useState(false);
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
    <section className="reco-section" id="recommandation" ref={sectionRef}>
      <div className="reco-inner">
        <span className="reco-label reveal">{isFr ? 'Recommandation' : 'Recommendation'}</span>
        <p className="reco-intro reveal">
          {isFr
            ? <>Quoi ? Tout cela ne vous a pas suffi ? Bon, d'accord, je l'entends — vous êtes exigeant. Alors laissez-moi finir par cette belle lettre que la propriétaire de mon ancienne agence a formulée à mon sujet. «&nbsp;Lettre de recommandation&nbsp;», paraît-il. Elle doit certainement avoir ses raisons.</>
            : <>What — all that wasn't enough for you? Alright, fair enough — you're demanding. So let me finish with this lovely letter the owner of my former agency wrote about me. A "letter of recommendation," apparently. She must have her reasons.</>}
        </p>

        <div className={`reco-stage reveal ${open ? 'open' : ''}`}>
          <button
            type="button"
            className="reco-cover"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="reco-doc"
          >
            <span className="reco-seal" aria-hidden="true">✦</span>
            <span className="reco-cover-title">{isFr ? 'Lettre de recommandation' : 'Letter of recommendation'}</span>
            <span className="reco-cover-sub">{isFr ? 'Direction · Agence ROM' : 'Management · Agence ROM'}</span>
            <span className="reco-cover-hint">{isFr ? '✶ Cliquez pour ouvrir' : '✶ Click to open'}</span>
          </button>

          <div className="reco-paper" id="reco-doc">
            <img
              className="reco-letter-img"
              src="/assets/reco-zaher.png"
              alt={isFr ? 'Lettre de recommandation — Zaher Madi' : 'Letter of recommendation — Zaher Madi'}
              loading="lazy"
            />
            <a className="reco-dl" href="/assets/reco-zaher.pdf" target="_blank" rel="noopener noreferrer">
              {isFr ? 'Ouvrir le PDF en grand' : 'Open the full PDF'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8" /></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendationSection;
