// ============================================================
// SIMPLIFIED CARD GAME DATA FOR GRADES 4-6
// ============================================================

// --- TECHNOLOGY STAGES ---
export const stages = [
  { id: 1, name_en: 'Early Survival', name_ko: '초기 생존', color: '#f59e0b', bg: '#78350f', emoji: '🔥' },
  { id: 2, name_en: 'Building Civilization', name_ko: '문명 건설', color: '#10b981', bg: '#064e3b', emoji: '🏛️' },
  { id: 3, name_en: 'Learning Through Science', name_ko: '과학적 탐구', color: '#3b82f6', bg: '#1e3a8a', emoji: '🔬' },
  { id: 4, name_en: 'Machines and Industry', name_ko: '기계와 산업', color: '#8b5cf6', bg: '#4c1d95', emoji: '⚙️' },
  { id: 5, name_en: 'Modern Inventions', name_ko: '현대 발명', color: '#ec4899', bg: '#831843', emoji: '📻' },
  { id: 6, name_en: 'The Space Age', name_ko: '우주 시대', color: '#06b6d4', bg: '#164e63', emoji: '🚀' },
];

// --- TECHNOLOGIES ---
export const technologies = [
  // Stage 1
  { id: 'fire', stage: 1, name_en: 'Controlled Fire', name_ko: '불의 사용', desc_en: 'Use fire for warmth and cooking.', desc_ko: '불로 따뜻하게 하고 음식을 익혀요.', cost: { science: 2, money: 0, consensus: 1 }, prereqs: [], emoji: '🔥', color: '#f59e0b' },
  { id: 'tools', stage: 1, name_en: 'Basic Tools', name_ko: '기초 도구', desc_en: 'Make simple tools from stone and wood.', desc_ko: '돌과 나무로 간단한 도구를 만들어요.', cost: { science: 2, money: 1, consensus: 0 }, prereqs: ['fire'], emoji: '🪨', color: '#f59e0b' },
  { id: 'farming', stage: 1, name_en: 'Farming', name_ko: '농업', desc_en: 'Grow crops to feed your people. Grants +3 Money immediately.', desc_ko: '작물을 키워 사람들을 먹여요. 즉시 자금 +3을 얻습니다.', cost: { science: 2, money: 1, consensus: 1 }, prereqs: ['tools'], emoji: '🌾', color: '#f59e0b', bonus: { money: 3 }, bonusDesc_en: '+3 Money', bonusDesc_ko: '자금 +3', deadEnd: true },
  { id: 'language', stage: 1, name_en: 'Spoken Language', name_ko: '말과 언어', desc_en: 'Talk and share ideas with others.', desc_ko: '말로 생각을 나눠요.', cost: { science: 1, money: 0, consensus: 2 }, prereqs: [], emoji: '💬', color: '#f59e0b' },

  // Stage 2
  { id: 'writing', stage: 2, name_en: 'Writing', name_ko: '문자', desc_en: 'Record ideas and share knowledge.', desc_ko: '생각을 기록하고 지식을 나눠요.', cost: { science: 3, money: 1, consensus: 1 }, prereqs: ['language'], emoji: '✍️', color: '#10b981' },
  { id: 'math', stage: 2, name_en: 'Mathematics', name_ko: '수학', desc_en: 'Count, measure, and solve problems.', desc_ko: '수를 세고 문제를 풀어요.', cost: { science: 3, money: 1, consensus: 0 }, prereqs: ['writing'], emoji: '🔢', color: '#10b981' },
  { id: 'metalwork', stage: 2, name_en: 'Metalworking', name_ko: '금속 가공', desc_en: 'Shape metal into stronger tools.', desc_ko: '금속으로 더 강한 도구를 만들어요.', cost: { science: 2, money: 2, consensus: 1 }, prereqs: ['tools'], emoji: '⚒️', color: '#10b981' },
  { id: 'astronomy', stage: 2, name_en: 'Astronomy', name_ko: '천문학', desc_en: 'Study the stars and planets. Grants +4 Science immediately.', desc_ko: '별과 행성을 연구해요. 즉시 과학력 +4를 얻습니다.', cost: { science: 4, money: 1, consensus: 1 }, prereqs: ['math'], emoji: '⭐', color: '#10b981', bonus: { science: 4 }, bonusDesc_en: '+4 Science', bonusDesc_ko: '과학력 +4', deadEnd: true },

  // Stage 3
  { id: 'experiments', stage: 3, name_en: 'Scientific Experiments', name_ko: '과학 실험', desc_en: 'Test ideas with careful experiments.', desc_ko: '실험으로 아이디어를 검증해요.', cost: { science: 4, money: 2, consensus: 1 }, prereqs: ['math'], emoji: '🧪', color: '#3b82f6' },
  { id: 'physics', stage: 3, name_en: 'Physics', name_ko: '물리학', desc_en: 'Understand how forces and motion work.', desc_ko: '힘과 운동의 원리를 이해해요.', cost: { science: 5, money: 2, consensus: 1 }, prereqs: ['experiments'], emoji: '⚡', color: '#3b82f6' },
  { id: 'chemistry', stage: 3, name_en: 'Chemistry', name_ko: '화학', desc_en: 'Learn how materials combine and change.', desc_ko: '물질이 어떻게 결합하고 변화하는지 알아요.', cost: { science: 5, money: 2, consensus: 1 }, prereqs: ['experiments'], emoji: '🧫', color: '#3b82f6' },
  { id: 'precision', stage: 3, name_en: 'Precision Tools', name_ko: '정밀 도구', desc_en: 'Build very accurate measuring tools. Grants +3 Science and +2 Money immediately.', desc_ko: '아주 정확한 측정 도구를 만들어요. 즉시 과학력 +3, 자금 +2를 얻습니다.', cost: { science: 4, money: 3, consensus: 0 }, prereqs: ['metalwork'], emoji: '📐', color: '#3b82f6', bonus: { science: 3, money: 2 }, bonusDesc_en: '+3 Science, +2 Money', bonusDesc_ko: '과학력 +3, 자금 +2', deadEnd: true },

  // Stage 4
  { id: 'steam', stage: 4, name_en: 'Steam Power', name_ko: '증기 기관', desc_en: 'Use steam to power machines.', desc_ko: '증기로 기계를 움직여요.', cost: { science: 5, money: 3, consensus: 2 }, prereqs: ['physics'], emoji: '🏭', color: '#8b5cf6' },
  { id: 'factories', stage: 4, name_en: 'Factories', name_ko: '공장', desc_en: 'Build places that make many goods quickly. Grants +5 Money immediately.', desc_ko: '물건을 빠르게 많이 만드는 곳이에요. 즉시 자금 +5를 얻습니다.', cost: { science: 4, money: 5, consensus: 2 }, prereqs: ['steam'], emoji: '🏗️', color: '#8b5cf6', bonus: { money: 5 }, bonusDesc_en: '+5 Money', bonusDesc_ko: '자금 +5', deadEnd: true },
  { id: 'electricity', stage: 4, name_en: 'Electricity', name_ko: '전기', desc_en: 'Power lights, machines, and cities.', desc_ko: '전기로 불을 켜고 기계를 돌려요.', cost: { science: 6, money: 4, consensus: 2 }, prereqs: ['physics', 'chemistry'], emoji: '💡', color: '#8b5cf6' },
  { id: 'engines', stage: 4, name_en: 'Engines', name_ko: '엔진', desc_en: 'Build powerful motors that move vehicles.', desc_ko: '강력한 모터로 탈것을 움직여요.', cost: { science: 5, money: 4, consensus: 1 }, prereqs: ['steam'], emoji: '⚙️', color: '#8b5cf6' },

  // Stage 5
  { id: 'radio', stage: 5, name_en: 'Radio', name_ko: '라디오', desc_en: 'Send messages through the air. Grants +4 Consensus immediately.', desc_ko: '공기를 통해 메시지를 보내요. 즉시 사회적 합의 +4를 얻습니다.', cost: { science: 6, money: 4, consensus: 2 }, prereqs: ['electricity'], emoji: '📻', color: '#ec4899', bonus: { consensus: 4 }, bonusDesc_en: '+4 Consensus', bonusDesc_ko: '사회적 합의 +4', deadEnd: true },
  { id: 'electronics', stage: 5, name_en: 'Electronics', name_ko: '전자공학', desc_en: 'Build circuits that control machines.', desc_ko: '회로로 기계를 제어해요.', cost: { science: 7, money: 5, consensus: 2 }, prereqs: ['electricity'], emoji: '🔌', color: '#ec4899' },
  { id: 'computers', stage: 5, name_en: 'Computers', name_ko: '컴퓨터', desc_en: 'Use machines that can think and calculate.', desc_ko: '생각하고 계산하는 기계를 사용해요.', cost: { science: 8, money: 6, consensus: 2 }, prereqs: ['electronics'], emoji: '💻', color: '#ec4899' },
  { id: 'airplanes', stage: 5, name_en: 'Airplanes', name_ko: '비행기', desc_en: 'Fly through the sky in a machine. Grants +3 Money and +3 Consensus immediately.', desc_ko: '기계를 타고 하늘을 날아요. 즉시 자금 +3, 사회적 합의 +3을 얻습니다.', cost: { science: 7, money: 5, consensus: 3 }, prereqs: ['engines'], emoji: '✈️', color: '#ec4899', bonus: { money: 3, consensus: 3 }, bonusDesc_en: '+3 Money, +3 Consensus', bonusDesc_ko: '자금 +3, 사회적 합의 +3', deadEnd: true },

  // Stage 6
  { id: 'rockets', stage: 6, name_en: 'Rocket Engines', name_ko: '로켓 엔진', desc_en: 'Build engines powerful enough to reach space.', desc_ko: '우주까지 갈 수 있는 강력한 엔진을 만들어요.', cost: { science: 9, money: 7, consensus: 3 }, prereqs: ['engines', 'chemistry'], emoji: '🚀', color: '#06b6d4' },
  { id: 'guidance', stage: 6, name_en: 'Guidance System', name_ko: '유도 시스템', desc_en: 'Steer rockets accurately to their target.', desc_ko: '로켓을 정확하게 목표로 유도해요.', cost: { science: 9, money: 6, consensus: 2 }, prereqs: ['computers', 'rockets'], emoji: '🎯', color: '#06b6d4' },
  { id: 'heatshield', stage: 6, name_en: 'Heat Shield', name_ko: '열 차폐', desc_en: 'Protect spacecraft from burning up.', desc_ko: '우주선이 타지 않도록 보호해요.', cost: { science: 8, money: 7, consensus: 2 }, prereqs: ['chemistry', 'rockets'], emoji: '🛡️', color: '#06b6d4' },
  { id: 'lifesupport', stage: 6, name_en: 'Life Support', name_ko: '생명 유지 장치', desc_en: 'Keep astronauts alive in space.', desc_ko: '우주에서 우주인이 살 수 있게 해요.', cost: { science: 10, money: 8, consensus: 3 }, prereqs: ['electronics', 'chemistry'], emoji: '🌬️', color: '#06b6d4' },
  { id: 'satellites', stage: 6, name_en: 'Satellites', name_ko: '인공위성', desc_en: 'Launch objects that orbit Earth.', desc_ko: '지구 주위를 도는 물체를 발사해요.', cost: { science: 10, money: 8, consensus: 3 }, prereqs: ['rockets', 'guidance'], emoji: '🛰️', color: '#06b6d4' },
  { id: 'crewedship', stage: 6, name_en: 'Crewed Spacecraft', name_ko: '유인 우주선', desc_en: 'Build a ship that carries people to space!', desc_ko: '사람을 우주로 데려가는 우주선을 만들어요!', cost: { science: 12, money: 10, consensus: 5 }, prereqs: ['lifesupport', 'heatshield', 'satellites'], emoji: '🧑‍🚀', color: '#06b6d4' },
];

// --- MISSIONS ---
export const missions = [
  {
    id: 'test_rocket',
    order: 1,
    name_en: 'Test Rocket',
    name_ko: '시험 로켓',
    desc_en: 'Launch your first test rocket!',
    desc_ko: '첫 번째 시험 로켓을 발사해요!',
    emoji: '🚀',
    reqTechs: ['rockets', 'guidance'],
    cost: { science: 5, money: 5, consensus: 2 },
  },
  {
    id: 'launch_satellite',
    order: 2,
    name_en: 'Launch a Satellite',
    name_ko: '인공위성 발사',
    desc_en: 'Put a satellite into orbit!',
    desc_ko: '인공위성을 궤도에 올려요!',
    emoji: '🛰️',
    reqTechs: ['satellites', 'computers'],
    reqMissions: ['test_rocket'],
    cost: { science: 7, money: 7, consensus: 3 },
  },
  {
    id: 'crewed_spaceflight',
    order: 3,
    name_en: 'Crewed Spaceflight',
    name_ko: '유인 우주 비행',
    desc_en: 'Send a crew to space and WIN!',
    desc_ko: '우주인을 우주로 보내고 승리해요!',
    emoji: '🧑‍🚀',
    reqTechs: ['lifesupport', 'heatshield', 'crewedship'],
    reqMissions: ['launch_satellite'],
    cost: { science: 10, money: 10, consensus: 5 },
  },
];

// --- MAIN DECK: RESOURCE & ACTION CARDS ---
export const mainDeckTemplate = [
  // Resource Cards (many copies for resource economy)
  { id: 'res_sci_1', type: 'resource', name_en: 'Curious Thinkers', name_ko: '호기심 많은 사람들', desc_en: 'Gain 2 Science.', desc_ko: '과학력 2를 얻습니다.', effect: { science: 2 }, emoji: '🔬', color: '#3b82f6', count: 5 },
  { id: 'res_sci_2', type: 'resource', name_en: 'New Discovery', name_ko: '새로운 발견', desc_en: 'Gain 3 Science.', desc_ko: '과학력 3을 얻습니다.', effect: { science: 3 }, emoji: '💡', color: '#3b82f6', count: 3 },
  { id: 'res_mon_1', type: 'resource', name_en: 'Successful Harvest', name_ko: '풍성한 수확', desc_en: 'Gain 2 Money.', desc_ko: '자금 2를 얻습니다.', effect: { money: 2 }, emoji: '🌾', color: '#f59e0b', count: 5 },
  { id: 'res_mon_2', type: 'resource', name_en: 'Trade Profits', name_ko: '무역 이익', desc_en: 'Gain 3 Money.', desc_ko: '자금 3을 얻습니다.', effect: { money: 3 }, emoji: '💰', color: '#f59e0b', count: 3 },
  { id: 'res_con_1', type: 'resource', name_en: 'Community Meeting', name_ko: '공동체 회의', desc_en: 'Gain 2 Consensus.', desc_ko: '사회적 합의 2를 얻습니다.', effect: { consensus: 2 }, emoji: '🤝', color: '#10b981', count: 5 },
  { id: 'res_con_2', type: 'resource', name_en: 'Grand Festival', name_ko: '대축제', desc_en: 'Gain 3 Consensus.', desc_ko: '사회적 합의 3을 얻습니다.', effect: { consensus: 3 }, emoji: '🎉', color: '#10b981', count: 3 },
  { id: 'res_mix_1', type: 'resource', name_en: 'Growing Town', name_ko: '성장하는 마을', desc_en: 'Gain 1 Money and 1 Consensus.', desc_ko: '자금 1과 사회적 합의 1을 얻습니다.', effect: { money: 1, consensus: 1 }, emoji: '🏘️', color: '#8b5cf6', count: 4 },
  { id: 'res_mix_2', type: 'resource', name_en: 'University Grant', name_ko: '대학 지원금', desc_en: 'Gain 2 Science and 1 Money.', desc_ko: '과학력 2와 자금 1을 얻습니다.', effect: { science: 2, money: 1 }, emoji: '🎓', color: '#8b5cf6', count: 3 },

  // Action Cards
  { id: 'act_great_idea', type: 'action', name_en: 'Great Idea!', name_ko: '멋진 아이디어!', desc_en: 'Gain 3 Science this turn.', desc_ko: '이번 턴에 과학력 3을 얻습니다.', effect: { science: 3 }, emoji: '🌟', color: '#f97316', count: 3, actionType: 'gainResource' },
  { id: 'act_fundraising', type: 'action', name_en: 'Fundraising Campaign', name_ko: '모금 운동', desc_en: 'Gain 3 Money.', desc_ko: '자금 3을 얻습니다.', effect: { money: 3 }, emoji: '📣', color: '#f97316', count: 3, actionType: 'gainResource' },
  { id: 'act_speech', type: 'action', name_en: 'Public Speech', name_ko: '대중 연설', desc_en: 'Gain 2 Consensus.', desc_ko: '사회적 합의 2를 얻습니다.', effect: { consensus: 2 }, emoji: '🎤', color: '#f97316', count: 3, actionType: 'gainResource' },
  { id: 'act_research_team', type: 'action', name_en: 'Research Team', name_ko: '연구팀', desc_en: 'Pick 2 cards from your hand to exchange for 2 new ones from the deck.', desc_ko: '손에서 카드 2장을 선택해 새 카드 2장으로 교환합니다.', effect: {}, emoji: '👩‍🔬', color: '#f97316', count: 2, actionType: 'exchangeCards' },
  { id: 'act_trade', type: 'action', name_en: 'Trade Agreement', name_ko: '무역 협정', desc_en: 'Choose a country. Both gain 2 Money.', desc_ko: '국가 하나를 선택합니다. 두 국가 모두 자금 2를 얻습니다.', effect: { money: 2 }, emoji: '🤲', color: '#f97316', count: 2, actionType: 'targetBoth', resource: 'money' },
  { id: 'act_sci_coop', type: 'action', name_en: 'Scientific Cooperation', name_ko: '과학 협력', desc_en: 'Choose a country. Both gain 2 Science.', desc_ko: '국가 하나를 선택합니다. 두 국가 모두 과학력 2를 얻습니다.', effect: { science: 2 }, emoji: '🌐', color: '#f97316', count: 2, actionType: 'targetBoth', resource: 'science' },
  { id: 'act_opposition', type: 'action', name_en: 'Public Opposition', name_ko: '대중의 반대', desc_en: 'Choose a country. They lose 1 Consensus.', desc_ko: '국가 하나를 선택합니다. 그 국가는 사회적 합의 1을 잃습니다.', effect: { consensus: -1 }, emoji: '📢', color: '#f97316', count: 2, actionType: 'targetOther', resource: 'consensus' },
];

// --- EVENT DECK ---
export const eventDeckTemplate = [
  { id: 'ev_discovery', name_en: 'Brilliant Discovery!', name_ko: '놀라운 발견!', desc_en: 'Gain 2 Science.', desc_ko: '과학력 2를 얻습니다.', emoji: '💡', effect: { type: 'current', resources: { science: 2 } }, positive: true },
  { id: 'ev_harvest', name_en: 'Good Harvest', name_ko: '풍년', desc_en: 'Every country gains 1 Money.', desc_ko: '모든 국가가 자금 1을 얻습니다.', emoji: '🌾', effect: { type: 'all', resources: { money: 1 } }, positive: true },
  { id: 'ev_celebration', name_en: 'Public Celebration!', name_ko: '국민 축제!', desc_en: 'Gain 2 Consensus.', desc_ko: '사회적 합의 2를 얻습니다.', emoji: '🎊', effect: { type: 'current', resources: { consensus: 2 } }, positive: true },
  { id: 'ev_science_fair', name_en: 'International Science Fair', name_ko: '국제 과학 박람회', desc_en: 'Every country gains 1 Science.', desc_ko: '모든 국가가 과학력 1을 얻습니다.', emoji: '🏆', effect: { type: 'all', resources: { science: 1 } }, positive: true },
  { id: 'ev_peace', name_en: 'Peace Treaty', name_ko: '평화 조약', desc_en: 'Every country gains 1 Consensus.', desc_ko: '모든 국가가 사회적 합의 1을 얻습니다.', emoji: '🕊️', effect: { type: 'all', resources: { consensus: 1 } }, positive: true },
  { id: 'ev_bonus', name_en: 'Lucky Day!', name_ko: '행운의 날!', desc_en: 'Gain 1 of each resource.', desc_ko: '각 자원을 1씩 얻습니다.', emoji: '🍀', effect: { type: 'current', resources: { science: 1, money: 1, consensus: 1 } }, positive: true },
  { id: 'ev_expensive', name_en: 'Expensive Repairs', name_ko: '비싼 수리비', desc_en: 'You lose 2 Money.', desc_ko: '자금 2를 잃습니다.', emoji: '🔧', effect: { type: 'current', resources: { money: -2 } }, positive: false },
  { id: 'ev_failed', name_en: 'Failed Experiment', name_ko: '실험 실패', desc_en: 'You lose 1 Science.', desc_ko: '과학력 1을 잃습니다.', emoji: '💥', effect: { type: 'current', resources: { science: -1 } }, positive: false },
  { id: 'ev_dispute', name_en: 'Budget Dispute', name_ko: '예산 논쟁', desc_en: 'You lose 1 Consensus.', desc_ko: '사회적 합의 1을 잃습니다.', emoji: '⚖️', effect: { type: 'current', resources: { consensus: -1 } }, positive: false },
  { id: 'ev_storm', name_en: 'Terrible Storm', name_ko: '큰 폭풍', desc_en: 'Every country loses 1 Money.', desc_ko: '모든 국가가 자금 1을 잃습니다.', emoji: '⛈️', effect: { type: 'all', resources: { money: -1 } }, positive: false },
  { id: 'ev_windfall', name_en: 'Unexpected Windfall', name_ko: '뜻밖의 행운', desc_en: 'You gain 3 Money.', desc_ko: '자금 3을 얻습니다.', emoji: '💸', effect: { type: 'current', resources: { money: 3 } }, positive: true },
  { id: 'ev_inspire', name_en: 'Inspiring Leader', name_ko: '영감을 주는 지도자', desc_en: 'Gain 2 Consensus and 1 Science.', desc_ko: '사회적 합의 2와 과학력 1을 얻습니다.', emoji: '👑', effect: { type: 'current', resources: { consensus: 2, science: 1 } }, positive: true },
];

// Build deck from template (expand count)
export function buildMainDeck() {
  const deck = [];
  let uid = 0;
  for (const template of mainDeckTemplate) {
    const count = template.count || 1;
    for (let i = 0; i < count; i++) {
      deck.push({ ...template, uid: `${template.id}_${uid++}` });
    }
  }
  return shuffleDeck(deck);
}

export function buildEventDeck() {
  return shuffleDeck([...eventDeckTemplate]);
}

export function shuffleDeck(deck) {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

export function getTechById(id) {
  return technologies.find(t => t.id === id);
}

export function getStageForTech(techId) {
  const tech = getTechById(techId);
  return tech ? tech.stage : 1;
}

export function getPlayerStage(unlockedTechs) {
  if (unlockedTechs.length === 0) return 1;
  const maxStage = Math.max(...unlockedTechs.map(id => getStageForTech(id)));
  return maxStage;
}

export function getAvailableTechs(unlockedTechs) {
  return technologies.filter(tech => {
    if (unlockedTechs.includes(tech.id)) return false;
    return tech.prereqs.every(p => unlockedTechs.includes(p));
  });
}

export const COUNTRY_COLORS = [
  { id: 'blue', label_en: 'Blue', label_ko: '파란색', value: '#3b82f6', bg: '#1e3a8a' },
  { id: 'red', label_en: 'Red', label_ko: '빨간색', value: '#ef4444', bg: '#7f1d1d' },
  { id: 'green', label_en: 'Green', label_ko: '초록색', value: '#22c55e', bg: '#14532d' },
  { id: 'yellow', label_en: 'Yellow', label_ko: '노란색', value: '#f59e0b', bg: '#78350f' },
  { id: 'purple', label_en: 'Purple', label_ko: '보라색', value: '#a855f7', bg: '#4a1d96' },
  { id: 'pink', label_en: 'Pink', label_ko: '분홍색', value: '#ec4899', bg: '#831843' },
];

export const COUNTRY_EMBLEMS = ['🌟', '🦅', '🌺', '🏔️', '🌊', '🦁', '🌙', '🌈'];