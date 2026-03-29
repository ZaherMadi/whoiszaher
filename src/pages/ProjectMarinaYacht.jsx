import React from 'react';
import { motion, useScroll } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, LayoutDashboard, ShieldCheck } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import './ProjectDetail.css';

const ProjectMarinaYacht = () => {
  const { t, language } = useLanguage();
  const { scrollYProgress } = useScroll();

  return (
    <div className="project-detail">
      <motion.div 
        className="scroll-progress text-gradient" 
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }} 
      />

      <div className="container">
        <Link to="/" className="btn-back">
          <ArrowLeft size={16} /> {t.project_page.back}
        </Link>
        
        <AnimatedSection className="project-header">
          <h1 className="text-gradient">Marina Yacht Inventory</h1>
          <p className="subtitle">
            {language === 'fr' 
              ? "App d'Entreprise, Lead Dev et Mentoring"
              : "Enterprise App, Lead Developer and Mentoring"}
          </p>
          <div className="project-hero-image glass-panel static-hero">
            <img src="/assets/marina.jpg" alt="Marina Yacht Inventory Team" />
          </div>
        </AnimatedSection>

        <div className="project-body">
          <AnimatedSection className="detail-section glass-panel">
            <h2><Users className="detail-icon" /> Leadership & Mentoring</h2>
            <p>
              {language === 'fr'
                ? "En tant que développeur principal sur ce projet d'entreprise, ma mission principale (au-delà de l'architecture) a été de manager et superviser 3 développeurs en première année post-bac. Le but était de leur fournir un environnement de travail formateur, en les initiant à Git/Github et aux standards de l'industrie."
                : "As the lead developer on this enterprise project, my main mission (beyond architecture) was to manage and supervise 3 first-year post-baccalaureate developers. The goal was to provide them with a formative work environment, introducing them to Git/Github and industry standards."}
            </p>
            <div className="mentoring-highlights">
               <div className="highlight">
                  <h4>{language === 'fr' ? 'Découpage des missions' : 'Task Breakdown'}</h4>
                  <p>{language === 'fr' ? 'Conception et distribution de missions accessibles de difficulté graduée.' : 'Design and distribution of accessible, progressively difficult tasks.'}</p>
               </div>
               <div className="highlight">
                  <h4>{language === 'fr' ? 'Revue de code' : 'Code Review'}</h4>
                  <p>{language === 'fr' ? "Implémentation d'un flux de travail strict avec Pull Requests." : 'Implementation of a strict workflow with Pull Requests.'}</p>
               </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="detail-section glass-panel">
            <h2><LayoutDashboard className="detail-icon" /> Architecture & DevOps</h2>
            <p>
              {language === 'fr'
                ? "De la création de la Landing Page jusqu'aux composants internes sophistiqués de l'application. Mise en place d'une CI/CD robuste, documentation rigoureuse et tests d'intégration (référence : S1 Ydays Marina Yacht Inventory)."
                : "From creating the Landing Page to the sophisticated internal components of the application. Setup of a robust CI/CD pipeline, rigorous documentation, and integration testing (reference: S1 Ydays Marina Yacht Inventory)."}
            </p>
          </AnimatedSection>

          <AnimatedSection className="detail-section glass-panel">
            <h2><ShieldCheck className="detail-icon" /> Rigueur Technique</h2>
            <ul className="feature-list">
              <li>
                <strong>{language === 'fr' ? 'Propriété du produit (Ownership) :' : 'Product Ownership:'}</strong> {language === 'fr' ? 'Gestion intégrale de la qualité de bout en bout.' : 'End-to-end quality management.'}
              </li>
              <li>
                <strong>Front-end Architectonic:</strong> React Ecosystem.
              </li>
              <li>
                <strong>Workflow Agile:</strong> Scrums & Sprints {language === 'fr' ? 'adaptés aux profils juniors.' : 'adapted to junior profiles.'}
              </li>
            </ul>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default ProjectMarinaYacht;
