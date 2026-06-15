import React, { useState, useCallback } from 'react';
import { useLanguage } from '../game/LanguageContext';
import { COUNTRY_COLORS, getAvailableTechs, missions as allMissions } from '../game/gameData';
import {
  createPlayer, createGameState, getCurrentPlayer,
  drawToFull, drawExtraCards, playCard, discardCard,
  buyTechnology, completeMission, drawEvent, endTurn,
  canBuyTech, canAttemptMission,
  MAX_HAND_SIZE, MAX_PLAYS_PER_TURN, MAX_DISCARDS_PER_TURN,
} from '../game/gameState';
import StarBackground from '../components/game/StarBackground';
import LanguageToggle from '../components/game/LanguageToggle';
import CardComponent from '../components/game/CardComponent';
import TechnologyPanel from '../components/game/TechnologyPanel';
import MissionPanel from '../components/game/MissionPanel';
import EventCard from '../components/game/EventCard';
import TransitionScreen from '../components/game/TransitionScreen';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, FlaskConical, Trophy, Globe2 } from 'lucide-react';

// ── Victory screen ────────────────────────────────────────────────────────────
function VictoryScreen({ winner, turn, onPlayAgain, onReturnToMenu }) {
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

// ── Other players progress strip ──────────────────────────────────────────────
function OtherPlayersStrip({ players, currentPlayerId, lang }) {
  const others = players.filter(p => p.id !== currentPlayerId);
  if (others.length === 0) return null;
  return (
    <div className="flex gap-2 flex-wrap">
      {others.map(p => {
        const color = COUNTRY_COLORS.find(c => c.id === p.colorId) || COUNTRY_COLORS[0];
        return (
          <div key={p.id} className="flex items-center gap-1.5 bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-sm border"
              style={{ backgroundColor: color.bg, borderColor: color.value }}
            >
              {p.emblem}
            </span>
            <span className="font-bold" style={{ color: color.value }}>{p.name}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-blue-300">🔬{p.resources.science}</span>
            <span className="text-yellow-300">💰{p.resources.money}</span>
            <span className="text-green-300">🤝{p.resources.consensus}</span>
            <span className="text-muted-foreground ml-1">{p.completedMissions.length}/3 🚀</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function GameBoard({ players: playerConfigs, onReturnToMenu, onPlayAgain }) {
  const { t, lang } = useLanguage();

  const [gameState, setGameState] = useState(() => {
    const players = playerConfigs.map(p => createPlayer(p.name, p.colorId, p.emblem));
    return createGameState(players);
  });

  const [sidePanelTab, setSidePanelTab] = useState('technologies');
  const [notification, setNotification] = useState(null);
  const [electricityChoice, setElectricityChoice] = useState(null); // null | 'science' | 'money'

  const currentPlayer = getCurrentPlayer(gameState);
  const colorObj = COUNTRY_COLORS.find(c => c.id === currentPlayer.colorId) || COUNTRY_COLORS[0];
  const playsRemaining = MAX_PLAYS_PER_TURN - gameState.playsThisTurn;

  // Badges for tab hints
  const availableTechs = getAvailableTechs(currentPlayer.unlockedTechs);
  const canAffordTech = availableTechs.some(tech => canBuyTech(currentPlayer, tech));
  const missionReady = allMissions.some(m =>
    !currentPlayer.completedMissions.includes(m.id) && canAttemptMission(currentPlayer, m)
  );

  const notify = useCallback((msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2200);
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const hasElectricity = currentPlayer.unlockedTechs.includes('electricity');

  const handleElectricityChoiceAndDraw = useCallback((choice) => {
    setElectricityChoice(null);
    // Store the choice on the player before drawing
    setGameState(s => {
      const updated = {
        ...s,
        players: s.players.map((p, i) =>
          i === s.currentPlayerIndex ? { ...p, electricityChoice: choice } : p
        ),
      };
      return drawToFull(updated);
    });
  }, []);

  const handleDraw = useCallback(() => {
    if (currentPlayer.hand.length >= MAX_HAND_SIZE) { notify(t('alreadyDrawn')); return; }
    if (hasElectricity) {
      setElectricityChoice('pending'); // show the choice UI
      return;
    }
    setGameState(s => drawToFull(s));
  }, [currentPlayer, t, notify, hasElectricity]);

  const handlePlayCard = useCallback((card) => {
    if (gameState.playsThisTurn >= MAX_PLAYS_PER_TURN) { notify(t('cantPlay')); return; }
    let newState = playCard(gameState, card);
    if (card.actionType === 'draw2') newState = drawExtraCards(newState, 2);
    setGameState(newState);
  }, [gameState, t, notify]);

  const handleDiscardCard = useCallback((card) => {
    if (gameState.discardsThisTurn >= MAX_DISCARDS_PER_TURN) { notify(t('cantDiscard')); return; }
    setGameState(s => discardCard(s, card));
  }, [gameState, t, notify]);

  const handleBuyTech = useCallback((tech) => {
    if (gameState.playsThisTurn >= MAX_PLAYS_PER_TURN) { notify(t('cantPlay')); return; }
    if (!canBuyTech(currentPlayer, tech)) { notify(t('notEnoughResources')); return; }
    setGameState(s => buyTechnology(s, tech));
    notify(t('techUnlocked') + ': ' + (lang === 'ko' ? tech.name_ko : tech.name_en));
  }, [gameState, currentPlayer, lang, t, notify]);

  const handleAttemptMission = useCallback((mission) => {
    if (gameState.playsThisTurn >= MAX_PLAYS_PER_TURN) { notify(t('cantPlay')); return; }
    if (!canAttemptMission(currentPlayer, mission)) { notify(t('notEnoughResources')); return; }
    setGameState(s => completeMission(s, mission));
    notify(t('missionCompleted') + ': ' + (lang === 'ko' ? mission.name_ko : mission.name_en));
  }, [gameState, currentPlayer, lang, t, notify]);

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

  // ── Special screens (use activeView pattern) ────────────────────────────────
  const { phase, winner } = gameState;

  if (winner) {
    const winnerPlayer = gameState.players.find(p => p.id === winner);
    return (
      <>
        <StarBackground />
        <VictoryScreen winner={winnerPlayer} turn={gameState.turn} onPlayAgain={onPlayAgain} onReturnToMenu={onReturnToMenu} />
      </>
    );
  }

  if (phase === 'transition') {
    const nextPlayer = gameState.players[gameState.currentPlayerIndex % gameState.players.length];
    return (
      <>
        <StarBackground />
        <TransitionScreen nextPlayer={nextPlayer} onStart={handleStartTurn} />
      </>
    );
  }

  // ── Guide message ───────────────────────────────────────────────────────────
  const getGuide = () => {
    if (phase === 'draw') return t('guide_draw');
    if (phase === 'play') {
      if (gameState.playsThisTurn >= MAX_PLAYS_PER_TURN) return t('guide_allPlayed');
      return t('guide_play');
    }
    if (phase === 'event') return t('guide_event');
    return '';
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background relative">
      <StarBackground />
      <LanguageToggle />

      {/* Electricity choice modal */}
      <AnimatePresence>
        {electricityChoice === 'pending' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-card border-2 border-yellow-400 rounded-2xl p-6 max-w-xs w-full text-center"
            >
              <div className="text-4xl mb-3">💡</div>
              <h3 className="text-lg font-heading font-bold mb-1">
                {lang === 'ko' ? '전기 보너스' : 'Electricity Bonus'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {lang === 'ko' ? '과학력 1 또는 자금 1을 선택하세요.' : 'Choose: gain 1 Science or 1 Money.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleElectricityChoiceAndDraw('science')}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors"
                >
                  🔬 {lang === 'ko' ? '과학력' : 'Science'}
                </button>
                <button
                  onClick={() => handleElectricityChoiceAndDraw('money')}
                  className="flex-1 py-3 bg-yellow-500 text-yellow-950 font-bold rounded-xl hover:bg-yellow-400 transition-colors"
                >
                  💰 {lang === 'ko' ? '자금' : 'Money'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event overlay — floats above everything */}
      <AnimatePresence>
        {phase === 'eventReveal' && gameState.lastEvent && (
          <EventCard event={gameState.lastEvent} onContinue={handleEventContinue} />
        )}
      </AnimatePresence>

      {/* Notification toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-bold shadow-lg pointer-events-none"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOP HEADER ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 border-b border-border/50 bg-background/85 backdrop-blur sticky top-0">
        <div className="max-w-screen-xl mx-auto px-3 py-2 flex flex-wrap items-center gap-3">

          {/* Player badge */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xl border-2 flex-shrink-0"
              style={{ backgroundColor: colorObj.bg, borderColor: colorObj.value }}
            >
              {currentPlayer.emblem}
            </div>
            <div>
              <p className="text-xs text-muted-foreground leading-none">{t('turn')} {gameState.turn}</p>
              <p className="text-sm font-bold leading-tight" style={{ color: colorObj.value }}>{currentPlayer.name}</p>
            </div>
          </div>

          <div className="w-px h-8 bg-border/50 hidden sm:block" />

          {/* Resources */}
          <div className="flex items-center gap-3 text-sm font-bold flex-wrap">
            <span className="flex items-center gap-1 text-blue-300">🔬 <span>{currentPlayer.resources.science}</span></span>
            <span className="flex items-center gap-1 text-yellow-300">💰 <span>{currentPlayer.resources.money}</span></span>
            <span className="flex items-center gap-1 text-green-300">🤝 <span>{currentPlayer.resources.consensus}</span></span>
          </div>

          <div className="w-px h-8 bg-border/50 hidden sm:block" />

          {/* Turn stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>🎴 {gameState.playsThisTurn}/{MAX_PLAYS_PER_TURN}</span>
            <span>🗑️ {gameState.discardsThisTurn}/{MAX_DISCARDS_PER_TURN}</span>
            <span>📦 {gameState.mainDeck.length}</span>
          </div>

          <div className="w-px h-8 bg-border/50 hidden sm:block" />

          {/* Mission dots */}
          <div className="flex items-center gap-1.5">
            {['test_rocket', 'launch_satellite', 'crewed_spaceflight'].map(mid => (
              <div
                key={mid}
                className={`w-3 h-3 rounded-full border-2 ${currentPlayer.completedMissions.includes(mid) ? 'bg-yellow-400 border-yellow-300' : 'bg-muted border-border'}`}
              />
            ))}
            <span className="text-xs text-muted-foreground">{currentPlayer.completedMissions.length}/3</span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-3 py-3">

        {/* Other players */}
        <div className="mb-3">
          <OtherPlayersStrip players={gameState.players} currentPlayerId={currentPlayer.id} lang={lang} />
        </div>

        {/* Two-column grid: left=play area, right=side panel */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] gap-4">

          {/* ── LEFT: PLAY AREA ─────────────────────────────────────────────── */}
          <div className="space-y-3">

            {/* Guidance banner */}
            <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-2.5 text-sm text-primary font-medium text-center">
              {getGuide()}
            </div>

            {/* Deck info + action buttons */}
            <div className="bg-card border border-border rounded-xl p-3 space-y-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>🃏 {lang === 'ko' ? '메인 덱' : 'Main Deck'}: {gameState.mainDeck.length}</span>
                <span>📋 {lang === 'ko' ? '버린 카드' : 'Discard'}: {(gameState.discardPile || []).length}</span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
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
                      onClick={handleDrawEvent}
                      className="flex-1 py-2.5 bg-purple-600/80 text-white font-bold rounded-xl hover:bg-purple-600 transition-colors text-sm"
                    >
                      🎲 {t('drawEventCard')}
                    </button>
                    <button
                      onClick={handleEndTurn}
                      className="flex-1 py-2.5 bg-secondary text-foreground font-bold rounded-xl hover:bg-secondary/80 transition-colors text-sm border border-border"
                    >
                      {t('endTurn')} →
                    </button>
                  </>
                )}
              </div>

              {/* Plays remaining indicator */}
              {phase === 'play' && (
                <div className="flex gap-1 items-center">
                  <span className="text-xs text-muted-foreground mr-1">{lang === 'ko' ? '행동:' : 'Actions:'}</span>
                  {Array.from({ length: MAX_PLAYS_PER_TURN }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full border-2 transition-all ${i < gameState.playsThisTurn ? 'bg-primary/30 border-primary/30' : 'bg-primary border-primary'}`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">
                    {playsRemaining} {lang === 'ko' ? '남음' : 'left'}
                  </span>
                </div>
              )}
            </div>

            {/* ── HAND ─────────────────────────────────────────────────────── */}
            <div className="bg-card border border-border rounded-xl p-3">
              <h3 className="text-sm font-bold mb-2.5 text-foreground">
                🃏 {t('yourHand')} <span className="text-muted-foreground font-normal">({currentPlayer.hand.length} {t('cardsInHand')})</span>
              </h3>

              {currentPlayer.hand.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-4xl mb-2">🃏</p>
                  <p className="text-sm">{phase === 'draw' ? t('guide_draw') : (lang === 'ko' ? '손에 카드 없음' : 'No cards in hand')}</p>
                </div>
              ) : (
                <div className="overflow-x-auto pb-2">
                  <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
                    {currentPlayer.hand.map(card => (
                      <div key={card.uid} className="w-44 flex-shrink-0">
                        <CardComponent
                          card={card}
                          canPlay={phase === 'play' && gameState.playsThisTurn < MAX_PLAYS_PER_TURN}
                          canDiscard={phase === 'play' && gameState.discardsThisTurn < MAX_DISCARDS_PER_TURN}
                          onPlay={handlePlayCard}
                          onDiscard={handleDiscardCard}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: SIDE PANEL ────────────────────────────────────────────── */}
          <aside className="space-y-3">

            {/* Tab switcher */}
            <div className="flex rounded-xl overflow-hidden border border-border bg-card">
              <button
                onClick={() => setSidePanelTab('technologies')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold transition-colors relative
                  ${sidePanelTab === 'technologies' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <FlaskConical className="w-4 h-4" />
                {lang === 'ko' ? '기술' : 'Technologies'}
                {canAffordTech && sidePanelTab !== 'technologies' && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                )}
              </button>
              <button
                onClick={() => setSidePanelTab('missions')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold transition-colors relative
                  ${sidePanelTab === 'missions' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Rocket className="w-4 h-4" />
                {lang === 'ko' ? '임무' : 'Missions'}
                {missionReady && sidePanelTab !== 'missions' && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                )}
              </button>
            </div>

            {/* Affordability hint */}
            {phase === 'play' && sidePanelTab === 'technologies' && canAffordTech && (
              <div className="bg-teal-950/40 border border-teal-500/40 rounded-xl px-3 py-2 text-sm text-teal-300 font-medium text-center">
                {lang === 'ko' ? '✨ 새로운 기술을 해금할 수 있어요!' : '✨ You can unlock a new technology!'}
              </div>
            )}
            {phase === 'play' && sidePanelTab === 'missions' && missionReady && (
              <div className="bg-yellow-950/40 border border-yellow-500/40 rounded-xl px-3 py-2 text-sm text-yellow-300 font-medium text-center">
                {lang === 'ko' ? '🚀 우주 임무를 수행할 수 있어요!' : '🚀 A space mission is ready!'}
              </div>
            )}

            {/* Panel content */}
            <div className="bg-card border border-border rounded-xl p-3 overflow-y-auto max-h-[60vh]">
              {sidePanelTab === 'technologies' ? (
                <TechnologyPanel
                  player={currentPlayer}
                  playsRemaining={phase === 'play' ? playsRemaining : 0}
                  onBuy={handleBuyTech}
                />
              ) : (
                <MissionPanel
                  player={currentPlayer}
                  playsRemaining={phase === 'play' ? playsRemaining : 0}
                  onAttempt={handleAttemptMission}
                />
              )}
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}