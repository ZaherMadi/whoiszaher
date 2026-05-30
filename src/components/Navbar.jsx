import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileOpen(false);

  const NavLinkItem = ({ to, children }) => {
    const isHome = location.pathname === '/';
    if (isHome) {
      return <a href={`#${to}`} className="nav-link" onClick={closeMenu}>{children}</a>;
    }
    return <Link to={`/#${to}`} className="nav-link" onClick={closeMenu}>{children}</Link>;
  };

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      {/* ── Logo (images gardées) ── */}
      <Link to="/" className="logo-brand" onClick={closeMenu}>
        <img src="/assets/WhoIsZaherLogoTransparent.png" alt="WhoIsZaher" className="brand-logo brand-logo-default" />
        <img src="/assets/WhoIsZaherLogo.png" alt="WhoIsZaher" className="brand-logo brand-logo-hover" />
      </Link>

      {/* ── Desktop nav ── */}
      <nav className={`nav-links ${mobileOpen ? 'open' : ''}`}>
        <NavLinkItem to="projects">{t.nav.projects}</NavLinkItem>
        <NavLinkItem to="skills">{t.nav.skills}</NavLinkItem>
        <NavLinkItem to="about">{t.nav.about}</NavLinkItem>
        <NavLinkItem to="contact">{t.nav.contact}</NavLinkItem>
      </nav>

      {/* ── Right: lang + mobile toggle ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="lang-toggle">
          <button className={`lang-btn ${language === 'fr' ? 'on' : ''}`} onClick={() => language !== 'fr' && toggleLanguage()}>FR</button>
          <button className={`lang-btn ${language === 'en' ? 'on' : ''}`} onClick={() => language !== 'en' && toggleLanguage()}>EN</button>
        </div>
        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
