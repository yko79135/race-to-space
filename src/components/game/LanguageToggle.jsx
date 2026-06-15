import React from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/80 backdrop-blur border border-border hover:bg-secondary transition-colors"
    >
      <Globe className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium text-foreground">
        {lang === 'en' ? '한국어' : 'English'}
      </span>
    </button>
  );
}