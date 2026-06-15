import React from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { missions, technologies } from '../../game/gameData';
import { canAttemptMission } from '../../game/gameState';
import { ResourceCost } from './CardComponent';
import { ChevronLeft, Check, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MissionScreen({ player, onAttempt, onClose, playsRemaining }) {
  const { t, lang } = useLanguage();

  return (
    <div className="fixed inset-0 z-40 bg-background/98 overflow-auto">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onClose} className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-heading font-bold">{t('missionsTitle')}</h2>
        </div>

        {/* Player Resources */}
        <div className="bg-card border-2 border-border rounded-2xl p-4 mb-6 flex flex-wrap gap-4">
          <span className="flex items-center gap-1.5 text-blue-300 font-bold">
            <span className="text-lg">🔬</span>{player.resources.science}
          </span>
          <span className="flex items-center gap-1.5 text-yellow-300 font-bold">
            <span className="text-lg">💰</span>{player.resources.money}
          </span>
          <span className="flex items-center gap-1.5 text-green-300 font-bold">
            <span className="text-lg">🤝</span>{player.resources.consensus}
          </span>
        </div>

        {/* Mission Cards */}
        <div className="space-y-5">
          {missions.map((mission, idx) => {
            const completed = player.completedMissions.includes(mission.id);
            const canDo = canAttemptMission(player, mission);

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-2xl border-4 p-5
                  ${completed ? 'border-green-500 bg-green-950/20' :
                    canDo ? 'border-yellow-400 bg-yellow-950/10' :
                    'border-border/40 bg-card'}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0
                    ${completed ? 'bg-green-500/20' : canDo ? 'bg-yellow-500/20' : 'bg-secondary'}`}
                  >
                    {completed ? '✅' : mission.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground font-medium">Mission {mission.order} / 3</span>
                      {completed && <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full font-bold">{t('missionComplete')}</span>}
                    </div>
                    <h3 className="text-lg font-heading font-bold mb-1">
                      {lang === 'ko' ? mission.name_ko : mission.name_en}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {lang === 'ko' ? mission.desc_ko : mission.desc_en}
                    </p>

                    {/* Requirements */}
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-bold text-muted-foreground mb-1">{t('cost')}:</p>
                        <ResourceCost
                          science={mission.cost.science}
                          money={mission.cost.money}
                          consensus={mission.cost.consensus}
                        />
                      </div>

                      {mission.reqTechs.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-muted-foreground mb-1">{t('technologies')}:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {mission.reqTechs.map(tid => {
                              const tech = technologies.find(t => t.id === tid);
                              const has = player.unlockedTechs.includes(tid);
                              return (
                                <span key={tid}
                                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium
                                    ${has ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}
                                >
                                  {has ? <Check className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                  {tech ? (lang === 'ko' ? tech.name_ko : tech.name_en) : tid}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {mission.reqMissions && (
                        <div>
                          <p className="text-xs font-bold text-muted-foreground mb-1">{t('previous')}:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {mission.reqMissions.map(mid => {
                              const prev = missions.find(m => m.id === mid);
                              const done = player.completedMissions.includes(mid);
                              return (
                                <span key={mid}
                                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium
                                    ${done ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}
                                >
                                  {done ? <Check className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                  {prev ? (lang === 'ko' ? prev.name_ko : prev.name_en) : mid}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {!completed && canDo && playsRemaining > 0 && (
                      <button
                        onClick={() => onAttempt(mission)}
                        className="mt-4 w-full py-3 rounded-xl bg-yellow-500 text-yellow-950 font-bold text-base hover:bg-yellow-400 transition-colors"
                      >
                        🚀 {t('attemptMission')}
                      </button>
                    )}
                    {!completed && canDo && playsRemaining <= 0 && (
                      <p className="mt-3 text-sm text-amber-400 font-medium">
                        {lang === 'ko' ? '이번 턴 카드 사용 횟수를 모두 썼습니다.' : 'No plays remaining this turn.'}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}