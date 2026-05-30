import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import './FeaturedProjects.css';

const PARAMS = {
  maxVisible:7, overlap:0.48, spreadDeg:48, depthPx:140,
  tiltXDeg:12, activeLift:22, activeScale:1.03, inactiveScale:0.94,
  loop:true, autoAdvance:true, intervalMs:3400,
};

const PROJECTS = [
  { id:'can-i-help-you', title:'CAN I HELP YOU', sub:"App mobile d'entraide en temps réel · solo", subEn:'Real-time mutual aid mobile app · solo', link:'/project/can-i-help-you', img:'/assets/cani-appstore.png' },
  { id:'marina-yacht', title:'Marina Yacht Inventory', sub:"Gestion d'inventaire · lead & mentor", subEn:'Inventory management · lead & mentor', link:'/project/marina-yacht', img:'/assets/image (1).png' },
  { id:'soon-1', title:'Bientôt', titleEn:'Coming soon', sub:'Un nouveau projet en préparation', subEn:'A new project in the works', link:'#', img:'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80' },
  { id:'soon-2', title:'Bientôt', titleEn:'Coming soon', sub:'Un nouveau projet en préparation', subEn:'A new project in the works', link:'#', img:'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80' },
  { id:'soon-3', title:'Bientôt', titleEn:'Coming soon', sub:'Un nouveau projet en préparation', subEn:'A new project in the works', link:'#', img:'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80' },
];

export default function FeaturedProjects() {
  const { language } = useLanguage();
  const [active, setActive] = useState(0);
  const [userTouched, setUserTouched] = useState(false);
  const autoRef = useRef(null);
  const stageRef = useRef(null);
  const downRef = useRef(null);
  const N = PROJECTS.length;
  const maxOffset = Math.max(0, Math.floor(PARAMS.maxVisible / 2));
  const stepDeg = maxOffset > 0 ? PARAMS.spreadDeg / maxOffset : 0;

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
      if (downRef.current.moved && Math.abs(dx) > 55) { setUserTouched(true); stopAuto(); setActive(a => wrap(dx < 0 ? a + 1 : a - 1)); }
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
        <span className="fan-label">02 — {language === 'fr' ? 'Projets' : 'Projects'}</span>
        <h2 className="fan-title">{language === 'fr' ? <>Naviguer <span className="fan-serif">parmi</span> mes projets</> : <>Browse <span className="fan-serif">through</span> my projects</>}</h2>
      </div>
      <div className="fan-stage-area">
        <button className="fan-navbtn" aria-label="Précédent" onClick={() => { setUserTouched(true); stopAuto(); setActive(a => wrap(a-1)); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="fan-stage" ref={stageRef} tabIndex={0} onMouseEnter={stopAuto} onMouseLeave={() => { if(!userTouched) startAuto(); }}>
          <div className="fan-wash fan-wash-top"/><div className="fan-wash fan-wash-bot"/>
          {PROJECTS.map((p, i) => (
            <article key={p.id} className={`fan-card ${signedOffset(i)===0?'active':''}`} style={getCardStyle(i)}
              onPointerDown={e => { if(signedOffset(i)!==0) return; downRef.current={x:e.clientX,moved:false}; }}
              onClick={() => { if(signedOffset(i)!==0){setUserTouched(true);stopAuto();setActive(i);} }}>
              <div className="fan-card-face" style={getFaceStyle(i)}>
                <img className="fan-img" src={p.img} alt={p.title} draggable={false} onError={e=>{e.currentTarget.style.opacity='0';}}/>
                <div className="fan-veil"/><div className="fan-frost" style={{opacity:signedOffset(i)!==0?1:0}}/>
                <div className="fan-body">
                  <h3 className="fan-proj-title">{language==='en'&&p.titleEn?p.titleEn:p.title}</h3>
                  <p className="fan-proj-sub">{language==='en'?p.subEn:p.sub}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <button className="fan-navbtn" aria-label="Suivant" onClick={() => { setUserTouched(true); stopAuto(); setActive(a => wrap(a+1)); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      <div className="fan-controls">
        <div className="fan-dots">
          {PROJECTS.map((p,i) => <button key={p.id} className={`fan-dot ${i===active?'on':''}`} aria-label={`Projet ${i+1}`} onClick={() => {setUserTouched(true);stopAuto();setActive(i);}}/>)}
          {PROJECTS[active].link!=='#' && (
            <Link to={PROJECTS[active].link} className="fan-ext" aria-label="Ouvrir">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
            </Link>
          )}
        </div>
        <div className="fan-hint">
          <span>{language==='fr'?'Glisse ↔ pour naviguer':'Swipe ↔ to browse'}</span><span>·</span>
          <span><kbd>←</kbd> <kbd>→</kbd></span><span>·</span>
          <span>{language==='fr'?'Clique une carte':'Click a card'}</span>
        </div>
      </div>
    </section>
  );
}
