import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import AnimatedSection from '../AnimatedSection';
import { ArrowRight, Download } from 'lucide-react';
import './HeroSection.css';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section id="hero" className="hero-section">
      <div className="hero-container">
        <AnimatedSection className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {t.hero.title}
          </motion.h1>
          
          <motion.h2 
            className="hero-subtitle text-gradient"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t.hero.subtitle}
          </motion.h2>

          <motion.p 
            className="hero-description"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t.hero.description}
          </motion.p>

          <motion.div
            className="hero-ctas"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a href="#projects" className="btn btn-primary glass-panel">
              {t.hero.cta_projects} <ArrowRight size={18} />
            </a>
            <a href="#contact" className="btn btn-secondary glass-panel">
              {t.hero.cta_contact}
            </a>
            <a href="/docs/CV_Zaher_Madi.pdf" download className="btn btn-ghost glass-panel">
              {t.hero.cta_cv} <Download size={18} />
            </a>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HeroSection;
