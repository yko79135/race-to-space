import React from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { allTechCards, eraData } from '../../game/cardData';
import { FlaskConical, Coins, Users, Lock, Check, ChevronLeft } from 'lucide-react';

export default function TechTreeView({ unlockedTechs, onClose }) {
  const { t, cardText, lang } = useLanguage();

  const getTechStatus = (tech) => {
    if (unlockedTechs.includes(tech.id)) return 'unlocked';
    if (!tech.prerequisites || tech.prerequisites.length === 0) return 'available';
    const allPrereqsMet = tech.prerequisites.every(p => unlockedTechs.includes(p));
    return allPrereqsMet ? 'available' : 'locked';
  };

  const statusStyles = {
    unlocked: 'border-emerald-500/60 bg-emerald-950/30',
    available: 'border-blue-500/60 bg-blue-950/20',
    locked: 'border-border/30 bg-muted/20 opacity-60',
  };

  return (
    <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm overflow-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">{t('close')}</span>
          </button>
          <h2 className="text-xl font-heading font-bold">{t('techTree')}</h2>
          <div className="w-20" />
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-6 justify-center text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border border-emerald-500 bg-emerald-950/30" />
            <span className="text-muted-foreground">{t('unlocked')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border border-blue-500 bg-blue-950/20" />
            <span className="text-muted-foreground">{t('available')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border border-border/30 bg-muted/20 opacity-60" />
            <span className="text-muted-foreground">{t('locked')}</span>
          </div>
        </div>

        {/* Eras */}
        <div className="space-y-8">
          {eraData.map(era => {
            const eraTechs = allTechCards.filter(tc => tc.era === era.id);
            if (eraTechs.length === 0) return null;

            return (
              <div key={era.id}>
                <div className={`flex items-center gap-3 mb-3 ${era.color}`}>
                  <div className={`w-8 h-8 rounded-lg ${era.bgColor} border ${era.borderColor} flex items-center justify-center text-sm font-bold font-heading`}>
                    {era.id}
                  </div>
                  <h3 className="text-lg font-heading font-semibold">
                    {lang === 'ko' ? era.name_ko : era.name_en}
                  </h3>
                  <div className="flex-1 h-px bg-border/30" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {eraTechs.map(tech => {
                    const status = getTechStatus(tech);
                    return (
                      <div key={tech.id} className={`rounded-lg border p-3 ${statusStyles[status]} transition-all`}>
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-sm font-heading font-semibold leading-tight">
                            {cardText(tech, 'name')}
                          </h4>
                          {status === 'unlocked' && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                          {status === 'locked' && <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {cardText(tech, 'description')}
                        </p>
                        {/* Cost */}
                        <div className="flex items-center gap-2 text-xs mb-1">
                          {tech.cost.science > 0 && (
                            <span className="flex items-center gap-0.5 text-cyan-400">
                              <FlaskConical className="w-3 h-3" />{tech.cost.science}
                            </span>
                          )}
                          {tech.cost.money > 0 && (
                            <span className="flex items-center gap-0.5 text-yellow-400">
                              <Coins className="w-3 h-3" />{tech.cost.money}
                            </span>
                          )}
                          {tech.cost.consensus > 0 && (
                            <span className="flex items-center gap-0.5 text-purple-400">
                              <Users className="w-3 h-3" />{tech.cost.consensus}
                            </span>
                          )}
                        </div>
                        {/* Prerequisites */}
                        {tech.prerequisites && tech.prerequisites.length > 0 && (
                          <div className="text-[10px] text-muted-foreground mt-1">
                            {t('requires')}: {tech.prerequisites.map(p => {
                              const pc = allTechCards.find(c => c.id === p);
                              const met = unlockedTechs.includes(p);
                              return (
                                <span key={p} className={met ? 'text-emerald-400' : 'text-red-400'}>
                                  {pc ? cardText(pc, 'name') : p}
                                  {tech.prerequisites.indexOf(p) < tech.prerequisites.length - 1 ? ', ' : ''}
                                </span>
                              );
                            })}
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
      </div>
    </div>
  );
}