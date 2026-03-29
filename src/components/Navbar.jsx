import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileOpen(false);

  const NavLinkItem = ({ to, children }) => {
    const isHome = location.pathname === '/';
    if (isHome) {
      return (
        <a href={`#${to}`} className="nav-link" onClick={closeMenu}>
          {children}
        </a>
      );
    }
    return (
      <Link to={`/#${to}`} className="nav-link" onClick={closeMenu}>
        {children}
      </Link>
    );
  };

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="brand logo-brand" onClick={closeMenu}>
          <img
            src="/assets/WhoIsZaherLogoTransparent.png"
            alt="WhoIsZaher"
            className="brand-logo brand-logo-default"
          />
          <img
            src="/assets/WhoIsZaherLogo.png"
            alt="WhoIsZaher"
            className="brand-logo brand-logo-hover"
          />
        </Link>

        <nav className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          <NavLinkItem to="projects">{t.nav.projects}</NavLinkItem>
          <NavLinkItem to="skills">{t.nav.skills}</NavLinkItem>
          <NavLinkItem to="about">{t.nav.about}</NavLinkItem>
          <NavLinkItem to="contact">{t.nav.contact}</NavLinkItem>

          <button className="lang-toggle nav-link" onClick={toggleLanguage} aria-label="Toggle language">
            <Globe size={18} />
            <span>{language.toUpperCase()}</span>
          </button>
        </nav>

        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
