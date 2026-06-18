import React from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { missions, technologies } from '../../game/gameData';
import { canAttemptMission } from '../../game/gameState';
import { Check, Lock } from 'lucide-react';

function CostBadge({ science = 0, money = 0, consensus = 0 }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap mt-1">
      {science > 0 && <span className="text-blue-300 text-xs font-bold">🔬{science}</span>}
      {money > 0 && <span className="text-yellow-300 text-xs font-bold">💰{money}</span>}
      {consensus > 0 && <span className="text-green-300 text-xs font-bold">🤝{consensus}</span>}
    </div>
  );
}

export default function MissionPanel({ player, playsRemaining, onAttemptMission }) {
  const { lang } = useLanguage();

  const anyReady = missions.some(m =>
    !player.completedMissions.includes(m.id) && canAttemptMission(player, m)
  );

  return (
    <div className="space-y-3">
      {anyReady && playsRemaining > 0 && (
        <div className="bg-yellow-900/40 border border-yellow-500/50 rounded-xl px-3 py-2 text-yellow-300 text-xs font-bold text-center">
          {lang === 'ko' ? '🚀 우주 임무를 수행할 수 있어요!' : '🚀 A space mission is ready!'}
        </div>
      )}

      {missions.map(mission => {
        const completed = player.completedMissions.includes(mission.id);
        const canDo = canAttemptMission(player, mission);
        const canAct = canDo && playsRemaining > 0 && !completed;

        return (
          <div
            key={mission.id}
            className={`rounded-xl border-2 p-3
              ${completed ? 'border-green-500/60 bg-green-950/20' :
                canDo ? 'border-yellow-400/60 bg-yellow-950/20' :
                'border-border/40 bg-card/50'}`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl">{completed ? '✅' : mission.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white leading-tight">
                  {lang === 'ko' ? mission.name_ko : mission.name_en}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {lang === 'ko' ? '임무' : 'Mission'} {mission.order}/3
                </p>
              </div>
              {completed && <Check className="w-4 h-4 text-green-400 flex-shrink-0" />}
            </div>

            {!completed && (
              <>
                <p className="text-xs text-muted-foreground mb-1.5">
                  {lang === 'ko' ? mission.desc_ko : mission.desc_en}
                </p>

                {/* Cost */}
                <CostBadge science={mission.cost.science} money={mission.cost.money} consensus={mission.cost.consensus} />

                {/* Required techs */}
                {mission.reqTechs.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {mission.reqTechs.map(tid => {
                      const tech = technologies.find(t => t.id === tid);
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

                {/* Required previous missions */}
                {mission.reqMissions && mission.reqMissions.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
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

                {canAct && (
                  <button
                    onClick={() => onAttemptMission(mission)}
                    className="mt-2.5 w-full py-1.5 rounded-lg bg-yellow-500 text-yellow-950 font-bold text-xs hover:bg-yellow-400 transition-colors"
                  >
                    🚀 {lang === 'ko' ? '임무 수행' : 'Attempt Mission'}
                  </button>
                )}
                {canDo && !canAct && playsRemaining <= 0 && (
                  <p className="mt-1.5 text-[10px] text-amber-400">
                    {lang === 'ko' ? '이번 턴 행동 불가' : 'No actions left this turn'}
                  </p>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}