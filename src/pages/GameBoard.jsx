import React, { useState, useCallback, useRef } from 'react';
import { useLanguage } from '../game/LanguageContext';
import { COUNTRY_COLORS } from '../game/gameData';
import {
  createPlayer, createGameState, getCurrentPlayer,
  drawToFull, drawExtraCards, playCard, discardCard,
  buyTechnology, completeMission, drawEvent, endTurn,
  resolveTargetCard, resolveExchangeCards,
  canBuyTech, canAttemptMission,
  MAX_HAND_SIZE, MAX_PLAYS_PER_TURN, MAX_DISCARDS_PER_TURN,
} from '../game/gameState';
import { getAvailableTechs, missions } from '../game/gameData';
import StarBackground from '../components/game/StarBackground';
import LanguageToggle from '../components/game/LanguageToggle';
import CardComponent from '../components/game/CardComponent';
import TechnologyPanel from '../components/game/TechnologyPanel';
import MissionPanel from '../components/game/MissionPanel';
import EventCard from '../components/game/EventCard';
import TransitionScreen from '../components/game/TransitionScreen';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, FlaskConical, ChevronDown, ChevronUp, Save, FolderOpen } from 'lucide-react';


// ---- Victory Screen ----
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

// ---- Resource Bar (inline, compact) ----
function ResourceRow({ resources }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="flex items-center gap-1 text-blue-300 font-bold text-sm">🔬<span>{resources.science}</span></span>
      <span className="flex items-center gap-1 text-yellow-300 font-bold text-sm">💰<span>{resources.money}</span></span>
      <span className="flex items-center gap-1 text-green-300 font-bold text-sm">🤝<span>{resources.consensus}</span></span>
    </div>
  );
}

// ---- Main Game Board ----
export default function GameBoard({ players: playerConfigs, onReturnToMenu, onPlayAgain }) {
  const { t, lang } = useLanguage();

  const [gameState, setGameState] = useState(() => {
    const players = playerConfigs.map(p => createPlayer(p.name, p.colorId, p.emblem));
    return createGameState(players);
  });

  const [sidePanelTab, setSidePanelTab] = useState('technologies');
  const [showHand, setShowHand] = useState(true);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  const handleSave = useCallback(() => {
    const blob = new Blob([JSON.stringify(gameState)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `race-to-space-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notify(lang === 'ko' ? '게임이 다운로드되었습니다! 📥' : 'Game downloaded! 📥');
  }, [gameState, lang]);

  const handleLoad = useCallback(() => {
    fileInputRef.current.click();
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        setGameState(JSON.parse(event.target.result));
        notify(lang === 'ko' ? '게임을 불러왔습니다! 📂' : 'Game loaded! 📂');
      } catch {
        notify(lang === 'ko' ? '잘못된 파일입니다.' : 'Invalid save file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [lang]);

  const currentPlayer = getCurrentPlayer(gameState);
  const colorObj = COUNTRY_COLORS.find(c => c.id === currentPlayer.colorId) || COUNTRY_COLORS[0];
  const playsRemaining = MAX_PLAYS_PER_TURN - gameState.playsThisTurn;

  const notify = useCallback((msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  const handleDraw = useCallback(() => {
    if (currentPlayer.hand.length >= MAX_HAND_SIZE) {
      setGameState(s => ({ ...s, phase: 'play' }));
      return;
    }
    setGameState(s => drawToFull(s));
  }, [currentPlayer, t, notify]);

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

  const handleSelectTarget = useCallback((targetPlayerId) => {
    setGameState(s => resolveTargetCard(s, targetPlayerId));
  }, []);

  const handleCancelTarget = useCallback(() => {
    setGameState(s => ({ ...s, pendingAction: null }));
  }, []);

  const handleToggleExchangeCard = useCallback((uid) => {
    setGameState(s => {
      if (!s.pendingAction) return s;
      const selected = s.pendingAction.selectedUids || [];
      const already = selected.includes(uid);
      if (!already && selected.length >= 2) return s; // max 2
      return {
        ...s,
        pendingAction: {
          ...s.pendingAction,
          selectedUids: already ? selected.filter(u => u !== uid) : [...selected, uid],
        },
      };
    });
  }, []);

  const handleConfirmExchange = useCallback(() => {
    setGameState(s => resolveExchangeCards(s, s.pendingAction.selectedUids));
  }, []);

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

  const { phase, winner } = gameState;

  // ---- Full-screen special states ----
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
    const nextPlayer = gameState.players[(gameState.currentPlayerIndex) % gameState.players.length];
    return (
      <>
        <StarBackground />
        <TransitionScreen nextPlayer={nextPlayer} onStart={handleStartTurn} />
      </>
    );
  }

  // ---- Badge helpers ----
  const availableTechs = getAvailableTechs(currentPlayer.unlockedTechs);
  const canAffordTech = availableTechs.some(tech => canBuyTech(currentPlayer, tech));
  const missionReady = missions.some(m => !currentPlayer.completedMissions.includes(m.id) && canAttemptMission(currentPlayer, m));

  const getGuide = () => {
    if (phase === 'draw') return t('guide_draw');
    if (phase === 'play') {
      if (gameState.playsThisTurn >= MAX_PLAYS_PER_TURN) return t('guide_allPlayed');
      return t('guide_play');
    }
    if (phase === 'event') return t('guide_event');
    return '';
  };

  return (
    <div className="min-h-screen bg-background relative">
      <StarBackground />

      {/* Event overlay (modal on top) */}
      <AnimatePresence>
        {phase === 'eventReveal' && gameState.lastEvent && (
          <EventCard event={gameState.lastEvent} onContinue={handleEventContinue} />
        )}
      </AnimatePresence>

      {/* Target selection overlay */}
      <AnimatePresence>
        {gameState.pendingAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card border-2 border-primary rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="text-4xl mb-2">{gameState.pendingAction.card.emoji}</div>
              <h3 className="text-lg font-bold mb-1">
                {lang === 'ko' ? gameState.pendingAction.card.name_ko : gameState.pendingAction.card.name_en}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {lang === 'ko' ? '대상 국가를 선택하세요' : 'Choose a target country'}
              </p>
              <div className="space-y-2 mb-4">
                {gameState.players
                  .filter(p => p.id !== currentPlayer.id)
                  .map(p => {
                    const col = COUNTRY_COLORS.find(c => c.id === p.colorId) || COUNTRY_COLORS[0];
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectTarget(p.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 hover:bg-white/10 transition-colors font-bold"
                        style={{ borderColor: col.value, color: col.value }}
                      >
                        <span className="text-2xl">{p.emblem}</span>
                        <span>{p.name}</span>
                      </button>
                    );
                  })}
              </div>
              <button
                onClick={handleCancelTarget}
                className="w-full py-2.5 rounded-xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors text-sm"
              >
                {lang === 'ko' ? '취소' : 'Cancel'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card exchange overlay (Research Team) */}
      <AnimatePresence>
        {gameState.pendingAction?.type === 'exchangeCards' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card border-2 border-orange-400 rounded-2xl p-5 max-w-lg w-full shadow-2xl"
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-1">👩‍🔬</div>
                <h3 className="text-lg font-bold">{lang === 'ko' ? '연구팀' : 'Research Team'}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {lang === 'ko' ? '교환할 카드 2장을 선택하세요' : 'Select 2 cards to exchange'}
                  {' '}({gameState.pendingAction.selectedUids.length}/2)
                </p>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {currentPlayer.hand
                  .filter(c => c.uid !== gameState.pendingAction.card.uid)
                  .map(c => {
                    const isSelected = gameState.pendingAction.selectedUids.includes(c.uid);
                    return (
                      <button
                        key={c.uid}
                        onClick={() => handleToggleExchangeCard(c.uid)}
                        className={`rounded-xl border-2 p-2 flex flex-col items-center gap-1 transition-all
                          ${isSelected ? 'border-orange-400 bg-orange-900/40 scale-105' : 'border-border bg-card/60 hover:border-orange-300'}`}
                      >
                        <span className="text-2xl">{c.emoji}</span>
                        <span className="text-[10px] text-center font-medium leading-tight text-white/80 line-clamp-2">
                          {lang === 'ko' ? c.name_ko : c.name_en}
                        </span>
                        {isSelected && <span className="text-[10px] text-orange-300 font-bold">✓</span>}
                      </button>
                    );
                  })}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCancelTarget}
                  className="flex-1 py-2.5 rounded-xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors text-sm"
                >
                  {lang === 'ko' ? '취소' : 'Cancel'}
                </button>
                <button
                  onClick={handleConfirmExchange}
                  disabled={gameState.pendingAction.selectedUids.length !== 2}
                  className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-400 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {lang === 'ko' ? '교환하기 🔄' : 'Exchange 🔄'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-bold shadow-lg pointer-events-none"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── TOP BAR ── */}
        <header className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border/50 bg-background/80 backdrop-blur flex-shrink-0 flex-wrap">
          {/* Player info */}
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xl border-2 flex-shrink-0"
              style={{ backgroundColor: colorObj.bg, borderColor: colorObj.value }}
            >
              {currentPlayer.emblem}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('turn')} {gameState.turn}</p>
              <p className="text-sm font-bold leading-tight" style={{ color: colorObj.value }}>{currentPlayer.name}</p>
            </div>
          </div>

          {/* Resources */}
          <ResourceRow resources={currentPlayer.resources} />

          {/* Stats */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
            <span>🎴 {gameState.playsThisTurn}/{MAX_PLAYS_PER_TURN}</span>
            <span>🗑️ {gameState.discardsThisTurn}/{MAX_DISCARDS_PER_TURN}</span>
            <span>📦 {gameState.mainDeck.length}</span>
          </div>

          {/* Mission dots */}
          <div className="flex items-center gap-1">
            {['test_rocket', 'launch_satellite', 'crewed_spaceflight'].map(mid => (
              <div
                key={mid}
                className={`w-3 h-3 rounded-full border-2 ${currentPlayer.completedMissions.includes(mid) ? 'bg-yellow-400 border-yellow-300' : 'bg-muted border-border'}`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">{currentPlayer.completedMissions.length}/3</span>
          </div>

          <LanguageToggle />

          {/* Save / Load */}
          <div className="flex items-center gap-1">
            <button onClick={handleSave} title="Save" className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-secondary/80 border border-border hover:bg-secondary transition-colors text-xs font-medium text-foreground">
              <Save className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">{lang === 'ko' ? '저장' : 'Save'}</span>
            </button>
            <button onClick={handleLoad} title="Load" className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-secondary/80 border border-border hover:bg-secondary transition-colors text-xs font-medium text-foreground">
              <FolderOpen className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden sm:inline">{lang === 'ko' ? '불러오기' : 'Load'}</span>
            </button>
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />
          </div>
        </header>

        {/* ── MIDDLE: main area + side panel ── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] gap-0">

          {/* LEFT: play area */}
          <div className="flex flex-col p-3 gap-3">

            {/* Guidance banner */}
            <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-2 text-sm text-primary font-medium text-center">
              {getGuide()}
            </div>

            {/* Stats row (mobile) */}
            <div className="flex sm:hidden items-center gap-3 text-xs text-muted-foreground px-1">
              <span>🎴 {gameState.playsThisTurn}/{MAX_PLAYS_PER_TURN}</span>
              <span>🗑️ {gameState.discardsThisTurn}/{MAX_DISCARDS_PER_TURN}</span>
              <span>📦 {gameState.mainDeck.length}</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 flex-wrap">
              {phase === 'draw' && (
                <button
                  onClick={handleDraw}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/80 transition-colors text-sm"
                >
                  {currentPlayer.hand.length >= MAX_HAND_SIZE ? (lang === 'ko' ? '▶️ 플레이 시작' : '▶️ Start Playing') : `🃏 ${t('drawCards')} (${currentPlayer.hand.length}/${MAX_HAND_SIZE})`}
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
                    {t('endTurn')}
                  </button>
                </>
              )}
            </div>

            {/* Hand section */}
            <div className="flex-1">
              <button
                onClick={() => setShowHand(h => !h)}
                className="flex items-center gap-2 text-sm font-bold text-foreground mb-2 hover:text-primary transition-colors w-full text-left"
              >
                {showHand ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                {t('yourHand')} ({currentPlayer.hand.length} {t('cardsInHand')})
              </button>

              {showHand && (
                currentPlayer.hand.length === 0 ? (
                  <div className="text-center text-muted-foreground py-10">
                    <p className="text-4xl mb-2">🃏</p>
                    <p className="text-sm">{phase === 'draw' ? t('guide_draw') : (lang === 'ko' ? '카드가 없습니다' : 'No cards in hand')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-2">
                    {currentPlayer.hand.map(card => (
                      <div key={card.uid}>
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
                )
              )}
            </div>
          </div>

          {/* RIGHT: side panel */}
          <aside className="border-t lg:border-t-0 lg:border-l border-border/50 bg-background/60 flex flex-col">

            {/* Tab switcher */}
            <div className="flex border-b border-border/50 flex-shrink-0">
              <button
                onClick={() => setSidePanelTab('technologies')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold transition-colors relative
                  ${sidePanelTab === 'technologies' ? 'text-teal-300 border-b-2 border-teal-400 bg-teal-950/20' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <FlaskConical className="w-4 h-4" />
                {lang === 'ko' ? '기술' : 'Technologies'}
                {canAffordTech && playsRemaining > 0 && (
                  <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                )}
              </button>
              <button
                onClick={() => setSidePanelTab('missions')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold transition-colors relative
                  ${sidePanelTab === 'missions' ? 'text-yellow-300 border-b-2 border-yellow-400 bg-yellow-950/20' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Rocket className="w-4 h-4" />
                {lang === 'ko' ? '임무' : 'Missions'}
                {missionReady && playsRemaining > 0 && (
                  <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                )}
              </button>
            </div>

            {/* Panel content */}
            <div className="flex-1 overflow-y-auto p-3 max-h-[60vh] lg:max-h-none">
              {sidePanelTab === 'technologies' ? (
                <TechnologyPanel
                  player={currentPlayer}
                  playsRemaining={playsRemaining}
                  onBuyTech={handleBuyTech}
                />
              ) : (
                <MissionPanel
                  player={currentPlayer}
                  playsRemaining={playsRemaining}
                  onAttemptMission={handleAttemptMission}
                />
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}