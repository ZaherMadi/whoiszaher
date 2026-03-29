import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../data/portfolio_en.json';
import fr from '../data/portfolio_fr.json';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Try to get saved language or use French by default
    return localStorage.getItem('language') || 'fr';
  });

  const [t, setT] = useState(language === 'fr' ? fr : en);

  useEffect(() => {
    localStorage.setItem('language', language);
    setT(language === 'fr' ? fr : en);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'fr' ? 'en' : 'fr'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
