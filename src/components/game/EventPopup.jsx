import React from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { FlaskConical, Coins, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventPopup({ event, onClose }) {
  const { t, cardText } = useLanguage();

  if (!event) return null;

  const isPositive = event.isPositive;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          onClick={e => e.stopPropagation()}
          className={`w-full max-w-sm rounded-2xl border p-6 ${
            isPositive ? 'border-emerald-500/50 bg-emerald-950/90' : 'border-red-500/50 bg-red-950/90'
          }`}
        >
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
              isPositive ? 'bg-emerald-500/20' : 'bg-red-500/20'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-400" />
              )}
            </div>

            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              {t('eventOccurred')}
            </h3>
            <h2 className="text-lg font-heading font-bold mb-2">
              {cardText(event, 'name')}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {cardText(event, 'description')}
            </p>

            <div className="flex items-center justify-center gap-4 mb-4">
              {event.effect.science !== 0 && (
                <span className={`flex items-center gap-1 text-sm ${event.effect.science > 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                  <FlaskConical className="w-4 h-4" />
                  {event.effect.science > 0 ? '+' : ''}{event.effect.science}
                </span>
              )}
              {event.effect.money !== 0 && (
                <span className={`flex items-center gap-1 text-sm ${event.effect.money > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                  <Coins className="w-4 h-4" />
                  {event.effect.money > 0 ? '+' : ''}{event.effect.money}
                </span>
              )}
              {event.effect.consensus !== 0 && (
                <span className={`flex items-center gap-1 text-sm ${event.effect.consensus > 0 ? 'text-purple-400' : 'text-red-400'}`}>
                  <Users className="w-4 h-4" />
                  {event.effect.consensus > 0 ? '+' : ''}{event.effect.consensus}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/80 transition-colors"
            >
              OK
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}