# Patch whoiszaher — Parcours + mises à jour de texte

Base : `ZaherMadi/whoiszaher@main` (lu le 2026-09-22).
**Rien n'est supprimé** : aucune section, aucun composant ni asset. Aucune nouvelle dépendance (framer-motion est déjà installé).

## 1. Fichiers nouveaux / remplacés (à copier tels quels)
- `src/components/sections/TimelineSection.jsx` — **nouveau**
- `src/components/sections/TimelineSection.css` — **nouveau**
- `src/pages/Home.jsx` — une seule ligne d'import en plus + `<TimelineSection />` après `<PresentationSection />`

## 2. Remplacements ciblés (chercher → remplacer)

### src/components/sections/PresentationSection.jsx
**a. Facette Full-Stack (FR)**
- chercher : `je serai bientôt diplômé Expert en conception logicielle. Alors fort heureusement`
- remplacer : `je viens de finir mon mastère, qui délivre le titre Expert en développement logiciel (RNCP niveau 7). Alors fort heureusement`

**b. Facette Full-Stack (EN)**
- chercher : `I'll soon graduate as a Software Design Expert — so, happily`
- remplacer : `I've just completed my Master's, which awards the Software Development Expert title (RNCP level 7) — so, happily`

**c. Bloc des credentials** — remplacer tout le `<div className="pres-creds">…</div>` par :
```jsx
<p className="pres-cert reveal">
  {isFr
    ? <>Je viens de finir mon mastère, qui délivre le titre <b>Expert en développement logiciel</b> — <a href="https://www.francecompetences.fr/recherche/rncp/39583/" target="_blank" rel="noopener noreferrer">RNCP 39583, niveau 7</a>. J'ai validé la certification « Public Cloud — Foundational » d'Infomaniak, et je songe à passer la <b>Solutions Architect</b> d'AWS.</>
    : <>I've just completed my Master's, which awards the <b>Software Development Expert</b> title — <a href="https://www.francecompetences.fr/recherche/rncp/39583/" target="_blank" rel="noopener noreferrer">RNCP 39583, level 7</a>. I've earned Infomaniak's “Public Cloud — Foundational” certification, and I'm considering AWS <b>Solutions Architect</b> next.</>}
</p>
<div className="pres-creds">
  <div className="pres-cred reveal">
    <span className="pres-cred-k">{isFr ? 'Diplôme' : 'Degree'}</span>
    <span className="pres-cred-v">{isFr ? 'Expert en dév. logiciel' : 'Software Dev. Expert'}</span>
  </div>
  <div className="pres-cred reveal">
    <span className="pres-cred-k">{isFr ? 'Certifications' : 'Certifications'}</span>
    <span className="pres-cred-v">AWS Cloud Practitioner</span>
    <span className="pres-cred-k" style={{ marginTop: 4 }}>+ Infomaniak · Public Cloud</span>
  </div>
  <div className="pres-cred reveal">
    <span className="pres-cred-k">{isFr ? 'À venir' : 'Up next'}</span>
    <span className="pres-cred-v">AWS Solutions Architect <span className="pres-live" /></span>
  </div>
</div>
```

**d. Ligne du bas**
- chercher : `<>En alternance chez Agence ROM (Nice) · <b>Disponible dès le 3 juin</b> ✦</>`
- remplacer : `<>Passé par l'Agence ROM (Nice) puis Infomaniak · Public Cloud · <b>Disponible dès le 1er octobre</b> ✦</>`
- chercher : `<>Apprenticeship at Agence ROM (Nice) · <b>Available from June 3rd</b> ✦</>`
- remplacer : `<>Agence ROM (Nice), then Infomaniak · Public Cloud · <b>Available from October 1st</b> ✦</>`

### src/components/sections/PresentationSection.css — ajouter à la fin
```css
.pres-cert { margin-top: 36px; font-size: clamp(.98rem,1.3vw,1.1rem) !important; }
```

### src/components/sections/ContactSection.jsx
- `disponible dès le 3 juin` → `disponible dès le 1er octobre`
- `available from June 3rd` → `available from October 1st`

### src/components/sections/HeroSection.jsx (sur-titre)
- chercher : `{language === 'fr' ? 'Support Client / Full-Stack · cloud' : 'Client Support / Full-Stack · cloud'}`
- remplacer : `{language === 'fr' ? 'Expert support Public Cloud · Infomaniak' : 'Public Cloud support expert · Infomaniak'}`

### src/components/Footer.jsx (en bas à droite — « Zaher Madi » est conservé)
- chercher : `<span>Zaher Madi</span>`
- remplacer : `<span>Zaher Madi · {language === 'fr' ? 'Dispo à Nice et Genève !' : 'Available in Nice & Geneva!'}</span>`

### Navbar + footer — lien « Parcours » (ajout)
`src/data/portfolio_fr.json` → dans `"nav"` ajouter `"timeline": "Parcours",`
`src/data/portfolio_en.json` → dans `"nav"` ajouter `"timeline": "Journey",`

`src/components/Navbar.jsx` — avant le lien `projects`, ajouter :
```jsx
<NavLinkItem to="parcours" isHome={isHome} onSelect={closeMenu}>{t.nav.timeline}</NavLinkItem>
```
`src/components/Footer.jsx` — dans `.footer-nav`, avant `#projects`, ajouter :
```jsx
<a href="#parcours">{language === 'fr' ? 'Parcours' : 'Journey'}</a>
```

## 3. Non modifié volontairement (à me confirmer si tu veux changer)
- `portfolio_*.json` → `skills.awsDetails` dit encore « Solutions Architect (En cours) »
- `portfolio_*.json` → `hero.subtitle` / `hero.description` (« Actuellement en alternance chez Agence ROM »)
- Numérotation des sections (02 Projets … 05 Contact) : le Parcours n'a pas de numéro pour ne pas décaler les autres.

## 4. Vérif avant push
```
npm run build && npm run preview
```
Desktop : le Parcours défile horizontalement (sticky + framer-motion, sans GSAP). Mobile (< 900 px) : liste verticale.
