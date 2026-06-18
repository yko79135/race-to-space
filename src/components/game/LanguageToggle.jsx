import React from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/80 border border-border hover:bg-secondary transition-colors flex-shrink-0"
    >
      <Globe className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium text-foreground">
        {lang === 'en' ? '한국어' : 'English'}
      </span>
    </button>
  );
}