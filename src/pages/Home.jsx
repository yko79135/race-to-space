import React, { useState } from 'react';
import { useLanguage } from '../game/LanguageContext';
import LanguageToggle from '../components/game/LanguageToggle';
import StarBackground from '../components/game/StarBackground';
import GameSetup from './GameSetup';
import GameBoard from './GameBoard';
import { Rocket, BookOpen, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';

function HowToPlayScreen({ onBack }) {
  const { t, lang } = useLanguage();
  const steps = [
    { emoji: '🃏', en: t('howStep1'), ko: t('howStep1') },
    { emoji: '🎴', en: t('howStep2'), ko: t('howStep2') },
    { emoji: '🔬', en: t('howStep3'), ko: t('howStep3') },
    { emoji: '🎲', en: t('howStep4'), ko: t('howStep4') },
    { emoji: '🚀', en: t('howStep5'), ko: t('howStep5') },
  ];

  return (
    <div className="min-h-screen relative overflow-auto">
      <StarBackground />
      <LanguageToggle />
      <div className="relative z-10 max-w-xl mx-auto px-4 py-10">
        <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1">
          ← {t('backToMenu')}
        </button>
        <h1 className="text-3xl font-heading font-bold mb-8 text-center">{t('howToPlayTitle')}</h1>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 bg-card border-2 border-border rounded-2xl p-4"
            >
              <div className="text-3xl flex-shrink-0">{step.emoji}</div>
              <div>
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Step {i + 1}</span>
                <p className="text-base font-medium mt-0.5">{lang === 'ko' ? step.ko : step.en}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 bg-primary/10 border-2 border-primary/30 rounded-2xl p-5 text-center">
          <p className="text-lg font-bold text-primary">{lang === 'ko' ? '먼저 유인 우주 비행을 완료하면 승리! 🏆' : 'First to complete Crewed Spaceflight wins! 🏆'}</p>
        </div>
        <button
          onClick={onBack}
          className="mt-6 w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary/80 transition-colors"
        >
          {t('backToMenu')}
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const [screen, setScreen] = useState('menu');
  const [playerConfigs, setPlayerConfigs] = useState(null);

  if (screen === 'game' && playerConfigs) {
    return (
      <GameBoard
        players={playerConfigs}
        onReturnToMenu={() => { setScreen('menu'); setPlayerConfigs(null); }}
        onPlayAgain={() => { setScreen('setup'); }}
      />
    );
  }

  if (screen === 'setup') {
    return (
      <GameSetup
        onStart={(configs) => { setPlayerConfigs(configs); setScreen('game'); }}
        onBack={() => setScreen('menu')}
      />
    );
  }

  if (screen === 'howToPlay') {
    return <HowToPlayScreen onBack={() => setScreen('menu')} />;
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <StarBackground />
      <LanguageToggle />

      <div className="relative z-10 text-center px-4 max-w-sm w-full">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-7xl mb-5"
          >
            🚀
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {t('gameTitle')}
          </h1>
          <p className="text-base text-muted-foreground">
            {t('gameSubtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-3"
        >
          <button
            onClick={() => setScreen('setup')}
            className="w-full flex items-center justify-center gap-3 py-5 px-6 rounded-2xl bg-primary text-white font-heading font-bold text-xl hover:bg-primary/80 hover:scale-[1.02] transition-all shadow-lg"
          >
            <Gamepad2 className="w-6 h-6" />
            {t('newGame')}
          </button>
          <button
            onClick={() => setScreen('howToPlay')}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-secondary border-2 border-border text-foreground font-bold text-base hover:bg-secondary/80 transition-colors"
          >
            <BookOpen className="w-5 h-5 text-primary" />
            {t('howToPlay')}
          </button>
        </motion.div>
      </div>
    </div>
  );
}