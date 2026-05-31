import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { CLIENTS } from '../../data/clients';
import LiquidButton from '../LiquidButton';
import './FeaturedProjects.css';

const PARAMS = {
  maxVisible:7, overlap:0.48, spreadDeg:48, depthPx:140,
  tiltXDeg:12, activeLift:22, activeScale:1.03, inactiveScale:0.94,
  loop:true, autoAdvance:true, intervalMs:3400,
};

const MARINA_CYCLE = [
  '/assets/MYI Onboarding.png',
  '/assets/MYI Oboarding P2.png',
  '/assets/MYI Screen Notifications .jpeg',
];
const MARINA_VIDEO = '/assets/Teaser marina.mp4';

// Personal, end-to-end projects (each has its own case-study page).
const PERSONAL_PROJECTS = [
  { id:'can-i-help-you', title:'CAN I HELP YOU', sub:"App mobile d'entraide en temps réel · solo", subEn:'Real-time mutual aid mobile app · solo', link:'/project/can-i-help-you', img:'/assets/cani-appstore.png' },
  { id:'marina-yacht', title:'Marina Yacht Inventory', sub:"Gestion d'inventaire · lead & mentor", subEn:'Inventory management · lead & mentor', link:'/project/marina-yacht', img: MARINA_CYCLE[0], cycle: MARINA_CYCLE, video: MARINA_VIDEO },
];

// Real client work delivered at Agence ROM — no dedicated page, a popup
// summarises the site on click.
const CLIENT_PROJECTS = CLIENTS.map((c) => ({
  id: c.id, kind: 'client', title: c.name, titleEn: c.name,
  sub: c.tagFr, subEn: c.tagEn, link: '#',
  brand: c.brand, url: c.url, badge: c.badge,
  descFr: c.descFr, descEn: c.descEn, address: c.address,
}));

const PROJECTS = [...PERSONAL_PROJECTS, ...CLIENT_PROJECTS];

const CYCLE_INTERVAL_MS = 1800;

const ProjectMedia = ({ project, isActive }) => {
  const [hovered, setHovered] = useState(false);
  const [cycleIdx, setCycleIdx] = useState(0);
  const videoRef = useRef(null);
  const cycle = project.cycle;
  const video = project.video;

  // Cycle through static images when not hovered (only on active card)
  useEffect(() => {
    if (!cycle || !isActive || hovered) return;
    const t = setInterval(() => setCycleIdx(i => (i + 1) % cycle.length), CYCLE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [cycle, isActive, hovered]);

  // Reset cycle index when leaving active
  useEffect(() => {
    if (!isActive) setCycleIdx(0);
  }, [isActive]);

  // Play/pause video on hover (active only)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hovered && isActive) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [hovered, isActive]);

  // Client cards: brand-tinted cover with the company name as the hero.
  if (project.kind === 'client') {
    return (
      <div className="fan-img fan-brandcover" style={{ '--bc': project.brand }}>
        {project.badge && <span className="fan-cover-badge">{project.badge}</span>}
        <span className="fan-cover-mark">{project.title}</span>
      </div>
    );
  }

  if (!cycle && !video) {
    return (
      <img
        className="fan-img"
        src={project.img}
        alt={project.title}
        draggable={false}
        onError={e => { e.currentTarget.style.opacity = '0'; }}
      />
    );
  }

  return (
    <div
      className="fan-media"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {cycle?.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={project.title}
          draggable={false}
          className={`fan-img fan-img-layer ${i === cycleIdx ? 'on' : ''}`}
          onError={e => { e.currentTarget.style.opacity = '0'; }}
        />
      ))}
      {video && (
        <video
          ref={videoRef}
          src={video}
          className={`fan-img fan-img-layer fan-video-layer ${hovered && isActive ? 'on' : ''}`}
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}
    </div>
  );
};

/* ─── Client popup ─────────────────────────────────────────────────── */
const ClientModal = ({ project, isFr, onClose }) => {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <div className="cmodal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cmodal" style={{ '--bc': project.brand }} onClick={e => e.stopPropagation()}>
        <button className="cmodal-close" onClick={onClose} aria-label={isFr ? 'Fermer' : 'Close'}>
          <X size={20} />
        </button>
        <span className="cmodal-tag">{isFr ? project.sub : project.subEn}</span>
        <h3 className="cmodal-title">{project.title}</h3>
        <p className="cmodal-desc">{isFr ? project.descFr : project.descEn}</p>
        {project.address && <p className="cmodal-addr">{project.address}</p>}
        <LiquidButton as="a" className="cmodal-liquid" href={project.url} target="_blank" rel="noopener noreferrer">
          {isFr ? 'Visiter le site' : 'Visit the site'}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>
        </LiquidButton>
      </div>
    </div>
  );
};

export default function FeaturedProjects() {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const [active, setActive] = useState(0);
  const [userTouched, setUserTouched] = useState(false);
  const [modal, setModal] = useState(null);
  const navigate = useNavigate();
  const autoRef = useRef(null);
  const stageRef = useRef(null);
  const downRef = useRef(null);
  const draggedRef = useRef(false);
  const N = PROJECTS.length;
  const maxOffset = Math.max(0, Math.floor(PARAMS.maxVisible / 2));
  const stepDeg = maxOffset > 0 ? PARAMS.spreadDeg / maxOffset : 0;

  const openModal = useCallback(p => setModal(p), []);
  const closeModal = useCallback(() => setModal(null), []);

  const wrap = useCallback(n => ((n % N) + N) % N, [N]);
  const signedOffset = useCallback(i => {
    const raw = i - active;
    if (!PARAMS.loop || N <= 1) return raw;
    const alt = raw > 0 ? raw - N : raw + N;
    return Math.abs(alt) < Math.abs(raw) ? alt : raw;
  }, [active, N]);

  const stopAuto = useCallback(() => { if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; } }, []);
  const startAuto = useCallback(() => {
    if (!PARAMS.autoAdvance || autoRef.current || userTouched) return;
    autoRef.current = setInterval(() => { if (!userTouched) setActive(a => wrap(a + 1)); }, PARAMS.intervalMs);
  }, [userTouched, wrap]);

  useEffect(() => { startAuto(); return stopAuto; }, [startAuto, stopAuto]);

  // Pause auto-advance while the popup is open.
  useEffect(() => { if (modal) stopAuto(); }, [modal, stopAuto]);

  useEffect(() => {
    const stage = stageRef.current; if (!stage) return;
    const onKey = e => {
      if (e.key === 'ArrowRight') { setUserTouched(true); stopAuto(); setActive(a => wrap(a + 1)); }
      if (e.key === 'ArrowLeft')  { setUserTouched(true); stopAuto(); setActive(a => wrap(a - 1)); }
    };
    stage.addEventListener('keydown', onKey);
    return () => stage.removeEventListener('keydown', onKey);
  }, [stopAuto, wrap]);

  useEffect(() => {
    const onUp = e => {
      if (!downRef.current) return;
      const dx = e.clientX - downRef.current.x;
      const swiped = downRef.current.moved && Math.abs(dx) > 40;
      draggedRef.current = swiped;
      if (swiped) { setUserTouched(true); stopAuto(); setActive(a => wrap(dx < 0 ? a + 1 : a - 1)); }
      downRef.current = null;
    };
    const onMove = e => { if (downRef.current && Math.abs(e.clientX - downRef.current.x) > 8) downRef.current.moved = true; };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
  }, [stopAuto, wrap]);

  const getCardStyle = i => {
    const off = signedOffset(i), abs = Math.abs(off), isA = off === 0;
    if (abs > maxOffset) return { opacity:0, pointerEvents:'none' };
    const spacing = Math.max(10, Math.round(470 * (1 - PARAMS.overlap)));
    const x = off * spacing, y = abs * 10, rotZ = off * stepDeg, rotX = isA ? 0 : PARAMS.tiltXDeg;
    const scale = isA ? PARAMS.activeScale : PARAMS.inactiveScale, lift = isA ? -PARAMS.activeLift : 0;
    return { transform:`translateX(calc(-50% + ${x}px)) translateY(${y+lift}px) rotateZ(${rotZ}deg) rotateX(${rotX}deg) scale(${scale})`, zIndex:100-abs, opacity:1, pointerEvents:'auto' };
  };
  const getFaceStyle = i => {
    const off = signedOffset(i), abs = Math.abs(off), isA = off === 0;
    return { transform:`translateZ(${-abs*PARAMS.depthPx}px)`, filter:isA?'none':'brightness(.72)' };
  };

  return (
    <section className="fan-section" id="projects">
      <div className="fan-glow fan-glow-a" /><div className="fan-glow fan-glow-b" />
      <div className="fan-head">
        <span className="fan-label">02 — {isFr ? 'Projets' : 'Projects'}</span>
        <h2 className="fan-title">{isFr ? <>Naviguer <span className="fan-serif">parmi</span> mes projets</> : <>Browse <span className="fan-serif">through</span> my projects</>}</h2>
      </div>
      <div className="fan-stage-area">
        <button className="fan-navbtn" aria-label="Précédent" onClick={() => { setUserTouched(true); stopAuto(); setActive(a => wrap(a-1)); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="fan-stage" ref={stageRef} tabIndex={0} onMouseEnter={stopAuto} onMouseLeave={() => { if(!userTouched) startAuto(); }}>
          <div className="fan-wash fan-wash-top"/><div className="fan-wash fan-wash-bot"/>
          {PROJECTS.map((p, i) => {
            const isA = signedOffset(i) === 0;
            return (
            <article key={p.id} className={`fan-card ${isA?'active':''}`} style={getCardStyle(i)}
              onPointerDown={e => { downRef.current={x:e.clientX,moved:false}; draggedRef.current=false; }}
              onClick={() => {
                if (draggedRef.current) { draggedRef.current = false; return; }
                if (!isA) { setUserTouched(true); stopAuto(); setActive(i); return; }
                if (p.kind === 'client') openModal(p);
                else if (p.link && p.link !== '#') navigate(p.link);
              }}>
              <div className="fan-card-face" style={getFaceStyle(i)}>
                <ProjectMedia project={p} isActive={isA} />
                <div className="fan-veil"/><div className="fan-frost" style={{opacity:!isA?1:0}}/>
                <div className="fan-body">
                  {p.kind === 'client' ? (
                    <>
                      <p className="fan-proj-sub">{isFr?p.sub:p.subEn}</p>
                      {isA && (
                        <button className="fan-open" onClick={e => { e.stopPropagation(); openModal(p); }}>
                          {isFr ? 'Découvrir le projet' : 'Discover the project'}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <h3 className="fan-proj-title">{language==='en'&&p.titleEn?p.titleEn:p.title}</h3>
                      <p className="fan-proj-sub">{isFr?p.sub:p.subEn}</p>
                    </>
                  )}
                </div>
              </div>
            </article>
          );})}
        </div>
        <button className="fan-navbtn" aria-label="Suivant" onClick={() => { setUserTouched(true); stopAuto(); setActive(a => wrap(a+1)); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      <div className="fan-controls">
        <div className="fan-dots">
          {PROJECTS.map((p,i) => <button key={p.id} className={`fan-dot ${i===active?'on':''}`} aria-label={`Projet ${i+1}`} onClick={() => {setUserTouched(true);stopAuto();setActive(i);}}/>)}
          {PROJECTS[active].link!=='#' ? (
            <Link to={PROJECTS[active].link} className="fan-ext" aria-label="Ouvrir">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
            </Link>
          ) : PROJECTS[active].kind==='client' ? (
            <button className="fan-ext" aria-label={isFr?'Découvrir':'Discover'} onClick={() => openModal(PROJECTS[active])}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16v-4M12 8h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z"/></svg>
            </button>
          ) : null}
        </div>
        <div className="fan-hint">
          <span>{isFr?'Glisse ↔ pour naviguer':'Swipe ↔ to browse'}</span><span>·</span>
          <span><kbd>←</kbd> <kbd>→</kbd></span><span>·</span>
          <span>{isFr?'Clique une carte':'Click a card'}</span>
        </div>
      </div>

      {modal && <ClientModal project={modal} isFr={isFr} onClose={closeModal} />}
    </section>
  );
}
