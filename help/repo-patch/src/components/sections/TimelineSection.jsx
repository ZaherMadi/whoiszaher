import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './TimelineSection.css';

// Parcours — horizontal scroll timeline (desktop) / vertical list (mobile).
// Additive section: no dependency beyond framer-motion (already installed).

const U = (id, w = 700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const ITEMS = [
  {
    id: 'bts', side: 'top', img: U('photo-1518770660439-4636190af475'),
    when: { fr: '2020 → 2023', en: '2020 → 2023' },
    title: { fr: 'BTS SNIR', en: 'BTS SNIR' },
    org: { fr: 'Lycée des Eucalyptus — Nice', en: 'Lycée des Eucalyptus — Nice' },
    teaser: { fr: 'Systèmes numériques, option informatique & réseaux.', en: 'Digital systems, IT & networks track.' },
    detail: {
      fr: { title: 'BTS Systèmes numériques — Informatique & Réseaux', body: ["Le socle : réseaux, systèmes, électronique et premiers développements. Une année redoublée, qui m'a appris à travailler autrement plutôt qu'à travailler plus."] },
      en: { title: 'BTS Digital Systems — IT & Networks', body: ['The foundation: networks, systems, electronics and first development work. One repeated year, which taught me to work differently rather than just harder.'] },
    },
  },
  { id: 'jobs', side: 'bot', kind: 'quiet' },
  {
    id: 'b3', side: 'top', img: U('photo-1498050108023-c5249f4df085'), mark: 'YNOV',
    when: { fr: '2023 · Septembre', en: '2023 · September' },
    title: { fr: 'B3 Développement Fullstack', en: 'B3 Fullstack Development' },
    org: { fr: 'Ynov Campus — Nice', en: 'Ynov Campus — Nice' },
    teaser: { fr: "Le passage au développement d'applications complètes.", en: 'The move to building complete applications.' },
    detail: {
      fr: { title: 'Bachelor 3 — Développement Fullstack', org: 'Ynov Campus · Nice', body: ["Année charnière : je passe de l'électronique et du réseau au développement d'applications complètes, et j'entre en alternance."] },
      en: { title: 'Bachelor 3 — Fullstack Development', org: 'Ynov Campus · Nice', body: ['A pivotal year: from electronics and networks to building complete applications — and the start of my apprenticeship.'] },
    },
  },
  {
    id: 'rom', side: 'bot', img: '/assets/clients/forum-homepage.png', markImg: '/assets/clients/rom.svg',
    bubbles: [
      { img: '/assets/clients/pure-montagne-logo.png', label: 'Pure Montagne', href: '#clients' },
      { img: '/assets/clients/carre-logo.png', label: 'Carré', href: '#clients' },
      { img: '/assets/clients/theatre-grasse.svg', label: 'Théâtre de Grasse', href: '#clients' },
    ],
    when: { fr: '2023 → Juin 2026', en: '2023 → June 2026' },
    title: { fr: 'Développeur fullstack · alternance', en: 'Fullstack developer · apprenticeship' },
    org: { fr: 'Agence ROM — Nice', en: 'Agence ROM — Nice' },
    teaser: { fr: 'Sites clients, CMS, support et mise en production.', en: 'Client sites, CMS, support and releases.' },
    detail: {
      fr: { title: 'Développeur fullstack en alternance', org: 'Agence ROM · Nice', body: ["L'endroit où j'ai appris à livrer. Des projets menés de la conception à la mise en production, du support au quotidien sur les sites clients."], tags: ['TypeScript', 'React / React Native', 'WordPress · Joomla', 'Cloudflare', 'DNS · WAF', 'PostgreSQL'] },
      en: { title: 'Fullstack developer (apprenticeship)', org: 'Agence ROM · Nice', body: ['Where I learned to ship. Projects taken from design to production, plus day-to-day support on client sites.'], tags: ['TypeScript', 'React / React Native', 'WordPress · Joomla', 'Cloudflare', 'DNS · WAF', 'PostgreSQL'] },
    },
  },
  {
    id: 'master', side: 'top', img: U('photo-1461749280684-dccba630e2f6'),
    bubbles: [
      { img: '/assets/cani-logo.png', label: 'CAN I HELP YOU', to: '/project/can-i-help-you' },
      { img: '/assets/marina.jpg', label: 'Marina Yacht Wear', to: '/project/marina-yacht' },
    ],
    when: { fr: '2024 · Septembre', en: '2024 · September' },
    title: { fr: 'Mastère · Développement logiciel', en: "Master's · Software development" },
    org: { fr: 'Début du cycle Expert', en: 'Start of the Expert track' },
    teaser: { fr: 'Architecture, qualité, conduite de projet.', en: 'Architecture, quality, project leadership.' },
    detail: {
      fr: { title: 'Mastère Expert en développement logiciel', body: ["Architecture logicielle, qualité de code, gestion de projet et cloud. Deux ans menés en parallèle de l'alternance."], projects: true },
      en: { title: "Master's — Software Development Expert", body: ['Software architecture, code quality, project management and cloud. Two years alongside the apprenticeship.'], projects: true },
    },
  },
  {
    id: 'aws', side: 'bot', img: U('photo-1558494949-ef010cbdcc31'),
    when: { fr: '2025 · Juillet', en: '2025 · July' },
    title: { fr: 'AWS Certified Cloud Practitioner', en: 'AWS Certified Cloud Practitioner' },
    org: { fr: 'Amazon Web Services', en: 'Amazon Web Services' },
    teaser: { fr: 'Première certification cloud.', en: 'First cloud certification.' },
    detail: {
      fr: { title: 'AWS Certified Cloud Practitioner', org: 'Amazon Web Services', body: ['La certification qui a transformé une curiosité en direction de carrière.'] },
      en: { title: 'AWS Certified Cloud Practitioner', org: 'Amazon Web Services', body: ['The certification that turned curiosity into a career direction.'] },
    },
  },
  {
    id: 'imkcert', side: 'top', kind: 'cert', img: U('photo-1451187580459-43490279c0fa'),
    when: { fr: '2026 · Fin juin', en: '2026 · Late June' },
    title: { fr: 'Public Cloud — Foundational', en: 'Public Cloud — Foundational' },
    org: { fr: 'Infomaniak Academy', en: 'Infomaniak Academy' },
    teaser: { fr: 'La certification qui inaugure mon entrée chez Infomaniak.', en: 'The certification that opened my way into Infomaniak.' },
    detail: {
      fr: { title: 'Certification Public Cloud — Foundational', org: 'Infomaniak Academy', body: ["Le cloud européen vu de l'intérieur : infrastructure, souveraineté des données, services managés.", "C'est la certification qui inaugure mon entrée chez Infomaniak — une grande entreprise éthique et innovante."] },
      en: { title: 'Public Cloud — Foundational certification', org: 'Infomaniak Academy', body: ['European cloud from the inside: infrastructure, data sovereignty, managed services.', 'The certification that opened my way into Infomaniak — a large, ethical and innovative company.'] },
    },
  },
  {
    id: 'imk', kind: 'imk', img: U('photo-1544197150-b99a580bb7a8', 900),
    when: { fr: 'Juillet → Octobre 2026', en: 'July → October 2026' },
    whenExact: { fr: '13 juillet → 29 septembre 2026', en: 'July 13 → September 29, 2026' },
    title: { fr: 'Expert support Public Cloud', en: 'Public Cloud support expert' },
    org: { fr: 'Infomaniak', en: 'Infomaniak' },
    teaser: { fr: 'Chaque journée là-bas valait une semaine ailleurs. Formation suivie de bout en bout.', en: 'Every day there was worth a week elsewhere. Training completed end to end.' },
    detail: {
      fr: {
        title: 'Expert support Public Cloud', org: 'Infomaniak · près de trois mois',
        body: [
          "Trois mois qui ont pesé des années. Chaque journée passée chez Infomaniak valait une semaine à l'agence : la densité technique, le niveau d'exigence, le rythme. Excessivement formateur.",
          "J'ai suivi la formation de bout en bout, comme il se doit. Sans quelques erreurs que j'assume pleinement, j'y serais resté bien plus longtemps.",
          "J'en ressors relevé, prêt pour de nouvelles aventures, avec une rage de vaincre encore plus forte.",
        ],
        quote: "Je suis tombé, mais je me relèverai encore plus fort. C'est le mot d'ordre.",
        listTitle: 'Le quotidien',
        list: [
          "Des appels en continu — deux heures par jour en moyenne, jusqu'à quatre, et un client peut arriver à tout moment.",
          'Le reste du temps en tickets : configurations avancées, bugs reproductibles, incidents critiques.',
          'Tous les profils accompagnés, du particulier à la PME, du développeur au pro — en français comme en anglais.',
          'Remontée des signaux terrain aux équipes techniques et produit.',
          "Enrichissement des bases de connaissance et des outils d'IA utilisés en support.",
        ],
        tags: ['Linux', 'Hébergement web', 'DNS', 'E-mails', 'Réseau', 'Cloud souverain', 'Outils IA'],
      },
      en: {
        title: 'Public Cloud support expert', org: 'Infomaniak · nearly three months',
        body: [
          'Three months that weighed like years. Every day at Infomaniak was worth a week at the agency: technical density, standards, pace. Intensely formative.',
          'I completed the training end to end, as it should be. Without a few mistakes I fully own, I would have stayed much longer.',
          "I'm back on my feet, ready for new adventures, with an even stronger will to win.",
        ],
        quote: "I fell, but I'll rise stronger. That's the watchword.",
        listTitle: 'Day to day',
        list: [
          'Calls all day long — two hours a day on average, up to four, and a customer can come in at any moment.',
          'Tickets the rest of the time: advanced configurations, reproducible bugs, critical incidents.',
          'Every kind of customer, from individuals to SMBs, developers to pros — in French and in English.',
          'Field signals escalated to technical and product teams.',
          'Enriching knowledge bases and the AI tools used in support.',
        ],
        tags: ['Linux', 'Web hosting', 'DNS', 'E-mail', 'Networking', 'Sovereign cloud', 'AI tools'],
      },
    },
  },
  {
    id: 'rncp', side: 'bot', img: '/assets/Zaher Oral Jury MYI.jpg', mark: 'YNOV',
    when: { fr: '2026 · Novembre', en: '2026 · November' },
    title: { fr: 'Expert en développement logiciel', en: 'Software Development Expert' },
    org: { fr: 'Titre RNCP niveau 7 (39583) · fin du mastère', en: 'RNCP level 7 title (39583) · end of Master’s' },
    teaser: { fr: 'Résultats la première semaine de novembre.', en: 'Results in the first week of November.' },
    detail: {
      fr: { title: 'Expert en développement logiciel', org: 'Titre RNCP niveau 7 · fiche 39583 · Ynov', body: ["C'est la fin du mastère : le cycle délivre ce titre à son terme, en plus de la validation du bulletin. Résultats attendus la première semaine de novembre 2026."], link: { href: 'https://www.francecompetences.fr/recherche/rncp/39583/', label: 'Voir la fiche RNCP 39583' } },
      en: { title: 'Software Development Expert', org: 'RNCP level 7 · 39583 · Ynov', body: ["The end of the Master's: the programme awards this title on completion, alongside the transcript. Results expected in the first week of November 2026."], link: { href: 'https://www.francecompetences.fr/recherche/rncp/39583/', label: 'View RNCP 39583' } },
    },
  },
];

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

const useIsDesktop = () => {
  const q = '(min-width: 901px)';
  const [ok, setOk] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setOk(m.matches);
    on(); m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return ok;
};

const Bubbles = ({ list, lang }) => (
  <span className="tl-bubs" onClick={e => e.stopPropagation()}>
    {list.map(b => {
      const style = { backgroundImage: `url("${b.img}")` };
      return b.to
        ? <Link key={b.label} to={b.to} className="tl-bub" title={b.label} aria-label={b.label} style={style} />
        : <a key={b.label} href={b.href} className="tl-bub" title={b.label} aria-label={b.label} style={style} />;
    })}
    {list[0]?.href && <a href="#clients" className="tl-bub more" title={lang === 'fr' ? 'Toutes les références' : 'All references'}>+</a>}
  </span>
);

const Card = ({ it, lang, onOpen }) => {
  if (it.kind === 'quiet') {
    return (
      <div className="tl-item bot tl-item--quiet">
        <span className="tl-dot" /><span className="tl-stem" />
        <div className="tl-card tl-card--static">
          <span className="tl-when">{lang === 'fr' ? 'En parallèle · 2020 → 2023' : 'Alongside · 2020 → 2023'}</span>
          <div className="tl-rail"><span /><span /><span /></div>
          <div className="tl-jobs">
            <span className="jb"><img src="https://cdn.simpleicons.org/mcdonalds/a9aaa5" alt="McDonald's" onError={e => { e.currentTarget.style.display = 'none'; }} /><b>McDonald's</b>{lang === 'fr' ? 'début du BTS' : 'start of the BTS'}</span>
            <span className="jb"><img src="https://cdn.simpleicons.org/lidl/a9aaa5" alt="Lidl" onError={e => { e.currentTarget.style.display = 'none'; }} /><b>Lidl</b>{lang === 'fr' ? 'les deux années de BTS' : 'both BTS years'}</span>
          </div>
          <span className="tl-teaser">{lang === 'fr' ? "Études le jour, équipe le soir. C'est là qu'on apprend le rythme." : "Studies by day, team shifts by night. That's where you learn the pace."}</span>
        </div>
      </div>
    );
  }
  const cls = ['tl-item', it.side || '', it.kind === 'imk' ? 'tl-item--imk' : '', it.kind === 'cert' ? 'tl-item--cert' : ''].join(' ');
  return (
    <div className={cls} data-id={it.id}>
      <span className="tl-dot" /><span className="tl-stem" />
      <div className={`tl-card ${it.bubbles ? 'has-bubs' : ''}`} role="button" tabIndex={0}
        onClick={() => onOpen(it)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(it); } }}>
        <span className="tl-thumb">
          {it.kind === 'imk' && <span className="tl-badge">{lang === 'fr' ? 'Le tournant' : 'The turning point'}</span>}
          <img src={it.img} alt="" loading="lazy" onError={e => { e.currentTarget.style.display = 'none'; }} />
          {it.mark && <span className="tl-mark">{it.mark}</span>}
          {it.markImg && <span className="tl-mark tl-mark--img"><img src={it.markImg} alt="" /></span>}
          <span className="tl-more">{it.kind === 'imk' ? (lang === 'fr' ? "Lire l'étape" : 'Read more') : (lang === 'fr' ? 'Détail' : 'Details')} <Arrow /></span>
        </span>
        {it.bubbles && <Bubbles list={it.bubbles} lang={lang} />}
        {it.whenExact
          ? <span className="tl-when tl-swap"><em className="a">{it.when[lang]}</em><em className="b">{it.whenExact[lang]}</em></span>
          : <span className="tl-when">{it.when[lang]}</span>}
        <span className="tl-title">{it.title[lang]}</span>
        <span className="tl-org">{it.org[lang]}</span>
        <span className="tl-teaser">{it.teaser[lang]}</span>
      </div>
    </div>
  );
};

const Sheet = ({ it, lang, onClose }) => {
  useEffect(() => {
    const k = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [onClose]);
  const d = it.detail[lang];
  const red = it.kind === 'imk' || it.kind === 'cert' || it.id === 'end';
  return (
    <motion.div className="tl-sheet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="tl-sheet-bg" onClick={onClose} />
      <motion.aside className="tl-sheet-panel" initial={{ x: '102%' }} animate={{ x: 0 }} exit={{ x: '102%' }} transition={{ duration: .5, ease: [.2, .8, .2, 1] }}>
        <button className="tl-sheet-x" onClick={onClose} aria-label={lang === 'fr' ? 'Fermer' : 'Close'}>✕</button>
        <span className={`ds-when ${red ? 'imk' : ''}`}>{(it.whenExact || it.when)[lang]}</span>
        <h3 className="ds-title">{d.title}</h3>
        {d.org && <p className="ds-org">{d.org}</p>}
        <div className="ds-hr" />
        <div className="ds-body">{d.body.map((p, i) => <p key={i}>{p}</p>)}</div>
        {d.quote && <p className="ds-quote">{d.quote}</p>}
        {d.list && <><div className="ds-h">{d.listTitle}</div><ul className="ds-list">{d.list.map((l, i) => <li key={i}>{l}</li>)}</ul></>}
        {d.projects && (
          <>
            <div className="ds-h">{lang === 'fr' ? 'Projets menés' : 'Projects'}</div>
            <ul className="ds-list">
              <li><Link className="ds-link" to="/project/can-i-help-you" onClick={onClose}>CAN I HELP YOU</Link></li>
              <li><Link className="ds-link" to="/project/marina-yacht" onClick={onClose}>Marina Yacht Inventory</Link></li>
            </ul>
          </>
        )}
        {d.tags && <><div className="ds-h">{lang === 'fr' ? 'Terrain' : 'Stack'}</div><div className="ds-tags">{d.tags.map(t => <span key={t}>{t}</span>)}</div></>}
        {d.link && <a className="ds-link" href={d.link.href} target="_blank" rel="noopener noreferrer">{d.link.label} ↗</a>}
      </motion.aside>
    </motion.div>
  );
};

const END = {
  id: 'end',
  when: { fr: 'Maintenant', en: 'Now' },
  detail: {
    fr: { title: 'Prêt pour de nouvelles aventures', body: ["Six ans, deux métiers, un cap : le cloud. Je cherche l'équipe où l'exigence est la norme — celle que j'ai trouvée chez Infomaniak et que je veux retrouver."], quote: 'Je suis tombé, mais je me relèverai encore plus fort.' },
    en: { title: 'Ready for new adventures', body: ['Six years, two crafts, one direction: cloud. I’m looking for the team where high standards are the norm — the kind I found at Infomaniak.'], quote: "I fell, but I'll rise stronger." },
  },
};

const TimelineSection = () => {
  const { language } = useLanguage();
  const lang = language === 'fr' ? 'fr' : 'en';
  const isDesktop = useIsDesktop();
  const outerRef = useRef(null);
  const trackRef = useRef(null);
  const geo = useRef({ over: 0, imkLeft: 0, redW: 1, vw: 1 });
  const [over, setOver] = useState(0);
  const [open, setOpen] = useState(null);

  useLayoutEffect(() => {
    const track = trackRef.current; if (!track) return;
    const measure = () => {
      const vw = window.innerWidth;
      const o = isDesktop ? Math.max(0, track.scrollWidth - vw + 48) : 0;
      const imk = track.querySelector('.tl-item--imk');
      const imkLeft = imk ? imk.offsetLeft : 0;
      geo.current = { over: o, imkLeft, redW: Math.max(1, track.scrollWidth - imkLeft), vw };
      const red = track.querySelector('.tl-axis--imk');
      if (red) { red.style.left = imkLeft + 'px'; red.style.width = geo.current.redW + 'px'; }
      setOver(o);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [isDesktop, lang]);

  const { scrollYProgress } = useScroll({ target: outerRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, v => -v * geo.current.over);
  const axisScale = useTransform(scrollYProgress, v => Math.min(1, v / 0.9));
  const redScale = useTransform(scrollYProgress, v => {
    const g = geo.current;
    const head = v * g.over + g.vw * 0.62;
    return Math.max(0, Math.min(1, (head - g.imkLeft) / g.redW));
  });

  return (
    <section className="tl-section" id="parcours" ref={outerRef}
      style={isDesktop ? { height: `calc(100vh + ${over}px)` } : undefined}>
      <div className="tl-sticky">
        <div className="tl-head">
          <span className="tl-label">{lang === 'fr' ? 'Parcours' : 'Journey'}</span>
          <h2 className="tl-h">{lang === 'fr' ? <>Six ans, <span className="tl-serif">une seule ligne</span></> : <>Six years, <span className="tl-serif">one line</span></>}</h2>
          <p className="tl-sub">{lang === 'fr' ? 'Du BTS aux datacenters. Clique une étape pour le détail.' : 'From BTS to datacenters. Click a step for details.'}</p>
        </div>

        <motion.div className="tl-track" ref={trackRef} style={isDesktop ? { x } : undefined}>
          <motion.div className="tl-axis" style={isDesktop ? { scaleX: axisScale } : undefined} />
          <motion.div className="tl-axis tl-axis--imk" style={isDesktop ? { scaleX: redScale } : undefined} />

          <div className="tl-lead">
            <img src="/assets/hero-1.jpg" alt="" onError={e => { e.currentTarget.style.display = 'none'; }} />
            <span className="cap">2020 → 2026</span>
          </div>

          {ITEMS.map(it => <Card key={it.id} it={it} lang={lang} onOpen={setOpen} />)}

          <div className="tl-end" role="button" tabIndex={0} onClick={() => setOpen(END)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(END); } }}>
            <span className="k">{lang === 'fr' ? '2026 — la suite' : '2026 — what’s next'}</span>
            <span className="q">{END.detail[lang].quote}</span>
            <span className="n">{lang === 'fr' ? 'Prêt pour de nouvelles aventures — relevé de mes erreurs, avec une rage de vaincre intacte.' : 'Ready for new adventures — back on my feet, with the will to win intact.'}</span>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>{open && <Sheet key={open.id} it={open} lang={lang} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
};

export default TimelineSection;
