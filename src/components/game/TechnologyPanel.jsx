import React from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { technologies, stages, getAvailableTechs } from '../../game/gameData';
import { canBuyTech } from '../../game/gameState';
import { Check, Lock } from 'lucide-react';

function CostBadge({ science = 0, money = 0, consensus = 0 }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap mt-1">
      {science > 0 && <span className="flex items-center gap-0.5 text-blue-300 text-xs font-bold">🔬{science}</span>}
      {money > 0 && <span className="flex items-center gap-0.5 text-yellow-300 text-xs font-bold">💰{money}</span>}
      {consensus > 0 && <span className="flex items-center gap-0.5 text-green-300 text-xs font-bold">🤝{consensus}</span>}
    </div>
  );
}

export default function TechnologyPanel({ player, playsRemaining, onBuyTech }) {
  const { lang } = useLanguage();

  const available = getAvailableTechs(player.unlockedTechs);

  const canAffordAny = available.some(tech => canBuyTech(player, tech));

  const getStatus = (tech) => {
    if (player.unlockedTechs.includes(tech.id)) return 'owned';
    if (available.find(a => a.id === tech.id)) return canBuyTech(player, tech) ? 'buyable' : 'available';
    return 'locked';
  };

  // Group: available (not owned, prereqs met) first, then owned
  const availableTechs = technologies.filter(t => {
    const s = getStatus(t);
    return s === 'buyable' || s === 'available';
  });
  const ownedTechs = technologies.filter(t => getStatus(t) === 'owned');

  return (
    <div className="space-y-3">
      {canAffordAny && playsRemaining > 0 && (
        <div className="bg-teal-900/40 border border-teal-500/50 rounded-xl px-3 py-2 text-teal-300 text-xs font-bold text-center">
          {lang === 'ko' ? '🌟 새로운 기술을 해금할 수 있어요!' : '🌟 You can unlock a new technology!'}
        </div>
      )}

      {availableTechs.length === 0 && ownedTechs.length === 0 && (
        <p className="text-center text-muted-foreground text-sm py-4">
          {lang === 'ko' ? '사용 가능한 기술이 없습니다.' : 'No technologies available yet.'}
        </p>
      )}

      {/* Available technologies */}
      {availableTechs.length > 0 && (
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            {lang === 'ko' ? '연구 가능' : 'Available'}
          </p>
          <div className="space-y-2">
            {availableTechs.map(tech => {
              const buyable = getStatus(tech) === 'buyable';
              const canBuy = buyable && playsRemaining > 0;
              return (
                <div
                  key={tech.id}
                  className={`rounded-xl border-2 p-3 flex gap-2 items-start
                    ${buyable ? 'border-teal-500/60 bg-teal-950/30' : 'border-border/40 bg-card/50 opacity-70'}`}
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5">{tech.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white leading-tight">
                      {lang === 'ko' ? tech.name_ko : tech.name_en}
                    </p>
                    <CostBadge science={tech.cost.science} money={tech.cost.money} consensus={tech.cost.consensus} />
                    {tech.prereqs.length > 0 && !buyable && (
                      <p className="text-[10px] text-red-400 mt-0.5">
                        <Lock className="w-3 h-3 inline mr-0.5" />
                        {lang === 'ko' ? '선행 기술 필요' : 'Prereqs needed'}
                      </p>
                    )}
                    {canBuy && (
                      <button
                        onClick={() => onBuyTech(tech)}
                        className="mt-2 w-full py-1.5 rounded-lg bg-teal-500 text-teal-950 font-bold text-xs hover:bg-teal-400 transition-colors"
                      >
                        {lang === 'ko' ? '연구하기 🚀' : 'Research 🚀'}
                      </button>
                    )}
                    {buyable && playsRemaining <= 0 && (
                      <p className="mt-1 text-[10px] text-amber-400">
                        {lang === 'ko' ? '이번 턴 행동 불가' : 'No actions left'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Owned technologies */}
      {ownedTechs.length > 0 && (
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1 mt-3">
            {lang === 'ko' ? '완료' : 'Unlocked'} ({ownedTechs.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ownedTechs.map(tech => (
              <div
                key={tech.id}
                className="flex items-center gap-1 bg-green-950/30 border border-green-700/40 rounded-lg px-2 py-1"
              >
                <span className="text-sm">{tech.emoji}</span>
                <span className="text-xs text-green-300 font-medium">
                  {lang === 'ko' ? tech.name_ko : tech.name_en}
                </span>
                <Check className="w-3 h-3 text-green-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}