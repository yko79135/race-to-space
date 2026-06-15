import React, { useState } from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { COUNTRY_COLORS, stages } from '../../game/gameData';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ProgressPanel({ players, currentPlayerIndex }) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-card/80 border-2 border-border rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
      >
        <span className="text-sm font-bold">{lang === 'ko' ? '국가 현황' : 'Country Progress'}</span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-2">
          {players.map((player, i) => {
            const color = COUNTRY_COLORS.find(c => c.id === player.colorId) || COUNTRY_COLORS[i % COUNTRY_COLORS.length];
            const stage = stages.find(s => s.id === player.stage) || stages[0];
            const isCurrent = i === currentPlayerIndex;

            return (
              <div
                key={player.id}
                className={`flex items-center gap-3 rounded-xl p-2.5 ${isCurrent ? 'bg-primary/10 border border-primary/30' : 'bg-secondary/30'}`}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 border-2"
                  style={{ borderColor: color.value, backgroundColor: color.value + '20' }}
                >
                  {player.emblem}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: color.value }}>{player.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {lang === 'ko' ? stage.name_ko : stage.name_en} · 🔧{player.unlockedTechs.length} · 🚀{player.completedMissions.length}
                  </p>
                </div>
                {isCurrent && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                    {lang === 'ko' ? '지금' : 'Now'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}