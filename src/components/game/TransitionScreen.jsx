import React from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { COUNTRY_COLORS } from '../../game/gameData';
import { motion } from 'framer-motion';

export default function TransitionScreen({ nextPlayer, onStart }) {
  const { t } = useLanguage();
  const color = COUNTRY_COLORS.find(c => c.id === nextPlayer.colorId) || COUNTRY_COLORS[0];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background px-4">
      {/* Starry dots as background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center max-w-md w-full"
      >
        {/* Hidden indicator */}
        <div className="bg-secondary/50 border-2 border-border rounded-2xl p-4 mb-8 inline-block">
          <p className="text-sm text-muted-foreground">🙈 {t('transitionHide')}</p>
        </div>

        {/* Next player badge */}
        <div
          className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl shadow-lg border-4"
          style={{ backgroundColor: color.value + '30', borderColor: color.value }}
        >
          {nextPlayer.emblem}
        </div>

        <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-2" style={{ color: color.value }}>
          {nextPlayer.name}
        </h2>
        <p className="text-xl text-muted-foreground mb-10">
          {t('transitionNext')}
        </p>

        <p className="text-base text-muted-foreground mb-6 font-medium">
          {t('transitionMsg')}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="w-full max-w-xs mx-auto py-5 rounded-2xl text-xl font-heading font-bold shadow-xl transition-all hover:opacity-90"
          style={{ backgroundColor: color.value, color: '#fff' }}
        >
          🚀 {t('startMyTurn')}
        </motion.button>
      </motion.div>
    </div>
  );
}