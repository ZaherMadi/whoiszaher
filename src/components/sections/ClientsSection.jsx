import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import PixelCanvas from '../PixelCanvas';
import { CLIENTS } from '../../data/clients';
import './ClientsSection.css';

const byId = (id) => CLIENTS.find((c) => c.id === id);

// 3×3 desktop grid, row-major. The Agence ROM logo anchors the centre.
const GRID = [
  'pure-montagne', 'tradieco',       'pharmaciens-monaco',
  'la-semeuse',    '__rom__',        'carre-sainte-maxime',
  'sainte-rita',   'theatre-grasse', 'theatre-forum',
];

// Logo silhouette / dual-logo / name — shared by desktop + mobile.
function ClientContent({ c }) {
  if (c.useLogo && c.logo) {
    if (c.logoHover) {
      return (
        <span className="px-logo-stack">
          <img src={c.logo} alt={c.name} className="px-logo-rest" loading="lazy" draggable={false} />
          <img src={c.logoHover} alt="" aria-hidden="true" className="px-logo-hover" loading="lazy" draggable={false} />
        </span>
      );
    }
    return (
      <img
        src={c.logo}
        alt={c.name}
        className={`px-logo${c.logoMono ? ' px-logo--mono' : ''}`}
        loading="lazy"
        draggable={false}
      />
    );
  }
  return <span className="px-name">{c.short || c.name}</span>;
}

// ── Mobile: fewer tiles, auto-shimmer + rotation (no hover on touch) ──────────
const MOBILE_SLOTS = 4;

function MobileClients({ isFr }) {
  const [slots, setSlots] = useState(() => CLIENTS.slice(0, MOBILE_SLOTS).map((c) => c.id));
  const [playing, setPlaying] = useState({});
  const slotsRef = useRef(slots);
  slotsRef.current = slots;
  const poolRef = useRef(MOBILE_SLOTS);

  const flash = (id, dur = 1200) => {
    setPlaying((p) => ({ ...p, [id]: true }));
    setTimeout(() => setPlaying((p) => ({ ...p, [id]: false })), dur);
  };

  // Every ~2s: swap one slot for a client not currently shown, and shimmer it.
  useEffect(() => {
    const t = setInterval(() => {
      const cur = slotsRef.current;
      const used = new Set(cur);
      let cand = null;
      for (let k = 0; k < CLIENTS.length; k++) {
        const id = CLIENTS[(poolRef.current + k) % CLIENTS.length].id;
        if (!used.has(id)) { cand = id; poolRef.current = (poolRef.current + k + 1) % CLIENTS.length; break; }
      }
      if (!cand) return;
      const slot = Math.floor(Math.random() * MOBILE_SLOTS);
      const next = [...cur]; next[slot] = cand;
      setSlots(next);
      flash(cand, 1500);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  // Randomly shimmer one of the visible tiles in between swaps.
  useEffect(() => {
    const t = setInterval(() => {
      const cur = slotsRef.current;
      flash(cur[Math.floor(Math.random() * cur.length)], 1000);
    }, 1700);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <div className="clients-grid clients-grid--mobile">
        {slots.map((id, slot) => {
          const c = byId(id);
          const on = !!playing[id];
          return (
            <a
              key={`${slot}-${id}`}
              className={`px-cell px-client px-cell--swap${on ? ' is-active' : ''}`}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ '--brand': c.brand }}
              title={c.name}
              aria-label={c.name}
            >
              <PixelCanvas colors={c.pixelColors} gap={5} speed={30} playing={on} />
              <ClientContent c={c} />
              {c.badge && <span className="px-badge">{c.badge}</span>}
            </a>
          );
        })}
      </div>
      <p className="clients-more">{isFr ? "et bien d'autres …" : 'and many more …'}</p>
    </>
  );
}

export default function ClientsSection() {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 680px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 680px)');
    const on = () => setIsMobile(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  return (
    <section className="clients-section" id="clients">
      <div className="clients-glow" />

      <div className="clients-head">
        <span className="clients-label">{isFr ? 'Références' : 'References'}</span>
        <h2 className="clients-title">
          {isFr
            ? <>Des marques qui me font <span className="clients-serif">confiance</span></>
            : <>Brands that put their <span className="clients-serif">trust</span> in me</>}
        </h2>
        <p className="clients-sub">
          {isFr
            ? <>Sites accompagnés au sein de l'<a href="https://www.rom.fr" target="_blank" rel="noopener noreferrer">Agence ROM</a> — migrations, refontes et maintenance (Joomla pour la plupart).</>
            : <>Sites delivered with <a href="https://www.rom.fr" target="_blank" rel="noopener noreferrer">Agence ROM</a> — migrations, redesigns and maintenance (mostly Joomla).</>}
        </p>
      </div>

      {isMobile ? (
        <MobileClients isFr={isFr} />
      ) : (
        <div className="clients-grid">
          {GRID.map((key) => {
            if (key === '__rom__') {
              return (
                <div className="px-cell px-rom" key="rom">
                  <PixelCanvas colors={['#3FC0D4', '#7C48C4', '#F3F1EC']} gap={6} speed={35} />
                  <a
                    href="https://www.rom.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-rom-link"
                    aria-label="Agence ROM"
                  >
                    <img src="/assets/clients/rom.svg" alt="Agence ROM" className="px-rom-logo" />
                  </a>
                </div>
              );
            }
            const c = byId(key);
            return (
              <a
                className="px-cell px-client"
                key={c.id}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ '--brand': c.brand }}
                title={c.name}
                aria-label={c.name}
              >
                <PixelCanvas colors={c.pixelColors} gap={5} speed={30} />
                <ClientContent c={c} />
                {c.badge && <span className="px-badge">{c.badge}</span>}
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
