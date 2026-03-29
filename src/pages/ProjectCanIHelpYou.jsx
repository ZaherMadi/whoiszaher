import React from 'react';
import { motion, useScroll } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, Server, Database, Smartphone, Globe, Star, BarChart2, Shield } from 'lucide-react';
import { FaInstagram, FaLink } from 'react-icons/fa';
import AnimatedSection from '../components/AnimatedSection';
import './ProjectDetail.css';

const fr = {
  subtitle: "App Mobile Fullstack & API Cloudflare Workers — En production",
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
};
const en = {
  subtitle: "Full-stack Mobile App & Cloudflare Workers API — Live in Production",
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

        <AnimatedSection className="project-header">
          <h1 className="text-gradient">CAN I HELP YOU</h1>
          <p className="subtitle">{c.subtitle}</p>

          {/* Social proof badges */}
          <div className="proof-badges">
            <a href="https://www.instagram.com/canihelpyouapp" target="_blank" rel="noopener noreferrer" className="badge glass-panel">
              <FaInstagram size={16} /> @canihelpyouapp
            </a>
            <a href="https://linktr.ee/CANIHELPYOUAPP" target="_blank" rel="noopener noreferrer" className="badge glass-panel">
              <FaLink size={16} /> Linktree
            </a>
            <span className="badge glass-panel star-badge"><Star size={14} fill="gold" color="gold" /> 4.9 App Store</span>
          </div>

          {/* Hero proof images */}
          <div className="proof-images-grid">
            <div className="proof-img-card glass-panel">
              <img src="/assets/cani-appstore.png" alt="App Store listing" />
              <p className="proof-caption">{c.proofAppStore}</p>
            </div>
            <div className="proof-img-card glass-panel">
              <img src="/assets/cani-admin.png" alt="Admin panel" />
              <p className="proof-caption">{c.proofAdmin}</p>
            </div>
            <div className="proof-img-card glass-panel">
              <img src="/assets/cani-review.png" alt="User review" />
              <p className="proof-caption">{c.proofReview}</p>
            </div>
          </div>
        </AnimatedSection>

        <div className="project-body">

          {/* Context */}
          <AnimatedSection className="detail-section glass-panel">
            <h2><Globe className="detail-icon" /> {c.context}</h2>
            <p>{c.contextBody}</p>
            <div className="cani-logo-wrapper">
              <img src="/assets/cani-logo.png" alt="CAN I HELP YOU logo" className="cani-logo" />
            </div>
          </AnimatedSection>

          {/* Architecture */}
          <AnimatedSection className="detail-section glass-panel">
            <h2><Server className="detail-icon" /> {c.archTitle}</h2>
            <p>{c.archBody}</p>
            <div className="architecture-grid">
              <div className="arch-card">
                <img src="/assets/logo-cloudflare.png" alt="Cloudflare" className="arch-logo" />
                <h3>Edge-Deployed Worker</h3>
                <p>{language === 'fr' ? 'API monolithique mondiale, zéro cold-start vs AWS Lambda.' : 'Global monolithic API, zero cold-start vs AWS Lambda.'}</p>
              </div>
              <div className="arch-card">
                <img src="/assets/logo-firebase.png" alt="Firebase" className="arch-logo" />
                <h3>Firebase Auth (REST)</h3>
                <p>{language === 'fr' ? 'JWT vérifié via REST — pas d\'Admin SDK, 100% Edge.' : 'JWT verified via REST — no Admin SDK, 100% Edge compatible.'}</p>
              </div>
              <div className="arch-card">
                <img src="/assets/logo-upstash.png" alt="Upstash Redis" className="arch-logo" />
                <h3>3-Tier Cache</h3>
                <p>Upstash Redis → Cloudflare KV → Cache-Control headers.</p>
              </div>
              <div className="arch-card">
                <img src="/assets/logo-neon.png" alt="Neon PostgreSQL" className="arch-logo" />
                <h3>PostgreSQL / Neon</h3>
                <p>{language === 'fr' ? 'New Connection Per Request — zéro fuite sur Workers.' : 'New Connection Per Request — zero leaks on Workers.'}</p>
              </div>
              <div className="arch-card">
                <img src="/assets/logo-mapbox.png" alt="Mapbox" className="arch-logo" />
                <h3>Mapbox Proxy</h3>
                <p>{language === 'fr' ? 'Token jamais exposé, tiles KV-cachées 20j.' : 'Token never exposed, tiles KV-cached 20 days.'}</p>
              </div>
              <div className="arch-card">
                <img src="/assets/logo-tripadvisor.png" alt="TripAdvisor" className="arch-logo" />
                <h3>TripAdvisor API</h3>
                <p>{language === 'fr' ? 'Conformité ToS stricte: live detail, cache listes.' : 'Strict ToS compliance: live detail, cached lists.'}</p>
              </div>
            </div>
          </AnimatedSection>

          {/* Features */}
          <AnimatedSection className="detail-section glass-panel">
            <h2><Database className="detail-icon" /> {c.featTitle}</h2>
            <ul className="feature-list">
              {feats.map((f, i) => (
                <li key={i}><strong>{f.label}:</strong> {f.desc}</li>
              ))}
            </ul>
          </AnimatedSection>

          {/* Proofs */}
          <AnimatedSection className="detail-section glass-panel">
            <h2><BarChart2 className="detail-icon" /> {c.proofTitle}</h2>
            <div className="proof-images-grid">
              <div className="proof-img-card glass-panel">
                <img src="/assets/cani-playstore-stats.png" alt="Google Play stats" />
                <p className="proof-caption">{c.proofPlayStore}</p>
              </div>
              <div className="proof-img-card glass-panel">
                <img src="/assets/cani-map.png" alt="Mapbox Morocco map" />
                <p className="proof-caption">{c.proofMap}</p>
              </div>
            </div>
            <div className="store-badges">
              <div className="store-badge glass-panel">
                <img src="/assets/logo-apple.png" alt="App Store" className="store-logo" />
                <div>
                  <p className="store-name">App Store</p>
                  <p className="store-rating">4.9★ · 19 {language === 'fr' ? 'notes' : 'ratings'}</p>
                </div>
              </div>
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

          {/* What's next */}
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
