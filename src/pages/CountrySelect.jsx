import React, { useState } from 'react';
import { useLanguage } from '../game/LanguageContext';
import { fictionalCountries } from '../game/cardData';
import { Globe, Rocket, ChevronLeft } from 'lucide-react';
import StarBackground from '../components/game/StarBackground';

export default function CountrySelect({ onStart, onBack }) {
  const { t, lang } = useLanguage();
  const [customName, setCustomName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [difficulty, setDifficulty] = useState('normal');

  const handleStart = () => {
    const name = customName.trim() || (selectedCountry ? (lang === 'ko' ? selectedCountry.name_ko : selectedCountry.name_en) : '');
    if (!name) return;
    onStart(name, difficulty);
  };

  const countryName = customName.trim() || (selectedCountry ? (lang === 'ko' ? selectedCountry.name_ko : selectedCountry.name_en) : '');

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <StarBackground />
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-8">
        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">{t('backToMenu')}</span>
        </button>

        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur p-6 sm:p-8">
          <div className="text-center mb-6">
            <Globe className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="text-2xl font-heading font-bold">{t('countrySelection')}</h1>
          </div>

          {/* Custom Name */}
          <div className="mb-6">
            <label className="text-sm text-muted-foreground block mb-2">{t('enterCustomName')}</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => { setCustomName(e.target.value); setSelectedCountry(null); }}
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder={lang === 'ko' ? '국가 이름...' : 'Country name...'}
            />
          </div>

          {/* Preset Countries */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">{t('orChooseFrom')}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {fictionalCountries.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCountry(c); setCustomName(''); }}
                  className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                    selectedCountry?.id === c.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-secondary/50 text-foreground hover:border-primary/50'
                  }`}
                >
                  {lang === 'ko' ? c.name_ko : c.name_en}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-8">
            <label className="text-sm text-muted-foreground block mb-3">{t('aiDifficulty')}</label>
            <div className="flex gap-2">
              {['easy', 'normal', 'hard'].map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    difficulty === d
                      ? d === 'easy' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : d === 'normal' ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                        : 'border-red-500 bg-red-500/10 text-red-400'
                      : 'border-border bg-secondary/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t(d)}
                </button>
              ))}
            </div>
          </div>

          {/* Start */}
          <button
            onClick={handleStart}
            disabled={!countryName}
            className={`w-full py-3 rounded-xl font-heading font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
              countryName
                ? 'bg-primary text-primary-foreground hover:bg-primary/80 hover:scale-[1.02]'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <Rocket className="w-5 h-5" />
            {t('startGame')}
          </button>
        </div>
      </div>
    </div>
  );
}