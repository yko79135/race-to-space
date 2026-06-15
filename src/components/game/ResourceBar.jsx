import React from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResourceBar({ resources }) {
  const { t } = useLanguage();

  const items = [
    { key: 'science', emoji: '🔬', value: resources.science, color: 'text-blue-300', bg: 'bg-blue-900/40', border: 'border-blue-700/60' },
    { key: 'money', emoji: '💰', value: resources.money, color: 'text-yellow-300', bg: 'bg-yellow-900/40', border: 'border-yellow-700/60' },
    { key: 'consensus', emoji: '🤝', value: resources.consensus, color: 'text-green-300', bg: 'bg-green-900/40', border: 'border-green-700/60' },
  ];

  return (
    <div className="flex gap-2 sm:gap-3">
      {items.map(item => (
        <motion.div
          key={item.key}
          layout
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border-2 ${item.bg} ${item.border}`}
        >
          <span className="text-xl sm:text-2xl">{item.emoji}</span>
          <div className="flex flex-col">
            <span className="hidden sm:block text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              {t(item.key)}
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={item.value}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                className={`text-lg sm:text-2xl font-heading font-bold ${item.color}`}
              >
                {item.value}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  );
}