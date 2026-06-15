import React from 'react';
import { useLanguage } from '../game/LanguageContext';
import { FlaskConical, Coins, Users, Zap, Building2, ScrollText, AlertTriangle, Rocket, BookOpen, ChevronLeft } from 'lucide-react';
import StarBackground from '../components/game/StarBackground';

export default function HowToPlay({ onBack }) {
  const { t } = useLanguage();

  const resourceItems = [
    { icon: FlaskConical, color: 'text-cyan-400', bg: 'bg-cyan-500/10', name: t('science'), desc: t('tutorialScienceDesc') },
    { icon: Coins, color: 'text-yellow-400', bg: 'bg-yellow-500/10', name: t('money'), desc: t('tutorialMoneyDesc') },
    { icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10', name: t('consensus'), desc: t('tutorialConsensusDesc') },
  ];

  const cardTypes = [
    { icon: Zap, color: 'text-amber-400', name: t('discovery'), desc: t('tutorialDiscoveryDesc') },
    { icon: FlaskConical, color: 'text-blue-400', name: t('technology'), desc: t('tutorialTechDesc') },
    { icon: Building2, color: 'text-emerald-400', name: t('infrastructure'), desc: t('tutorialInfraDesc') },
    { icon: ScrollText, color: 'text-purple-400', name: t('policy'), desc: t('tutorialPolicyDesc') },
    { icon: AlertTriangle, color: 'text-red-400', name: t('event'), desc: t('tutorialEventDesc') },
    { icon: Rocket, color: 'text-yellow-400', name: t('mission'), desc: t('tutorialMissionDesc') },
  ];

  return (
    <div className="min-h-screen relative">
      <StarBackground />
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">{t('backToMenu')}</span>
        </button>

        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-8 h-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-heading font-bold">{t('tutorialTitle')}</h1>
        </div>

        {/* Resources */}
        <section className="mb-8">
          <h2 className="text-xl font-heading font-semibold mb-2">{t('tutorialResources')}</h2>
          <p className="text-sm text-muted-foreground mb-4">{t('tutorialResourcesDesc')}</p>
          <div className="space-y-3">
            {resourceItems.map(r => (
              <div key={r.name} className={`flex items-start gap-3 p-3 rounded-lg ${r.bg} border border-border/30`}>
                <r.icon className={`w-5 h-5 mt-0.5 ${r.color}`} />
                <div>
                  <h4 className={`text-sm font-semibold ${r.color}`}>{r.name}</h4>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Card Types */}
        <section className="mb-8">
          <h2 className="text-xl font-heading font-semibold mb-2">{t('tutorialCards')}</h2>
          <p className="text-sm text-muted-foreground mb-4">{t('tutorialCardsDesc')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cardTypes.map(c => (
              <div key={c.name} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30">
                <c.icon className={`w-5 h-5 mt-0.5 ${c.color}`} />
                <div>
                  <h4 className="text-sm font-semibold">{c.name}</h4>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Turn Structure */}
        <section className="mb-8">
          <h2 className="text-xl font-heading font-semibold mb-2">{t('tutorialTurns')}</h2>
          <p className="text-sm text-muted-foreground mb-4">{t('tutorialTurnsDesc')}</p>
          <div className="space-y-2 pl-2 border-l-2 border-primary/30">
            {[t('tutorialPhase1'), t('tutorialPhase2'), t('tutorialPhase3'), t('tutorialPhase4'), t('tutorialPhase5')].map((ph, i) => (
              <p key={i} className="text-sm text-foreground/80 pl-3">{ph}</p>
            ))}
          </div>
        </section>

        {/* Tech Tree */}
        <section className="mb-8">
          <h2 className="text-xl font-heading font-semibold mb-2">{t('tutorialTech')}</h2>
          <p className="text-sm text-muted-foreground">{t('tutorialTechDesc')}</p>
        </section>

        {/* Victory */}
        <section className="mb-8">
          <h2 className="text-xl font-heading font-semibold mb-2">{t('tutorialVictory')}</h2>
          <p className="text-sm text-muted-foreground">{t('tutorialVictoryDesc')}</p>
        </section>

        {/* Note */}
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-sm text-blue-200/80 italic">
          {t('tutorialNote')}
        </div>

        <button onClick={onBack} className="mt-8 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/80 transition-colors">
          {t('backToMenu')}
        </button>
      </div>
    </div>
  );
}