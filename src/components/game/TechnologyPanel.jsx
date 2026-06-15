import React, { useState } from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { technologies, stages, getAvailableTechs } from '../../game/gameData';
import { canBuyTech } from '../../game/gameState';
import { getFinalTechCost } from '../../game/techEffects';
import { Check, Lock, ChevronDown, ChevronUp, Zap, Star } from 'lucide-react';

function CostBadge({ science, money, consensus }) {
  return (
    <div className="flex flex-wrap gap-1">
      {science > 0 && <span className="text-[11px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-bold">🔬{science}</span>}
      {money > 0 && <span className="text-[11px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded font-bold">💰{money}</span>}
      {consensus > 0 && <span className="text-[11px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded font-bold">🤝{consensus}</span>}
    </div>
  );
}

export default function TechnologyPanel({ player, playsRemaining, onBuy }) {
  const { t, lang } = useLanguage();
  const [expanded, setExpanded] = useState(null);

  const available = getAvailableTechs(player.unlockedTechs);

  const getStatus = (tech) => {
    if (player.unlockedTechs.includes(tech.id)) return 'owned';
    const prereqsMet = !tech.prereqs || tech.prereqs.length === 0 ||
      tech.prereqs.every(p => player.unlockedTechs.includes(p));
    if (!prereqsMet) return 'locked';
    return canBuyTech(player, tech) ? 'buyable' : 'needs_resources';
  };

  return (
    <div className="space-y-4">
      {stages.map(stage => {
        const stageTechs = technologies.filter(tech => tech.stage === stage.id);
        const visibleTechs = stageTechs.filter(tech => {
          const s = getStatus(tech);
          return s !== 'locked';
        });
        if (visibleTechs.length === 0) return null;

        return (
          <div key={stage.id}>
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
                const needsResources = status === 'needs_resources';
                const isOpen = expanded === tech.id;
                const finalCost = getFinalTechCost(player, tech);
                const hasDiscount =
                  finalCost.science < (tech.cost?.science ?? 0) ||
                  finalCost.money < (tech.cost?.money ?? 0) ||
                  finalCost.consensus < (tech.cost?.consensus ?? 0);

                return (
                  <div
                    key={tech.id}
                    className={`rounded-xl border-2 overflow-hidden transition-all
                      ${owned ? 'border-green-500/50 bg-green-950/20' :
                        buyable ? 'border-teal-400/60 bg-teal-950/20' :
                        needsResources ? 'border-yellow-500/40 bg-yellow-950/10' :
                        'border-border/40 bg-muted/10 opacity-60'}
                    `}
                  >
                    <button
                      className="w-full flex items-center gap-2 p-2.5 text-left"
                      onClick={() => setExpanded(isOpen ? null : tech.id)}
                    >
                      <span className="text-xl flex-shrink-0">{tech.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-sm font-bold leading-tight">
                            {lang === 'ko' ? tech.name_ko : tech.name_en}
                          </span>
                          {/* Core / Optional badge */}
                          {tech.isCore ? (
                            <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1 py-0.5 rounded font-bold leading-none">
                              {lang === 'ko' ? '핵심' : 'Core'}
                            </span>
                          ) : (
                            <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 py-0.5 rounded font-bold leading-none">
                              {lang === 'ko' ? '선택' : 'Optional'}
                            </span>
                          )}
                        </div>
                        {/* Show final cost inline when collapsed */}
                        {!isOpen && !owned && (
                          <div className="mt-0.5">
                            <CostBadge {...finalCost} />
                          </div>
                        )}
                      </div>
                      {owned && <Check className="w-4 h-4 text-green-400 flex-shrink-0" />}
                      {status === 'locked' && <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                      {needsResources && (
                        <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 whitespace-nowrap">
                          {lang === 'ko' ? '자원 부족' : 'Need Resources'}
                        </span>
                      )}
                      {buyable && (
                        <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 whitespace-nowrap">
                          {lang === 'ko' ? '연구하기' : 'Research'}
                        </span>
                      )}
                      {isOpen
                        ? <ChevronUp className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        : <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                    </button>

                    {isOpen && (
                      <div className="px-3 pb-3 border-t border-border/30 pt-2 space-y-2">
                        {/* Description */}
                        <p className="text-xs text-muted-foreground">
                          {lang === 'ko' ? tech.desc_ko : tech.desc_en}
                        </p>

                        {/* Permanent Effect */}
                        {(tech.effect_en || tech.permanentEffects?.length > 0) && (
                          <div className="bg-accent/10 border border-accent/30 rounded-lg px-2 py-1.5">
                            <p className="text-[10px] font-bold text-accent mb-0.5 flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              {lang === 'ko' ? '영구 효과' : 'Permanent Effect'}
                            </p>
                            <p className="text-xs text-accent/80">
                              {lang === 'ko' ? tech.effect_ko : tech.effect_en}
                            </p>
                          </div>
                        )}

                        {/* Costs */}
                        {!owned && (
                          <div>
                            <p className="text-[10px] text-muted-foreground font-bold mb-1">
                              {lang === 'ko' ? '비용:' : 'Cost:'}
                              {hasDiscount && (
                                <span className="ml-1 text-teal-400">
                                  {lang === 'ko' ? '(할인 적용됨)' : '(discounted)'}
                                </span>
                              )}
                            </p>
                            <CostBadge {...finalCost} />
                            {hasDiscount && (
                              <p className="text-[10px] text-muted-foreground line-through mt-0.5">
                                {lang === 'ko' ? '원래: ' : 'Base: '}
                                🔬{tech.cost.science} 💰{tech.cost.money} 🤝{tech.cost.consensus}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Prereqs */}
                        {!owned && (
                          <p className="text-[10px] text-muted-foreground">
                            {t('requires')}: {tech.prereqs.length === 0
                              ? <span className="text-green-400">{lang === 'ko' ? '없음' : 'None'}</span>
                              : tech.prereqs.map((pid, i) => {
                                  const pt = technologies.find(x => x.id === pid);
                                  const met = player.unlockedTechs.includes(pid);
                                  return (
                                    <span key={pid} className={met ? 'text-green-400' : 'text-red-400'}>
                                      {pt ? (lang === 'ko' ? pt.name_ko : pt.name_en) : pid}
                                      {i < tech.prereqs.length - 1 ? ', ' : ''}
                                    </span>
                                  );
                                })
                            }
                          </p>
                        )}

                        {/* Optional tech note */}
                        {!tech.isCore && !owned && (
                          <p className="text-[10px] text-purple-400 italic">
                            {lang === 'ko'
                              ? '필수 기술은 아니지만 영구적인 이점을 제공합니다.'
                              : 'Not required, but provides a permanent advantage.'}
                          </p>
                        )}

                        {/* Buy button */}
                        {!owned && buyable && (
                          <button
                            onClick={() => { onBuy(tech); setExpanded(null); }}
                            disabled={playsRemaining <= 0}
                            className="w-full py-2 rounded-lg bg-teal-500 text-teal-950 font-bold text-sm hover:bg-teal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {playsRemaining > 0
                              ? `${t('buyTech')} 🚀`
                              : (lang === 'ko' ? '행동 없음' : 'No actions left')}
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