import { useEffect, useRef } from 'react';
import './WhoAmI.css';

const WhoAmI = () => {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const calculateAge = () => {
    const birthDate = new Date(2002, 7, 5); // August 5, 2002
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <section id="whoami" className="whoami" ref={sectionRef}>
      {/* Video Background */}
      <div className="video-container">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="background-video"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%230f172a' width='1920' height='1080'/%3E%3C/svg%3E"
        >
          {/* Video will use a placeholder gradient animation since no actual video file is provided */}
        </video>
        <div className="video-overlay"></div>
      </div>

      <div className="whoami-container">
        <div className="whoami-header">
          <h2 className="whoami-question">Who am I?</h2>
          <p className="whoami-hint">The answer below!</p>
          <div className="arrow-down">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <polyline points="19 12 12 19 5 12"/>
            </svg>
          </div>
        </div>

        <div className="whoami-content">
          <div className="whoami-card">
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h3>Personal Info</h3>
            <ul className="info-list">
              <li>
                <span className="info-label">Name:</span>
                <span className="info-value">Zaher Madi</span>
              </li>
              <li>
                <span className="info-label">Age:</span>
                <span className="info-value">{calculateAge()} years old</span>
              </li>
              <li>
                <span className="info-label">Birthday:</span>
                <span className="info-value">August 5, 2002</span>
              </li>
              <li>
                <span className="info-label">Location:</span>
                <span className="info-value">Nice, France 🇫🇷</span>
              </li>
            </ul>
          </div>

          <div className="whoami-card">
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <h3>Education</h3>
            <ul className="info-list">
              <li>
                <span className="info-label">Current:</span>
                <span className="info-value">Master Dév Logiciel</span>
              </li>
              <li>
                <span className="info-label">Previous:</span>
                <span className="info-value">BTS SNIR</span>
              </li>
            </ul>
          </div>

          <div className="whoami-card">
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <h3>Other</h3>
            <ul className="info-list">
              <li>
                <span className="info-label">English:</span>
                <span className="info-value">Level B1 <em>(improving!)</em></span>
              </li>
              <li>
                <span className="info-label">Driving:</span>
                <span className="info-value">Permis B 🚗</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="whoami-quote">
          <blockquote>
            &ldquo;Passionate about building efficient, scalable, and user-friendly applications.
            Always learning, always growing.&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default WhoAmI;
