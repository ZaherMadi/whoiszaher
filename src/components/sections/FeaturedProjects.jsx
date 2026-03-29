import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import AnimatedSection from '../AnimatedSection';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import './FeaturedProjects.css';

const FeaturedProjects = () => {
  const { t } = useLanguage();

  return (
    <section id="projects" className="featured-section">
      <div className="container">
        <AnimatedSection className="section-header">
          <h2 className="section-title text-gradient">{t.projects.title}</h2>
        </AnimatedSection>

        <div className="projects-grid">
          {t.projects.featured.map((project, index) => (
            <AnimatedSection 
              key={project.id} 
              className={`project-card glass-panel ${index % 2 !== 0 ? 'reverse' : ''}`}
              delay={0.2}
            >
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <h4 className="project-subtitle">{project.subtitle}</h4>
                <p className="project-desc">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag glass-panel">{tag}</span>
                  ))}
                </div>
                <Link to={project.link} className="btn-case-study glass-panel">
                  Deep Dive <ExternalLink size={16} />
                </Link>
              </div>
              
              <div className="project-visual">
                <div className="visual-wrapper glass-panel">
                  {/* The image logic relies on static public path */}
                  <img src={project.image} alt={project.title} className="project-image" />
                  <div className="visual-overlay"></div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
