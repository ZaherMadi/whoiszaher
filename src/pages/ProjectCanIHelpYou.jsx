import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ProjectCanIHelpYou.css';

/* ─── Content ─────────────────────────────────────────────────────── */
const APPSTORE_URL = 'https://apps.apple.com/fr/app/can-i-help-you/id6755744827';
const VIDEO_SRC    = '/assets/CANI Video1.mp4';

const reviews = [
  { title: "Appli très serviable",       author: "MGN06300",      date: "6 janv. 2026",  stars: 5, body: "Je vous la recommande fortement, elle m'a bcp aidée et elle est très bien développée, bravo" },
  { title: "Utile pour voyage au Maroc", author: "Jadeoul",       date: "10 janv. 2026", stars: 5, body: "Très bonne application, facile à utiliser. Elle m'a énormément servi durant ce voyage !" },
  { title: "Superbe application",        author: "Monsieur Zaïd", date: "18 déc. 2025",  stars: 5, body: "L'appli est très user-friendly, et il y'a toutes les informations utiles pour la CAN" },
  { title: "Incroyable",                 author: "Laid510",       date: "5 déc. 2025",   stars: 5, body: "L'application est super, je vais aller au Maroc pour la CAN et je vais très sûrement utiliser cette application." },
  { title: "Utile",                      author: "fazid-06",      date: "7 janv. 2026",  stars: 5, body: "Je trouve que cette application a très bien été travaillée, elle m'a beaucoup servi pour les matchs 👍" },
  { title: "Agréablement surpris",       author: "Moutz7",        date: "9 janv. 2026",  stars: 5, body: "Bonne appli !" },
];

/* ─── ParticleCanvas ──────────────────────────────────────────────── */
const BRAND_COLORS = [
  { r: 0x3f, g: 0xc0, b: 0xd4 }, // teal
  { r: 0xf3, g: 0xf1, b: 0xec }, // ink
  { r: 0x7c, g: 0x48, b: 0xc4 }, // violet
  { r: 0x9b, g: 0xe7, b: 0xf0 }, // light teal
];
const WORDS_FR = ['CAN I HELP YOU', 'AIDE LOCALE', 'TEMPS RÉEL'];
const WORDS_EN = ['CAN I HELP YOU', 'LOCAL HELP', 'REAL TIME'];
const W = 1000, H = 300, PIXEL_STEPS = 4;

class Particle {
  constructor() {
    this.pos = { x: 0, y: 0 }; this.vel = { x: 0, y: 0 }; this.acc = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 }; this.closeEnoughTarget = 100;
    this.maxSpeed = 1; this.maxForce = 0.1;
    this.isKilled = false;
    this.startColor = { r: 0, g: 0, b: 0 }; this.targetColor = { r: 0, g: 0, b: 0 };
    this.colorWeight = 0; this.colorBlendRate = 0.01;
  }
  move() {
    const d = Math.hypot(this.pos.x - this.target.x, this.pos.y - this.target.y);
    const pm = d < this.closeEnoughTarget ? d / this.closeEnoughTarget : 1;
    let tx = this.target.x - this.pos.x, ty = this.target.y - this.pos.y;
    const m = Math.hypot(tx, ty);
    if (m > 0) { tx = (tx / m) * this.maxSpeed * pm; ty = (ty / m) * this.maxSpeed * pm; }
    let sx = tx - this.vel.x, sy = ty - this.vel.y;
    const sm = Math.hypot(sx, sy);
    if (sm > 0) { sx = (sx / sm) * this.maxForce; sy = (sy / sm) * this.maxForce; }
    this.acc.x += sx; this.acc.y += sy;
    this.vel.x += this.acc.x; this.vel.y += this.acc.y;
    this.pos.x += this.vel.x; this.pos.y += this.vel.y;
    this.acc.x = 0; this.acc.y = 0;
  }
  draw(ctx) {
    if (this.colorWeight < 1) this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1);
    const c = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    };
    ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
    ctx.fillRect(this.pos.x, this.pos.y, 2.2, 2.2);
  }
  kill(w, h) {
    if (!this.isKilled) {
      const angle = Math.random() * Math.PI * 2;
      const dist = (w + h) / 2;
      this.target.x = w / 2 + Math.cos(angle) * dist;
      this.target.y = h / 2 + Math.sin(angle) * dist;
      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      };
      this.targetColor = { r: 0, g: 0, b: 0 };
      this.colorWeight = 0; this.isKilled = true;
    }
  }
}

const ParticleCanvas = ({ language }) => {
  const canvasRef = useRef(null);
  const stateRef  = useRef({ particles: [], frame: 0, wi: 0, rafId: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const words = language === 'fr' ? WORDS_FR : WORDS_EN;
    const state = stateRef.current;

    const fitFont = word => {
      let s = 130;
      ctx.font = `bold ${s}px Arial`;
      while (ctx.measureText(word).width > W * 0.9 && s > 20) { s -= 4; ctx.font = `bold ${s}px Arial`; }
      return s;
    };

    const nextWord = word => {
      const off = document.createElement('canvas');
      off.width = W; off.height = H;
      const o = off.getContext('2d');
      const s = fitFont(word);
      o.fillStyle = 'white'; o.font = `bold ${s}px Arial`;
      o.textAlign = 'center'; o.textBaseline = 'middle';
      o.fillText(word, W / 2, H / 2);
      const px = o.getImageData(0, 0, W, H).data;
      const nc = BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)];

      // collect & shuffle pixel coords
      const coords = [];
      for (let i = 0; i < px.length; i += PIXEL_STEPS * 4) coords.push(i);
      for (let i = coords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [coords[i], coords[j]] = [coords[j], coords[i]];
      }

      let idx = 0;
      for (const ci of coords) {
        if (px[ci + 3] === 0) continue;
        const x = (ci / 4) % W, y = Math.floor(ci / 4 / W);
        let p;
        if (idx < state.particles.length) {
          p = state.particles[idx]; p.isKilled = false; idx++;
        } else {
          p = new Particle();
          const angle = Math.random() * Math.PI * 2;
          const dist  = (W + H) / 2;
          p.pos.x = W / 2 + Math.cos(angle) * dist;
          p.pos.y = H / 2 + Math.sin(angle) * dist;
          p.maxSpeed = Math.random() * 6 + 4;
          p.maxForce = p.maxSpeed * 0.05;
          p.colorBlendRate = Math.random() * 0.0275 + 0.0025;
          state.particles.push(p);
        }
        p.startColor = {
          r: p.startColor.r + (p.targetColor.r - p.startColor.r) * p.colorWeight,
          g: p.startColor.g + (p.targetColor.g - p.startColor.g) * p.colorWeight,
          b: p.startColor.b + (p.targetColor.b - p.startColor.b) * p.colorWeight,
        };
        p.targetColor = nc; p.colorWeight = 0;
        p.target.x = x; p.target.y = y;
      }
      for (let i = idx; i < state.particles.length; i++) state.particles[i].kill(W, H);
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(10,12,14,0.15)';
      ctx.fillRect(0, 0, W, H);
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.move(); p.draw(ctx);
        if (p.isKilled && (p.pos.x < -50 || p.pos.x > W + 50 || p.pos.y < -50 || p.pos.y > H + 50)) {
          state.particles.splice(i, 1);
        }
      }
      state.frame++;
      if (state.frame % 300 === 0) {
        state.wi = (state.wi + 1) % words.length;
        nextWord(words[state.wi]);
      }
      state.rafId = requestAnimationFrame(animate);
    };

    // reset on language change
    state.particles = []; state.frame = 0; state.wi = 0;
    ctx.clearRect(0, 0, W, H);
    nextWord(words[0]);
    state.rafId = requestAnimationFrame(animate);

    return () => { if (state.rafId) cancelAnimationFrame(state.rafId); };
  }, [language]);

  return (
    <canvas
      ref={canvasRef}
      width={W} height={H}
      style={{ display: 'block', width: 'min(1000px, 94vw)', height: 'auto', maxHeight: '46vh', position: 'relative', zIndex: 5 }}
    />
  );
};

/* ─── ReviewCarousel ──────────────────────────────────────────────── */
const slideVariants = {
  enter:  dir => ({ x: dir > 0 ?  60 : -60, opacity: 0 }),
  center:      ({ x: 0, opacity: 1 }),
  exit:   dir => ({ x: dir > 0 ? -60 :  60, opacity: 0 }),
};

const ReviewCarousel = ({ language }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const go = useCallback(delta => { setDirection(delta); setCurrent(p => (p + delta + reviews.length) % reviews.length); }, []);
  useEffect(() => { const t = setInterval(() => go(1), 4500); return () => clearInterval(t); }, [go]);
  const r = reviews[current];
  return (
    <div className="cani-reviews">
      <div className="cani-carousel">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.a key={current} href={APPSTORE_URL} target="_blank" rel="noopener noreferrer"
            className="cani-review-slide" custom={direction}
            variants={slideVariants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}>
            <div className="cani-stars">{'★'.repeat(r.stars)}</div>
            <p className="cani-review-title">{r.title}</p>
            <p className="cani-review-body">« {r.body} »</p>
            <div className="cani-review-meta"><span>{r.author}</span><span>{r.date}</span></div>
          </motion.a>
        </AnimatePresence>
      </div>
      <div className="cani-carousel-controls">
        <button onClick={() => go(-1)} aria-label="Précédent"><ChevronLeft size={16} /></button>
        <div className="cani-dots">{reviews.map((_, i) => <button key={i} className={i === current ? 'on' : ''} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }} />)}</div>
        <button onClick={() => go(1)} aria-label="Suivant"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
};

/* ─── Main page ───────────────────────────────────────────────────── */
const ProjectCanIHelpYou = () => {
  const { language } = useLanguage();
  const { scrollYProgress } = useScroll();
  const contentRef = useRef(null);
  const isFr = language === 'fr';

  // Reveal on scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    contentRef.current?.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [language]);

  return (
    <div className="cani-page">
      {/* Scroll progress */}
      <motion.div className="cani-scroll-bar" style={{ scaleX: scrollYProgress, transformOrigin: '0%' }} />

      {/* ── Top nav ── */}
      <div className="cani-topnav">
        <Link to="/" className="cani-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          {isFr ? 'Projets' : 'Projects'}
        </Link>
        <Link to="/" className="cani-brand">whois<b>zaher</b></Link>
      </div>

      {/* ── Particle Hero ── */}
      <section className="cani-hero">
        <span className="cani-eyebrow">
          <span className="cani-eyebrow-dot" />
          {isFr ? 'Projet · App mobile full-stack' : 'Project · Full-stack mobile app'}
        </span>
        <ParticleCanvas language={language} />
        <p className="cani-hero-sub">
          {isFr
            ? <>Connecter en temps réel ceux qui ont besoin d'aide avec ceux prêts à aider, à proximité. <b>Conçu et codé en solo.</b></>
            : <>Connecting in real time those who need help with those ready to help, nearby. <b>Designed and coded solo.</b></>
          }
        </p>
        <div className="cani-hero-tags">
          <span className="cani-tag">Cloudflare Workers</span>
          <span className="cani-tag">React Native · Expo</span>
          <span className="cani-tag">Neon · PostgreSQL</span>
          <span className="cani-tag">Upstash Redis</span>
        </div>
        <div className="cani-scroll-cue">
          <div className="cani-mouse" />
          {isFr ? 'Étude de cas' : 'Case study'}
        </div>
      </section>

      {/* ── Case study ── */}
      <section className="cani-content" ref={contentRef}>
        <div className="cani-inner">

          {/* Meta */}
          <div className="cani-meta reveal">
            <span className="cani-meta-k"><span className="cani-dot" />{isFr ? 'En production' : 'In production'}</span>
            <span className="cani-meta-k">{isFr ? 'Rôle — Développeur full-stack (solo)' : 'Role — Full-stack developer (solo)'}</span>
            <span className="cani-meta-k">2024 — 2025</span>
            <a href={APPSTORE_URL} target="_blank" rel="noopener noreferrer" className="cani-meta-k cani-appstore-link">
              ★ 4.9 App Store
            </a>
          </div>

          {/* Contexte */}
          <h2 className="cani-ch reveal">{isFr ? 'Le contexte' : 'The context'}</h2>
          <p className="cani-cp reveal">
            {isFr
              ? <><b>CAN I HELP YOU</b> est une application mobile pensée pour connecter en temps réel les personnes qui ont besoin d'un coup de main avec celles prêtes à aider, à proximité. Un projet mené <b>de A à Z, en solo</b> — du design produit à l'infrastructure cloud.</>
              : <><b>CAN I HELP YOU</b> is a mobile app designed to connect in real time people who need a hand with those ready to help, nearby. A project led <b>end-to-end, solo</b> — from product design to cloud infrastructure.</>
            }
          </p>

          <div className="cani-shot reveal">
            <img src="/assets/cani-appstore.png" alt="CAN I HELP YOU App Store" />
          </div>

          {/* Demo video */}
          <h2 className="cani-ch reveal">{isFr ? 'La démo' : 'The demo'}</h2>
          <div className="cani-video-wrap reveal">
            <video src={VIDEO_SRC} autoPlay muted loop playsInline controls className="cani-video" />
          </div>

          {/* Architecture */}
          <h2 className="cani-ch reveal">{isFr ? 'L\'architecture' : 'The architecture'}</h2>
          <p className="cani-cp reveal">
            {isFr
              ? <>API <b>edge</b> sur Cloudflare Workers pour une latence minimale, base <b>PostgreSQL serverless</b> (Neon), cache et files d'attente via <b>Upstash Redis</b>, et géolocalisation temps réel avec <b>Mapbox</b>. Le client mobile est construit en <b>React Native / Expo</b> pour iOS et Android.</>
              : <><b>Edge</b> API on Cloudflare Workers for minimal latency, <b>serverless PostgreSQL</b> (Neon), cache and queues via <b>Upstash Redis</b>, and real-time geolocation with <b>Mapbox</b>. The mobile client is built in <b>React Native / Expo</b> for iOS and Android.</>
            }
          </p>

          <div className="cani-arch-grid reveal">
            {[
              { logo: '/assets/logo-cloudflare.png', title: 'Edge-Deployed Worker',  desc: isFr ? 'API monolithique mondiale, zéro cold-start vs AWS Lambda.' : 'Global monolithic API, zero cold-start vs AWS Lambda.' },
              { logo: '/assets/logo-firebase.png',   title: 'Firebase Auth (REST)',  desc: isFr ? "JWT vérifié via REST — pas d'Admin SDK, 100% Edge." : 'JWT verified via REST — no Admin SDK, 100% Edge compatible.' },
              { logo: '/assets/logo-upstash.png',    title: '3-Tier Cache',          desc: isFr ? 'Upstash Redis → Cloudflare KV → Cache-Control headers.' : 'Upstash Redis → Cloudflare KV → Cache-Control headers.' },
              { logo: '/assets/logo-neon.png',       title: 'PostgreSQL / Neon',     desc: isFr ? 'New Connection Per Request — zéro fuite sur Workers.' : 'New Connection Per Request — zero leaks on Workers.' },
              { logo: '/assets/logo-mapbox.png',     title: 'Mapbox Proxy',          desc: isFr ? 'Token jamais exposé, tiles KV-cachées 20j.' : 'Token never exposed, tiles KV-cached 20 days.' },
              { logo: '/assets/logo-tripadvisor.png',title: 'TripAdvisor API',       desc: isFr ? 'Conformité ToS stricte: live detail, cache listes.' : 'Strict ToS compliance: live detail, cached lists.' },
            ].map(({ logo, title, desc }) => (
              <div key={title} className="cani-arch-card">
                <img src={logo} alt={title} className="cani-arch-logo" onError={e => { e.currentTarget.style.display='none'; }} />
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="cani-stat-row reveal">
            <div className="cani-stat"><div className="cani-stat-v">&lt;80ms</div><div className="cani-stat-l">{isFr ? 'Latence API edge médiane' : 'Median edge API latency'}</div></div>
            <div className="cani-stat"><div className="cani-stat-v">100%</div><div className="cani-stat-l">{isFr ? 'Serverless · zéro serveur' : 'Serverless · zero servers'}</div></div>
            <div className="cani-stat"><div className="cani-stat-v">4.9★</div><div className="cani-stat-l">{isFr ? 'App Store · 19 notes' : 'App Store · 19 ratings'}</div></div>
          </div>

          {/* Défis */}
          <h2 className="cani-ch reveal">{isFr ? 'Les défis' : 'The challenges'}</h2>
          <p className="cani-cp reveal">
            {isFr
              ? <>Synchroniser des positions en temps réel tout en maîtrisant les coûts, gérer l'authentification et les notifications push, et concevoir un matching fiable entre demandes et aidants — le tout avec une expérience fluide et une <b>app store-ready</b>.</>
              : <>Synchronising positions in real time while keeping costs under control, managing authentication and push notifications, and designing reliable matching between requests and helpers — all with a smooth experience and an <b>app store-ready</b> build.</>
            }
          </p>

          {/* Preuves */}
          <h2 className="cani-ch reveal">{isFr ? 'Preuves concrètes' : 'Concrete proof'}</h2>
          <div className="cani-proof-grid reveal">
            <a href={APPSTORE_URL} target="_blank" rel="noopener noreferrer" className="cani-proof-card">
              <img src="/assets/cani-review.png" alt="User review 5★" />
              <span>{isFr ? 'Avis utilisateur réel (5★)' : 'Real user review (5★)'}</span>
            </a>
            <div className="cani-proof-card">
              <img src="/assets/cani-admin.png" alt="Admin panel" />
              <span>{isFr ? 'Panel d\'administration (Vercel)' : 'Administration panel (Vercel)'}</span>
            </div>
            <div className="cani-proof-card">
              <img src="/assets/cani-playstore-stats.png" alt="Google Play stats" />
              <span>{isFr ? 'Statistiques Google Play Console' : 'Google Play Console stats'}</span>
            </div>
            <div className="cani-proof-card">
              <img src="/assets/cani-map.png" alt="Mapbox map" />
              <span>{isFr ? 'Carte interactive Mapbox' : 'Interactive Mapbox map'}</span>
            </div>
          </div>

          {/* Reviews */}
          <h2 className="cani-ch reveal">{isFr ? 'Avis App Store' : 'App Store reviews'}</h2>
          <ReviewCarousel language={language} />

          {/* CTA */}
          <div className="cani-cta reveal">
            <a href={APPSTORE_URL} target="_blank" rel="noopener noreferrer" className="cani-btn cani-btn-primary">
              {isFr ? 'Voir sur l\'App Store' : 'View on App Store'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>
            </a>
            <Link to="/" className="cani-btn cani-btn-glass">
              ← {isFr ? 'Retour aux projets' : 'Back to projects'}
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ProjectCanIHelpYou;
