import React, { useEffect, useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import './Project5HcAi.css';

const PROJECT_URL = 'https://ai.5hc.dev';

// Tech logos that float in the hero background. Files live under /public/assets;
// if a file is missing the img is hidden via onError so the layout never breaks.
const HERO_LOGOS = [
  { id: 'infomaniak', src: '/assets/logo-infomaniak.png', name: 'Infomaniak', color: '#0098FF' },
  { id: 'openstack',  src: '/assets/logo-openstack.png',  name: 'OpenStack',  color: '#ED1944' },
  { id: 'redhat',     src: '/assets/logo-redhat.png',     name: 'Red Hat',    color: '#EE0000' },
  { id: 'openshift',  src: '/assets/logo-openshift.png',  name: 'OpenShift',  color: '#EE0000' },
  { id: 'kubernetes', src: '/assets/logo-kubernetes.png', name: 'Kubernetes', color: '#326CE5' },
  { id: 'openwebui',  src: '/assets/logo-openwebui.png',  name: 'OpenWebUI',  color: '#7C48C4' },
];

// Fixed positions so the layout stays stable across renders.
const LOGO_POS = [
  { left: '10%', top: '22%' },
  { left: '78%', top: '18%' },
  { left: '20%', top: '68%' },
  { left: '82%', top: '62%' },
  { left: '48%', top: '82%' },
  { left: '58%', top: '12%' },
];

// Inline red fedora — playful nod to the Red Hat brand, floats on top of the hero.
const RedHat = ({ size = 60 }) => (
  <svg
    width={size}
    height={size * 0.72}
    viewBox="0 0 100 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Brim */}
    <ellipse cx="50" cy="58" rx="46" ry="8" fill="#8b0000" />
    <ellipse cx="50" cy="55" rx="46" ry="6" fill="#c40000" />
    {/* Crown */}
    <path
      d="M22 55 C 22 32, 42 20, 50 20 C 58 20, 78 32, 78 55 L 78 56 Q 50 50, 22 56 Z"
      fill="#ee0000"
    />
    {/* Highlight */}
    <path
      d="M30 46 Q 40 30, 52 26"
      stroke="#ff5555"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
      opacity="0.75"
    />
    {/* Bottom ribbon shadow */}
    <path d="M22 55 Q 50 50, 78 55 L 78 57 Q 50 52, 22 57 Z" fill="#6b0000" opacity="0.6" />
  </svg>
);

const Project5HcAi = () => {
  const { language } = useLanguage();
  const { scrollYProgress } = useScroll();
  const isFr = language === 'fr';
  const contentRef = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    contentRef.current?.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [language]);

  return (
    <div className="fhc-page">
      <motion.div
        className="fhc-scroll-bar"
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
      />

      {/* Top nav */}
      <div className="fhc-topnav">
        <Link to="/" className="fhc-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          {isFr ? 'Projets' : 'Projects'}
        </Link>
        <Link to="/" className="fhc-brand">whois<b>zaher</b></Link>
      </div>

      {/* Hero */}
      <section className="fhc-hero">
        {/* Ambient background glows */}
        <div className="fhc-glow fhc-glow-a" aria-hidden="true" />
        <div className="fhc-glow fhc-glow-b" aria-hidden="true" />

        {/* Floating tech logos — decorative, ignored by AT */}
        <div className="fhc-floats" aria-hidden="true">
          {HERO_LOGOS.map((l, i) => (
            <motion.div
              key={l.id}
              className="fhc-float"
              style={{ ...LOGO_POS[i % LOGO_POS.length], '--fhc-color': l.color }}
              animate={{ y: [0, -14, 0], rotate: [-4, 4, -4] }}
              transition={{
                duration: 6 + i * 0.9,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.35,
              }}
            >
              <img
                src={l.src}
                alt=""
                loading="lazy"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="fhc-float-name">{l.name}</span>
            </motion.div>
          ))}
        </div>

        {/* Floating Red Hat fedora on top — playful */}
        <motion.div
          className="fhc-hat"
          animate={{ y: [0, -10, 0], rotate: [-6, 6, -6] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <RedHat size={64} />
        </motion.div>

        <div className="fhc-hero-inner">
          <span className="fhc-eyebrow">
            <span className="fhc-eyebrow-dot" />
            {isFr
              ? 'Projet perso · Expert Support & Full-Stack'
              : 'Personal project · Expert Support & Full-Stack'}
          </span>

          <h1 className="fhc-title">
            <span className="fhc-title-mark">5HC</span>
            <span className="fhc-title-sep">·</span>
            <span className="fhc-serif">
              {isFr ? 'IA auto-hébergée' : 'self-hosted AI'}
            </span>
          </h1>

          <p className="fhc-sub">
            {isFr
              ? <>Une plateforme qui propose des <b>services IA à plusieurs niveaux</b> — sur les appareils locaux, sur les serveurs on-premise des entreprises et sur des serveurs cloud managés.</>
              : <>A platform delivering <b>AI services at multiple levels</b> — on local devices, on enterprise on-premise servers, and on managed cloud servers.</>}
          </p>

          <div className="fhc-badges">
            <a
              href={PROJECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="fhc-badge fhc-badge-link"
            >
              <span className="fhc-badge-dot" />
              ai.5hc.dev
              <ArrowUpRight size={14} />
            </a>
            <span className="fhc-badge fhc-badge-status">
              {isFr ? 'Accès privé — bêta' : 'Private access — beta'}
            </span>
            <span className="fhc-badge">2026 · {isFr ? 'En cours' : 'In progress'}</span>
          </div>
        </div>
      </section>

      {/* Case study */}
      <section className="fhc-content" ref={contentRef}>
        <div className="fhc-inner">

          {/* Vision */}
          <h2 className="fhc-ch reveal">{isFr ? "L'idée" : 'The idea'}</h2>
          <p className="fhc-cp reveal">
            {isFr
              ? <>Concevoir une <b>architecture unique</b> pour orchestrer des déploiements IA sur des clusters Kubernetes — que ce soit chez soi, dans une entreprise, ou sur du cloud managé. Un même socle, plusieurs cibles.</>
              : <>Design a <b>single architecture</b> to orchestrate AI deployments across Kubernetes clusters — at home, on-premise, or on managed cloud. One backbone, many targets.</>}
          </p>

          {/* Part 1 — Live */}
          <article className="fhc-part reveal">
            <div className="fhc-part-header">
              <span className="fhc-part-tag">Part 1</span>
              <span className="fhc-part-status fhc-status-live">
                <span className="fhc-status-dot" />
                {isFr ? 'En ligne' : 'Live'}
              </span>
            </div>
            <h3 className="fhc-part-title">
              {isFr
                ? 'OpenWebUI sur Infomaniak Public Cloud (OpenStack)'
                : 'OpenWebUI on Infomaniak Public Cloud (OpenStack)'}
            </h3>
            <p className="fhc-cp">
              {isFr
                ? <>LLM auto-hébergé — <b>Llama 3</b> via <b>OpenWebUI</b> — déployé sur un cluster Kubernetes hébergé chez <b>Infomaniak Public Cloud</b> (OpenStack). Exposition via un <b>Ingress HTTPS</b> (cert-manager + Let's Encrypt) sur un <b>domaine personnalisé</b>.</>
                : <>Self-hosted LLM — <b>Llama 3</b> via <b>OpenWebUI</b> — deployed on a Kubernetes cluster on <b>Infomaniak Public Cloud</b> (OpenStack). Exposed via an <b>HTTPS Ingress</b> (cert-manager + Let's Encrypt) on a <b>custom domain</b>.</>}
            </p>
            <div className="fhc-chips">
              {['Kubernetes','Infomaniak Public Cloud','OpenStack','OpenWebUI','Llama 3','Ingress','cert-manager','Let’s Encrypt','DNS'].map(c => (
                <span key={c} className="fhc-chip">{c}</span>
              ))}
            </div>
          </article>

          {/* Part 2 — WIP */}
          <article className="fhc-part reveal">
            <div className="fhc-part-header">
              <span className="fhc-part-tag">Part 2</span>
              <span className="fhc-part-status fhc-status-wip">
                <span className="fhc-status-dot" />
                {isFr ? 'En cours' : 'In progress'}
              </span>
            </div>
            <h3 className="fhc-part-title">
              {isFr
                ? 'LibreChat sur Red Hat OpenShift (Developer Sandbox)'
                : 'LibreChat on Red Hat OpenShift (Developer Sandbox)'}
            </h3>
            <p className="fhc-cp">
              {isFr
                ? <>Mise en place de <b>LibreChat</b> et extension du projet sur <b>Red Hat OpenShift</b> via la <b>Developer Sandbox</b>. Je donnerai des news dès que possible.</>
                : <>Setting up <b>LibreChat</b> and extending the project on <b>Red Hat OpenShift</b> via the <b>Developer Sandbox</b>. Updates coming soon.</>}
            </p>
            <div className="fhc-chips">
              {['Red Hat OpenShift','Developer Sandbox','LibreChat','Kubernetes'].map(c => (
                <span key={c} className="fhc-chip">{c}</span>
              ))}
            </div>
          </article>

          {/* Result */}
          <h2 className="fhc-ch reveal">{isFr ? 'Résultat' : 'Result'}</h2>
          <ul className="fhc-list reveal">
            <li>
              <strong>{isFr ? 'LLM fonctionnel' : 'Working LLM'} —</strong>{' '}
              {isFr
                ? 'auto-hébergé, accessible en HTTPS sur son propre domaine.'
                : 'self-hosted, reachable over HTTPS on its own domain.'}
            </li>
            <li>
              <strong>{isFr ? 'Chaîne complète' : 'Full chain'} —</strong>{' '}
              DNS → Ingress → cert-manager → TLS {isFr ? 'auto-renouvelé' : 'auto-renewed'}.
            </li>
            <li>
              <strong>{isFr ? 'Portabilité' : 'Portability'} —</strong>{' '}
              {isFr
                ? "un même socle vise plusieurs clouds (Infomaniak Public Cloud, OpenShift…)."
                : 'one backbone targets multiple clouds (Infomaniak Public Cloud, OpenShift…).'}
            </li>
          </ul>

          {/* CTAs */}
          <div className="fhc-cta reveal">
            <a
              href={PROJECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="fhc-btn fhc-btn-primary"
            >
              {isFr ? 'Ouvrir ai.5hc.dev' : 'Open ai.5hc.dev'}
              <ArrowUpRight size={16} />
            </a>
            <Link to="/" className="fhc-btn fhc-btn-glass">
              ← {isFr ? 'Retour aux projets' : 'Back to projects'}
            </Link>
          </div>

          <p className="fhc-note reveal">
            {isFr
              ? <>Note : l'URL n'est pas encore ouverte au public — je la libère dès que la Part 2 est stable.</>
              : <>Note: the URL is not public yet — I'll open it once Part 2 is stable.</>}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Project5HcAi;
