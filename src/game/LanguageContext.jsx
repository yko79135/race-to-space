import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('rts_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('rts_language', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] || translations.en?.[key] || key;
  };

  const cardText = (card, field) => {
    const langField = `${field}_${lang}`;
    const enField = `${field}_en`;
    return card[langField] || card[enField] || '';
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'ko' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, cardText, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}