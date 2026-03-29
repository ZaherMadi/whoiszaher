import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import AnimatedSection from '../AnimatedSection';
import { Quote } from 'lucide-react';
import './AboutSection.css';

const AboutSection = () => {
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section id="about" className="about-section">
      <div className="container">
        <AnimatedSection className="section-header">
          <h2 className="section-title text-gradient">{t.about.title}</h2>
        </AnimatedSection>

        <div className="about-content">
          <AnimatedSection className="bio-container glass-panel" delay={0.2}>
            <div className="quote-icon">
              <Quote size={40} color="var(--starlight-blue)" />
            </div>
            <p className="bio-text">{t.about.bio}</p>
            <div className="bio-author">
              <p>— {t.about.bio_author}</p>
              <a href={t.about.bio_link} target="_blank" rel="noopener noreferrer" className="bio-source">
                {t.language === 'fr' ? 'Source originale' : 'Original Source'}
              </a>
            </div>
          </AnimatedSection>

          <AnimatedSection className="hobbies-container" delay={0.4}>
            <motion.div style={{ y: yParallax }} className="parallax-hobbies glass-panel">
              <h3>{t.language === 'fr' ? 'Lifestyle & Équilibre' : 'Lifestyle & Balance'}</h3>
              <p>{t.about.hobbies}</p>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
