import React from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { missionCards, allTechCards, infrastructureCards } from '../../game/cardData';
import { FlaskConical, Coins, Users, Lock, Check, ChevronLeft, Rocket } from 'lucide-react';

export default function MissionView({ playerCountry, onAttempt, actionsRemaining, onClose }) {
  const { t, cardText } = useLanguage();

  const canAttemptMission = (mission) => {
    const player = playerCountry;
    if (player.completedMissions.includes(mission.id)) return { can: false, reason: 'completed' };
    if (actionsRemaining <= 0) return { can: false, reason: 'noActions' };
    
    // Check previous missions
    const prevMissions = missionCards.filter(m => m.missionOrder < mission.missionOrder);
    for (const pm of prevMissions) {
      if (!player.completedMissions.includes(pm.id)) return { can: false, reason: 'prerequisitesNotMet' };
    }
    
    // Check tech prerequisites
    if (mission.prerequisites) {
      for (const p of mission.prerequisites) {
        if (!player.unlockedTechs.includes(p)) return { can: false, reason: 'prerequisitesNotMet' };
      }
    }
    
    // Check infrastructure
    if (mission.requiredInfra) {
      for (const inf of mission.requiredInfra) {
        if (!player.builtInfra.includes(inf)) return { can: false, reason: 'prerequisitesNotMet' };
      }
    }
    
    // Check resources
    if (player.resources.science < mission.cost.science ||
        player.resources.money < mission.cost.money ||
        player.resources.consensus < mission.cost.consensus) {
      return { can: false, reason: 'notEnoughResources' };
    }
    
    return { can: true };
  };

  return (
    <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm overflow-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">{t('close')}</span>
          </button>
          <h2 className="text-xl font-heading font-bold flex items-center gap-2">
            <Rocket className="w-5 h-5 text-yellow-400" />
            {t('missionScreen')}
          </h2>
          <div className="w-20" />
        </div>

        {/* Mission Timeline */}
        <div className="space-y-4">
          {missionCards.sort((a, b) => a.missionOrder - b.missionOrder).map((mission, idx) => {
            const status = canAttemptMission(mission);
            const isCompleted = playerCountry.completedMissions.includes(mission.id);

            return (
              <div key={mission.id} className="relative">
                {/* Connector line */}
                {idx < missionCards.length - 1 && (
                  <div className={`absolute left-6 top-14 w-0.5 h-8 ${isCompleted ? 'bg-emerald-500' : 'bg-border/30'}`} />
                )}
                
                <div className={`rounded-xl border p-4 sm:p-5 transition-all ${
                  isCompleted ? 'border-emerald-500/50 bg-emerald-950/20' :
                  status.can ? 'border-yellow-500/50 bg-yellow-950/10' :
                  'border-border/30 bg-muted/10'
                }`}>
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isCompleted ? 'bg-emerald-500/20' : status.can ? 'bg-yellow-500/20' : 'bg-muted/30'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <span className="text-lg font-heading font-bold text-muted-foreground">{mission.missionOrder}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-heading font-semibold mb-1">
                        {cardText(mission, 'name')}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {cardText(mission, 'description')}
                      </p>

                      {/* Requirements */}
                      <div className="space-y-2 text-xs">
                        {/* Cost */}
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground w-12">{t('cost')}:</span>
                          <span className="flex items-center gap-1 text-cyan-400"><FlaskConical className="w-3 h-3" />{mission.cost.science}</span>
                          <span className="flex items-center gap-1 text-yellow-400"><Coins className="w-3 h-3" />{mission.cost.money}</span>
                          <span className="flex items-center gap-1 text-purple-400"><Users className="w-3 h-3" />{mission.cost.consensus}</span>
                        </div>

                        {/* Tech prereqs */}
                        {mission.prerequisites && (
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="text-muted-foreground w-12">{t('requires')}:</span>
                            {mission.prerequisites.map(p => {
                              const pc = allTechCards.find(c => c.id === p);
                              const met = playerCountry.unlockedTechs.includes(p);
                              return (
                                <span key={p} className={`px-1.5 py-0.5 rounded text-[10px] ${met ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                                  {met && <Check className="w-2.5 h-2.5 inline mr-0.5" />}
                                  {!met && <Lock className="w-2.5 h-2.5 inline mr-0.5" />}
                                  {pc ? cardText(pc, 'name') : p}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {/* Infra prereqs */}
                        {mission.requiredInfra && (
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="text-muted-foreground w-12">Infra:</span>
                            {mission.requiredInfra.map(inf => {
                              const ic = infrastructureCards.find(c => c.id === inf);
                              const met = playerCountry.builtInfra.includes(inf);
                              return (
                                <span key={inf} className={`px-1.5 py-0.5 rounded text-[10px] ${met ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                                  {met ? <Check className="w-2.5 h-2.5 inline mr-0.5" /> : <Lock className="w-2.5 h-2.5 inline mr-0.5" />}
                                  {ic ? cardText(ic, 'name') : inf}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      {!isCompleted && (
                        <button
                          onClick={() => status.can && onAttempt(mission)}
                          disabled={!status.can}
                          className={`mt-3 text-xs font-medium py-2 px-4 rounded-lg transition-colors ${
                            status.can
                              ? 'bg-yellow-500 text-yellow-950 hover:bg-yellow-400'
                              : 'bg-muted text-muted-foreground cursor-not-allowed'
                          }`}
                        >
                          <Rocket className="w-3 h-3 inline mr-1" />
                          {t('attemptMission')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}