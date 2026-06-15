import React, { useState, useCallback } from 'react';
import { useLanguage } from '../game/LanguageContext';
import { eraData, infrastructureCards, policyCards } from '../game/cardData';
import { createInitialState, generateResources, drawCards, canPlayCard, playCard, triggerEvent, processAITurns, getEraProgress } from '../game/gameEngine';
import StarBackground from '../components/game/StarBackground';
import ResourceBar from '../components/game/ResourceBar';
import PhaseIndicator from '../components/game/PhaseIndicator';
import GameCard from '../components/game/GameCard';
import OpponentPanel from '../components/game/OpponentPanel';
import TechTreeView from '../components/game/TechTreeView';
import MissionView from '../components/game/MissionView';
import EventPopup from '../components/game/EventPopup';
import EducationalPopup from '../components/game/EducationalPopup';
import VictoryScreen from '../components/game/VictoryScreen';
import { Rocket, TreePine, Target, Building2, ScrollText, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

export default function GameBoard({ playerName, difficulty, onReturnToMenu }) {
  const { t, lang, cardText } = useLanguage();
  const { toast } = useToast();
  const [gameState, setGameState] = useState(() => createInitialState(playerName, difficulty));
  const [showTechTree, setShowTechTree] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [showEvent, setShowEvent] = useState(false);
  const [showEducational, setShowEducational] = useState(false);
  const [resourceGain, setResourceGain] = useState(null);

  const player = gameState.playerCountry;
  const currentEraData = eraData.find(e => e.id === player.currentEra) || eraData[0];
  const eraProgress = getEraProgress(player);

  // Phase progression
  const advancePhase = useCallback(() => {
    setGameState(prev => {
      let next = { ...prev };

      if (prev.phase === 'resource') {
        // Generate resources
        next = generateResources(next);
        setResourceGain(next.resourceGain);
        next.phase = 'draw';
        toast({ title: t('gainedResources'), duration: 1500 });
      } else if (prev.phase === 'draw') {
        // Draw cards
        next = drawCards(next, 2);
        next.phase = 'action';
        next.actionsRemaining = next.maxActions;
        toast({ title: t('drewCards'), duration: 1500 });
      } else if (prev.phase === 'action') {
        // Move to event phase
        next.phase = 'event';
        next = triggerEvent(next);
        if (next.currentEvent) {
          setShowEvent(true);
        } else {
          // Skip to AI phase
          next.phase = 'ai';
          next = processAITurns(next);
          if (next.gameOver) return next;
          next.phase = 'end';
        }
      } else if (prev.phase === 'event') {
        next.phase = 'ai';
        next = processAITurns(next);
        if (next.gameOver) return next;
        next.phase = 'end';
      } else if (prev.phase === 'ai' || prev.phase === 'end') {
        // Start new turn
        next.turn += 1;
        next.phase = 'resource';
        next.currentEvent = null;
        setResourceGain(null);
      }

      return next;
    });
  }, [t, toast]);

  const handlePlayCard = useCallback((card) => {
    if (gameState.phase !== 'action') return;
    
    const check = canPlayCard(gameState, card);
    if (!check.canPlay) {
      toast({ title: t(check.reason), variant: 'destructive', duration: 2000 });
      return;
    }

    setGameState(prev => {
      const next = playCard(prev, card);
      if (next.educationalPopup) {
        setShowEducational(true);
      }
      return next;
    });
  }, [gameState, t, toast]);

  const handleMissionAttempt = useCallback((mission) => {
    const check = canPlayCard(gameState, mission);
    if (!check.canPlay) {
      toast({ title: t(check.reason), variant: 'destructive', duration: 2000 });
      return;
    }

    setGameState(prev => {
      const next = playCard(prev, mission);
      if (next.educationalPopup) {
        setShowEducational(true);
      }
      return next;
    });
    setShowMissions(false);
  }, [gameState, t, toast]);

  const handleCloseEvent = () => {
    setShowEvent(false);
    // Continue to AI phase
    setGameState(prev => {
      let next = { ...prev, phase: 'ai' };
      next = processAITurns(next);
      if (next.gameOver) return next;
      next.phase = 'end';
      return next;
    });
  };

  // Determine button label for current phase
  const getPhaseButtonLabel = () => {
    const phaseLabels = {
      resource: t('resourcePhase'),
      draw: t('drawPhase'),
      action: t('endTurn'),
      event: t('eventPhase'),
      ai: t('aiPhase'),
      end: t('endTurn'),
    };
    return phaseLabels[gameState.phase] || t('endTurn');
  };

  // Built infrastructure names
  const builtInfraCards = player.builtInfra.map(id => infrastructureCards.find(c => c.id === id)).filter(Boolean);
  const activePolicyCards = player.activePolicies.map(id => policyCards.find(c => c.id === id)).filter(Boolean);

  const winnerAI = gameState.winner && gameState.winner !== 'player'
    ? gameState.aiPlayers.find(a => a.id === gameState.winner)
    : null;

  return (
    <div className="min-h-screen relative">
      <StarBackground />

      {/* Game Over Screen */}
      {gameState.gameOver && (
        <VictoryScreen
          isWinner={gameState.winner === 'player'}
          turn={gameState.turn}
          playerName={playerName}
          winnerName={winnerAI ? (lang === 'ko' ? winnerAI.name_ko : winnerAI.name_en) : null}
          aiPlayers={gameState.aiPlayers}
          onReturnToMenu={onReturnToMenu}
        />
      )}

      {/* Event Popup */}
      {showEvent && gameState.currentEvent && (
        <EventPopup event={gameState.currentEvent} onClose={handleCloseEvent} />
      )}

      {/* Educational Popup */}
      {showEducational && gameState.educationalPopup && (
        <EducationalPopup
          card={gameState.educationalPopup}
          onClose={() => {
            setShowEducational(false);
            setGameState(prev => ({ ...prev, educationalPopup: null }));
          }}
        />
      )}

      {/* Tech Tree Overlay */}
      {showTechTree && (
        <TechTreeView
          unlockedTechs={player.unlockedTechs}
          onClose={() => setShowTechTree(false)}
        />
      )}

      {/* Missions Overlay */}
      {showMissions && (
        <MissionView
          playerCountry={player}
          actionsRemaining={gameState.actionsRemaining}
          onAttempt={handleMissionAttempt}
          onClose={() => setShowMissions(false)}
        />
      )}

      {/* Main Game UI */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="border-b border-border/30 bg-card/60 backdrop-blur-sm px-3 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* Country & Turn Info */}
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-sm font-heading font-bold">{playerName}</h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{t('turn')} {gameState.turn}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span className={currentEraData.color}>{lang === 'ko' ? currentEraData.name_ko : currentEraData.name_en}</span>
                </div>
              </div>
            </div>

            {/* Resources */}
            <ResourceBar resources={player.resources} gain={resourceGain} />

            {/* Actions */}
            <div className="flex items-center gap-2">
              {gameState.phase === 'action' && (
                <span className="text-xs text-muted-foreground">
                  {gameState.actionsRemaining} {t('actionsRemaining')}
                </span>
              )}
            </div>
          </div>

          {/* Phase Indicator */}
          <div className="mt-2">
            <PhaseIndicator currentPhase={gameState.phase} />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 p-3 sm:p-4 overflow-auto">
          {/* Left Sidebar - Opponents & Infra */}
          <aside className="lg:w-64 flex-shrink-0 space-y-4 order-2 lg:order-1">
            <OpponentPanel aiPlayers={gameState.aiPlayers} />

            {/* Infrastructure */}
            {builtInfraCards.length > 0 && (
              <div>
                <h3 className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3 h-3" /> {t('activeInfra')}
                </h3>
                <div className="space-y-1.5">
                  {builtInfraCards.map(inf => (
                    <GameCard key={inf.id} card={inf} compact />
                  ))}
                </div>
              </div>
            )}

            {/* Policies */}
            {activePolicyCards.length > 0 && (
              <div>
                <h3 className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ScrollText className="w-3 h-3" /> {t('activePolicies')}
                </h3>
                <div className="space-y-1.5">
                  {activePolicyCards.map(pol => (
                    <GameCard key={pol.id} card={pol} compact />
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Center - Hand & Actions */}
          <main className="flex-1 flex flex-col gap-4 order-1 lg:order-2">
            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowTechTree(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary/60 border border-border/40 text-sm hover:bg-secondary transition-colors"
              >
                <TreePine className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">{t('techTree')}</span>
              </button>
              <button
                onClick={() => setShowMissions(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary/60 border border-border/40 text-sm hover:bg-secondary transition-colors"
              >
                <Target className="w-4 h-4 text-yellow-400" />
                <span className="hidden sm:inline">{t('missions')}</span>
                <span className="text-xs text-muted-foreground">{player.completedMissions.length}/5</span>
              </button>
              <div className="flex-1" />
              <button
                onClick={advancePhase}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/80 transition-colors"
              >
                <SkipForward className="w-4 h-4" />
                {getPhaseButtonLabel()}
              </button>
            </div>

            {/* Era Progress Bar */}
            <div className="rounded-lg bg-secondary/30 border border-border/30 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-heading ${currentEraData.color}`}>
                  {t('era')} {player.currentEra}: {lang === 'ko' ? currentEraData.name_ko : currentEraData.name_en}
                </span>
                <span className="text-xs text-muted-foreground">
                  {eraProgress.current}/{eraProgress.total}
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${eraProgress.total > 0 ? (eraProgress.current / eraProgress.total) * 100 : 0}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Player Hand */}
            <div>
              <h3 className="text-sm font-heading font-semibold mb-3 flex items-center gap-2">
                {t('yourHand')}
                <span className="text-xs text-muted-foreground font-normal">({player.hand.length})</span>
              </h3>
              
              {player.hand.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {t('noCards')}
                </div>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-3 snap-x">
                  <AnimatePresence mode="popLayout">
                    {player.hand.map(card => (
                      <motion.div
                        key={card.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="snap-start flex-shrink-0"
                      >
                        <GameCard
                          card={card}
                          canPlay={gameState.phase === 'action' ? canPlayCard(gameState, card) : { canPlay: false, reason: 'wrongPhase' }}
                          onPlay={handlePlayCard}
                          disabled={gameState.phase !== 'action'}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Phase hint */}
            {gameState.phase !== 'action' && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  {gameState.phase === 'resource' && (lang === 'ko' ? '자원 단계를 진행하세요 →' : 'Advance to collect resources →')}
                  {gameState.phase === 'draw' && (lang === 'ko' ? '카드를 뽑으세요 →' : 'Draw your cards →')}
                  {gameState.phase === 'event' && (lang === 'ko' ? '사건 단계를 진행하세요 →' : 'Check for events →')}
                  {gameState.phase === 'ai' && (lang === 'ko' ? 'AI 턴을 진행하세요 →' : 'Process AI turns →')}
                  {gameState.phase === 'end' && (lang === 'ko' ? '다음 턴을 시작하세요 →' : 'Start next turn →')}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}