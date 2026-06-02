import React, { useEffect, useRef } from 'react';
import './LetterScroll.css';

/* -----------------------------------------------------------------------------
 * LetterScroll — immersive recommendation-letter overlay (v2).
 * A folded, sealed parchment letter; the wax seal cracks, the folded letter
 * dissolves and two brass rolls unroll the scroll to reveal the letter, which
 * can be read fullscreen. Mounted on demand and closed via onClose.
 * -------------------------------------------------------------------------- */

const LETTER_IMG = '/assets/reco-zaher.png';
const LETTER_PDF = '/assets/reco-zaher.pdf';
const ALT = 'Lettre de recommandation — Zaher Madi, par Lorraine Lucchini (Société Nouvelle ROM)';

export default function LetterScroll({ onClose, isFr = true }) {
  const stageRef = useRef(null);
  const sceneRef = useRef(null);
  const sealRef = useRef(null);
  const letterClosedRef = useRef(null);
  const paperWrapRef = useRef(null);
  const lightboxRef = useRef(null);
  const dustRef = useRef(null);
  const toggleRef = useRef(null);
  const toggleLabelRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const seal = sealRef.current;
    const letterClosed = letterClosedRef.current;
    const paperWrap = paperWrapRef.current;
    const lightbox = lightboxRef.current;
    const dust = dustRef.current;
    const toggle = toggleRef.current;
    const toggleLabel = toggleLabelRef.current;
    const stage = stageRef.current;
    if (!scene || !paperWrap) return;

    const RATIO = 640 / 905;
    let isOpen = false;
    let animating = false;
    const timers = [];
    const after = (ms, fn) => { const id = setTimeout(fn, ms); timers.push(id); return id; };

    function layout() {
      const vh = window.innerHeight, vw = window.innerWidth;
      let ph = Math.min(vh * 0.72, 660);
      let pw = ph * RATIO;
      const maxW = Math.min(vw * 0.86, 470);
      if (pw > maxW) { pw = maxW; ph = pw / RATIO; }
      scene.style.setProperty('--pw', pw + 'px');
      scene.style.setProperty('--ph', ph + 'px');
      if (isOpen && !animating) { paperWrap.style.transition = 'none'; paperWrap.style.height = ph + 'px'; }
    }
    layout();
    window.addEventListener('resize', layout);

    // floating dust motes
    for (let i = 0; i < 16; i++) {
      const m = document.createElement('div');
      m.className = 'ls-mote';
      const s = 1.5 + Math.random() * 2.8;
      m.style.width = m.style.height = s + 'px';
      m.style.left = Math.random() * 100 + '%';
      m.style.top = (55 + Math.random() * 45) + '%';
      m.style.animationDuration = (7 + Math.random() * 9) + 's';
      m.style.animationDelay = (-Math.random() * 12) + 's';
      dust.appendChild(m);
    }

    const easeOutQuint = t => 1 - Math.pow(1 - t, 5);
    const easeInQuint = t => Math.pow(t, 5);

    function animateHeight(to, dur, ease, onDone) {
      const from = parseFloat(getComputedStyle(paperWrap).height) || 0;
      paperWrap.style.transition = 'none';
      const start = performance.now();
      let done = false;
      const finish = () => { if (done) return; done = true; paperWrap.style.height = to + 'px'; animating = false; if (onDone) onDone(); };
      function step(now) {
        const t = Math.min(1, (now - start) / dur);
        paperWrap.style.height = (from + (to - from) * ease(t)) + 'px';
        if (t < 1 && !done) requestAnimationFrame(step); else finish();
      }
      animating = true;
      requestAnimationFrame(step);
      after(dur + 200, finish);
    }

    function setToggle() {
      toggleLabel.textContent = isOpen ? (isFr ? 'Refermer' : 'Close') : (isFr ? 'Dérouler' : 'Unroll');
      toggle.setAttribute('aria-label', isOpen ? 'Refermer la lettre' : 'Dérouler la lettre');
    }

    function openScroll() {
      if (isOpen || animating) return;
      isOpen = true; setToggle();
      scene.classList.remove('ready');
      // 1. the wax seal cracks and lifts off the letter
      after(170, () => scene.classList.add('broken'));
      // 2. the folded letter dissolves as the scroll takes its place
      after(760, () => scene.classList.add('open'));
      // safety net: guarantee the letter & seal vanish even if a throttled tab stalls the transition
      after(1650, () => {
        letterClosed.style.transition = 'none'; letterClosed.style.opacity = '0'; letterClosed.style.pointerEvents = 'none';
        seal.style.transition = 'none'; seal.style.opacity = '0';
      });
      // 3. the parchment unrolls delicately
      after(1200, () => {
        const ph = parseFloat(getComputedStyle(scene).getPropertyValue('--ph'));
        animateHeight(ph, 2300, easeOutQuint, () => scene.classList.add('ready'));
      });
    }

    function closeScroll() {
      if (!isOpen || animating) return;
      isOpen = false; setToggle();
      scene.classList.remove('ready');
      closeLightbox();
      animateHeight(0, 1650, easeInQuint, () => {
        scene.classList.remove('open', 'broken');
        letterClosed.style.transition = ''; letterClosed.style.opacity = ''; letterClosed.style.pointerEvents = '';
        seal.style.transition = ''; seal.style.opacity = '';
      });
    }

    function openLightbox() { if (!isOpen || animating) return; lightbox.classList.add('show'); }
    function closeLightbox() { lightbox.classList.remove('show'); }

    // first reveal plays automatically, a beat after load so the sealed letter is seen
    after(1300, openScroll);

    const onToggle = () => (isOpen ? closeScroll() : openScroll());
    const onLetter = () => { if (!isOpen) openScroll(); };
    const onPaperClick = openLightbox;
    // Clicking anywhere outside the parchment (the dark stage) re-rolls the
    // open letter — a quick way to close it without the toolbar button.
    const onStageClick = (e) => {
      if (!isOpen || animating) return;
      if (e.target.closest('.ls-scene') || e.target.closest('.ls-topbar')) return;
      closeScroll();
    };
    const onLbBg = (e) => { if (e.target === lightbox) closeLightbox(); };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (lightbox.classList.contains('show')) closeLightbox();
        else onClose && onClose();
      }
    };
    toggle.addEventListener('click', onToggle);
    letterClosed.addEventListener('click', onLetter);
    paperWrap.addEventListener('click', onPaperClick);
    stage.addEventListener('click', onStageClick);
    lightbox.addEventListener('click', onLbBg);
    document.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', layout);
      toggle.removeEventListener('click', onToggle);
      letterClosed.removeEventListener('click', onLetter);
      paperWrap.removeEventListener('click', onPaperClick);
      stage.removeEventListener('click', onStageClick);
      lightbox.removeEventListener('click', onLbBg);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isFr, onClose]);

  return (
    <>
      <div className="ls-stage" ref={stageRef}>
        <div className="ls-glow" />
        <div className="ls-dust" ref={dustRef} />
        <div className="ls-vignette" />
        <div className="ls-grain" />

        <div className="ls-topbar">
          <button className="ls-back" onClick={onClose} aria-label={isFr ? 'Fermer' : 'Close'}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            {isFr ? 'Retour' : 'Back'}
          </button>
          <span className="ls-eyebrow"><span className="ls-ln" />{isFr ? 'Lettre de recommandation' : 'Letter of recommendation'}</span>
          <button className="ls-back ls-scroll-toggle" ref={toggleRef} aria-label="Dérouler la lettre">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2M4 7h16M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M9 12h6" /></svg>
            <span ref={toggleLabelRef}>{isFr ? 'Dérouler' : 'Unroll'}</span>
          </button>
        </div>

        <div className="ls-scene" ref={sceneRef}>
          <div className="ls-roll ls-roll-top"><span className="ls-roll-relief" /><span className="ls-lip" /><span className="ls-roll-cap l" /><span className="ls-roll-cap r" /></div>

          <div className="ls-paper-wrap" ref={paperWrapRef}>
            <div className="ls-sheet">
              <img className="ls-paper" src={LETTER_IMG} alt={ALT} />
              <div className="ls-parchment" />
              <div className="ls-grain-paper" />
            </div>
            <div className="ls-curl" />
            <span className="ls-open-cue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M21 3l-9 9M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></svg>
              {isFr ? 'Cliquez pour lire en grand' : 'Click to read fullscreen'}
            </span>
          </div>

          <div className="ls-roll ls-roll-bottom"><span className="ls-roll-relief" /><span className="ls-lip" /><span className="ls-roll-cap l" /><span className="ls-roll-cap r" /></div>

          <div className="ls-letter-closed" ref={letterClosedRef}>
            <div className="ls-packet" />
            <div className="ls-inscription">
              {isFr ? 'À qui de droit' : 'To whom it may concern'}
              <small>{isFr ? '— Lettre de recommandation —' : '— Letter of recommendation —'}</small>
            </div>
            <div className="ls-seal" ref={sealRef}>
              <div className="ls-wax">
                <div className="ls-ring" />
                <div className="ls-emboss">Z</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ls-lightbox" ref={lightboxRef}>
        <button className="ls-lb-close" onClick={() => lightboxRef.current?.classList.remove('show')} aria-label={isFr ? 'Fermer' : 'Close'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        <img className="ls-lb-paper" src={LETTER_IMG} alt={ALT} />
        <div className="ls-lb-actions">
          <a className="ls-lb-btn ls-lb-primary" href={LETTER_PDF} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M21 3l-9 9M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" /></svg>
            {isFr ? 'Ouvrir le PDF' : 'Open the PDF'}
          </a>
          <a className="ls-lb-btn ls-lb-glass" href={LETTER_PDF} download="Lettre-recommandation-Zaher-Madi.pdf">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            {isFr ? 'Télécharger' : 'Download'}
          </a>
        </div>
      </div>
    </>
  );
}
