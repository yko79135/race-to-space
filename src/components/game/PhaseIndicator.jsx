import React from 'react';
import { useLanguage } from '../../game/LanguageContext';

const phases = [
  { key: 'resource', tKey: 'resourcePhase' },
  { key: 'draw', tKey: 'drawPhase' },
  { key: 'action', tKey: 'actionPhase' },
  { key: 'event', tKey: 'eventPhase' },
  { key: 'ai', tKey: 'aiPhase' },
];

export default function PhaseIndicator({ currentPhase }) {
  const { t } = useLanguage();
  const currentIdx = phases.findIndex(p => p.key === currentPhase);

  return (
    <div className="flex items-center gap-1">
      {phases.map((phase, idx) => (
        <div key={phase.key} className="flex items-center">
          <div className={`text-[10px] sm:text-xs px-2 py-1 rounded-full transition-colors ${
            idx === currentIdx
              ? 'bg-primary text-primary-foreground font-medium'
              : idx < currentIdx
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-muted text-muted-foreground'
          }`}>
            <span className="hidden sm:inline">{t(phase.tKey)}</span>
            <span className="sm:hidden">{idx + 1}</span>
          </div>
          {idx < phases.length - 1 && (
            <div className={`w-2 sm:w-4 h-px ${idx < currentIdx ? 'bg-emerald-500/40' : 'bg-border/30'}`} />
          )}
        </div>
      ))}
    </div>
  );
}