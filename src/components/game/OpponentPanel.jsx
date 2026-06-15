import React from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { eraData } from '../../game/cardData';
import { FlaskConical, Coins, Users, Rocket } from 'lucide-react';

export default function OpponentPanel({ aiPlayers }) {
  const { t, lang } = useLanguage();

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {t('opponents')}
      </h3>
      {aiPlayers.map(ai => {
        const eraInfo = eraData.find(e => e.id === ai.currentEra);
        return (
          <div key={ai.id} className="rounded-lg border border-border/40 bg-secondary/30 p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium">{lang === 'ko' ? ai.name_ko : ai.name_en}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${eraInfo?.bgColor || ''} ${eraInfo?.color || 'text-muted-foreground'}`}>
                {eraInfo ? (lang === 'ko' ? eraInfo.name_ko : eraInfo.name_en) : `E${ai.currentEra}`}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5 text-cyan-400/70">
                <FlaskConical className="w-3 h-3" />{ai.resources.science}
              </span>
              <span className="flex items-center gap-0.5 text-yellow-400/70">
                <Coins className="w-3 h-3" />{ai.resources.money}
              </span>
              <span className="flex items-center gap-0.5 text-purple-400/70">
                <Users className="w-3 h-3" />{ai.resources.consensus}
              </span>
              <span className="flex items-center gap-0.5 ml-auto">
                <Rocket className="w-3 h-3" />{ai.completedMissions.length}/5
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}