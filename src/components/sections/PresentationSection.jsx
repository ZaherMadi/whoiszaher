import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './PresentationSection.css';

const PresentationSection = () => {
  const { language } = useLanguage();
  const sectionRef = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="pres-section" id="intro" ref={sectionRef}>
      <div className="pres-inner">
        {/* Left col */}
        <div>
          <div className="pres-label reveal">
            {language === 'fr' ? 'Qui suis-je' : 'About me'}
          </div>
          <h2 className="pres-h reveal">
            {language === 'fr'
              ? <>Curieux,<br />cloud-addict,<br />et jamais rassasié.</>
              : <>Curious,<br />cloud-addicted,<br />never satisfied.</>
            }
          </h2>
        </div>

        {/* Right col */}
        <div className="pres-body">
          {language === 'fr' ? (
            <>
              <p className="reveal">
                Développeur passionné par l'<b>innovation</b> et la création d'applications et de projets IT, avec un goût prononcé pour l'<b>exploration des technologies cloud</b>.
              </p>
              <p className="reveal">
                Je prépare actuellement un <b>Master en développement logiciel</b> ainsi qu'une deuxième certification AWS — la <b>SAA-C03</b>. En parallèle, je suis la formation{' '}
                <a href="https://www.infomaniak.com/en/academy" target="_blank" rel="noopener noreferrer">« Public Cloud — Foundational » d'Infomaniak</a>{' '}
                … en espérant qu'il y en aura beaucoup d'autres.
              </p>
            </>
          ) : (
            <>
              <p className="reveal">
                A developer passionate about <b>innovation</b> and building IT applications and projects, with a strong taste for <b>exploring cloud technologies</b>.
              </p>
              <p className="reveal">
                Currently pursuing a <b>Master's degree in software development</b> and a second AWS certification — <b>SAA-C03</b>. I'm also following{' '}
                <a href="https://www.infomaniak.com/en/academy" target="_blank" rel="noopener noreferrer">Infomaniak's "Public Cloud — Foundational" training</a>{' '}
                … hoping for many more.
              </p>
            </>
          )}

          <div className="pres-creds">
            <div className="pres-cred reveal">
              <span className="pres-cred-k">{language === 'fr' ? 'Formation' : 'Education'}</span>
              <span className="pres-cred-v">{language === 'fr' ? 'Master · Dev logiciel' : 'Master · Software Dev'}</span>
            </div>
            <div className="pres-cred reveal">
              <span className="pres-cred-k">{language === 'fr' ? 'Certification' : 'Certification'}</span>
              <span className="pres-cred-v">AWS Cloud Practitioner</span>
            </div>
            <div className="pres-cred reveal">
              <span className="pres-cred-k">{language === 'fr' ? 'En cours' : 'In progress'}</span>
              <span className="pres-cred-v">
                AWS Solutions Architect <span className="pres-live" />
              </span>
              <span className="pres-cred-k" style={{ marginTop: 4 }}>+ Infomaniak · Public Cloud</span>
            </div>
          </div>

          <p className="pres-foot reveal">
            {language === 'fr'
              ? <>En alternance chez Agence ROM (Nice) · <b>Disponible dès le 3 juin</b> ✦</>
              : <>Apprenticeship at Agence ROM (Nice) · <b>Available from June 3rd</b> ✦</>
            }
          </p>
        </div>
      </div>
    </section>
  );
};

export default PresentationSection;
