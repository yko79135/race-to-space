import React, { useState, useCallback } from 'react';
import { useLanguage } from '../game/LanguageContext';
import { COUNTRY_COLORS } from '../game/gameData';
import {
  createPlayer, createGameState, getCurrentPlayer,
  drawToFull, drawExtraCards, playCard, discardCard,
  buyTechnology, completeMission, drawEvent, endTurn,
  canBuyTech, canAttemptMission,
  MAX_HAND_SIZE, MAX_PLAYS_PER_TURN, MAX_DISCARDS_PER_TURN,
  applyResources,
} from '../game/gameState';
import StarBackground from '../components/game/StarBackground';
import LanguageToggle from '../components/game/LanguageToggle';
import ResourceBar from '../components/game/ResourceBar';
import CardComponent from '../components/game/CardComponent';
import TechScreen from '../components/game/TechScreen';
import MissionScreen from '../components/game/MissionScreen';
import EventCard from '../components/game/EventCard';
import TransitionScreen from '../components/game/TransitionScreen';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, FlaskConical, Trophy, ChevronDown, ChevronUp } from 'lucide-react';

function VictoryScreen({ winner, players, turn, onPlayAgain, onReturnToMenu }) {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-b from-yellow-900 to-yellow-950 border-4 border-yellow-400 rounded-3xl p-10 text-center max-w-sm w-full mx-4"
      >
        <div className="text-7xl mb-4">🏆</div>
        <h1 className="text-4xl font-heading font-bold text-yellow-300 mb-2">{t('victory')}</h1>
        <p className="text-xl text-white/80 mb-2">{winner.emblem} {winner.name}</p>
        <p className="text-base text-white/60 mb-8">{t('victoryMsg')}</p>
        <p className="text-sm text-white/40 mb-6">{t('turn')} {turn}</p>
        <div className="space-y-3">
          <button onClick={onPlayAgain} className="w-full py-4 bg-yellow-500 text-yellow-950 font-bold text-lg rounded-2xl hover:bg-yellow-400 transition-colors">
            {t('playAgain')}
          </button>
          <button onClick={onReturnToMenu} className="w-full py-3 bg-white/10 text-white font-medium rounded-2xl hover:bg-white/20 transition-colors">
            {t('returnMenu')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function GameBoard({ players: playerConfigs, onReturnToMenu, onPlayAgain }) {
  const { t, lang } = useLanguage();

  const [gameState, setGameState] = useState(() => {
    const players = playerConfigs.map(p => createPlayer(p.name, p.colorId, p.emblem));
    return createGameState(players);
  });

  const [showTech, setShowTech] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [showHand, setShowHand] = useState(true);
  const [notification, setNotification] = useState(null);

  const currentPlayer = getCurrentPlayer(gameState);
  const colorObj = COUNTRY_COLORS.find(c => c.id === currentPlayer.colorId) || COUNTRY_COLORS[0];

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  };

  const handleDraw = useCallback(() => {
    if (currentPlayer.hand.length >= MAX_HAND_SIZE) {
      notify(t('alreadyDrawn'));
      return;
    }
    setGameState(s => drawToFull(s));
  }, [currentPlayer, t]);

  const handlePlayCard = useCallback((card) => {
    if (gameState.playsThisTurn >= MAX_PLAYS_PER_TURN) {
      notify(t('cantPlay'));
      return;
    }
    let newState = playCard(gameState, card);
    // handle draw2 action
    if (card.actionType === 'draw2') {
      newState = drawExtraCards(newState, 2);
    }
    // handle targetBoth/targetOther — for simplicity apply to current player
    setGameState(newState);
  }, [gameState, t]);

  const handleDiscardCard = useCallback((card) => {
    if (gameState.discardsThisTurn >= MAX_DISCARDS_PER_TURN) {
      notify(t('cantDiscard'));
      return;
    }
    setGameState(s => discardCard(s, card));
  }, [gameState, t]);

  const handleBuyTech = useCallback((tech) => {
    if (gameState.playsThisTurn >= MAX_PLAYS_PER_TURN) {
      notify(t('cantPlay'));
      return;
    }
    if (!canBuyTech(currentPlayer, tech)) {
      notify(t('notEnoughResources'));
      return;
    }
    setGameState(s => buyTechnology(s, tech));
    notify(t('techUnlocked') + ': ' + (lang === 'ko' ? tech.name_ko : tech.name_en));
  }, [gameState, currentPlayer, lang, t]);

  const handleAttemptMission = useCallback((mission) => {
    if (gameState.playsThisTurn >= MAX_PLAYS_PER_TURN) {
      notify(t('cantPlay'));
      return;
    }
    if (!canAttemptMission(currentPlayer, mission)) {
      notify(t('notEnoughResources'));
      return;
    }
    setGameState(s => completeMission(s, mission));
    notify(t('missionCompleted') + ': ' + (lang === 'ko' ? mission.name_ko : mission.name_en));
  }, [gameState, currentPlayer, lang, t]);

  const handleDrawEvent = useCallback(() => {
    setGameState(s => drawEvent(s));
  }, []);

  const handleEventContinue = useCallback(() => {
    setGameState(s => endTurn(s));
  }, []);

  const handleStartTurn = useCallback(() => {
    setGameState(s => ({ ...s, phase: 'draw' }));
  }, []);

  const handleEndTurn = useCallback(() => {
    setGameState(s => endTurn(s));
  }, []);

  // Phase guidance message
  const getGuide = () => {
    const { phase, playsThisTurn } = gameState;
    if (phase === 'draw') return t('guide_draw');
    if (phase === 'play') {
      if (playsThisTurn >= MAX_PLAYS_PER_TURN) return t('guide_allPlayed');
      const canAffordAny = canBuyTech(currentPlayer, { cost: { science: 0, money: 0, consensus: 0 }, prereqs: [] });
      return t('guide_play');
    }
    if (phase === 'event') return t('guide_event');
    return '';
  };

  const { phase, winner } = gameState;

  if (winner) {
    const winnerPlayer = gameState.players.find(p => p.id === winner);
    return (
      <>
        <StarBackground />
        <VictoryScreen
          winner={winnerPlayer}
          players={gameState.players}
          turn={gameState.turn}
          onPlayAgain={onPlayAgain}
          onReturnToMenu={onReturnToMenu}
        />
      </>
    );
  }

  if (phase === 'transition') {
    const nextPlayer = gameState.players[(gameState.currentPlayerIndex) % gameState.players.length];
    return (
      <>
        <StarBackground />
        <TransitionScreen nextPlayer={nextPlayer} onStart={handleStartTurn} />
      </>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarBackground />
      <LanguageToggle />

      {/* Event overlay */}
      <AnimatePresence>
        {phase === 'eventReveal' && gameState.lastEvent && (
          <EventCard event={gameState.lastEvent} onContinue={handleEventContinue} />
        )}
      </AnimatePresence>

      {/* Tech / Mission screens */}
      {showTech && (
        <TechScreen
          player={currentPlayer}
          playsThisTurn={gameState.playsThisTurn}
          onBuyTech={handleBuyTech}
          onClose={() => setShowTech(false)}
        />
      )}
      {showMissions && (
        <MissionScreen
          player={currentPlayer}
          playsThisTurn={gameState.playsThisTurn}
          onAttemptMission={handleAttemptMission}
          onClose={() => setShowMissions(false)}
        />
      )}

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-bold shadow-lg"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout */}
      <div className="relative z-10 flex flex-col h-screen max-h-screen">

        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-background/80 backdrop-blur flex-shrink-0">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xl border-2"
              style={{ backgroundColor: colorObj.bg, borderColor: colorObj.value }}
            >
              {currentPlayer.emblem}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('turn')} {gameState.turn}</p>
              <p className="text-sm font-bold" style={{ color: colorObj.value }}>{currentPlayer.name}</p>
            </div>
          </div>

          {/* Mission progress dots */}
          <div className="flex items-center gap-1">
            {['test_rocket', 'launch_satellite', 'crewed_spaceflight'].map((mid, i) => (
              <div
                key={mid}
                className={`w-3 h-3 rounded-full border-2 ${currentPlayer.completedMissions.includes(mid) ? 'bg-yellow-400 border-yellow-300' : 'bg-muted border-border'}`}
                title={mid}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">{currentPlayer.completedMissions.length}/3</span>
          </div>

          <ResourceBar resources={currentPlayer.resources} />
        </div>

        {/* Phase guidance */}
        <div className="px-3 py-2 flex-shrink-0">
          <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-2 text-sm text-primary font-medium text-center">
            {getGuide()}
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-3 pb-2 flex gap-2 flex-shrink-0 flex-wrap">
          {phase === 'draw' && (
            <button
              onClick={handleDraw}
              className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/80 transition-colors text-sm"
            >
              🃏 {t('drawCards')} ({currentPlayer.hand.length}/{MAX_HAND_SIZE})
            </button>
          )}

          {phase === 'play' && (
            <>
              <button
                onClick={() => setShowTech(true)}
                className="flex-1 py-2.5 bg-blue-600/80 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors text-sm flex items-center justify-center gap-1"
              >
                <FlaskConical className="w-4 h-4" />
                {t('exploreTech')}
              </button>
              <button
                onClick={() => setShowMissions(true)}
                className="flex-1 py-2.5 bg-yellow-600/80 text-white font-bold rounded-xl hover:bg-yellow-600 transition-colors text-sm flex items-center justify-center gap-1"
              >
                <Rocket className="w-4 h-4" />
                {t('viewMissions')}
              </button>
              <button
                onClick={handleDrawEvent}
                className="flex-1 py-2.5 bg-purple-600/80 text-white font-bold rounded-xl hover:bg-purple-600 transition-colors text-sm"
              >
                🎲 {t('drawEventCard')}
              </button>
              <button
                onClick={handleEndTurn}
                className="flex-1 py-2.5 bg-secondary text-foreground font-bold rounded-xl hover:bg-secondary/80 transition-colors text-sm border border-border"
              >
                {t('endTurn')}
              </button>
            </>
          )}
        </div>

        {/* Stats row */}
        <div className="px-3 pb-1 flex gap-3 text-xs text-muted-foreground flex-shrink-0">
          <span>🎴 {t('cardsPlayed')}: {gameState.playsThisTurn}/{MAX_PLAYS_PER_TURN}</span>
          <span>🗑️ {t('cardsDiscarded')}: {gameState.discardsThisTurn}/{MAX_DISCARDS_PER_TURN}</span>
          <span>📦 {t('deckRemaining')}: {gameState.mainDeck.length}</span>
        </div>

        {/* Hand */}
        <div className="flex-1 overflow-hidden flex flex-col px-3 pb-3">
          <button
            onClick={() => setShowHand(h => !h)}
            className="flex items-center gap-2 text-sm font-bold text-foreground mb-2 hover:text-primary transition-colors"
          >
            {showHand ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            {t('yourHand')} ({currentPlayer.hand.length} {t('cardsInHand')})
          </button>

          {showHand && (
            <div className="flex-1 overflow-y-auto">
              {currentPlayer.hand.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                  <p className="text-4xl mb-2">🃏</p>
                  <p className="text-sm">{phase === 'draw' ? t('guide_draw') : 'No cards in hand'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {currentPlayer.hand.map(card => (
                    <CardComponent
                      key={card.uid}
                      card={card}
                      canPlay={phase === 'play' && gameState.playsThisTurn < MAX_PLAYS_PER_TURN}
                      canDiscard={phase === 'play' && gameState.discardsThisTurn < MAX_DISCARDS_PER_TURN}
                      onPlay={handlePlayCard}
                      onDiscard={handleDiscardCard}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}