import { useState, useEffect, useRef } from 'react';
import './Projects.css';

const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const projects = [
    {
      id: 'can-i-help-you',
      title: 'Can I Help You',
      subtitle: 'Application mobile dédiée à la CAN 2025 (Maroc)',
      role: 'Co-Founder & Lead Software Engineer',
      period: 'sept. 2025 – aujourd\'hui',
      description: 'Can I Help You est une application mobile que j\'ai co-fondée et développée pour accompagner les visiteurs de la CAN 2025 au Maroc. L\'objectif : offrir une expérience fluide, utile et complète à tous les supporters, touristes et professionnels présents pendant la compétition.',
      technicalRole: 'Je suis responsable de l\'architecture technique de l\'application et de l\'ensemble des choix technologiques, du design produit au déploiement mobile.',
      icon: '🇲🇦',
      color: '#c1272d',
      tags: ['React Native', 'Expo', 'Node.js', 'NestJS', 'SQL', 'Cloudflare'],
      features: [
        'Visa & documents officiels',
        'Carte SIM, change & informations administratives',
        'Transports (aéroport → ville, bus, train, taxi, Uber, InDrive)',
        'Hébergements par ville, par date et par nombre de personnes',
        'Stades, hôpitaux, police',
        'Activités touristiques & restaurants',
        'Calendrier des matchs',
        'Espace utilisateur (favoris)',
      ],
      technicalFeatures: [
        'API scalable, optimisée pour le mobile',
        'Système d\'authentification complet (Google Sign-In, tokens, sécurité)',
        'Stack Cloud moderne (Expo / React Native, Node/NestJS, SQL, Cloudflare)',
      ],
      collaboration: 'J\'ai été en co-développement sur plusieurs parties de l\'application avec Laïd Ousseni, qui prenait notamment le relais lors de mes indisponibilités, du code à la gestion des utilisateurs tests, il a toujours répondu présent. Il a également été à l\'initiative de plusieurs fonctionnalités majeures encore présentes aujourd\'hui, telles que : le multilingue, les ressources administratives, la partie restaurants, la partie transports, et bien d\'autres encore.',
      status: 'In Development',
      links: {
        github: '#',
        demo: '#',
      },
    },
  ];

  return (
    <main className="projects-page" ref={sectionRef}>
      <div className="projects-hero">
        <div className="projects-hero-bg"></div>
        <div className="projects-hero-content">
          <h1>My Projects</h1>
          <p>Exploring ideas and building solutions</p>
        </div>
      </div>

      <div className="projects-container">
        <div className="projects-grid single-project">
          {projects.map((project, index) => (
            <article 
              key={project.id} 
              className={`project-card ${activeProject === project.id ? 'active' : ''}`}
              style={{ '--delay': `${index * 0.2}s`, '--accent': project.color }}
              onMouseEnter={() => setActiveProject(project.id)}
              onMouseLeave={() => setActiveProject(null)}
            >
              <div className="project-header">
                <div className="project-icon">{project.icon}</div>
                <div className="project-status">
                  <span className={`status-badge ${project.status === 'Live' ? 'live' : 'dev'}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="project-content">
                <h2 className="project-title">{project.title}</h2>
                <p className="project-subtitle">{project.subtitle}</p>
                <p className="project-role"><strong>{project.role}</strong></p>
                <p className="project-period">{project.period}</p>
                <p className="project-description">{project.description}</p>
                <p className="project-technical-role">{project.technicalRole}</p>

                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="project-tag">{tag}</span>
                  ))}
                </div>

                <div className="project-features">
                  <h4>Fonctionnalités principales</h4>
                  <ul>
                    {project.features.map((feature) => (
                      <li key={feature}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="project-features">
                  <h4>Développements techniques</h4>
                  <ul>
                    {project.technicalFeatures.map((feature) => (
                      <li key={feature}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="project-collaboration">
                  <h4>Collaboration</h4>
                  <p>{project.collaboration}</p>
                </div>

                <div className="project-actions">
                  <a 
                    href={project.links.github} 
                    className="btn btn-secondary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View Code
                  </a>
                  <a 
                    href={project.links.demo} 
                    className="btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    Live Demo
                  </a>
                </div>
              </div>

              <div className="project-glow"></div>
            </article>
          ))}
        </div>

        <div className="projects-cta">
          <div className="cta-card">
            <h3>Want to Collaborate?</h3>
            <p>I&apos;m always open to discussing new projects and ideas.</p>
            <a href="mailto:contact@zaher.dev" className="btn btn-primary">
              Get in Touch
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Projects;
