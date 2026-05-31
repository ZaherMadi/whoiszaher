import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './PresentationSection.css';

// Two facets, switchable via the toggle. "Support Client" is the default.
const FACETS = {
  support: {
    fr: [
      `Support technique : « Bonjour, j'ai oublié mon mot de passe. » Vous vous attendiez à ça ? Non, vous rêvez. Ce n'est pas de ça que je parle quand j'évoque le support (même s'il m'est déjà arrivé d'enquêter sur un "espace" tapé par erreur dans un mot de passe !). Je parle de problèmes bien plus profonds. Au cours de mon alternance, j'ai été quotidiennement confronté à des situations critiques. Ma mission ? Déceler les erreurs au plus vite pour les corriger moi-même, ou préparer le terrain de manière clinique avant d'impliquer les développeurs seniors.`,
      `Exemple classique : « Le site est down ». Mon plan d'action : j'inspecte immédiatement notre hébergeur (coucou Infomaniak) pour vérifier les alertes globales. Je regarde si le stockage du serveur est saturé. Je fouille dans les logs. J'analyse le WAF, les zones DNS, les règles Cloudflare... Dans un temps imparti, je pose le diagnostic. Si c'est dans mes cordes, je règle le problème pour protéger la bande passante de l'équipe. Sinon, je transmets un dossier complet, tout en gardant une oreille attentive sur le dénouement pour apprendre et être encore plus efficace la fois suivante.`,
      `Mais le support, ce n'est pas que de la gestion de crise. J'ai aussi eu la responsabilité de newsletters envoyées à des milliers de lecteurs pour de gros clients. Chaque mail était inspecté, testé et re-testé. J'ai parfois essuyé quelques casseroles (toujours plus de peur que de mal !), mais c'est là que j'ai compris une chose fondamentale : ce qui fait peur, ce n'est pas la panne. C'est l'inconnu. Une fois qu'on accepte que les bugs font partie du jeu, on n'est plus jamais brusqué. On reste solide sur ses appuis, et à chaque nouvel incident, notre temps de réaction diminue. Pour moi, le support, c'est ça : c'est marcher pour que le reste de l'équipe puisse courir.`,
    ],
    en: [
      `Technical support: "Hi, I forgot my password." Is that what you expected? No — keep dreaming. That's not what I mean when I talk about support (even if I once did investigate a stray "space" typed by mistake into a password!). I'm talking about far deeper problems. During my apprenticeship I faced critical situations every day. My mission? Spot the errors as fast as possible to fix them myself, or clinically prepare the ground before bringing in the senior developers.`,
      `Classic example: "the site is down." My action plan: I immediately check our host (hi Infomaniak) for global alerts. I check whether the server storage is full. I dig through the logs. I analyse the WAF, the DNS zones, the Cloudflare rules... Within a set time, I make the diagnosis. If it's within my reach, I fix it to protect the team's bandwidth. Otherwise I hand over a complete report, while keeping an ear on the outcome to learn and be even more effective next time.`,
      `But support isn't only crisis management. I was also responsible for newsletters sent to thousands of readers for big clients. Every email was inspected, tested and re-tested. I took a few knocks along the way (always more fear than harm!), but that's where I understood something fundamental: what's scary isn't the outage. It's the unknown. Once you accept that bugs are part of the game, you're never thrown off again. You stay steady on your feet, and with every new incident your reaction time shrinks. To me, that's what support is: walking so the rest of the team can run.`,
    ],
  },
  fullstack: {
    fr: [
      `Loin de moi l'idée de me prendre pour un couteau suisse, mais il est vrai que j'ai une double casquette. En effet, je serai bientôt diplômé Expert en conception logicielle. Alors fort heureusement, développer est dans mes cordes ! J'ai à cœur de m'investir dans des projets toujours plus passionnants les uns que les autres, que ce soit pour développer de A à Z, conseiller, ou donner un coup de pouce. Je serai toujours de près ou de loin derrière un clavier, à tester des solutions ou de nouvelles idées. C'est d'ailleurs ainsi que mes premières applications sont nées : cette même flamme m'a poussé à développer des projets qui me tenaient à cœur et qui répondaient à de vrais besoins.`,
    ],
    en: [
      `Far be it from me to call myself a Swiss Army knife, but I do wear two hats. Indeed, I'll soon graduate as a Software Design Expert — so, happily, building things is well within my reach! I love getting involved in ever more exciting projects, whether to develop from A to Z, to advise, or to lend a hand. I'll always be behind a keyboard one way or another, testing solutions or new ideas. That's exactly how my first apps were born: that same spark pushed me to build projects I cared about, answering real needs.`,
    ],
  },
};

const PresentationSection = () => {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const sectionRef = useRef(null);
  const [facet, setFacet] = useState('support');

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const paras = FACETS[facet][isFr ? 'fr' : 'en'];

  return (
    <section className="pres-section" id="intro" ref={sectionRef}>
      <div className="pres-inner">
        {/* Left col */}
        <div>
          <div className="pres-label reveal">
            {isFr ? 'Qui suis-je' : 'About me'}
          </div>
          <h2 className="pres-h reveal">
            {isFr
              ? <>Curieux,<br />cloud-addict,<br />et jamais rassasié.</>
              : <>Curious,<br />cloud-addicted,<br />never satisfied.</>
            }
          </h2>
        </div>

        {/* Right col */}
        <div className="pres-body">
          {/* Facet toggle — Support Client (default) / Full-Stack */}
          <div className="pres-tabs reveal" role="tablist" aria-label={isFr ? 'Profil' : 'Profile'}>
            <button
              role="tab"
              aria-selected={facet === 'support'}
              className={`pres-tab ${facet === 'support' ? 'on' : ''}`}
              onClick={() => setFacet('support')}
            >
              {isFr ? 'Support Client' : 'Client Support'}
            </button>
            <button
              role="tab"
              aria-selected={facet === 'fullstack'}
              className={`pres-tab ${facet === 'fullstack' ? 'on' : ''}`}
              onClick={() => setFacet('fullstack')}
            >
              Full-Stack
            </button>
          </div>

          <div className="pres-facet" key={facet}>
            {paras.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="pres-creds">
            <div className="pres-cred reveal">
              <span className="pres-cred-k">{isFr ? 'Formation' : 'Education'}</span>
              <span className="pres-cred-v">{isFr ? 'Master · Dev logiciel' : 'Master · Software Dev'}</span>
            </div>
            <div className="pres-cred reveal">
              <span className="pres-cred-k">{isFr ? 'Certification' : 'Certification'}</span>
              <span className="pres-cred-v">AWS Cloud Practitioner</span>
            </div>
            <div className="pres-cred reveal">
              <span className="pres-cred-k">{isFr ? 'En cours' : 'In progress'}</span>
              <span className="pres-cred-v">
                AWS Solutions Architect <span className="pres-live" />
              </span>
              <span className="pres-cred-k" style={{ marginTop: 4 }}>+ Infomaniak · Public Cloud</span>
            </div>
          </div>

          <p className="pres-foot reveal">
            {isFr
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
