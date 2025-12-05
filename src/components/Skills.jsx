import { useEffect, useRef } from 'react';
import './Skills.css';

const Skills = () => {
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

  const certifications = [
    {
      title: 'AWS Cloud Practitioner',
      status: 'Certified',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
        </svg>
      ),
      color: '#ff9900',
      badge: '✓',
    },
    {
      title: 'AWS Solutions Architect Associate',
      status: 'In Progress',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
          <path d="m8 13 2.5 2.5L15 11"/>
        </svg>
      ),
      color: '#ff9900',
      badge: '⏳',
    },
  ];

  const education = [
    {
      title: 'Master Dév Logiciel',
      description: 'Software Development Master\'s Degree',
      status: 'Current',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      ),
    },
    {
      title: 'BTS SNIR',
      description: 'Systèmes Numériques - Informatique et Réseaux',
      status: 'Completed',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          <path d="m9 10 2 2 4-4"/>
        </svg>
      ),
    },
  ];

  const technicalSkills = [
    { name: 'React / JavaScript', level: 85 },
    { name: 'Node.js', level: 75 },
    { name: 'AWS Services', level: 70 },
    { name: 'Python', level: 70 },
    { name: 'SQL / Databases', level: 75 },
    { name: 'Git / CI-CD', level: 80 },
  ];

  const additionalInfo = [
    {
      title: 'English Level',
      value: 'B1',
      note: 'Improving!',
      icon: '🌍',
    },
    {
      title: 'Driving License',
      value: 'Permis B',
      note: 'Valid',
      icon: '🚗',
    },
  ];

  return (
    <section id="skills" className="skills" ref={sectionRef}>
      <div className="skills-container">
        <h2 className="section-title">Skills & Education</h2>

        {/* Certifications */}
        <div className="skills-section">
          <h3 className="subsection-title">
            <span className="icon">☁️</span>
            AWS Certifications
          </h3>
          <div className="certifications-grid">
            {certifications.map((cert, index) => (
              <div 
                key={cert.title} 
                className={`cert-card ${cert.status === 'In Progress' ? 'in-progress' : ''}`}
                style={{ '--delay': `${index * 0.1}s`, '--accent': cert.color }}
              >
                <div className="cert-badge">{cert.badge}</div>
                <div className="cert-icon" style={{ color: cert.color }}>
                  {cert.icon}
                </div>
                <h4>{cert.title}</h4>
                <span className={`cert-status ${cert.status === 'Certified' ? 'certified' : 'progress'}`}>
                  {cert.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="skills-section">
          <h3 className="subsection-title">
            <span className="icon">🎓</span>
            Education
          </h3>
          <div className="education-grid">
            {education.map((edu, index) => (
              <div 
                key={edu.title} 
                className="edu-card"
                style={{ '--delay': `${index * 0.1}s` }}
              >
                <div className="edu-icon">
                  {edu.icon}
                </div>
                <div className="edu-content">
                  <h4>{edu.title}</h4>
                  <p>{edu.description}</p>
                  <span className={`edu-status ${edu.status === 'Current' ? 'current' : 'completed'}`}>
                    {edu.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Skills */}
        <div className="skills-section">
          <h3 className="subsection-title">
            <span className="icon">💻</span>
            Technical Skills
          </h3>
          <div className="tech-skills-grid">
            {technicalSkills.map((skill, index) => (
              <div 
                key={skill.name} 
                className="skill-bar-item"
                style={{ '--delay': `${index * 0.1}s` }}
              >
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-percent">{skill.level}%</span>
                </div>
                <div className="skill-bar">
                  <div 
                    className="skill-progress" 
                    style={{ '--progress': `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="skills-section">
          <h3 className="subsection-title">
            <span className="icon">✨</span>
            Additional
          </h3>
          <div className="additional-grid">
            {additionalInfo.map((info, index) => (
              <div 
                key={info.title} 
                className="additional-card"
                style={{ '--delay': `${index * 0.1}s` }}
              >
                <span className="additional-icon">{info.icon}</span>
                <div className="additional-content">
                  <h4>{info.title}</h4>
                  <p className="additional-value">{info.value}</p>
                  <span className="additional-note">{info.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
