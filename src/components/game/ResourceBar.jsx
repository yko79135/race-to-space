import React from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { FlaskConical, Coins, Users } from 'lucide-react';

export default function ResourceBar({ resources, gain }) {
  const { t } = useLanguage();

  const items = [
    { key: 'science', icon: FlaskConical, value: resources.science, gainVal: gain?.science, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { key: 'money', icon: Coins, value: resources.money, gainVal: gain?.money, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { key: 'consensus', icon: Users, value: resources.consensus, gainVal: gain?.consensus, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="flex gap-2 sm:gap-4">
      {items.map(item => (
        <div key={item.key} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${item.bg} border border-border/50`}>
          <item.icon className={`w-4 h-4 ${item.color}`} />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground hidden sm:block">{t(item.key)}</span>
            <div className="flex items-center gap-1">
              <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
              {item.gainVal > 0 && (
                <span className="text-xs text-emerald-400">+{item.gainVal}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}