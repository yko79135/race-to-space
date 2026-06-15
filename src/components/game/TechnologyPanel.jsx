import React, { useState } from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { technologies, stages, getAvailableTechs } from '../../game/gameData';
import { canBuyTech } from '../../game/gameState';
import { ResourceCost } from './CardComponent';
import { Check, Lock, ChevronDown, ChevronUp } from 'lucide-react';

export default function TechnologyPanel({ player, playsRemaining, onBuy }) {
  const { t, lang } = useLanguage();
  const [expanded, setExpanded] = useState(null);

  const available = getAvailableTechs(player.unlockedTechs);

  const getStatus = (tech) => {
    if (player.unlockedTechs.includes(tech.id)) return 'owned';
    if (available.find(a => a.id === tech.id)) return canBuyTech(player, tech) ? 'buyable' : 'available';
    return 'locked';
  };

  return (
    <div className="space-y-4">
      {stages.map(stage => {
        const stageTechs = technologies.filter(tech => tech.stage === stage.id);
        const visibleTechs = stageTechs.filter(tech => getStatus(tech) !== 'locked');
        if (visibleTechs.length === 0) return null;

        return (
          <div key={stage.id}>
            {/* Stage header */}
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-base">{stage.emoji}</span>
              <span className="text-xs font-bold" style={{ color: stage.color }}>
                {lang === 'ko' ? stage.name_ko : stage.name_en}
              </span>
            </div>

            <div className="space-y-2">
              {visibleTechs.map(tech => {
                const status = getStatus(tech);
                const owned = status === 'owned';
                const buyable = status === 'buyable';
                const isOpen = expanded === tech.id;

                return (
                  <div
                    key={tech.id}
                    className={`rounded-xl border-2 overflow-hidden transition-all
                      ${owned ? 'border-green-500/50 bg-green-950/20' :
                        buyable ? 'border-teal-400/60 bg-teal-950/20' :
                        'border-border/40 bg-muted/10 opacity-70'}
                    `}
                  >
                    {/* Compact header row */}
                    <button
                      className="w-full flex items-center gap-2 p-2.5 text-left"
                      onClick={() => setExpanded(isOpen ? null : tech.id)}
                    >
                      <span className="text-xl flex-shrink-0">{tech.emoji}</span>
                      <span className="flex-1 text-sm font-bold leading-tight">
                        {lang === 'ko' ? tech.name_ko : tech.name_en}
                      </span>
                      {owned && <Check className="w-4 h-4 text-green-400 flex-shrink-0" />}
                      {!owned && !buyable && <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                      {!owned && buyable && (
                        <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">
                          {lang === 'ko' ? '구매 가능' : 'Buy'}
                        </span>
                      )}
                      {isOpen ? <ChevronUp className="w-3 h-3 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                    </button>

                    {/* Expanded detail */}
                    {isOpen && (
                      <div className="px-3 pb-3 border-t border-border/30 pt-2 space-y-2">
                        <p className="text-xs text-muted-foreground">
                          {lang === 'ko' ? tech.desc_ko : tech.desc_en}
                        </p>
                        {!owned && (
                          <ResourceCost
                            science={tech.cost.science}
                            money={tech.cost.money}
                            consensus={tech.cost.consensus}
                            small
                          />
                        )}
                        {tech.prereqs.length > 0 && !owned && (
                          <p className="text-[10px] text-muted-foreground">
                            {t('requires')}: {tech.prereqs.map((pid, i) => {
                              const pt = technologies.find(x => x.id === pid);
                              const met = player.unlockedTechs.includes(pid);
                              return (
                                <span key={pid} className={met ? 'text-green-400' : 'text-red-400'}>
                                  {pt ? (lang === 'ko' ? pt.name_ko : pt.name_en) : pid}
                                  {i < tech.prereqs.length - 1 ? ', ' : ''}
                                </span>
                              );
                            })}
                          </p>
                        )}
                        {!owned && buyable && (
                          <button
                            onClick={() => { onBuy(tech); setExpanded(null); }}
                            disabled={playsRemaining <= 0}
                            className="w-full py-2 rounded-lg bg-teal-500 text-teal-950 font-bold text-sm hover:bg-teal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {playsRemaining > 0
                              ? `${t('buyTech')} 🚀`
                              : (lang === 'ko' ? '이번 턴 종료' : 'No plays left')}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}