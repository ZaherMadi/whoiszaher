import React, { useEffect, useRef, useCallback, useState } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import './ProjectMarinaYacht.css';

const HERO_VIDEO = '/assets/Teaser marina.mp4';
const APP_TEASER_VIDEO = '/assets/MYI TeaserApp.mp4';
const GALLERY = [
  { src: '/assets/MYI Onboarding.png',             alt: 'Onboarding 1' },
  { src: '/assets/MYI Oboarding P2.png',           alt: 'Onboarding 2' },
  { src: '/assets/MYI Screen Notifications .jpeg', alt: 'Notifications screen' },
];

/* ─── Lightbox ─────────────────────────────────────────────────────── */
const Lightbox = ({ items, index, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape')      onClose();
      else if (e.key === 'ArrowLeft')  onPrev();
      else if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  const item = items[index];

  return (
    <motion.div
      className="marina-lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button className="marina-lb-close" onClick={onClose} aria-label="Fermer">
        <X size={22} />
      </button>
      <button className="marina-lb-nav marina-lb-prev" onClick={e => { e.stopPropagation(); onPrev(); }} aria-label="Précédent">
        <ChevronLeft size={28} />
      </button>
      <motion.img
        key={item.src}
        src={item.src}
        alt={item.alt}
        className="marina-lb-img"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
      />
      <button className="marina-lb-nav marina-lb-next" onClick={e => { e.stopPropagation(); onNext(); }} aria-label="Suivant">
        <ChevronRight size={28} />
      </button>
      <span className="marina-lb-counter">{index + 1} / {items.length}</span>
    </motion.div>
  );
};

/* ─── ScrollExpandMedia hook ─────────────────────────────────────────
   Faithful port of the scroll-hijack pattern from the design.
   Uses refs + direct DOM mutation for jank-free animation — no
   React state re-renders inside the scroll handler.
──────────────────────────────────────────────────────────────────── */
const useScrollExpand = ({ mediaRef, bgRef, vScrimRef, titleARef, titleBRef,
  metaDateRef, metaHintRef, contentRef }) => {

  const progress  = useRef(0);
  const expanded  = useRef(false);
  const touchY    = useRef(0);

  const isMobile = () => window.innerWidth < 768;

  const apply = useCallback(() => {
    const p = progress.current;
    const el = {
      media:    mediaRef.current,
      bg:       bgRef.current,
      vScrim:   vScrimRef.current,
      titleA:   titleARef.current,
      titleB:   titleBRef.current,
      metaDate: metaDateRef.current,
      metaHint: metaHintRef.current,
    };
    if (!el.media) return;

    const mw = 300 + p * (isMobile() ? 650 : 1250);
    const mh = 400 + p * (isMobile() ? 200 : 400);
    const tx = p * (isMobile() ? 180 : 150);

    el.media.style.width  = mw + 'px';
    el.media.style.height = mh + 'px';
    if (el.bg)       el.bg.style.opacity      = String(1 - p);
    if (el.vScrim)   el.vScrim.style.opacity   = String(0.5 - p * 0.3);
    if (el.titleA)   el.titleA.style.transform = `translateX(-${tx}vw)`;
    if (el.titleB)   el.titleB.style.transform = `translateX(${tx}vw)`;
    if (el.metaDate) el.metaDate.style.transform = `translateX(-${tx}vw)`;
    if (el.metaHint) {
      el.metaHint.style.transform = `translateX(${tx}vw)`;
      el.metaHint.style.opacity   = String(1 - p * 2.2);
    }
  }, [mediaRef, bgRef, vScrimRef, titleARef, titleBRef, metaDateRef, metaHintRef]);

  const setProgress = useCallback(np => {
    progress.current = Math.min(Math.max(np, 0), 1);
    const p = progress.current;

    if (p >= 1 && !expanded.current) {
      expanded.current = true;
      contentRef.current?.classList.add('show');
    } else if (p < 0.75 && expanded.current) {
      expanded.current = false;
      contentRef.current?.classList.remove('show');
    }
    apply();
  }, [apply, contentRef]);

  useEffect(() => {
    const onWheel = e => {
      if (expanded.current && e.deltaY < 0 && window.scrollY <= 5) {
        expanded.current = false;
      } else if (!expanded.current) {
        e.preventDefault();
        setProgress(progress.current + e.deltaY * 0.0009);
      }
    };

    const onTouchStart = e => { touchY.current = e.touches[0].clientY; };
    const onTouchMove  = e => {
      if (!touchY.current) return;
      const dy = touchY.current - e.touches[0].clientY;
      if (expanded.current && dy < -20 && window.scrollY <= 5) {
        expanded.current = false;
        e.preventDefault();
      } else if (!expanded.current) {
        e.preventDefault();
        setProgress(progress.current + dy * (dy < 0 ? 0.008 : 0.005));
        touchY.current = e.touches[0].clientY;
      }
    };
    const onTouchEnd = () => { touchY.current = 0; };

    const onScroll = () => { if (!expanded.current) window.scrollTo(0, 0); };
    const onResize = () => apply();

    window.addEventListener('wheel',      onWheel,      { passive: false });
    window.addEventListener('scroll',     onScroll);
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove',  onTouchMove,  { passive: false });
    window.addEventListener('touchend',   onTouchEnd);
    window.addEventListener('resize',     onResize);

    apply(); // initial state

    return () => {
      window.removeEventListener('wheel',      onWheel);
      window.removeEventListener('scroll',     onScroll);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove',  onTouchMove);
      window.removeEventListener('touchend',   onTouchEnd);
      window.removeEventListener('resize',     onResize);
    };
  }, [apply, setProgress]);
};

/* ─── Main page ───────────────────────────────────────────────────── */
const ProjectMarinaYacht = () => {
  const { language } = useLanguage();
  const { scrollYProgress } = useScroll();
  const isFr = language === 'fr';

  // Refs for direct DOM manipulation (no re-render jank)
  const mediaRef   = useRef(null);
  const bgRef      = useRef(null);
  const vScrimRef  = useRef(null);
  const titleARef  = useRef(null);
  const titleBRef  = useRef(null);
  const metaDateRef = useRef(null);
  const metaHintRef = useRef(null);
  const contentRef  = useRef(null);
  const appVideoRef = useRef(null);

  // Lightbox state
  const [lbIndex, setLbIndex] = useState(-1);
  const openLb  = i => setLbIndex(i);
  const closeLb = () => setLbIndex(-1);
  const prevLb  = useCallback(() => setLbIndex(i => (i - 1 + GALLERY.length) % GALLERY.length), []);
  const nextLb  = useCallback(() => setLbIndex(i => (i + 1) % GALLERY.length), []);

  useScrollExpand({ mediaRef, bgRef, vScrimRef, titleARef, titleBRef,
    metaDateRef, metaHintRef, contentRef });

  // Reveal on scroll for case study sections
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    contentRef.current?.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [language]);

  // Auto play/loop the in-app teaser video when it nears the viewport.
  useEffect(() => {
    const v = appVideoRef.current; if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); },
      { threshold: 0.3 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div className="marina-page">
      {/* Scroll progress bar */}
      <motion.div className="marina-scroll-bar" style={{ scaleX: scrollYProgress, transformOrigin: '0%' }} />

      {/* ── Top nav ── */}
      <div className="marina-topnav">
        <Link to="/" className="marina-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          {isFr ? 'Projets' : 'Projects'}
        </Link>
        <Link to="/" className="marina-brand">whois<b>zaher</b></Link>
      </div>

      {/* ── ScrollExpandMedia hero ── */}
      <section className="marina-sem-section">
        <div className="marina-sem-stage">
          {/* Background gradient (fades as media expands) */}
          <div className="marina-sem-bg" ref={bgRef} />

          <div className="marina-sem-container">
            <div className="marina-sem-hero">

              {/* Expanding media card */}
              <div className="marina-sem-media" ref={mediaRef} style={{ width: 300, height: 400 }}>
                <video
                  className="marina-hero-video"
                  src={HERO_VIDEO}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                <div className="marina-vscrim" ref={vScrimRef} />
                <div className="marina-vmeta">
                  <p className="marina-vmeta-date" ref={metaDateRef}>
                    {isFr ? 'Application d\'entreprise' : 'Enterprise application'}
                  </p>
                  <p className="marina-vmeta-hint" ref={metaHintRef}>
                    {isFr ? 'Défile pour agrandir' : 'Scroll to expand'}
                  </p>
                </div>
              </div>

              {/* Split title — flies apart on scroll */}
              <div className="marina-title">
                <h2 ref={titleARef}>Marina Yacht</h2>
                <h2 ref={titleBRef}>Inventory</h2>
              </div>
            </div>

            {/* ── Case study content (revealed when fully expanded) ── */}
            <section className="marina-content" ref={contentRef}>
              <div className="marina-inner">

                {/* Meta */}
                <div className="marina-meta reveal">
                  <span className="marina-meta-k"><span className="marina-dot" />Lead Dev &amp; Mentor</span>
                  <span className="marina-meta-k">
                    {isFr ? 'Encadrement de 3 développeurs juniors' : 'Mentoring 3 junior developers'}
                  </span>
                  <span className="marina-meta-k">2023 — 2024</span>
                </div>

                <div className="marina-chips reveal">
                  {['Architecture','Leadership','React','CI/CD','PostgreSQL'].map(c => (
                    <span key={c} className="marina-chip">{c}</span>
                  ))}
                </div>

                {/* Contexte */}
                <h2 className="marina-ch reveal">{isFr ? 'Le contexte' : 'The context'}</h2>
                <p className="marina-cp reveal">
                  {isFr
                    ? <><b>Marina Yacht Inventory</b> est une application de gestion d'inventaire pour un acteur du nautisme. Au-delà du code, mon rôle a été de <b>poser l'architecture complète</b> et d'<b>encadrer trois développeurs juniors</b> tout au long du projet.</>
                    : <><b>Marina Yacht Inventory</b> is an inventory management app for a marine industry player. Beyond writing code, my role was to <b>define the full architecture</b> and <b>mentor three junior developers</b> throughout the project.</>
                  }
                </p>

                {/* Mon rôle */}
                <h2 className="marina-ch reveal">{isFr ? 'Mon rôle' : 'My role'}</h2>
                <p className="marina-cp reveal">
                  {isFr
                    ? <>Définition de l'architecture front &amp; back, mise en place de la <b>CI/CD</b>, des standards de code et des revues. J'ai accompagné l'équipe au quotidien — montée en compétences, pair-programming et déblocage technique — pour livrer un produit fiable et maintenable.</>
                    : <>Defining front &amp; back architecture, setting up <b>CI/CD</b>, code standards and review processes. I supported the team daily — skill-building, pair-programming and technical unblocking — to deliver a reliable, maintainable product.</>
                  }
                </p>

                {/* Highlights */}
                <div className="marina-highlights reveal">
                  <div className="marina-highlight">
                    <h4>{isFr ? 'Découpage des missions' : 'Task breakdown'}</h4>
                    <p>{isFr ? 'Conception et distribution de missions accessibles de difficulté graduée.' : 'Design and distribution of progressively difficult, accessible tasks.'}</p>
                  </div>
                  <div className="marina-highlight">
                    <h4>{isFr ? 'Revue de code' : 'Code review'}</h4>
                    <p>{isFr ? "Implémentation d'un flux de travail strict avec Pull Requests." : 'Implementation of a strict workflow with Pull Requests.'}</p>
                  </div>
                  <div className="marina-highlight">
                    <h4>Workflow Agile</h4>
                    <p>{isFr ? 'Scrums & Sprints adaptés aux profils juniors.' : 'Scrums & Sprints adapted to junior profiles.'}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="marina-stat-row reveal">
                  <div className="marina-stat">
                    <div className="marina-stat-v">3</div>
                    <div className="marina-stat-l">{isFr ? 'Juniors encadrés' : 'Juniors mentored'}</div>
                  </div>
                  <div className="marina-stat">
                    <div className="marina-stat-v">100%</div>
                    <div className="marina-stat-l">{isFr ? 'Architecture définie de zéro' : 'Architecture built from scratch'}</div>
                  </div>
                  <div className="marina-stat">
                    <div className="marina-stat-v">CI/CD</div>
                    <div className="marina-stat-l">{isFr ? 'Pipeline de déploiement' : 'Deployment pipeline'}</div>
                  </div>
                </div>

                {/* Rigueur technique */}
                <h2 className="marina-ch reveal">{isFr ? 'Rigueur technique' : 'Technical rigour'}</h2>
                <ul className="marina-list reveal">
                  <li><strong>{isFr ? 'Propriété du produit :' : 'Product ownership:'}</strong> {isFr ? 'Gestion intégrale de la qualité de bout en bout.' : 'End-to-end quality management.'}</li>
                  <li><strong>Front-end Architectonic:</strong> React Ecosystem.</li>
                  <li><strong>Workflow Agile:</strong> Scrums &amp; Sprints {isFr ? 'adaptés aux profils juniors.' : 'adapted to junior profiles.'}</li>
                </ul>

                {/* Gallery */}
                <h2 className="marina-ch reveal">{isFr ? 'Aperçu de l\'application' : 'App preview'}</h2>
                <p className="marina-cp reveal">
                  {isFr
                    ? 'Quelques écrans de l\'application — clique pour agrandir.'
                    : 'A few screens from the app — click to enlarge.'}
                </p>
                <div className="marina-gallery reveal">
                  {GALLERY.map((g, i) => (
                    <button
                      key={g.src}
                      type="button"
                      className="marina-gallery-thumb"
                      onClick={() => openLb(i)}
                      aria-label={isFr ? `Ouvrir ${g.alt}` : `Open ${g.alt}`}
                    >
                      <img src={g.src} alt={g.alt} loading="lazy" />
                    </button>
                  ))}
                </div>

                {/* App teaser video */}
                <h2 className="marina-ch reveal">{isFr ? 'Extrait vidéo de l\'application' : 'In-app video clip'}</h2>
                <p className="marina-cp reveal">
                  {isFr
                    ? <>Voici un <b>extrait vidéo plus approfondi</b> de l'application — tournée directement sur <b>Expo Go</b>, en local.</>
                    : <>Here's a <b>more in-depth video</b> of the application — recorded directly on <b>Expo Go</b>, running locally.</>}
                </p>
                <div className="marina-app-video-wrap reveal">
                  <video
                    ref={appVideoRef}
                    src={APP_TEASER_VIDEO}
                    className="marina-app-video"
                    controls
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                </div>

                {/* CTAs */}
                <div className="marina-cta reveal">
                  <Link to="/" className="marina-btn marina-btn-primary">
                    {isFr ? 'Voir d\'autres projets' : 'See more projects'}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>
                  </Link>
                  <Link to="/" className="marina-btn marina-btn-glass">
                    ← {isFr ? 'Retour aux projets' : 'Back to projects'}
                  </Link>
                </div>

              </div>
            </section>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lbIndex >= 0 && (
          <Lightbox
            items={GALLERY}
            index={lbIndex}
            onClose={closeLb}
            onPrev={prevLb}
            onNext={nextLb}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectMarinaYacht;
