import React from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { motion } from 'framer-motion';

export default function EventCard({ event, onContinue }) {
  const { t, lang } = useLanguage();
  const isPositive = event.positive;

  const name = lang === 'ko' ? event.name_ko : event.name_en;
  const desc = lang === 'ko' ? event.desc_ko : event.desc_en;

  const affectType = event.effect?.type;
  const affectLabel = affectType === 'all' ? t('eventAll') : t('eventYou');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
    >
      <motion.div
        initial={{ scale: 0.6, rotate: -5, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className={`w-full max-w-sm rounded-3xl border-4 p-8 text-center shadow-2xl
          ${isPositive
            ? 'border-yellow-400 bg-gradient-to-b from-yellow-900 to-yellow-950'
            : 'border-red-400 bg-gradient-to-b from-red-900 to-red-950'}
        `}
      >
        {/* Title Badge */}
        <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4
          ${isPositive ? 'bg-yellow-500/30 text-yellow-200' : 'bg-red-500/30 text-red-200'}`}
        >
          {t('eventTitle')}
        </div>

        {/* Emoji */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          className="text-7xl mb-4"
        >
          {event.emoji}
        </motion.div>

        {/* Event Name */}
        <h2 className="text-2xl font-heading font-bold text-white mb-3">{name}</h2>

        {/* Description */}
        <p className="text-base text-white/80 mb-4 leading-relaxed">{desc}</p>

        {/* Affects */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6
          ${isPositive ? 'bg-yellow-500/20 text-yellow-200' : 'bg-red-500/20 text-red-200'}`}
        >
          <span>{t('eventAffects')}</span>
          <span className="font-bold">{affectLabel}</span>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className={`w-full py-4 rounded-2xl text-lg font-bold transition-all hover:scale-[1.02] active:scale-95
            ${isPositive
              ? 'bg-yellow-500 text-yellow-950 hover:bg-yellow-400'
              : 'bg-red-500 text-white hover:bg-red-400'}
          `}
        >
          {t('continueTurn')} →
        </button>
      </motion.div>
    </motion.div>
  );
}