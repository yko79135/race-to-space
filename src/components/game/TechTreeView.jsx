import React from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { technologies, stages } from '../../game/gameData';
import { canBuyTech } from '../../game/gameState';
import { Check, Lock, GitBranch } from 'lucide-react';

// Returns all techs grouped by stage
function groupByStage() {
  const groups = {};
  for (const tech of technologies) {
    if (!groups[tech.stage]) groups[tech.stage] = [];
    groups[tech.stage].push(tech);
  }
  return groups;
}

const STATUS_STYLES = {
  owned:     'border-green-500 bg-green-950/40 opacity-100',
  buyable:   'border-teal-400 bg-teal-950/30 opacity-100',
  available: 'border-border/50 bg-card/60 opacity-80',
  locked:    'border-border/20 bg-card/30 opacity-40',
};

export default function TechTreeView({ player, playsRemaining, onBuyTech }) {
  const { lang } = useLanguage();
  const groups = groupByStage();

  const getStatus = (tech) => {
    if (player.unlockedTechs.includes(tech.id)) return 'owned';
    const prereqsMet = tech.prereqs.every(p => player.unlockedTechs.includes(p));
    if (!prereqsMet) return 'locked';
    return canBuyTech(player, tech) ? 'buyable' : 'available';
  };

  return (
    <div className="space-y-4">
      {stages.map(stage => {
        const techs = groups[stage.id] || [];
        return (
          <div key={stage.id}>
            {/* Stage header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{stage.emoji}</span>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: stage.color }}>
                {lang === 'ko' ? stage.name_ko : stage.name_en}
              </span>
              <div className="flex-1 h-px bg-border/30" />
            </div>

            {/* Tech cards in this stage */}
            <div className="space-y-1.5 pl-2">
              {techs.map(tech => {
                const status = getStatus(tech);
                const canBuy = status === 'buyable' && playsRemaining > 0;

                return (
                  <div
                    key={tech.id}
                    className={`rounded-lg border-2 px-2.5 py-2 flex items-center gap-2 transition-all ${STATUS_STYLES[status]}`}
                  >
                    {/* Prereq connector line */}
                    {tech.prereqs.length > 0 && (
                      <GitBranch className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                    )}

                    <span className="text-lg flex-shrink-0">{tech.emoji}</span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 flex-wrap">
                        <p className="text-xs font-bold text-white leading-tight">
                          {lang === 'ko' ? tech.name_ko : tech.name_en}
                        </p>
                        {tech.deadEnd && (
                          <span className="text-[9px] bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-full px-1.5 py-0.5 font-bold whitespace-nowrap">
                            {lang === 'ko' ? '⭐ 보너스' : '⭐ Bonus'}
                          </span>
                        )}
                      </div>

                      {/* Cost */}
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        {tech.cost.science > 0 && <span className="text-blue-300 text-[10px] font-bold">🔬{tech.cost.science}</span>}
                        {tech.cost.money > 0 && <span className="text-yellow-300 text-[10px] font-bold">💰{tech.cost.money}</span>}
                        {tech.cost.consensus > 0 && <span className="text-green-300 text-[10px] font-bold">🤝{tech.cost.consensus}</span>}
                      </div>

                      {/* Dead-end bonus label */}
                      {tech.deadEnd && (
                        <p className="text-[10px] text-amber-300 font-medium mt-0.5">
                          {lang === 'ko' ? tech.bonusDesc_ko : tech.bonusDesc_en}
                        </p>
                      )}
                    </div>

                    {/* Status indicator / button */}
                    {status === 'owned' && <Check className="w-4 h-4 text-green-400 flex-shrink-0" />}
                    {status === 'locked' && <Lock className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />}
                    {canBuy && (
                      <button
                        onClick={() => onBuyTech(tech)}
                        className="flex-shrink-0 px-2 py-1 rounded-md bg-teal-500 text-teal-950 font-bold text-[10px] hover:bg-teal-400 transition-colors whitespace-nowrap"
                      >
                        {lang === 'ko' ? '연구' : 'Get'}
                      </button>
                    )}
                    {status === 'available' && !canBuy && (
                      <span className="flex-shrink-0 text-[10px] text-muted-foreground whitespace-nowrap">
                        {lang === 'ko' ? '자원 부족' : 'Need more'}
                      </span>
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