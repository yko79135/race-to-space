// ============ DISCOVERY CARDS ============
export const discoveryCards = [
  {
    id: "controlled_fire", type: "discovery", era: 1,
    name_en: "Controlled Fire", name_ko: "불의 사용",
    description_en: "Unlocks early cooking, protection, and material processing.",
    description_ko: "초기 조리, 보호, 재료 가공 기술을 해금합니다.",
    cost: { science: 1, money: 0, consensus: 0 },
    effect: { science: 1, money: 0, consensus: 0 },
    educational_en: "Controlling fire was one of humanity's most transformative achievements. It allowed cooking food, staying warm, and eventually smelting metals — all essential steps toward civilization.",
    educational_ko: "불의 통제는 인류의 가장 혁신적인 성취 중 하나였습니다. 음식 조리, 보온, 금속 제련을 가능하게 했으며, 문명을 향한 필수적인 단계였습니다."
  },
  {
    id: "counting", type: "discovery", era: 1,
    name_en: "Counting", name_ko: "수 세기",
    description_en: "Basic numerical awareness for tracking resources.",
    description_ko: "자원 추적을 위한 기초적인 수 인식.",
    cost: { science: 1, money: 0, consensus: 0 },
    effect: { science: 1, money: 1, consensus: 0 },
    educational_en: "Early counting systems used tally marks on bones and clay. This simple ability to track quantities became the foundation for mathematics, trade, and eventually computing.",
    educational_ko: "초기 수 세기 체계는 뼈와 점토에 표시를 했습니다. 양을 추적하는 이 단순한 능력이 수학, 무역, 그리고 결국 컴퓨팅의 기초가 되었습니다."
  },
  {
    id: "agriculture", type: "discovery", era: 1,
    name_en: "Agriculture", name_ko: "농업",
    description_en: "Settle and grow food, enabling larger communities.",
    description_ko: "정착하여 식량을 재배하고, 더 큰 공동체를 가능하게 합니다.",
    cost: { science: 1, money: 1, consensus: 0 },
    effect: { science: 0, money: 2, consensus: 1 },
    educational_en: "The agricultural revolution allowed humans to settle in one place, grow surplus food, and support specialists — priests, artisans, and eventually scientists.",
    educational_ko: "농업 혁명은 인류가 정착하고, 잉여 식량을 생산하며, 전문가들 — 성직자, 장인, 그리고 결국 과학자 — 을 부양할 수 있게 했습니다."
  },
  {
    id: "writing", type: "discovery", era: 1,
    name_en: "Writing", name_ko: "문자",
    description_en: "Record and transmit knowledge across generations.",
    description_ko: "세대를 넘어 지식을 기록하고 전달합니다.",
    cost: { science: 2, money: 0, consensus: 1 },
    effect: { science: 2, money: 0, consensus: 1 },
    educational_en: "Writing systems, from cuneiform to alphabets, allowed knowledge to accumulate across generations. Without writing, each generation would have to rediscover everything from scratch.",
    educational_ko: "설형문자에서 알파벳까지, 문자 체계는 지식이 세대를 넘어 축적될 수 있게 했습니다. 문자 없이는 각 세대가 모든 것을 처음부터 다시 발견해야 했을 것입니다."
  },
  {
    id: "basic_tools", type: "discovery", era: 1,
    name_en: "Basic Tools", name_ko: "기초 도구",
    description_en: "Stone and bone tools improve productivity.",
    description_ko: "석기와 골각기가 생산성을 향상시킵니다.",
    cost: { science: 0, money: 1, consensus: 0 },
    effect: { science: 0, money: 2, consensus: 0 },
    educational_en: "Tool-making is a defining trait of humanity. Simple stone tools allowed early humans to process food, build shelters, and shape their environment — the earliest form of engineering.",
    educational_ko: "도구 제작은 인류의 대표적인 특성입니다. 간단한 석기 도구로 초기 인류는 식량을 가공하고, 거처를 만들고, 환경을 형성할 수 있었습니다 — 가장 초기 형태의 공학이었습니다."
  },
  {
    id: "mathematics", type: "discovery", era: 2,
    name_en: "Mathematics", name_ko: "수학",
    description_en: "Formal number systems and arithmetic.",
    description_ko: "체계적인 수 체계와 산술.",
    cost: { science: 3, money: 0, consensus: 0 },
    effect: { science: 2, money: 1, consensus: 0 },
    prerequisites: ["counting", "writing"],
    educational_en: "Mathematics moved beyond counting to abstract reasoning. From Babylonian algebra to Greek proofs, math became the universal language of science and engineering.",
    educational_ko: "수학은 단순한 수 세기를 넘어 추상적 사고로 발전했습니다. 바빌로니아의 대수학에서 그리스의 증명까지, 수학은 과학과 공학의 보편적 언어가 되었습니다."
  },
  {
    id: "geometry", type: "discovery", era: 2,
    name_en: "Geometry", name_ko: "기하학",
    description_en: "Spatial reasoning and structural design.",
    description_ko: "공간적 추론과 구조 설계.",
    cost: { science: 3, money: 1, consensus: 0 },
    effect: { science: 2, money: 1, consensus: 0 },
    prerequisites: ["mathematics"],
    educational_en: "Geometry enabled construction of monumental buildings, accurate maps, and navigation. Euclid's Elements remained the gold standard of logical reasoning for over 2,000 years.",
    educational_ko: "기하학은 기념비적 건축물, 정확한 지도, 항해를 가능하게 했습니다. 유클리드의 원론은 2,000년 이상 논리적 추론의 표준으로 남았습니다."
  },
  {
    id: "astronomy", type: "discovery", era: 2,
    name_en: "Astronomy", name_ko: "천문학",
    description_en: "Study of celestial bodies and cycles.",
    description_ko: "천체와 주기에 대한 연구.",
    cost: { science: 3, money: 0, consensus: 1 },
    effect: { science: 2, money: 0, consensus: 1 },
    prerequisites: ["mathematics", "writing"],
    educational_en: "Astronomy is one of the oldest sciences. By tracking stars and planets, ancient civilizations developed calendars, navigation, and the first understanding that Earth exists in a vast cosmos.",
    educational_ko: "천문학은 가장 오래된 과학 중 하나입니다. 별과 행성을 추적함으로써, 고대 문명은 달력, 항해법, 그리고 지구가 광대한 우주에 존재한다는 최초의 이해를 발전시켰습니다."
  },
  {
    id: "metallurgy", type: "discovery", era: 2,
    name_en: "Metallurgy", name_ko: "금속 가공",
    description_en: "Extract and shape metals for tools and structures.",
    description_ko: "도구와 구조물을 위해 금속을 추출하고 가공합니다.",
    cost: { science: 2, money: 2, consensus: 0 },
    effect: { science: 1, money: 2, consensus: 0 },
    prerequisites: ["controlled_fire", "basic_tools"],
    educational_en: "Metallurgy transformed society. Bronze, iron, and steel enabled stronger tools, weapons, and machines. Without metal-working, industrialization would have been impossible.",
    educational_ko: "금속 가공은 사회를 변혁시켰습니다. 청동, 철, 강철은 더 강한 도구, 무기, 기계를 가능하게 했습니다. 금속 가공 없이는 산업화가 불가능했을 것입니다."
  },
  {
    id: "mechanical_devices", type: "discovery", era: 2,
    name_en: "Mechanical Devices", name_ko: "기계 장치",
    description_en: "Levers, pulleys, and gears multiply human force.",
    description_ko: "지렛대, 도르래, 톱니바퀴가 인간의 힘을 증폭시킵니다.",
    cost: { science: 2, money: 2, consensus: 0 },
    effect: { science: 1, money: 2, consensus: 0 },
    prerequisites: ["metallurgy", "geometry"],
    educational_en: "Simple machines — levers, pulleys, screws — amplified human capability. Archimedes said 'Give me a lever long enough and I shall move the world.' These principles still underpin every rocket engine.",
    educational_ko: "단순 기계 — 지렛대, 도르래, 나사 — 는 인간의 능력을 증폭시켰습니다. 아르키메데스는 '충분히 긴 지렛대를 주면 세계를 움직이겠다'고 말했습니다. 이 원리는 여전히 모든 로켓 엔진의 기초입니다."
  },
  {
    id: "experimental_science", type: "discovery", era: 3,
    name_en: "Experimental Science", name_ko: "실험 과학",
    description_en: "The scientific method: observe, hypothesize, test.",
    description_ko: "과학적 방법: 관찰, 가설, 실험.",
    cost: { science: 4, money: 1, consensus: 1 },
    effect: { science: 3, money: 0, consensus: 1 },
    prerequisites: ["mathematics", "writing"],
    educational_en: "The scientific method revolutionized how we understand the world. Instead of relying on authority or tradition, knowledge is built through repeatable experiments and peer review.",
    educational_ko: "과학적 방법은 세계를 이해하는 방식을 혁명적으로 바꿨습니다. 권위나 전통에 의존하는 대신, 반복 가능한 실험과 동료 검증을 통해 지식을 구축합니다."
  },
  {
    id: "physics", type: "discovery", era: 3,
    name_en: "Physics", name_ko: "물리학",
    description_en: "Laws of motion, gravity, and energy.",
    description_ko: "운동, 중력, 에너지의 법칙.",
    cost: { science: 5, money: 1, consensus: 0 },
    effect: { science: 3, money: 0, consensus: 1 },
    prerequisites: ["experimental_science", "geometry"],
    educational_en: "Newton's laws of motion and gravity explained how objects move on Earth and in space. Without physics, calculating rocket trajectories would be impossible.",
    educational_ko: "뉴턴의 운동법칙과 중력은 물체가 지구와 우주에서 어떻게 움직이는지 설명했습니다. 물리학 없이는 로켓 궤도 계산이 불가능했을 것입니다."
  },
];

// ============ TECHNOLOGY CARDS ============
export const technologyCards = [
  {
    id: "chemistry", type: "technology", era: 3,
    name_en: "Chemistry", name_ko: "화학",
    description_en: "Understanding of elements, compounds, and reactions.",
    description_ko: "원소, 화합물, 반응에 대한 이해.",
    cost: { science: 5, money: 2, consensus: 0 },
    effect: { science: 2, money: 1, consensus: 0 },
    prerequisites: ["experimental_science"],
    educational_en: "Chemistry unlocked understanding of what matter is made of. From gunpowder to rocket fuel, chemical knowledge is essential for propulsion systems.",
    educational_ko: "화학은 물질이 무엇으로 구성되어 있는지 이해할 수 있게 했습니다. 화약에서 로켓 연료까지, 화학 지식은 추진 시스템에 필수적입니다."
  },
  {
    id: "precision_instruments", type: "technology", era: 3,
    name_en: "Precision Instruments", name_ko: "정밀 기기",
    description_en: "Accurate measurement and observation tools.",
    description_ko: "정확한 측정 및 관찰 도구.",
    cost: { science: 4, money: 3, consensus: 0 },
    effect: { science: 2, money: 1, consensus: 0 },
    prerequisites: ["mechanical_devices", "experimental_science"],
    educational_en: "Telescopes, microscopes, and precision clocks transformed science from qualitative observation to quantitative measurement — essential for any engineering endeavor.",
    educational_ko: "망원경, 현미경, 정밀 시계는 과학을 정성적 관찰에서 정량적 측정으로 전환시켰습니다 — 모든 공학적 노력에 필수적입니다."
  },
  {
    id: "advanced_math", type: "technology", era: 3,
    name_en: "Advanced Mathematics", name_ko: "고등 수학",
    description_en: "Calculus, algebra, and analytical methods.",
    description_ko: "미적분학, 대수학, 해석적 방법.",
    cost: { science: 5, money: 0, consensus: 1 },
    effect: { science: 3, money: 0, consensus: 0 },
    prerequisites: ["physics", "geometry"],
    educational_en: "Calculus, independently developed by Newton and Leibniz, made it possible to describe changing quantities — how rockets accelerate, how orbits curve, how fuel burns.",
    educational_ko: "뉴턴과 라이프니츠가 독립적으로 개발한 미적분학은 변화하는 양을 기술할 수 있게 했습니다 — 로켓의 가속, 궤도의 곡률, 연료의 연소 방식 등."
  },
  {
    id: "steam_power", type: "technology", era: 4,
    name_en: "Steam Power", name_ko: "증기 기관",
    description_en: "Convert heat energy into mechanical work.",
    description_ko: "열 에너지를 기계적 일로 변환합니다.",
    cost: { science: 4, money: 4, consensus: 1 },
    effect: { science: 1, money: 3, consensus: 0 },
    prerequisites: ["chemistry", "mechanical_devices"],
    educational_en: "The steam engine was the first practical device to convert heat into continuous motion. It powered the Industrial Revolution and demonstrated the principle that drives all rockets: controlled energy release.",
    educational_ko: "증기 기관은 열을 지속적인 운동으로 변환하는 최초의 실용적 장치였습니다. 산업 혁명을 이끌었으며, 모든 로켓을 구동하는 원리인 통제된 에너지 방출을 보여주었습니다."
  },
  {
    id: "factories", type: "technology", era: 4,
    name_en: "Factories", name_ko: "공장",
    description_en: "Organized mass production of goods.",
    description_ko: "조직화된 대량 상품 생산.",
    cost: { science: 3, money: 5, consensus: 2 },
    effect: { science: 0, money: 4, consensus: 0 },
    prerequisites: ["steam_power"],
    educational_en: "Factories concentrated workers and machines, enabling mass production. This model of organized production was essential for manufacturing the thousands of components in a spacecraft.",
    educational_ko: "공장은 노동자와 기계를 집중시켜 대량 생산을 가능하게 했습니다. 이 조직화된 생산 모델은 우주선의 수천 개 부품을 제조하는 데 필수적이었습니다."
  },
  {
    id: "mass_production", type: "technology", era: 4,
    name_en: "Mass Production", name_ko: "대량 생산",
    description_en: "Standardized parts and assembly line methods.",
    description_ko: "표준화된 부품과 조립 라인 방식.",
    cost: { science: 3, money: 5, consensus: 1 },
    effect: { science: 0, money: 4, consensus: 1 },
    prerequisites: ["factories"],
    educational_en: "Interchangeable parts and assembly lines made complex products affordable. Henry Ford's methods were later adopted by aerospace manufacturers to build rockets at scale.",
    educational_ko: "호환 가능한 부품과 조립 라인은 복잡한 제품을 저렴하게 만들었습니다. 헨리 포드의 방법은 나중에 항공우주 제조업체들이 로켓을 대규모로 생산하는 데 채택되었습니다."
  },
  {
    id: "electricity", type: "technology", era: 4,
    name_en: "Electricity", name_ko: "전기",
    description_en: "Harness electrical energy for light and power.",
    description_ko: "빛과 동력을 위해 전기 에너지를 활용합니다.",
    cost: { science: 5, money: 4, consensus: 1 },
    effect: { science: 2, money: 2, consensus: 1 },
    prerequisites: ["physics", "precision_instruments"],
    educational_en: "Electricity transformed civilization. From telegraphs to computers, nearly every modern technology depends on controlled electrical current — including every system aboard a spacecraft.",
    educational_ko: "전기는 문명을 변혁시켰습니다. 전신에서 컴퓨터까지, 거의 모든 현대 기술은 통제된 전류에 의존합니다 — 우주선의 모든 시스템을 포함하여."
  },
  {
    id: "internal_combustion", type: "technology", era: 4,
    name_en: "Internal Combustion", name_ko: "내연기관",
    description_en: "Engines burning fuel inside cylinders.",
    description_ko: "실린더 내부에서 연료를 연소시키는 엔진.",
    cost: { science: 5, money: 4, consensus: 0 },
    effect: { science: 1, money: 3, consensus: 0 },
    prerequisites: ["chemistry", "steam_power"],
    educational_en: "Internal combustion engines are more efficient than steam engines. The principle of burning fuel in a controlled chamber is directly related to how rocket engines work.",
    educational_ko: "내연기관은 증기 기관보다 효율적입니다. 통제된 공간에서 연료를 연소시키는 원리는 로켓 엔진의 작동 방식과 직접적으로 관련됩니다."
  },
  {
    id: "electronics", type: "technology", era: 5,
    name_en: "Electronics", name_ko: "전자공학",
    description_en: "Vacuum tubes and transistors for signal processing.",
    description_ko: "신호 처리를 위한 진공관과 트랜지스터.",
    cost: { science: 6, money: 5, consensus: 1 },
    effect: { science: 3, money: 1, consensus: 0 },
    prerequisites: ["electricity", "advanced_math"],
    educational_en: "Electronics miniaturized electrical circuits, enabling radio, television, and computers. Without electronics, spacecraft communication and control would be impossible.",
    educational_ko: "전자공학은 전기 회로를 소형화하여 라디오, 텔레비전, 컴퓨터를 가능하게 했습니다. 전자공학 없이는 우주선 통신과 제어가 불가능했을 것입니다."
  },
  {
    id: "radio_communication", type: "technology", era: 5,
    name_en: "Radio Communication", name_ko: "무선 통신",
    description_en: "Wireless transmission of information.",
    description_ko: "정보의 무선 전송.",
    cost: { science: 5, money: 4, consensus: 1 },
    effect: { science: 2, money: 1, consensus: 1 },
    prerequisites: ["electronics"],
    educational_en: "Radio made wireless communication possible. Every spacecraft relies on radio waves to send data, receive commands, and communicate with mission control.",
    educational_ko: "라디오는 무선 통신을 가능하게 했습니다. 모든 우주선은 데이터 전송, 명령 수신, 관제소와의 통신에 전파를 사용합니다."
  },
  {
    id: "modern_materials", type: "technology", era: 5,
    name_en: "Modern Materials", name_ko: "현대 재료",
    description_en: "Alloys, polymers, and composites.",
    description_ko: "합금, 폴리머, 복합 재료.",
    cost: { science: 5, money: 5, consensus: 0 },
    effect: { science: 1, money: 2, consensus: 0 },
    prerequisites: ["chemistry", "mass_production"],
    educational_en: "Lightweight, heat-resistant materials like titanium alloys and carbon composites are essential for spacecraft. They must withstand extreme temperatures and stresses during launch and reentry.",
    educational_ko: "티타늄 합금과 탄소 복합재와 같은 경량, 내열 재료는 우주선에 필수적입니다. 발사와 재진입 시 극한의 온도와 응력을 견뎌야 합니다."
  },
  {
    id: "computing", type: "technology", era: 5,
    name_en: "Computing", name_ko: "컴퓨팅",
    description_en: "Programmable machines for calculation.",
    description_ko: "계산을 위한 프로그래밍 가능한 기계.",
    cost: { science: 7, money: 5, consensus: 1 },
    effect: { science: 3, money: 1, consensus: 0 },
    prerequisites: ["electronics", "advanced_math"],
    educational_en: "Computers transformed every field of science and engineering. The Apollo missions relied on computers with less power than a modern phone to navigate to the Moon and back.",
    educational_ko: "컴퓨터는 과학과 공학의 모든 분야를 변혁시켰습니다. 아폴로 미션은 현대 스마트폰보다 성능이 낮은 컴퓨터로 달까지 항해하고 돌아왔습니다."
  },
  {
    id: "aeronautics", type: "technology", era: 5,
    name_en: "Aeronautics", name_ko: "항공공학",
    description_en: "Science of powered flight through atmosphere.",
    description_ko: "대기 중 동력 비행의 과학.",
    cost: { science: 6, money: 5, consensus: 2 },
    effect: { science: 2, money: 1, consensus: 1 },
    prerequisites: ["internal_combustion", "modern_materials"],
    educational_en: "The Wright brothers' first flight in 1903 lasted 12 seconds. Within 66 years, humans walked on the Moon. Aeronautics provided the engineering principles for understanding flight.",
    educational_ko: "1903년 라이트 형제의 첫 비행은 12초 동안 지속되었습니다. 66년 만에 인류는 달 위를 걸었습니다. 항공공학은 비행을 이해하기 위한 공학 원리를 제공했습니다."
  },
  {
    id: "rocket_propulsion", type: "technology", era: 6,
    name_en: "Rocket Propulsion", name_ko: "로켓 추진",
    description_en: "Engines that work in the vacuum of space.",
    description_ko: "우주 진공에서 작동하는 엔진.",
    cost: { science: 8, money: 7, consensus: 3 },
    effect: { science: 2, money: 0, consensus: 1 },
    prerequisites: ["aeronautics", "chemistry"],
    educational_en: "Unlike jet engines, rockets carry their own oxidizer and work in vacuum. Newton's third law — every action has an equal and opposite reaction — is the fundamental principle of rocketry.",
    educational_ko: "제트 엔진과 달리, 로켓은 자체 산화제를 탑재하여 진공에서 작동합니다. 뉴턴의 제3법칙 — 모든 작용에는 같고 반대인 반작용이 있다 — 이 로켓 공학의 기본 원리입니다."
  },
  {
    id: "guidance_systems", type: "technology", era: 6,
    name_en: "Guidance Systems", name_ko: "유도 시스템",
    description_en: "Automated navigation and trajectory control.",
    description_ko: "자동화된 항법 및 궤도 제어.",
    cost: { science: 8, money: 6, consensus: 2 },
    effect: { science: 2, money: 0, consensus: 0 },
    prerequisites: ["computing", "radio_communication"],
    educational_en: "Guidance systems use gyroscopes, accelerometers, and computers to keep a rocket on course. Without precise guidance, a spacecraft would miss its target by thousands of kilometers.",
    educational_ko: "유도 시스템은 자이로스코프, 가속도계, 컴퓨터를 사용하여 로켓의 경로를 유지합니다. 정밀한 유도 없이는 우주선이 목표를 수천 킬로미터나 벗어날 것입니다."
  },
  {
    id: "life_support", type: "technology", era: 6,
    name_en: "Life Support", name_ko: "생명 유지 장치",
    description_en: "Systems to keep humans alive in space.",
    description_ko: "우주에서 인간을 생존시키는 시스템.",
    cost: { science: 7, money: 7, consensus: 3 },
    effect: { science: 1, money: 0, consensus: 1 },
    prerequisites: ["modern_materials", "computing"],
    educational_en: "Life support systems provide oxygen, remove carbon dioxide, regulate temperature, and manage water. In the vacuum of space, these systems are the thin barrier between life and death.",
    educational_ko: "생명 유지 장치는 산소를 공급하고, 이산화탄소를 제거하고, 온도를 조절하고, 물을 관리합니다. 우주의 진공에서 이 시스템은 삶과 죽음 사이의 얇은 장벽입니다."
  },
  {
    id: "heat_shield", type: "technology", era: 6,
    name_en: "Heat Shield", name_ko: "열 차폐",
    description_en: "Protection from extreme temperatures during reentry.",
    description_ko: "재진입 시 극한 온도로부터의 보호.",
    cost: { science: 7, money: 8, consensus: 2 },
    effect: { science: 1, money: 0, consensus: 0 },
    prerequisites: ["modern_materials", "aeronautics"],
    educational_en: "During reentry, spacecraft experience temperatures exceeding 1,600°C. Heat shields use ablative materials or ceramic tiles to protect the crew — one of the most critical safety systems.",
    educational_ko: "재진입 시 우주선은 1,600°C를 초과하는 온도를 경험합니다. 열 차폐는 삭마 재료나 세라믹 타일을 사용하여 승무원을 보호합니다 — 가장 중요한 안전 시스템 중 하나입니다."
  },
  {
    id: "orbital_mechanics", type: "technology", era: 6,
    name_en: "Orbital Mechanics", name_ko: "궤도 역학",
    description_en: "Mathematics of orbits, trajectories, and transfers.",
    description_ko: "궤도, 궤적, 전이의 수학.",
    cost: { science: 9, money: 4, consensus: 2 },
    effect: { science: 2, money: 0, consensus: 1 },
    prerequisites: ["advanced_math", "rocket_propulsion"],
    educational_en: "Orbital mechanics calculates how to enter, maintain, and change orbits. Hohmann transfer orbits, gravity assists, and orbital rendezvous all depend on this discipline.",
    educational_ko: "궤도 역학은 궤도에 진입하고, 유지하고, 변경하는 방법을 계산합니다. 호만 전이 궤도, 중력 보조, 궤도 랑데부 모두 이 학문에 의존합니다."
  },
];

// ============ INFRASTRUCTURE CARDS ============
export const infrastructureCards = [
  {
    id: "workshop", type: "infrastructure", era: 1,
    name_en: "Workshop", name_ko: "작업장",
    description_en: "A basic workspace for crafting and repair.",
    description_ko: "제작과 수리를 위한 기본 작업 공간.",
    cost: { science: 0, money: 2, consensus: 0 },
    perTurnBonus: { science: 0, money: 1, consensus: 0 },
    prerequisites: ["basic_tools"],
  },
  {
    id: "library", type: "infrastructure", era: 2,
    name_en: "Library", name_ko: "도서관",
    description_en: "Preserve and share accumulated knowledge.",
    description_ko: "축적된 지식을 보존하고 공유합니다.",
    cost: { science: 1, money: 2, consensus: 1 },
    perTurnBonus: { science: 2, money: 0, consensus: 0 },
    prerequisites: ["writing"],
  },
  {
    id: "university", type: "infrastructure", era: 2,
    name_en: "University", name_ko: "대학교",
    description_en: "Train scholars and advance research.",
    description_ko: "학자를 양성하고 연구를 발전시킵니다.",
    cost: { science: 2, money: 3, consensus: 2 },
    perTurnBonus: { science: 2, money: 0, consensus: 1 },
    prerequisites: ["writing", "mathematics"],
  },
  {
    id: "observatory", type: "infrastructure", era: 3,
    name_en: "Observatory", name_ko: "천문대",
    description_en: "Dedicated facility for astronomical observation.",
    description_ko: "천문 관측을 위한 전용 시설.",
    cost: { science: 3, money: 3, consensus: 1 },
    perTurnBonus: { science: 3, money: 0, consensus: 0 },
    prerequisites: ["astronomy", "precision_instruments"],
  },
  {
    id: "factory", type: "infrastructure", era: 4,
    name_en: "Factory", name_ko: "공장 시설",
    description_en: "Mass-produce goods and equipment.",
    description_ko: "상품과 장비를 대량 생산합니다.",
    cost: { science: 1, money: 5, consensus: 1 },
    perTurnBonus: { science: 0, money: 3, consensus: 0 },
    prerequisites: ["factories"],
  },
  {
    id: "power_plant", type: "infrastructure", era: 4,
    name_en: "Power Plant", name_ko: "발전소",
    description_en: "Generate electrical power for industry.",
    description_ko: "산업을 위한 전력을 생산합니다.",
    cost: { science: 2, money: 5, consensus: 2 },
    perTurnBonus: { science: 1, money: 2, consensus: 0 },
    prerequisites: ["electricity"],
  },
  {
    id: "research_lab", type: "infrastructure", era: 5,
    name_en: "Research Laboratory", name_ko: "연구소",
    description_en: "Advanced research in all scientific fields.",
    description_ko: "모든 과학 분야의 첨단 연구.",
    cost: { science: 3, money: 5, consensus: 2 },
    perTurnBonus: { science: 3, money: 0, consensus: 1 },
    prerequisites: ["electronics"],
  },
  {
    id: "computing_center", type: "infrastructure", era: 5,
    name_en: "Computing Center", name_ko: "전산 센터",
    description_en: "Large-scale computing and simulation facility.",
    description_ko: "대규모 연산 및 시뮬레이션 시설.",
    cost: { science: 4, money: 6, consensus: 1 },
    perTurnBonus: { science: 2, money: 1, consensus: 0 },
    prerequisites: ["computing"],
  },
  {
    id: "wind_tunnel", type: "infrastructure", era: 5,
    name_en: "Wind Tunnel", name_ko: "풍동 시설",
    description_en: "Test aerodynamic designs for aircraft and rockets.",
    description_ko: "항공기와 로켓의 공기역학적 설계를 시험합니다.",
    cost: { science: 3, money: 5, consensus: 1 },
    perTurnBonus: { science: 2, money: 0, consensus: 0 },
    prerequisites: ["aeronautics"],
  },
  {
    id: "launch_facility", type: "infrastructure", era: 6,
    name_en: "Launch Facility", name_ko: "발사 시설",
    description_en: "Facility for assembling and launching rockets.",
    description_ko: "로켓 조립 및 발사를 위한 시설.",
    cost: { science: 4, money: 10, consensus: 4 },
    perTurnBonus: { science: 1, money: 0, consensus: 1 },
    prerequisites: ["rocket_propulsion"],
  },
];

// ============ POLICY CARDS ============
export const policyCards = [
  {
    id: "public_education", type: "policy", era: 2,
    name_en: "Public Education Program", name_ko: "공교육 확대",
    description_en: "Expand access to education for all citizens.",
    description_ko: "모든 시민에게 교육 기회를 확대합니다.",
    cost: { science: 0, money: 2, consensus: 1 },
    effect: { science: 1, money: 0, consensus: 2 },
  },
  {
    id: "research_funding", type: "policy", era: 3,
    name_en: "Research Funding Act", name_ko: "연구 지원법",
    description_en: "Government funding for scientific research.",
    description_ko: "과학 연구에 대한 정부 자금 지원.",
    cost: { science: 0, money: 3, consensus: 2 },
    effect: { science: 3, money: 0, consensus: 0 },
  },
  {
    id: "trade_agreement", type: "policy", era: 2,
    name_en: "Trade Agreement", name_ko: "무역 협정",
    description_en: "International trade boosts economy.",
    description_ko: "국제 무역이 경제를 활성화합니다.",
    cost: { science: 0, money: 1, consensus: 2 },
    effect: { science: 0, money: 3, consensus: 1 },
  },
  {
    id: "national_academy", type: "policy", era: 3,
    name_en: "National Academy of Sciences", name_ko: "국립 과학 아카데미",
    description_en: "Prestigious institution advancing research.",
    description_ko: "연구를 발전시키는 권위 있는 기관.",
    cost: { science: 1, money: 3, consensus: 2 },
    effect: { science: 3, money: 0, consensus: 1 },
  },
  {
    id: "industrial_policy", type: "policy", era: 4,
    name_en: "Industrial Development Policy", name_ko: "산업 발전 정책",
    description_en: "Government-backed industrial growth.",
    description_ko: "정부 지원 산업 성장.",
    cost: { science: 0, money: 2, consensus: 3 },
    effect: { science: 0, money: 4, consensus: 0 },
  },
  {
    id: "space_program", type: "policy", era: 5,
    name_en: "National Space Program", name_ko: "국가 우주 계획",
    description_en: "Dedicated government space initiative.",
    description_ko: "정부 전담 우주 계획.",
    cost: { science: 2, money: 4, consensus: 4 },
    effect: { science: 3, money: 2, consensus: 2 },
  },
  {
    id: "public_lecture", type: "policy", era: 2,
    name_en: "Public Lecture Series", name_ko: "공개 강연회",
    description_en: "Scientists share knowledge with citizens.",
    description_ko: "과학자들이 시민들과 지식을 공유합니다.",
    cost: { science: 1, money: 0, consensus: 0 },
    effect: { science: 0, money: 0, consensus: 3 },
  },
  {
    id: "tech_expo", type: "policy", era: 4,
    name_en: "Technology Exposition", name_ko: "기술 박람회",
    description_en: "Showcase technological achievements publicly.",
    description_ko: "기술적 성과를 대중에게 전시합니다.",
    cost: { science: 0, money: 3, consensus: 0 },
    effect: { science: 1, money: 1, consensus: 3 },
  },
];

// ============ EVENT CARDS ============
export const eventCards = [
  {
    id: "scientific_breakthrough", type: "event",
    name_en: "Scientific Breakthrough", name_ko: "과학적 돌파구",
    description_en: "A brilliant discovery accelerates research!",
    description_ko: "뛰어난 발견이 연구를 가속화합니다!",
    effect: { science: 4, money: 0, consensus: 1 },
    isPositive: true,
  },
  {
    id: "economic_recession", type: "event",
    name_en: "Economic Recession", name_ko: "경제 불황",
    description_en: "Economic downturn reduces available funding.",
    description_ko: "경기 침체가 가용 자금을 감소시킵니다.",
    effect: { science: 0, money: -3, consensus: -1 },
    isPositive: false,
  },
  {
    id: "public_protest", type: "event",
    name_en: "Public Protest", name_ko: "대중 시위",
    description_en: "Citizens question government spending priorities.",
    description_ko: "시민들이 정부 지출 우선순위에 의문을 제기합니다.",
    effect: { science: 0, money: 0, consensus: -3 },
    isPositive: false,
  },
  {
    id: "international_cooperation", type: "event",
    name_en: "International Cooperation", name_ko: "국제 협력",
    description_en: "Allied nations share research and resources.",
    description_ko: "동맹국들이 연구와 자원을 공유합니다.",
    effect: { science: 2, money: 2, consensus: 2 },
    isPositive: true,
  },
  {
    id: "industrial_accident", type: "event",
    name_en: "Industrial Accident", name_ko: "산업 사고",
    description_en: "A factory accident damages production capacity.",
    description_ko: "공장 사고가 생산 능력을 손상시킵니다.",
    effect: { science: 0, money: -2, consensus: -2 },
    isPositive: false,
  },
  {
    id: "trade_boom", type: "event",
    name_en: "Trade Boom", name_ko: "무역 호황",
    description_en: "Favorable trade conditions boost the economy.",
    description_ko: "유리한 무역 조건이 경제를 활성화합니다.",
    effect: { science: 0, money: 4, consensus: 1 },
    isPositive: true,
  },
  {
    id: "talented_scientist", type: "event",
    name_en: "Talented Scientist Recruited", name_ko: "뛰어난 과학자 영입",
    description_en: "A brilliant mind joins your research team.",
    description_ko: "뛰어난 인재가 연구팀에 합류합니다.",
    effect: { science: 3, money: 0, consensus: 1 },
    isPositive: true,
  },
  {
    id: "natural_disaster", type: "event",
    name_en: "Natural Disaster", name_ko: "자연재해",
    description_en: "Floods or earthquakes disrupt infrastructure.",
    description_ko: "홍수나 지진이 기반 시설을 파괴합니다.",
    effect: { science: -1, money: -3, consensus: 0 },
    isPositive: false,
  },
  {
    id: "cultural_renaissance", type: "event",
    name_en: "Cultural Renaissance", name_ko: "문화 부흥",
    description_en: "An era of artistic and intellectual flourishing.",
    description_ko: "예술적, 지적 번영의 시대.",
    effect: { science: 2, money: 1, consensus: 3 },
    isPositive: true,
  },
  {
    id: "political_instability", type: "event",
    name_en: "Political Instability", name_ko: "정치 불안",
    description_en: "Leadership crisis reduces national cohesion.",
    description_ko: "지도부 위기가 국가 결속을 약화시킵니다.",
    effect: { science: -1, money: -1, consensus: -3 },
    isPositive: false,
  },
  {
    id: "foreign_investment", type: "event",
    name_en: "Foreign Investment", name_ko: "외국인 투자",
    description_en: "International investors fund your development.",
    description_ko: "국제 투자자들이 발전에 자금을 지원합니다.",
    effect: { science: 0, money: 5, consensus: 0 },
    isPositive: true,
  },
  {
    id: "epidemic", type: "event",
    name_en: "Epidemic", name_ko: "전염병",
    description_en: "Disease outbreak strains resources and morale.",
    description_ko: "전염병 발생이 자원과 사기를 소진시킵니다.",
    effect: { science: -2, money: -2, consensus: -2 },
    isPositive: false,
  },
];

// ============ MISSION CARDS ============
export const missionCards = [
  {
    id: "atmospheric_test", type: "mission", era: 5,
    name_en: "Atmospheric Test", name_ko: "대기권 시험",
    description_en: "Test rocket flight within the atmosphere.",
    description_ko: "대기권 내 로켓 비행을 시험합니다.",
    cost: { science: 4, money: 5, consensus: 2 },
    prerequisites: ["aeronautics", "rocket_propulsion"],
    missionOrder: 1,
    educational_en: "Early rocket tests often ended in spectacular failures. Each failure taught engineers valuable lessons about aerodynamics, fuel systems, and structural integrity.",
    educational_ko: "초기 로켓 시험은 종종 장관을 이루는 실패로 끝났습니다. 각 실패는 엔지니어들에게 공기역학, 연료 시스템, 구조적 완전성에 대한 귀중한 교훈을 주었습니다."
  },
  {
    id: "uncrewed_launch", type: "mission", era: 6,
    name_en: "Uncrewed Rocket Launch", name_ko: "무인 로켓 발사",
    description_en: "Launch a rocket beyond the atmosphere without crew.",
    description_ko: "승무원 없이 대기권 밖으로 로켓을 발사합니다.",
    cost: { science: 5, money: 7, consensus: 3 },
    prerequisites: ["rocket_propulsion", "guidance_systems"],
    requiredInfra: ["launch_facility"],
    missionOrder: 2,
    educational_en: "Uncrewed launches proved that rockets could reach space and return safely. These missions tested every system that would later carry human passengers.",
    educational_ko: "무인 발사는 로켓이 우주에 도달하고 안전하게 귀환할 수 있음을 증명했습니다. 이 미션들은 나중에 인간 승객을 태울 모든 시스템을 시험했습니다."
  },
  {
    id: "satellite_launch", type: "mission", era: 6,
    name_en: "Satellite Launch", name_ko: "인공위성 발사",
    description_en: "Place a satellite into Earth orbit.",
    description_ko: "인공위성을 지구 궤도에 배치합니다.",
    cost: { science: 6, money: 8, consensus: 3 },
    prerequisites: ["rocket_propulsion", "guidance_systems", "orbital_mechanics"],
    requiredInfra: ["launch_facility"],
    missionOrder: 3,
    educational_en: "Sputnik, launched by the Soviet Union in 1957, was the first artificial satellite. Its radio beeps, heard worldwide, marked the beginning of the Space Age.",
    educational_ko: "1957년 소련이 발사한 스푸트니크는 최초의 인공위성이었습니다. 전 세계에서 들린 무선 신호음은 우주 시대의 시작을 알렸습니다."
  },
  {
    id: "orbital_test", type: "mission", era: 6,
    name_en: "Orbital Test", name_ko: "궤도 시험",
    description_en: "Test orbital insertion and controlled reentry.",
    description_ko: "궤도 진입과 통제된 재진입을 시험합니다.",
    cost: { science: 7, money: 9, consensus: 4 },
    prerequisites: ["orbital_mechanics", "heat_shield", "life_support"],
    requiredInfra: ["launch_facility"],
    missionOrder: 4,
    educational_en: "Before risking human lives, space agencies tested orbital reentry with capsules carrying instruments or animals. These tests validated heat shields and parachute systems.",
    educational_ko: "인간의 생명을 위험에 빠뜨리기 전에, 우주 기관들은 기기나 동물을 실은 캡슐로 궤도 재진입을 시험했습니다. 이 시험들은 열 차폐와 낙하산 시스템을 검증했습니다."
  },
  {
    id: "crewed_spaceflight", type: "mission", era: 6,
    name_en: "Crewed Spaceflight", name_ko: "유인 우주 비행",
    description_en: "Send humans to orbit and return them safely!",
    description_ko: "인간을 궤도에 보내고 안전하게 귀환시킵니다!",
    cost: { science: 8, money: 12, consensus: 6 },
    prerequisites: ["rocket_propulsion", "guidance_systems", "life_support", "heat_shield", "orbital_mechanics"],
    requiredInfra: ["launch_facility"],
    missionOrder: 5,
    educational_en: "Yuri Gagarin became the first human in space on April 12, 1961, orbiting Earth in Vostok 1. This achievement required mastery of every technology from fire to computers.",
    educational_ko: "유리 가가린은 1961년 4월 12일 보스토크 1호로 지구를 공전하며 최초의 우주 인간이 되었습니다. 이 성취는 불에서 컴퓨터까지 모든 기술의 숙달을 필요로 했습니다."
  },
];

// ============ ALL CARDS COMBINED ============
export const allTechCards = [...discoveryCards, ...technologyCards];

export const allCards = [
  ...discoveryCards,
  ...technologyCards,
  ...infrastructureCards,
  ...policyCards,
  ...eventCards,
  ...missionCards,
];

// ============ ERA DATA ============
export const eraData = [
  { id: 1, key: 'era1', name_en: "Foundations", name_ko: "기초 문명", color: "text-amber-400", bgColor: "bg-amber-900/30", borderColor: "border-amber-700/50" },
  { id: 2, key: 'era2', name_en: "Early Science", name_ko: "초기 과학", color: "text-emerald-400", bgColor: "bg-emerald-900/30", borderColor: "border-emerald-700/50" },
  { id: 3, key: 'era3', name_en: "Scientific Revolution", name_ko: "과학 혁명", color: "text-cyan-400", bgColor: "bg-cyan-900/30", borderColor: "border-cyan-700/50" },
  { id: 4, key: 'era4', name_en: "Industrial Age", name_ko: "산업 시대", color: "text-orange-400", bgColor: "bg-orange-900/30", borderColor: "border-orange-700/50" },
  { id: 5, key: 'era5', name_en: "Modern Technology", name_ko: "현대 기술", color: "text-blue-400", bgColor: "bg-blue-900/30", borderColor: "border-blue-700/50" },
  { id: 6, key: 'era6', name_en: "Space Age", name_ko: "우주 시대", color: "text-purple-400", bgColor: "bg-purple-900/30", borderColor: "border-purple-700/50" },
];

// ============ FICTIONAL COUNTRIES ============
export const fictionalCountries = [
  { id: "solaria", name_en: "Solaria", name_ko: "솔라리아" },
  { id: "novaheim", name_en: "Novaheim", name_ko: "노바하임" },
  { id: "crescentia", name_en: "Crescentia", name_ko: "크레센티아" },
  { id: "aethon", name_en: "Aethon", name_ko: "에톤" },
  { id: "meridia", name_en: "Meridia", name_ko: "메리디아" },
  { id: "auralis", name_en: "Auralis", name_ko: "아우랄리스" },
];

export const aiCountryNames = [
  { name_en: "Zephyria", name_ko: "제피리아" },
  { name_en: "Polaris", name_ko: "폴라리스" },
  { name_en: "Terranis", name_ko: "테라니스" },
];