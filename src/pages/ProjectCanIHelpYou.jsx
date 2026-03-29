import React, { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, Server, Database, Globe, Star, BarChart2, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { FaInstagram, FaLink } from 'react-icons/fa';
import AnimatedSection from '../components/AnimatedSection';
import './ProjectDetail.css';

/* ─────────────────────────────────────────────
   i18n strings
───────────────────────────────────────────── */
const fr = {
  subtitle: "App Mobile Fullstack & API Cloudflare Workers — En production",
  videoTitle: "Démo de l'application",
  context: "Morocco 2025 : l'idée simple derrière un projet complexe",
  contextBody: "Tout est parti d'un constat simple : les fans de football voyageant au Maroc pour la CAN 2025 n'avaient pas d'outil centralisé pour trouver hôtels, restaurants, matchs en direct et infos locales. J'ai décidé de le construire seul, en production, du premier commit au déploiement live.",
  archTitle: "Architecture & Décisions techniques clés",
  archBody: "Une API monolithique Cloudflare Workers globale, zéro cold-start. L'auth Firebase JWT est vérifiée via REST (pas d'Admin SDK, compatible Edge). Trois niveaux de cache pour une latence <50ms.",
  featTitle: "Ce que j'ai livré",
  proofTitle: "Preuves concrètes",
  proofAppStore: "4,9★ sur l'App Store — 19 notes",
  proofReview: "Avis utilisateur réel (5★)",
  proofAdmin: "Panel d'administration (Vercel)",
  proofPlayStore: "Statistiques Google Play Console",
  proofMap: "Carte interactive Mapbox (Maroc)",
  improvTitle: "Ce que j'améliorerai ensuite",
  reviewsTitle: "Avis App Store",
  reviewCta: "Voir sur l'App Store →",
};
const en = {
  subtitle: "Full-stack Mobile App & Cloudflare Workers API — Live in Production",
  videoTitle: "App Demo",
  context: "Morocco 2025: the simple idea behind a complex project",
  contextBody: "It started from a simple observation: football fans travelling to Morocco for AFCON 2025 had no centralised tool to find hotels, restaurants, live matches, and local info. I decided to build it solo, in production, from the first commit to live deployment.",
  archTitle: "Architecture & Key technical decisions",
  archBody: "A globally deployed monolithic Cloudflare Workers API — zero cold-start. Firebase JWT auth is verified via REST (no Admin SDK, fully edge-compatible). Three cache layers for <50ms latency.",
  featTitle: "What I shipped",
  proofTitle: "Concrete proofs",
  proofAppStore: "4.9★ on App Store — 19 ratings",
  proofReview: "Real user review (5★)",
  proofAdmin: "Administration panel (Vercel)",
  proofPlayStore: "Google Play Console statistics",
  proofMap: "Interactive Mapbox map (Morocco)",
  improvTitle: "What I'd improve next",
  reviewsTitle: "App Store Reviews",
  reviewCta: "View on App Store →",
};

const features = {
  fr: [
    { label: "Reverse proxy Mapbox", desc: "Token jamais exposé au client. Tiles mis en cache 20 jours via KV." },
    { label: "TripAdvisor API (ToS)", desc: "Appels live pour le détail, cache Redis pour les listes." },
    { label: "PostgreSQL serverless", desc: "'New Connection Per Request' — zéro fuite de connexion sur Workers." },
    { label: "Push notifications dual-token", desc: "Notifications pour utilisateurs authentifiés ET invités anonymes." },
    { label: "Cron warm endpoint", desc: "Endpoint protégé par CRON_SECRET pour garder la DB chaude." },
    { label: "App publiée iOS & Android", desc: "4,9★ App Store · Google Play Console live." },
  ],
  en: [
    { label: "Mapbox reverse proxy", desc: "Token never exposed to the client. Tiles cached 20 days via KV." },
    { label: "TripAdvisor API (ToS)", desc: "Live calls for details, Redis cache for lightweight lists." },
    { label: "Serverless PostgreSQL", desc: "'New Connection Per Request' — zero connection leaks on Workers." },
    { label: "Dual-token push notifications", desc: "Notifications for authenticated users AND anonymous guests." },
    { label: "Cron warm endpoint", desc: "CRON_SECRET-protected endpoint to keep the DB warm." },
    { label: "Published iOS & Android", desc: "4.9★ App Store · Google Play Console live." },
  ],
};

const improvements = {
  fr: ["CI/CD automatisé avec tests d'intégration (Vitest + Workers)", "Monitoring Sentry + alertes latence", "Internationalisation complète (AR, EN, FR)", "Dashboard analytics recruteur en temps réel"],
  en: ["Automated CI/CD with integration tests (Vitest + Workers)", "Sentry monitoring + latency alerts", "Full internationalisation (AR, EN, FR)", "Real-time analytics recruiter dashboard"],
};

const reviews = [
  { title: "Appli très serviable",      author: "MGN06300",       date: "6 janv. 2026",  stars: 5, body: "Je vous la recommande fortement, elle m'a bcp aidée et elle est très bien développée, bravo" },
  { title: "Utile pour voyage au Maroc", author: "Jadeoul",        date: "10 janv. 2026", stars: 5, body: "Très bonne application, facile à utiliser. Elle m'a énormément servi durant ce voyage !" },
  { title: "Superbe application",        author: "Monsieur Zaïd",  date: "18 déc. 2025",  stars: 5, body: "L'appli est très user-friendly, et il y'a toutes les informations utiles pour la CAN" },
  { title: "Incroyable",                 author: "Laid510",        date: "5 déc. 2025",   stars: 5, body: "L'application est super, je vais aller au Maroc pour la CAN et je vais très sûrement utiliser cette application." },
  { title: "Utile",                      author: "fazid-06",       date: "7 janv. 2026",  stars: 5, body: "Je trouve que cette application a très bien été travaillée, elle m'a beaucoup servi pour les matchs 👍" },
  { title: "Agréablement surpris",       author: "Moutz7",         date: "9 janv. 2026",  stars: 5, body: "Bonne appli !" },
];

const APPSTORE_URL = 'https://apps.apple.com/fr/app/can-i-help-you/id6755744827';
const VIDEO_URL = 'https://1drv.ms/v/c/12412070ff219537/IQB-xrumQfsjS69V2u_iICKwARXQKYvEH2vLMrP7lesZt6Y?e=hameyu';

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 70 : -70, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -70 : 70, opacity: 0 }),
};

/* ─────────────────────────────────────────────
   ReviewCarousel — auto-advance + manual nav
   Clicking the card opens App Store
───────────────────────────────────────────── */
const ReviewCarousel = ({ cta }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = useCallback((delta) => {
    setDirection(delta);
    setCurrent(prev => (prev + delta + reviews.length) % reviews.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => go(1), 4500);
    return () => clearInterval(timer);
  }, [go]);

  const r = reviews[current];

  return (
    <div>
      <div className="reviews-carousel">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.a
            key={current}
            href={APPSTORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="review-slide"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: 'easeInOut' }}
            style={{ display: 'flex' }}
          >
            <div className="review-stars">
              {Array.from({ length: r.stars }).map((_, i) => (
                <span key={i} className="review-star">★</span>
              ))}
            </div>
            <p className="review-title">{r.title}</p>
            <p className="review-text">« {r.body} »</p>
            <div className="review-meta">
              <span className="review-author">{r.author}</span>
              <span className="review-date">{r.date}</span>
            </div>
          </motion.a>
        </AnimatePresence>
      </div>

      <div className="carousel-controls">
        <button className="carousel-arrow" onClick={() => go(-1)} aria-label="Previous review">
          <ChevronLeft size={16} />
        </button>
        <div className="carousel-dots">
          {reviews.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot${i === current ? ' active' : ''}`}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>
        <button className="carousel-arrow" onClick={() => go(1)} aria-label="Next review">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   ProofImgCard — desktop: caption below image
                  mobile:  caption overlaid with toggle
───────────────────────────────────────────── */
const ProofImgCard = ({ src, alt, caption, href }) => {
  const [captionVisible, setCaptionVisible] = useState(true);

  const toggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCaptionVisible(v => !v);
  };

  const inner = (
    <>
      <img src={src} alt={alt} />
      <div className={`proof-caption-wrapper${captionVisible ? '' : ' caption-hidden'}`}>
        <p className="proof-caption">{caption}</p>
      </div>
      <button className="overlay-toggle-btn" onClick={toggle} aria-label={captionVisible ? 'Cacher le texte' : 'Afficher le texte'}>
        {captionVisible ? '✕' : 'ℹ'}
      </button>
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="proof-img-card glass-panel">
        {inner}
      </a>
    );
  }
  return <div className="proof-img-card glass-panel">{inner}</div>;
};

/* ─────────────────────────────────────────────
   Main page component
───────────────────────────────────────────── */
const ProjectCanIHelpYou = () => {
  const { language } = useLanguage();
  const { scrollYProgress } = useScroll();
  const c = language === 'fr' ? fr : en;
  const feats = language === 'fr' ? features.fr : features.en;
  const improvs = language === 'fr' ? improvements.fr : improvements.en;

  return (
    <div className="project-detail">
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress, transformOrigin: '0%' }} />

      <div className="container">
        <Link to="/" className="btn-back">
          <ArrowLeft size={16} /> {language === 'fr' ? 'Retour' : 'Back'}
        </Link>

        {/* ── Header ── */}
        <AnimatedSection className="project-header">
          <h1 className="text-gradient">CAN I HELP YOU</h1>
          <p className="subtitle">{c.subtitle}</p>

          <div className="proof-badges">
            <a href="https://www.instagram.com/canihelpyouapp" target="_blank" rel="noopener noreferrer" className="badge glass-panel">
              <FaInstagram size={16} /> @canihelpyouapp
            </a>
            <a href="https://linktr.ee/CANIHELPYOUAPP" target="_blank" rel="noopener noreferrer" className="badge glass-panel">
              <FaLink size={16} /> Linktree
            </a>
            <a href={APPSTORE_URL} target="_blank" rel="noopener noreferrer" className="badge glass-panel star-badge">
              <Star size={14} fill="gold" color="gold" /> 4.9 App Store
            </a>
          </div>

          {/* Hero proof images */}
          <div className="proof-images-grid">
            <ProofImgCard src="/assets/cani-appstore.png" alt="App Store listing" caption={c.proofAppStore} href={APPSTORE_URL} />
            <ProofImgCard src="/assets/cani-admin.png"    alt="Admin panel"       caption={c.proofAdmin} />
            <ProofImgCard src="/assets/cani-review.png"   alt="User review"       caption={c.proofReview} />
          </div>
        </AnimatedSection>

        <div className="project-body">

          {/* ── App demo video ── */}
          <AnimatedSection className="detail-section glass-panel">
            <h2><Star className="detail-icon" size={24} /> {c.videoTitle}</h2>
            <div className="project-video-container">
              <iframe
                className="project-video-iframe"
                src={VIDEO_URL}
                title="CAN I HELP YOU — App Demo"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </AnimatedSection>

          {/* ── Context ── */}
          <AnimatedSection className="detail-section glass-panel">
            <h2><Globe className="detail-icon" /> {c.context}</h2>
            <p>{c.contextBody}</p>
            <div className="cani-logo-wrapper">
              <img src="/assets/cani-logo.png" alt="CAN I HELP YOU logo" className="cani-logo" />
            </div>
          </AnimatedSection>

          {/* ── Architecture ── */}
          <AnimatedSection className="detail-section glass-panel">
            <h2><Server className="detail-icon" /> {c.archTitle}</h2>
            <p>{c.archBody}</p>
            <div className="architecture-grid">
              {[
                { logo: 'logo-cloudflare.png',  alt: 'Cloudflare',       title: 'Edge-Deployed Worker',  desc: { fr: 'API monolithique mondiale, zéro cold-start vs AWS Lambda.', en: 'Global monolithic API, zero cold-start vs AWS Lambda.' } },
                { logo: 'logo-firebase.png',    alt: 'Firebase',         title: 'Firebase Auth (REST)',  desc: { fr: "JWT vérifié via REST — pas d'Admin SDK, 100% Edge.", en: 'JWT verified via REST — no Admin SDK, 100% Edge compatible.' } },
                { logo: 'logo-upstash.png',     alt: 'Upstash Redis',    title: '3-Tier Cache',          desc: { fr: 'Upstash Redis → Cloudflare KV → Cache-Control headers.', en: 'Upstash Redis → Cloudflare KV → Cache-Control headers.' } },
                { logo: 'logo-neon.png',        alt: 'Neon PostgreSQL',  title: 'PostgreSQL / Neon',     desc: { fr: 'New Connection Per Request — zéro fuite sur Workers.', en: 'New Connection Per Request — zero leaks on Workers.' } },
                { logo: 'logo-mapbox.png',      alt: 'Mapbox',           title: 'Mapbox Proxy',          desc: { fr: 'Token jamais exposé, tiles KV-cachées 20j.', en: 'Token never exposed, tiles KV-cached 20 days.' } },
                { logo: 'logo-tripadvisor.png', alt: 'TripAdvisor',      title: 'TripAdvisor API',       desc: { fr: 'Conformité ToS stricte: live detail, cache listes.', en: 'Strict ToS compliance: live detail, cached lists.' } },
              ].map(({ logo, alt, title, desc }) => (
                <div key={logo} className="arch-card">
                  <div className="arch-logo-wrap">
                    <img src={`/assets/${logo}`} alt={alt} className="arch-logo" />
                  </div>
                  <h3>{title}</h3>
                  <p>{desc[language]}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* ── Features ── */}
          <AnimatedSection className="detail-section glass-panel">
            <h2><Database className="detail-icon" /> {c.featTitle}</h2>
            <ul className="feature-list">
              {feats.map((f, i) => (
                <li key={i}><strong>{f.label}:</strong> {f.desc}</li>
              ))}
            </ul>
          </AnimatedSection>

          {/* ── Proofs ── */}
          <AnimatedSection className="detail-section glass-panel">
            <h2><BarChart2 className="detail-icon" /> {c.proofTitle}</h2>
            <div className="proof-images-grid">
              <ProofImgCard src="/assets/cani-playstore-stats.png" alt="Google Play stats"     caption={c.proofPlayStore} />
              <ProofImgCard src="/assets/cani-map.png"             alt="Mapbox Morocco map"    caption={c.proofMap} />
            </div>
            <div className="store-badges">
              <a href={APPSTORE_URL} target="_blank" rel="noopener noreferrer" className="store-badge glass-panel">
                <img src="/assets/logo-apple.png" alt="App Store" className="store-logo" />
                <div>
                  <p className="store-name">App Store</p>
                  <p className="store-rating">4.9★ · 19 {language === 'fr' ? 'notes' : 'ratings'}</p>
                </div>
              </a>
              <div className="store-badge glass-panel">
                <img src="/assets/logo-render.png" alt="Render" className="store-logo" />
                <div>
                  <p className="store-name">Render</p>
                  <p className="store-rating">{language === 'fr' ? 'Hébergement API admin' : 'Admin API hosting'}</p>
                </div>
              </div>
              <div className="store-badge glass-panel">
                <img src="/assets/logo-expo.png" alt="Expo" className="store-logo" />
                <div>
                  <p className="store-name">Expo / React Native</p>
                  <p className="store-rating">iOS + Android</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* ── App Store Reviews ── */}
          <AnimatedSection className="detail-section glass-panel">
            <h2><Star className="detail-icon" size={24} /> {c.reviewsTitle}</h2>
            <ReviewCarousel cta={c.reviewCta} />
          </AnimatedSection>

          {/* ── What's next ── */}
          <AnimatedSection className="detail-section glass-panel">
            <h2><Shield className="detail-icon" /> {c.improvTitle}</h2>
            <ul className="feature-list">
              {improvs.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </AnimatedSection>

        </div>
      </div>
    </div>
  );
};

export default ProjectCanIHelpYou;
