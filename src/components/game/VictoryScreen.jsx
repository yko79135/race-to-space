import React from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { Trophy, Rocket, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VictoryScreen({ isWinner, turn, playerName, winnerName, aiPlayers, onReturnToMenu }) {
  const { t, lang } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.3, duration: 0.8 }}
        className={`w-full max-w-lg rounded-3xl border-2 p-8 text-center ${
          isWinner ? 'border-yellow-500/60 bg-gradient-to-b from-yellow-950/80 to-background' : 'border-red-500/40 bg-gradient-to-b from-red-950/60 to-background'
        }`}
      >
        {/* Icon */}
        <motion.div
          initial={{ rotate: -10, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="mb-6"
        >
          {isWinner ? (
            <div className="relative inline-block">
              <Trophy className="w-20 h-20 text-yellow-400 mx-auto" />
              <Star className="w-6 h-6 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
          ) : (
            <Rocket className="w-20 h-20 text-red-400 mx-auto" />
          )}
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl font-heading font-bold mb-3">
          {isWinner ? t('victory') : t('defeat')}
        </h1>

        {/* Message */}
        <p className="text-lg text-foreground/80 mb-2">
          {isWinner ? t('victoryMessage') : t('defeatMessage')}
        </p>

        {!isWinner && winnerName && (
          <p className="text-sm text-muted-foreground mb-4">
            {lang === 'ko' ? `${winnerName} 승리` : `${winnerName} wins!`}
          </p>
        )}

        {/* Stats */}
        <div className="mt-6 p-4 rounded-xl bg-secondary/50 text-sm">
          <p className="text-muted-foreground mb-2">
            {t('turnsCompleted')}: <span className="text-foreground font-bold">{turn}</span>
          </p>

          {/* Opponent progress */}
          <div className="space-y-1.5 mt-3">
            <p className="text-xs text-muted-foreground">{t('opponents')}:</p>
            {aiPlayers.map(ai => (
              <div key={ai.id} className="flex items-center justify-between text-xs">
                <span className="text-foreground">{lang === 'ko' ? ai.name_ko : ai.name_en}</span>
                <span className="text-muted-foreground">
                  {ai.completedMissions.length}/5 {t('missions')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Return Button */}
        <button
          onClick={onReturnToMenu}
          className="mt-6 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/80 transition-colors"
        >
          {t('returnToMenu')}
        </button>
      </motion.div>
    </motion.div>
  );
}