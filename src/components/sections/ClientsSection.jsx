import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import PixelCanvas from '../PixelCanvas';
import { CLIENTS } from '../../data/clients';
import './ClientsSection.css';

const byId = (id) => CLIENTS.find((c) => c.id === id);

// 3×4 grid keys, row-major. The Agence ROM logo anchors the centre,
// clients fill the ring around it, "et plus encore" fills the rest.
const GRID = [
  'pure-montagne',      'tradieco',     'pharmaciens-monaco',
  'la-semeuse',         '__rom__',      'carre-sainte-maxime',
  'sainte-rita',        '__more__',     '__more__',
];

export default function ClientsSection() {
  const { language } = useLanguage();
  const isFr = language === 'fr';

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

      <div className="clients-grid">
        {GRID.map((key, i) => {
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

          if (key === '__more__') {
            return (
              <div className="px-cell px-more" key={`more-${i}`}>
                <span>{isFr ? 'et plus encore' : 'and more'}</span>
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
            >
              <PixelCanvas colors={c.pixelColors} gap={5} speed={30} />
              <span className="px-name">{c.short || c.name}</span>
              {c.badge && <span className="px-badge">{isFr ? c.badge : c.badge}</span>}
            </a>
          );
        })}
      </div>
    </section>
  );
}
