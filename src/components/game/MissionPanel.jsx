import React from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { missions, technologies } from '../../game/gameData';
import { canAttemptMission } from '../../game/gameState';
import { getFinalMissionCost } from '../../game/techEffects';
import { Check, Lock } from 'lucide-react';

function CostBadge({ science, money, consensus }) {
  return (
    <div className="flex flex-wrap gap-1">
      {science > 0 && <span className="text-[11px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-bold">🔬{science}</span>}
      {money > 0 && <span className="text-[11px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded font-bold">💰{money}</span>}
      {consensus > 0 && <span className="text-[11px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded font-bold">🤝{consensus}</span>}
    </div>
  );
}

export default function MissionPanel({ player, playsRemaining, onAttempt }) {
  const { t, lang } = useLanguage();

  return (
    <div className="space-y-3">
      {missions.map((mission, idx) => {
        const completed = player.completedMissions.includes(mission.id);
        const canDo = canAttemptMission(player, mission);
        const finalCost = getFinalMissionCost(player, mission);
        const hasDiscount =
          finalCost.science < mission.cost.science ||
          finalCost.money < mission.cost.money ||
          finalCost.consensus < mission.cost.consensus;

        return (
          <div
            key={mission.id}
            className={`rounded-xl border-2 p-3
              ${completed ? 'border-green-500/60 bg-green-950/20' :
                canDo ? 'border-yellow-400/70 bg-yellow-950/15' :
                'border-border/40 bg-card'}
            `}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{completed ? '✅' : mission.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">
                  {lang === 'ko' ? `임무 ${mission.order}/3` : `Mission ${mission.order}/3`}
                </p>
                <h4 className="text-sm font-bold leading-tight">
                  {lang === 'ko' ? mission.name_ko : mission.name_en}
                </h4>
              </div>
              {completed && (
                <span className="text-[10px] bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                  {t('missionComplete')}
                </span>
              )}
              {!completed && canDo && (
                <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full font-bold flex-shrink-0 animate-pulse">
                  {lang === 'ko' ? '준비!' : 'Ready!'}
                </span>
              )}
            </div>

            {!completed && (
              <div className="space-y-1.5 mb-2">
                {/* Cost */}
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold mb-0.5">
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
                      🔬{mission.cost.science} 💰{mission.cost.money} 🤝{mission.cost.consensus}
                    </p>
                  )}
                </div>

                {/* Required techs */}
                {mission.reqTechs.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {mission.reqTechs.map(tid => {
                      const tech = technologies.find(tt => tt.id === tid);
                      const has = player.unlockedTechs.includes(tid);
                      return (
                        <span
                          key={tid}
                          className={`flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-medium
                            ${has ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}
                        >
                          {has ? <Check className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                          {tech ? (lang === 'ko' ? tech.name_ko : tech.name_en) : tid}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Required missions */}
                {mission.reqMissions && mission.reqMissions.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {mission.reqMissions.map(mid => {
                      const prev = missions.find(m => m.id === mid);
                      const done = player.completedMissions.includes(mid);
                      return (
                        <span
                          key={mid}
                          className={`flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-medium
                            ${done ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}
                        >
                          {done ? <Check className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                          {prev ? (lang === 'ko' ? prev.name_ko : prev.name_en) : mid}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {!completed && canDo && (
              <button
                onClick={() => onAttempt(mission)}
                disabled={playsRemaining <= 0}
                className="w-full py-2 rounded-lg bg-yellow-500 text-yellow-950 font-bold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {playsRemaining > 0
                  ? `🚀 ${t('attemptMission')}`
                  : (lang === 'ko' ? '행동 없음' : 'No actions left')}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}