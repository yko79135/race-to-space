import React, { useState } from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { technologies, stages, getAvailableTechs } from '../../game/gameData';
import { canBuyTech } from '../../game/gameState';
import { ResourceCost } from './CardComponent';
import { ChevronLeft, Check, Lock, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TechScreen({ player, onBuy, onClose, playsRemaining }) {
  const { t, lang } = useLanguage();
  const [learnCard, setLearnCard] = useState(null);

  const available = getAvailableTechs(player.unlockedTechs);
  const canAffordAny = available.some(tech => canBuyTech(player, tech));

  const getStatus = (tech) => {
    if (player.unlockedTechs.includes(tech.id)) return 'owned';
    if (available.find(a => a.id === tech.id)) return canBuyTech(player, tech) ? 'buyable' : 'available';
    return 'locked';
  };

  return (
    <div className="fixed inset-0 z-40 bg-background/98 overflow-auto">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onClose} className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-heading font-bold">{t('techTitle')}</h2>
          {playsRemaining > 0 && (
            <span className="ml-auto text-sm bg-primary/20 text-primary px-3 py-1 rounded-full font-medium">
              {playsRemaining} {lang === 'ko' ? '번 남음' : 'play(s) left'}
            </span>
          )}
        </div>

        {/* Player Resources */}
        <div className="bg-card border-2 border-border rounded-2xl p-4 mb-6 flex items-center gap-4 flex-wrap">
          <span className="text-sm text-muted-foreground font-medium">{lang === 'ko' ? '현재 자원:' : 'Your Resources:'}</span>
          <span className="flex items-center gap-1.5 text-blue-300 font-bold">
            <span className="text-lg">🔬</span>{player.resources.science} {t('science')}
          </span>
          <span className="flex items-center gap-1.5 text-yellow-300 font-bold">
            <span className="text-lg">💰</span>{player.resources.money} {t('money')}
          </span>
          <span className="flex items-center gap-1.5 text-green-300 font-bold">
            <span className="text-lg">🤝</span>{player.resources.consensus} {t('consensus')}
          </span>
        </div>

        {/* Technologies by Stage */}
        {stages.map(stage => {
          const stageTechs = technologies.filter(t => t.stage === stage.id);
          const anyVisible = stageTechs.some(tech => getStatus(tech) !== 'locked');
          if (!anyVisible) return null;

          return (
            <div key={stage.id} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{stage.emoji}</span>
                <div>
                  <h3 className="text-base font-heading font-bold" style={{ color: stage.color }}>
                    {lang === 'ko' ? stage.name_ko : stage.name_en}
                  </h3>
                  <p className="text-xs text-muted-foreground">{t('stage')} {stage.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stageTechs.map(tech => {
                  const status = getStatus(tech);
                  if (status === 'locked') return null;
                  const buyable = status === 'buyable';
                  const owned = status === 'owned';

                  return (
                    <motion.div
                      key={tech.id}
                      layout
                      className={`rounded-2xl border-2 p-4 flex gap-3 items-start transition-all
                        ${owned ? 'border-green-500/60 bg-green-950/20' :
                          buyable ? 'border-teal-400/60 bg-teal-950/20' :
                          'border-border/40 bg-muted/10 opacity-70'}
                      `}
                    >
                      <div className="text-3xl flex-shrink-0">{tech.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-base font-bold leading-tight">
                            {lang === 'ko' ? tech.name_ko : tech.name_en}
                          </h4>
                          {owned && <Check className="w-5 h-5 text-green-400 flex-shrink-0" />}
                          {!owned && !buyable && <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 mb-2">
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
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {t('requires')}: {tech.prereqs.map(pid => {
                              const pt = technologies.find(x => x.id === pid);
                              const met = player.unlockedTechs.includes(pid);
                              return (
                                <span key={pid} className={met ? 'text-green-400' : 'text-red-400'}>
                                  {pt ? (lang === 'ko' ? pt.name_ko : pt.name_en) : pid}
                                  {tech.prereqs.indexOf(pid) < tech.prereqs.length - 1 ? ', ' : ''}
                                </span>
                              );
                            })}
                          </p>
                        )}
                        {!owned && buyable && playsRemaining > 0 && (
                          <button
                            onClick={() => onBuy(tech)}
                            className="mt-3 w-full py-2 rounded-xl bg-teal-500 text-teal-950 font-bold text-sm hover:bg-teal-400 transition-colors"
                          >
                            {t('buyTech')} 🚀
                          </button>
                        )}
                        {!owned && buyable && playsRemaining <= 0 && (
                          <p className="mt-2 text-xs text-amber-400">
                            {lang === 'ko' ? '이번 턴 카드 사용 횟수를 모두 썼습니다.' : 'No plays remaining this turn.'}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Learn More Modal */}
      <AnimatePresence>
        {learnCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setLearnCard(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border-2 border-border rounded-2xl p-6 max-w-sm w-full"
            >
              <div className="text-5xl text-center mb-3">{learnCard.emoji}</div>
              <h3 className="text-xl font-bold text-center mb-2">
                {lang === 'ko' ? learnCard.name_ko : learnCard.name_en}
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                {lang === 'ko' ? learnCard.desc_ko : learnCard.desc_en}
              </p>
              <button onClick={() => setLearnCard(null)} className="mt-4 w-full py-3 rounded-xl bg-primary text-white font-bold">
                {t('close')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}