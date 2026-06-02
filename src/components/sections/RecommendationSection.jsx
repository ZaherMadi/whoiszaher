import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import LetterScroll from '../LetterScroll';
import './RecommendationSection.css';

/* Closing flourish before the contact CTA: a sealed letter that opens the
 * immersive parchment-scroll overlay (LetterScroll). */
const RecommendationSection = () => {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const sectionRef = useRef(null);
  const [open, setOpen] = useState(false);

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

        <div className="reco-stage reveal">
          <button type="button" className="reco-cover" onClick={() => setOpen(true)} aria-haspopup="dialog">
            <span className="reco-seal" aria-hidden="true">Z</span>
            <span className="reco-cover-title">{isFr ? 'Lettre de recommandation' : 'Letter of recommendation'}</span>
            <span className="reco-cover-sub">Société Nouvelle ROM</span>
            <span className="reco-cover-hint">{isFr ? '✶ Cliquez pour dérouler la lettre' : '✶ Click to unroll the letter'}</span>
          </button>
        </div>
      </div>

      {open && <LetterScroll isFr={isFr} onClose={() => setOpen(false)} />}
    </section>
  );
};

export default RecommendationSection;
