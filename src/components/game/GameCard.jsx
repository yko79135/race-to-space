import React from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { FlaskConical, Coins, Users, Lock, Check, Zap, Building2, ScrollText, AlertTriangle, Rocket } from 'lucide-react';
import { allTechCards } from '../../game/cardData';

const typeConfig = {
  discovery: { icon: Zap, label: 'discovery', glowClass: 'card-discovery', accent: 'border-amber-500/50', bg: 'bg-amber-950/40', badge: 'bg-amber-500/20 text-amber-300' },
  technology: { icon: FlaskConical, label: 'technology', glowClass: 'card-technology', accent: 'border-blue-500/50', bg: 'bg-blue-950/40', badge: 'bg-blue-500/20 text-blue-300' },
  infrastructure: { icon: Building2, label: 'infrastructure', glowClass: 'card-infrastructure', accent: 'border-emerald-500/50', bg: 'bg-emerald-950/40', badge: 'bg-emerald-500/20 text-emerald-300' },
  policy: { icon: ScrollText, label: 'policy', glowClass: 'card-policy', accent: 'border-purple-500/50', bg: 'bg-purple-950/40', badge: 'bg-purple-500/20 text-purple-300' },
  event: { icon: AlertTriangle, label: 'event', glowClass: 'card-event', accent: 'border-red-500/50', bg: 'bg-red-950/40', badge: 'bg-red-500/20 text-red-300' },
  mission: { icon: Rocket, label: 'mission', glowClass: 'card-mission', accent: 'border-yellow-500/50', bg: 'bg-yellow-950/40', badge: 'bg-yellow-500/20 text-yellow-300' },
};

export default function GameCard({ card, onPlay, canPlay, disabled, compact }) {
  const { t, cardText } = useLanguage();
  const config = typeConfig[card.type] || typeConfig.discovery;
  const Icon = config.icon;

  const playable = canPlay?.canPlay;
  const reason = canPlay?.reason;

  const handleClick = () => {
    if (playable && onPlay && !disabled) {
      onPlay(card);
    }
  };

  if (compact) {
    return (
      <div className={`game-card rounded-lg border ${config.accent} ${config.bg} p-2 transition-all duration-200 cursor-default`}>
        <div className="flex items-center gap-2">
          <Icon className="w-3 h-3 flex-shrink-0 text-muted-foreground" />
          <span className="text-xs font-medium truncate">{cardText(card, 'name')}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`game-card ${config.glowClass} rounded-xl border ${config.accent} ${config.bg} p-3 sm:p-4 transition-all duration-200 flex flex-col gap-2 min-w-[160px] max-w-[200px]
        ${playable && !disabled ? 'cursor-pointer hover:border-primary/70' : 'cursor-default opacity-75'}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-center gap-1.5">
          <Icon className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${config.badge}`}>
            {t(config.label)}
          </span>
        </div>
        {card.era && (
          <span className="text-[10px] text-muted-foreground">
            E{card.era}
          </span>
        )}
      </div>

      {/* Name */}
      <h4 className="text-sm font-heading font-semibold leading-tight">
        {cardText(card, 'name')}
      </h4>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {cardText(card, 'description')}
      </p>

      {/* Cost */}
      {card.cost && (card.cost.science > 0 || card.cost.money > 0 || card.cost.consensus > 0) && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">{t('cost')}:</span>
          {card.cost.science > 0 && (
            <span className="flex items-center gap-0.5 text-cyan-400">
              <FlaskConical className="w-3 h-3" />{card.cost.science}
            </span>
          )}
          {card.cost.money > 0 && (
            <span className="flex items-center gap-0.5 text-yellow-400">
              <Coins className="w-3 h-3" />{card.cost.money}
            </span>
          )}
          {card.cost.consensus > 0 && (
            <span className="flex items-center gap-0.5 text-purple-400">
              <Users className="w-3 h-3" />{card.cost.consensus}
            </span>
          )}
        </div>
      )}

      {/* Prerequisites */}
      {card.prerequisites && card.prerequisites.length > 0 && (
        <div className="text-[10px] text-muted-foreground">
          <span>{t('prerequisite')}: </span>
          {card.prerequisites.map((p, i) => {
            const prereqCard = allTechCards.find(c => c.id === p);
            return (
              <span key={p}>
                {prereqCard ? cardText(prereqCard, 'name') : p}
                {i < card.prerequisites.length - 1 ? ', ' : ''}
              </span>
            );
          })}
        </div>
      )}

      {/* Play Button */}
      {onPlay && (
        <button
          onClick={e => { e.stopPropagation(); handleClick(); }}
          disabled={!playable || disabled}
          className={`mt-auto text-xs font-medium py-1.5 px-3 rounded-lg transition-colors
            ${playable && !disabled
              ? 'bg-primary text-primary-foreground hover:bg-primary/80'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
            }
          `}
        >
          {!playable && reason === 'prerequisitesNotMet' && <Lock className="w-3 h-3 inline mr-1" />}
          {!playable && reason === 'notEnoughResources' && <Coins className="w-3 h-3 inline mr-1" />}
          {card.type === 'discovery' || card.type === 'technology' ? t('research') :
           card.type === 'infrastructure' ? t('build') :
           card.type === 'policy' ? t('enact') :
           card.type === 'mission' ? t('attempt') : t('play')}
        </button>
      )}
    </div>
  );
}