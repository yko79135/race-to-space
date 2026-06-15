import React, { useState } from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { FlaskConical, Coins, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CARD_BORDER_COLORS = {
  resource: {
    science: 'border-blue-400',
    money: 'border-yellow-400',
    consensus: 'border-green-400',
    mixed: 'border-purple-400',
    default: 'border-blue-400',
  },
  action: 'border-orange-400',
  event: 'border-red-400',
  technology: 'border-teal-400',
  mission: 'border-yellow-300',
};

const CARD_BG_COLORS = {
  resource: {
    science: 'from-blue-900 to-blue-950',
    money: 'from-yellow-900 to-yellow-950',
    consensus: 'from-green-900 to-green-950',
    mixed: 'from-purple-900 to-purple-950',
    default: 'from-blue-900 to-blue-950',
  },
  action: 'from-orange-900 to-orange-950',
  event: 'from-red-900 to-red-950',
  technology: 'from-teal-900 to-teal-950',
  mission: 'from-yellow-900 to-yellow-950',
};

function getResourceSubtype(effect) {
  if (!effect) return 'default';
  const keys = Object.keys(effect).filter(k => effect[k] && effect[k] > 0);
  if (keys.length > 1) return 'mixed';
  if (keys[0] === 'science') return 'science';
  if (keys[0] === 'money') return 'money';
  if (keys[0] === 'consensus') return 'consensus';
  return 'default';
}

function getCardBorder(card) {
  if (card.type === 'resource') {
    const sub = getResourceSubtype(card.effect);
    return CARD_BORDER_COLORS.resource[sub] || CARD_BORDER_COLORS.resource.default;
  }
  return CARD_BORDER_COLORS[card.type] || 'border-gray-400';
}

function getCardBg(card) {
  if (card.type === 'resource') {
    const sub = getResourceSubtype(card.effect);
    return CARD_BG_COLORS.resource[sub] || CARD_BG_COLORS.resource.default;
  }
  return CARD_BG_COLORS[card.type] || 'from-gray-900 to-gray-950';
}

function ResourceCost({ science = 0, money = 0, consensus = 0, small = false }) {
  const sz = small ? 'w-3 h-3' : 'w-4 h-4';
  const txt = small ? 'text-xs' : 'text-sm';
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {science > 0 && (
        <span className={`flex items-center gap-1 text-blue-300 font-bold ${txt}`}>
          <FlaskConical className={sz} />{science}
        </span>
      )}
      {money > 0 && (
        <span className={`flex items-center gap-1 text-yellow-300 font-bold ${txt}`}>
          <Coins className={sz} />{money}
        </span>
      )}
      {consensus > 0 && (
        <span className={`flex items-center gap-1 text-green-300 font-bold ${txt}`}>
          <Users className={sz} />{consensus}
        </span>
      )}
    </div>
  );
}

function ResourceEffect({ effect, small = false }) {
  if (!effect) return null;
  const entries = Object.entries(effect).filter(([, v]) => v !== 0);
  if (!entries.length) return null;
  const sz = small ? 'w-3 h-3' : 'w-4 h-4';
  const txt = small ? 'text-xs' : 'text-sm';
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {entries.map(([key, val]) => {
        const positive = val > 0;
        const color = key === 'science' ? 'text-blue-300' : key === 'money' ? 'text-yellow-300' : 'text-green-300';
        const Icon = key === 'science' ? FlaskConical : key === 'money' ? Coins : Users;
        return (
          <span key={key} className={`flex items-center gap-1 font-bold ${color} ${txt}`}>
            <Icon className={sz} />
            {positive ? '+' : ''}{val}
          </span>
        );
      })}
    </div>
  );
}

export { ResourceCost, ResourceEffect };

export default function CardComponent({ card, onPlay, onDiscard, canPlay = true, canDiscard = true, selected = false, compact = false }) {
  const { t, lang } = useLanguage();
  const [hovered, setHovered] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);

  const name = lang === 'ko' ? card.name_ko : card.name_en;
  const desc = lang === 'ko' ? card.desc_ko : card.desc_en;
  const border = getCardBorder(card);
  const bg = getCardBg(card);

  const typeLabel = t(card.type) || card.type;

  if (compact) {
    return (
      <motion.div
        whileHover={{ y: -3, scale: 1.02 }}
        className={`rounded-xl border-2 ${border} bg-gradient-to-b ${bg} p-2 cursor-default min-w-[120px]`}
      >
        <div className="text-center text-2xl mb-1">{card.emoji}</div>
        <p className="text-xs font-bold text-center text-white leading-tight">{name}</p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -12, scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`relative rounded-2xl border-4 ${border} bg-gradient-to-b ${bg} flex flex-col shadow-xl cursor-pointer select-none
          ${selected ? 'ring-4 ring-white ring-offset-2 ring-offset-transparent' : ''}
          w-36 sm:w-40 flex-shrink-0`}
        style={{ minHeight: '210px' }}
      >
        {/* Illustration Area */}
        <div className="flex items-center justify-center py-3 text-5xl sm:text-6xl">
          {card.emoji}
        </div>

        {/* Type Badge */}
        <div className="px-2">
          <span className={`inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full
            ${card.type === 'resource' ? 'bg-blue-500/30 text-blue-200' :
              card.type === 'action' ? 'bg-orange-500/30 text-orange-200' :
              card.type === 'event' ? 'bg-red-500/30 text-red-200' :
              'bg-teal-500/30 text-teal-200'}
          `}>
            {typeLabel}
          </span>
        </div>

        {/* Card Name */}
        <div className="px-2 pt-1">
          <h3 className="text-sm font-bold text-white leading-tight">{name}</h3>
        </div>

        {/* Description + Effect */}
        <div className="px-2 pt-1 pb-2 flex-1">
          {card.effect && Object.keys(card.effect).length > 0 && (
            <div className="mb-1">
              <ResourceEffect effect={card.effect} small />
            </div>
          )}
          <p className="text-xs text-white/70 leading-snug line-clamp-2">{desc}</p>
        </div>

        {/* Action Buttons */}
        {(onPlay || onDiscard) && (
          <div className="px-2 pb-2 flex gap-1.5">
            {onPlay && (
              <button
                onClick={e => { e.stopPropagation(); if (canPlay) onPlay(card); }}
                disabled={!canPlay}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors
                  ${canPlay ? 'bg-primary text-white hover:bg-primary/80 active:scale-95' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
              >
                {t('play')}
              </button>
            )}
            {onDiscard && (
              <button
                onClick={e => { e.stopPropagation(); if (canDiscard) setShowDiscard(true); }}
                disabled={!canDiscard}
                className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-colors
                  ${canDiscard ? 'bg-red-800/60 text-red-200 hover:bg-red-700/60' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
              >
                {t('discard')}
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Discard Confirm Dialog */}
      <AnimatePresence>
        {showDiscard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
            onClick={() => setShowDiscard(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border-2 border-border rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="text-5xl mb-3">{card.emoji}</div>
              <h3 className="text-xl font-bold mb-2">{t('confirmDiscard')}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t('discardWarning')}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDiscard(false)}
                  className="flex-1 py-3 rounded-xl bg-secondary text-foreground font-bold hover:bg-secondary/80"
                >
                  {t('no')}
                </button>
                <button
                  onClick={() => { setShowDiscard(false); onDiscard(card); }}
                  className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500"
                >
                  {t('yes')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}