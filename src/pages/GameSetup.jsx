import React, { useState } from 'react';
import { useLanguage } from '../game/LanguageContext';
import { COUNTRY_COLORS, COUNTRY_EMBLEMS } from '../game/gameData';
import StarBackground from '../components/game/StarBackground';
import LanguageToggle from '../components/game/LanguageToggle';
import { Rocket, Plus, Minus, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GameSetup({ onStart, onBack }) {
  const { t } = useLanguage();
  const [numPlayers, setNumPlayers] = useState(2);
  const [players, setPlayers] = useState([
    { name: '', colorId: 'blue', emblem: '🌟' },
    { name: '', colorId: 'red', emblem: '🦅' },
    { name: '', colorId: 'green', emblem: '🌺' },
    { name: '', colorId: 'yellow', emblem: '🏔️' },
  ]);

  const updatePlayer = (index, field, value) => {
    setPlayers(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  const handleStart = () => {
    const activePlayers = players.slice(0, numPlayers).map((p, i) => ({
      ...p,
      name: p.name.trim() || `${t('player')} ${i + 1}`,
    }));
    onStart(activePlayers);
  };

  return (
    <div className="min-h-screen relative overflow-auto">
      <StarBackground />
      <LanguageToggle />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-secondary/60 hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <Rocket className="w-7 h-7 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-heading font-bold">{t('setupTitle')}</h1>
          </div>
        </div>

        {/* Number of Players */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border-2 border-border rounded-2xl p-5 mb-5"
        >
          <h2 className="text-lg font-bold mb-4">{t('numPlayers')}</h2>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setNumPlayers(n => Math.max(2, n - 1))}
              className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-5xl font-heading font-bold text-primary">{numPlayers}</span>
            <button
              onClick={() => setNumPlayers(n => Math.min(4, n + 1))}
              className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">2 – 4 {t('player')}s</p>
        </motion.div>

        {/* Player Setup */}
        <div className="space-y-4 mb-8">
          {Array.from({ length: numPlayers }).map((_, index) => {
            const player = players[index];
            const color = COUNTRY_COLORS.find(c => c.id === player.colorId) || COUNTRY_COLORS[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border-2 rounded-2xl p-5"
                style={{ borderColor: color.value }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold"
                    style={{ backgroundColor: color.value + '30', border: `2px solid ${color.value}` }}
                  >
                    {player.emblem}
                  </div>
                  <h3 className="text-base font-bold" style={{ color: color.value }}>
                    {t('player')} {index + 1}
                  </h3>
                </div>

                {/* Name */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-muted-foreground block mb-1.5">{t('playerName')}</label>
                  <input
                    type="text"
                    value={player.name}
                    onChange={e => updatePlayer(index, 'name', e.target.value)}
                    placeholder={t('enterName')}
                    maxLength={20}
                    className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 text-base font-medium focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Color */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-muted-foreground block mb-2">{t('countryColor')}</label>
                  <div className="flex gap-2 flex-wrap">
                    {COUNTRY_COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => updatePlayer(index, 'colorId', c.id)}
                        className={`w-9 h-9 rounded-full border-4 transition-transform hover:scale-110 ${player.colorId === c.id ? 'border-white scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c.value }}
                        title={c.label_en}
                      />
                    ))}
                  </div>
                </div>

                {/* Emblem */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">{t('countryEmblem')}</label>
                  <div className="flex gap-2 flex-wrap">
                    {COUNTRY_EMBLEMS.map(emb => (
                      <button
                        key={emb}
                        onClick={() => updatePlayer(index, 'emblem', emb)}
                        className={`w-10 h-10 rounded-xl text-2xl transition-all hover:scale-110 ${player.emblem === emb ? 'bg-primary/30 ring-2 ring-primary scale-110' : 'bg-secondary'}`}
                      >
                        {emb}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Start Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={handleStart}
          className="w-full py-5 rounded-2xl bg-primary text-primary-foreground text-xl font-heading font-bold hover:bg-primary/80 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-lg"
        >
          <Rocket className="w-6 h-6" />
          {t('startGame')}
        </motion.button>
      </div>
    </div>
  );
}