import React, { useState } from 'react';
import { useLanguage } from '../game/LanguageContext';
import LanguageToggle from '../components/game/LanguageToggle';
import StarBackground from '../components/game/StarBackground';
import CountrySelect from './CountrySelect';
import GameBoard from './GameBoard';
import HowToPlay from './HowToPlay';
import { Rocket, BookOpen, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { t } = useLanguage();
  const [screen, setScreen] = useState('menu'); // menu, howToPlay, countrySelect, game
  const [gameConfig, setGameConfig] = useState(null);

  const handleStartGame = (name, difficulty) => {
    setGameConfig({ name, difficulty });
    setScreen('game');
  };

  if (screen === 'game' && gameConfig) {
    return (
      <>
        <LanguageToggle />
        <GameBoard
          playerName={gameConfig.name}
          difficulty={gameConfig.difficulty}
          onReturnToMenu={() => { setScreen('menu'); setGameConfig(null); }}
        />
      </>
    );
  }

  if (screen === 'howToPlay') {
    return (
      <>
        <LanguageToggle />
        <HowToPlay onBack={() => setScreen('menu')} />
      </>
    );
  }

  if (screen === 'countrySelect') {
    return (
      <>
        <LanguageToggle />
        <CountrySelect
          onStart={handleStartGame}
          onBack={() => setScreen('menu')}
        />
      </>
    );
  }

  // Main Menu
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <StarBackground />
      <LanguageToggle />

      <div className="relative z-10 text-center px-4 max-w-lg w-full">
        {/* Logo / Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Rocket className="w-16 h-16 sm:w-20 sm:h-20 text-primary mx-auto mb-6" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {t('gameTitle')}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-body">
            {t('gameSubtitle')}
          </p>
        </motion.div>

        {/* Menu Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-3"
        >
          <button
            onClick={() => setScreen('countrySelect')}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-primary text-primary-foreground font-heading font-semibold text-lg hover:bg-primary/80 hover:scale-[1.02] transition-all"
          >
            <Gamepad2 className="w-5 h-5" />
            {t('newGame')}
          </button>

          <button
            onClick={() => setScreen('howToPlay')}
            className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl bg-secondary border border-border text-foreground font-medium hover:bg-secondary/80 transition-colors"
          >
            <BookOpen className="w-5 h-5 text-primary" />
            {t('howToPlay')}
          </button>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-xs text-muted-foreground/50 italic"
        >
          {t('tutorialNote')}
        </motion.p>
      </div>
    </div>
  );
}