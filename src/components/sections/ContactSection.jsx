import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import AnimatedSection from '../AnimatedSection';
import { Mail, Download } from 'lucide-react';
import { FaGithub as Github, FaLinkedin as Linkedin, FaInstagram as Instagram, FaLink as Link2 } from 'react-icons/fa';
import './ContactSection.css';

const ContactSection = () => {
  const { t } = useLanguage();

  const handleContactClick = (e, href) => {
    // If it's a mailto link, we let default behavior works. Otherwise open in new tab.
    if (!href.startsWith('mailto:')) {
      e.preventDefault();
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <AnimatedSection className="contact-wrapper glass-panel">
          <h2 className="section-title text-gradient">{t.contact.title}</h2>
          
          <div className="contact-grid">
            <a href="mailto:zaher@example.com" className="contact-card glass-panel">
              <Mail size={32} className="card-icon" />
              <span>{t.contact.email}</span>
            </a>
            
            <a href="https://github.com/ZaherMadi" target="_blank" rel="noopener noreferrer" className="contact-card glass-panel" onClick={(e) => handleContactClick(e, 'https://github.com/ZaherMadi')}>
              <Github size={32} className="card-icon" />
              <span>{t.contact.github}</span>
            </a>
            
            <a href="https://linkedin.com/in/zahermadi" target="_blank" rel="noopener noreferrer" className="contact-card glass-panel" onClick={(e) => handleContactClick(e, 'https://linkedin.com/in/zaher-madi/')}>
              <Linkedin size={32} className="card-icon" />
              <span>{t.contact.linkedin}</span>
            </a>
            
            <a href="https://instagram.com/canihelpyouapp" target="_blank" rel="noopener noreferrer" className="contact-card glass-panel" onClick={(e) => handleContactClick(e, 'https://instagram.com/canihelpyouapp')}>
              <Instagram size={32} className="card-icon insta" />
              <span>{t.contact.instagram}</span>
            </a>
            
            <a href="https://linktr.ee/CANIHELPYOUAPP" target="_blank" rel="noopener noreferrer" className="contact-card glass-panel" onClick={(e) => handleContactClick(e, 'https://linktr.ee/CANIHELPYOUAPP')}>
              <Link2 size={32} className="card-icon linktree" />
              <span>{t.contact.linktree}</span>
            </a>
          </div>

          <div className="cv-download-area">
             <a href="/docs/CV_Zaher_Madi.pdf" download className="btn btn-primary glass-panel">
               {t.hero.cta_cv} <Download size={18} />
             </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ContactSection;
