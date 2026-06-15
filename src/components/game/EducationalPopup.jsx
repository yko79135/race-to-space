import React from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EducationalPopup({ card, onClose }) {
  const { t, cardText } = useLanguage();

  if (!card) return null;

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
          className="w-full max-w-md rounded-2xl border border-blue-500/30 bg-blue-950/90 p-6"
        >
          <div className="text-center">
            <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center bg-blue-500/20">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>

            <h3 className="text-xs uppercase tracking-wider text-blue-300 mb-1">
              {t('didYouKnow')}
            </h3>
            <h2 className="text-lg font-heading font-bold mb-3">
              {cardText(card, 'name')}
            </h2>
            <p className="text-sm text-blue-100/80 leading-relaxed mb-5">
              {cardText(card, 'educational')}
            </p>

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-400 transition-colors"
            >
              {t('close')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}