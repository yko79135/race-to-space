import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../game/LanguageContext';
import { technologies, stages, missions } from '../../game/gameData';
import { canBuyTech } from '../../game/gameState';
import { getFinalTechCost } from '../../game/techEffects';
import { X, Check, Lock, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { COUNTRY_COLORS } from '../../game/gameData';

// ── Path filter definitions ────────────────────────────────────────────────────
const PATH_FILTERS = {
  all: [],
  direct: ['controlled_fire','spoken_language','basic_tools','writing','math','astronomy','experiments','physics','chemistry','precision','steam','electricity','engines','radio','electronics','computers','rockets','guidance','heatshield','lifesupport','satellites','crewedship'],
  economy: ['farming','steam','factories','electricity'],
  science: ['writing','math','astronomy','experiments','physics','chemistry','computers'],
  flight: ['engines','airplanes','rockets','guidance','heatshield'],
};

// ── Status helper ─────────────────────────────────────────────────────────────
function getTechStatus(tech, player) {
  if (player.unlockedTechs.includes(tech.id)) return 'owned';
  const prereqsMet = !tech.prereqs || tech.prereqs.length === 0 ||
    tech.prereqs.every(p => player.unlockedTechs.includes(p));
  if (!prereqsMet) return 'locked';
  return canBuyTech(player, tech) ? 'buyable' : 'needs_resources';
}

// ── Cost badge ─────────────────────────────────────────────────────────────────
function CostBadge({ science, money, consensus, small }) {
  const cls = small ? 'text-[9px] px-1 py-0.5' : 'text-[10px] px-1.5 py-0.5';
  return (
    <div className="flex flex-wrap gap-0.5">
      {science > 0 && <span className={`${cls} bg-blue-500/20 text-blue-300 rounded font-bold`}>🔬{science}</span>}
      {money > 0 && <span className={`${cls} bg-yellow-500/20 text-yellow-300 rounded font-bold`}>💰{money}</span>}
      {consensus > 0 && <span className={`${cls} bg-green-500/20 text-green-300 rounded font-bold`}>🤝{consensus}</span>}
    </div>
  );
}

// ── Mission icon helper ────────────────────────────────────────────────────────
const MISSION_META = {
  test_rocket:       { emoji: '🚀', name_en: 'Test Rocket',       name_ko: '시험 로켓' },
  launch_satellite:  { emoji: '🛰️', name_en: 'Launch a Satellite', name_ko: '인공위성 발사' },
  crewed_spaceflight:{ emoji: '🧑‍🚀', name_en: 'Crewed Spaceflight', name_ko: '유인 우주 비행' },
};

function missionsForTech(techId) {
  return missions.filter(m => m.reqTechs.includes(techId));
}

// ── Detail panel ──────────────────────────────────────────────────────────────
function TechDetailPanel({ tech, player, lang, t, onClose }) {
  const status = getTechStatus(tech, player);
  const finalCost = getFinalTechCost(player, tech);
  const hasDiscount =
    finalCost.science < (tech.cost?.science ?? 0) ||
    finalCost.money < (tech.cost?.money ?? 0) ||
    finalCost.consensus < (tech.cost?.consensus ?? 0);

  const missionLinks = missionsForTech(tech.id);

  const unlocks = useMemo(() =>
    technologies.filter(t2 => t2.prereqs.includes(tech.id)),
  [tech.id]);

  const statusLabel = {
    owned:          { label: lang === 'ko' ? '해금됨' : 'Unlocked',        cls: 'bg-green-500/20 text-green-300 border-green-500/40' },
    buyable:        { label: lang === 'ko' ? '연구 가능' : 'Available',     cls: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
    needs_resources:{ label: lang === 'ko' ? '자원 부족' : 'Need Resources', cls: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
    locked:         { label: lang === 'ko' ? '잠김' : 'Locked',            cls: 'bg-muted text-muted-foreground border-border' },
  }[status];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div
        className="bg-slate-900 border-2 rounded-2xl p-5 max-w-md w-full max-h-[90vh] overflow-y-auto"
        style={{ borderColor: tech.color }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{tech.emoji}</span>
            <div>
              <h2 className="text-lg font-heading font-bold leading-tight" style={{ color: tech.color }}>
                {lang === 'ko' ? tech.name_ko : tech.name_en}
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                {tech.isCore
                  ? <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-bold">{t('coreTech')}</span>
                  : <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-bold">{t('optionalTech')}</span>
                }
                <span className={`text-[9px] border px-1.5 py-0.5 rounded font-bold ${statusLabel.cls}`}>
                  {statusLabel.label}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3">
          {lang === 'ko' ? tech.desc_ko : tech.desc_en}
        </p>

        {/* Cost */}
        {status !== 'owned' && (
          <div className="bg-muted/20 border border-border rounded-xl p-3 mb-3">
            <p className="text-xs font-bold text-muted-foreground mb-1.5">{t('cost')}</p>
            <CostBadge {...finalCost} />
            {hasDiscount && (
              <p className="text-[10px] text-muted-foreground line-through mt-1">
                {lang === 'ko' ? '원래: ' : 'Base: '}
                🔬{tech.cost.science} 💰{tech.cost.money} 🤝{tech.cost.consensus}
              </p>
            )}
          </div>
        )}

        {/* Permanent Effect */}
        {(tech.effect_en || tech.permanentEffects?.length > 0) && (
          <div className="bg-accent/10 border border-accent/30 rounded-xl px-3 py-2 mb-3">
            <p className="text-[10px] font-bold text-accent mb-1 flex items-center gap-1">
              <Zap className="w-3 h-3" />{t('permanentEffect')}
            </p>
            <p className="text-xs text-accent/80">{lang === 'ko' ? tech.effect_ko : tech.effect_en}</p>
          </div>
        )}

        {/* Prerequisites */}
        <div className="mb-3">
          <p className="text-xs font-bold text-muted-foreground mb-1">{t('prerequisite')}</p>
          {tech.prereqs.length === 0
            ? <span className="text-xs text-green-400">{lang === 'ko' ? '없음' : 'None'}</span>
            : <div className="flex flex-wrap gap-1">
                {tech.prereqs.map(pid => {
                  const pt = technologies.find(x => x.id === pid);
                  const met = player.unlockedTechs.includes(pid);
                  return (
                    <span key={pid} className={`text-xs px-1.5 py-0.5 rounded font-medium ${met ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                      {pt ? (lang === 'ko' ? pt.name_ko : pt.name_en) : pid}
                    </span>
                  );
                })}
              </div>
          }
        </div>

        {/* Unlocks */}
        {unlocks.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-bold text-muted-foreground mb-1">{t('unlocks')}</p>
            <div className="flex flex-wrap gap-1">
              {unlocks.map(u => (
                <span key={u.id} className="text-xs px-1.5 py-0.5 rounded bg-muted/40 text-muted-foreground">
                  {u.emoji} {lang === 'ko' ? u.name_ko : u.name_en}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Mission links */}
        {missionLinks.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-bold text-muted-foreground mb-1">{t('requiredForMission')}</p>
            <div className="flex flex-wrap gap-1">
              {missionLinks.map(m => {
                const mm = MISSION_META[m.id];
                return (
                  <span key={m.id} className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-300 border border-yellow-500/30">
                    {mm.emoji} {lang === 'ko' ? mm.name_ko : mm.name_en}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Return hint */}
        <p className="text-[10px] text-muted-foreground italic border-t border-border pt-2 mt-2">
          {t('returnToPurchase')}
        </p>
      </div>
    </div>
  );
}

// ── Tech node ─────────────────────────────────────────────────────────────────
function TechNode({ tech, player, lang, t, activeFilter, onSelect }) {
  const status = getTechStatus(tech, player);
  const finalCost = getFinalTechCost(player, tech);
  const missionLinks = missionsForTech(tech.id);

  const filterSet = PATH_FILTERS[activeFilter];
  const isHighlighted = activeFilter === 'all' || filterSet.includes(tech.id);

  const borderCls = status === 'owned' ? 'border-green-500 shadow-green-500/20'
    : status === 'buyable' ? 'border-teal-400 shadow-teal-400/20'
    : status === 'needs_resources' ? 'border-yellow-500/60'
    : 'border-border/40';

  const bgCls = status === 'owned' ? 'bg-green-950/30'
    : status === 'buyable' ? 'bg-teal-950/30'
    : status === 'needs_resources' ? 'bg-yellow-950/10'
    : 'bg-muted/10';

  return (
    <button
      type="button"
      onClick={() => onSelect(tech)}
      className={`w-full text-left rounded-xl border-2 p-2.5 transition-all hover:scale-[1.02] hover:shadow-lg
        ${borderCls} ${bgCls}
        ${!isHighlighted ? 'opacity-30' : 'opacity-100'}
      `}
    >
      {/* Top row */}
      <div className="flex items-start gap-2 mb-1.5">
        <span className="text-2xl flex-shrink-0">{tech.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap mb-0.5">
            <span className="text-xs font-bold leading-tight truncate" style={{ color: tech.color }}>
              {lang === 'ko' ? tech.name_ko : tech.name_en}
            </span>
            {status === 'owned' && <Check className="w-3 h-3 text-green-400 flex-shrink-0" />}
            {status === 'locked' && <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
          </div>
          <div className="flex gap-1 flex-wrap">
            {tech.isCore
              ? <span className="text-[8px] bg-blue-500/20 text-blue-300 px-1 py-0.5 rounded font-bold">{t('coreTech')}</span>
              : <span className="text-[8px] bg-purple-500/20 text-purple-300 px-1 py-0.5 rounded font-bold">{t('optionalTech')}</span>
            }
            {status === 'needs_resources' && (
              <span className="text-[8px] bg-yellow-500/20 text-yellow-300 px-1 py-0.5 rounded font-bold">
                {lang === 'ko' ? '자원 부족' : 'Need Resources'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cost */}
      {status !== 'owned' && (
        <div className="mb-1.5">
          <CostBadge science={finalCost.science} money={finalCost.money} consensus={finalCost.consensus} small />
        </div>
      )}

      {/* Mission icons */}
      {missionLinks.length > 0 && (
        <div className="flex gap-0.5 flex-wrap">
          {missionLinks.map(m => (
            <span key={m.id} title={lang === 'ko' ? MISSION_META[m.id]?.name_ko : MISSION_META[m.id]?.name_en}
              className="text-xs opacity-70">{MISSION_META[m.id]?.emoji}</span>
          ))}
        </div>
      )}
    </button>
  );
}

// ── Stage column ──────────────────────────────────────────────────────────────
function StageColumn({ stage, player, lang, t, activeFilter, onSelect }) {
  const stageTechs = useMemo(() =>
    technologies.filter(tech => tech.stage === stage.id),
  [stage.id]);

  return (
    <div className="flex flex-col" style={{ minWidth: '160px' }}>
      {/* Stage header */}
      <div className="rounded-xl p-3 mb-3 text-center border border-border/40" style={{ background: stage.bg + 'cc' }}>
        <div className="text-3xl mb-1">{stage.emoji}</div>
        <p className="text-[9px] font-bold text-white/60 mb-0.5">{lang === 'ko' ? `${stage.id}단계` : `Stage ${stage.id}`}</p>
        <p className="text-xs font-bold leading-tight" style={{ color: stage.color }}>
          {lang === 'ko' ? stage.name_ko : stage.name_en}
        </p>
      </div>

      {/* Tech nodes */}
      <div className="space-y-2">
        {stageTechs.map(tech => (
          <TechNode
            key={tech.id}
            tech={tech}
            player={player}
            lang={lang}
            t={t}
            activeFilter={activeFilter}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FullTechnologyTree({ player, onClose }) {
  const { t, lang } = useLanguage();
  const [selectedTech, setSelectedTech] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [mobileStage, setMobileStage] = useState(0); // for phone layout

  const colorObj = COUNTRY_COLORS.find(c => c.id === player.colorId) || COUNTRY_COLORS[0];
  const unlockedCount = player.unlockedTechs.length;

  const currentStage = useMemo(() => {
    if (unlockedCount === 0) return 1;
    return Math.max(...player.unlockedTechs.map(id => {
      const tech = technologies.find(t => t.id === id);
      return tech ? tech.stage : 1;
    }));
  }, [player.unlockedTechs, unlockedCount]);

  const filters = [
    { id: 'all',      label_en: 'All Technologies',    label_ko: '모든 기술' },
    { id: 'direct',   label_en: 'Direct Path to Space', label_ko: '우주 직행 경로' },
    { id: 'economy',  label_en: 'Economy Path',         label_ko: '경제 경로' },
    { id: 'science',  label_en: 'Science Path',         label_ko: '과학 경로' },
    { id: 'flight',   label_en: 'Flight Path',          label_ko: '비행 경로' },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col overflow-hidden">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-b border-border/50 bg-slate-900/90 backdrop-blur px-4 py-3">
        <div className="max-w-screen-2xl mx-auto flex flex-wrap items-center gap-3">

          {/* Back button */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-sm font-bold flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('backToGame')}
          </button>

          <div className="w-px h-6 bg-border/50 hidden sm:block" />

          {/* Title */}
          <h1 className="text-base sm:text-lg font-heading font-bold text-foreground flex-shrink-0">
            🌌 {t('fullTechTree')}
          </h1>

          <div className="w-px h-6 bg-border/50 hidden sm:block" />

          {/* Player info */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm border-2"
              style={{ backgroundColor: colorObj.bg, borderColor: colorObj.value }}
            >
              {player.emblem}
            </div>
            <span className="text-sm font-bold" style={{ color: colorObj.value }}>{player.name}</span>
          </div>

          {/* Resources */}
          <div className="flex items-center gap-3 text-sm font-bold">
            <span className="text-blue-300">🔬 {player.resources.science}</span>
            <span className="text-yellow-300">💰 {player.resources.money}</span>
            <span className="text-green-300">🤝 {player.resources.consensus}</span>
          </div>

          <div className="w-px h-6 bg-border/50 hidden sm:block" />

          {/* Stage + count */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{lang === 'ko' ? `${currentStage}단계` : `Stage ${currentStage}`}</span>
            <span>·</span>
            <span>{unlockedCount} {lang === 'ko' ? '기술 해금' : 'unlocked'}</span>
          </div>
        </div>

        {/* Filter row */}
        <div className="max-w-screen-2xl mx-auto mt-2 flex flex-wrap gap-1.5">
          {filters.map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors
                ${activeFilter === f.id ? 'bg-primary text-primary-foreground' : 'bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
            >
              {lang === 'ko' ? f.label_ko : f.label_en}
            </button>
          ))}
        </div>

        {/* Scroll hint — hidden on very small screens */}
        <p className="text-[10px] text-muted-foreground mt-1.5 max-w-screen-2xl mx-auto hidden sm:block">
          {t('scrollSideways')}
        </p>
      </div>

      {/* ── Tree: desktop / tablet horizontal ──────────────────────────────── */}
      <div className="flex-1 overflow-auto hidden sm:block">
        <div className="p-6 min-w-max">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${stages.length}, 180px)` }}>
            {stages.map(stage => (
              <StageColumn
                key={stage.id}
                stage={stage}
                player={player}
                lang={lang}
                t={t}
                activeFilter={activeFilter}
                onSelect={setSelectedTech}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Tree: mobile vertical stage-by-stage ───────────────────────────── */}
      <div className="flex-1 overflow-auto sm:hidden">
        <div className="p-4">
          {/* Mobile stage nav */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setMobileStage(s => Math.max(0, s - 1))}
              disabled={mobileStage === 0}
              className="p-2 rounded-xl bg-secondary disabled:opacity-30 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <span className="text-2xl">{stages[mobileStage].emoji}</span>
              <p className="text-sm font-bold" style={{ color: stages[mobileStage].color }}>
                {lang === 'ko' ? stages[mobileStage].name_ko : stages[mobileStage].name_en}
              </p>
              <p className="text-xs text-muted-foreground">
                {lang === 'ko' ? `${mobileStage + 1} / ${stages.length}단계` : `Stage ${mobileStage + 1} of ${stages.length}`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMobileStage(s => Math.min(stages.length - 1, s + 1))}
              disabled={mobileStage === stages.length - 1}
              className="p-2 rounded-xl bg-secondary disabled:opacity-30 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Stage dots */}
          <div className="flex justify-center gap-1.5 mb-4">
            {stages.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setMobileStage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === mobileStage ? 'scale-125' : 'opacity-40'}`}
                style={{ backgroundColor: s.color }}
              />
            ))}
          </div>

          {/* Current stage techs */}
          <div className="space-y-2">
            {technologies.filter(tech => tech.stage === stages[mobileStage].id).map(tech => (
              <TechNode
                key={tech.id}
                tech={tech}
                player={player}
                lang={lang}
                t={t}
                activeFilter={activeFilter}
                onSelect={setSelectedTech}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Detail panel ─────────────────────────────────────────────────────── */}
      {selectedTech && (
        <TechDetailPanel
          tech={selectedTech}
          player={player}
          lang={lang}
          t={t}
          onClose={() => setSelectedTech(null)}
        />
      )}
    </div>
  );
}