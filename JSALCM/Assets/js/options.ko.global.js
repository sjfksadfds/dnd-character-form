// 전역 데이터: 한국어 D&D 옵션 (code/name) + 레벨1 특성 + 클래스별 스킬 규칙
// - "표시명(name)"은 마음껏 바꿔도 되고, 내부 로직은 "code"로 안전하게 연결됩니다.
// - 스킬 선택 규칙도 클래스 안에서 함께 관리합니다(choose, from).

window.DND_OPTIONS = {
  // 1) 스킬 마스터(전체 목록): code(내부키) + name(표시명)
  skillsMaster: [
    { code: 'acrobatics',      name: '곡예 (민첩)' },
    { code: 'animalHandling',  name: '동물 조련 (지혜)' },
    { code: 'arcana',          name: '비전 (지능)' },
    { code: 'athletics',       name: '운동 (근력)' },
    { code: 'deception',       name: '기만 (매력)' },
    { code: 'history',         name: '역사 (지능)' },
    { code: 'insight',         name: '통찰 (지혜)' },
    { code: 'intimidation',    name: '위협 (매력)' },
    { code: 'investigation',   name: '조사 (지능)' },
    { code: 'medicine',        name: '치유 (지혜)' },
    { code: 'nature',          name: '자연 (지능)' },
    { code: 'perception',      name: '지각 (지혜)' },
    { code: 'performance',     name: '공연 (매력)' },
    { code: 'persuasion',      name: '설득 (매력)' },
    { code: 'religion',        name: '종교 (지능)' },
    { code: 'sleightOfHand',   name: '손놀림 (민첩)' },
    { code: 'stealth',         name: '은신 (민첩)' },
    { code: 'survival',        name: '생존 (지혜)' },
  ],

  // 2) 클래스: code/name + featuresLvl1 + skills(choose/from)
  classes: [
    {
      code: "barbarian",
      name: "바바리안",
      featuresLvl1: [
        { name: "분노 (Rage)", desc: "한정 횟수로 분노 상태에 들어가 공격/내성 등에 보너스를 얻습니다." },
        { name: "무장 방어 (Unarmored Defense)", desc: "방어구 없이도 능력치 기반의 방어를 사용합니다." }
      ],
      // 사용자 요청: 바드/로그만 3개, 나머지는 2개
      skills: { choose: 2, from: ["animalHandling","athletics","intimidation","nature","perception","survival"] }
    },
    {
      code: "bard",
      name: "바드",
      featuresLvl1: [
        { name: "바드의 고양 (Bardic Inspiration)", desc: "아군에게 주사위 보너스를 부여해 판정/공격/피해를 돕습니다." },
        { name: "주문 시전", desc: "바드 주문을 배워 시전합니다." }
      ],
      // 바드는 전체 스킬 중 3개 선택
      skills: { choose: 3, from: [
        "acrobatics","animalHandling","arcana","athletics","deception","history","insight","intimidation",
        "investigation","medicine","nature","perception","performance","persuasion","religion","sleightOfHand","stealth","survival"
      ] }
    },
    {
      code: "cleric",
      name: "클레릭",
      featuresLvl1: [
        { name: "주문 시전", desc: "신성한 힘으로 치유·보호·지원 주문을 시전합니다." },
        { name: "도메인 선택", desc: "신앙 분야(도메인)를 정하고 관련 특징을 얻습니다." }
      ],
      skills: { choose: 2, from: ["history","insight","medicine","persuasion","religion"] }
    },
    {
      code: "druid",
      name: "드루이드",
      featuresLvl1: [
        { name: "자연 주문", desc: "자연의 힘을 다루는 주문을 시전합니다." },
        { name: "드루이드어", desc: "드루이드만 사용하는 암호 언어를 알고 사용합니다." }
      ],
      skills: { choose: 2, from: ["arcana","animalHandling","insight","medicine","nature","perception","religion","survival"] }
    },
    {
      code: "fighter",
      name: "파이터",
      featuresLvl1: [
        { name: "전투 스타일", desc: "전투 성향을 선택하여 특정 상황에서 보너스를 얻습니다." },
        { name: "재정비 (Second Wind)", desc: "보너스 행동으로 약간의 체력을 회복합니다." }
      ],
      skills: { choose: 2, from: ["acrobatics","animalHandling","athletics","history","insight","intimidation","perception","survival"] }
    },
    {
      code: "monk",
      name: "몽크",
      featuresLvl1: [
        { name: "무술 (Martial Arts)", desc: "맨손/간단 무기로 유연하고 연속적인 전투를 수행합니다." },
        { name: "무장 방어", desc: "방어구 없이도 능력치 기반의 방어를 사용합니다." }
      ],
      skills: { choose: 2, from: ["acrobatics","athletics","history","insight","religion","stealth"] }
    },
    {
      code: "paladin",
      name: "팔라딘",
      featuresLvl1: [
        { name: "신성 감지 (Divine Sense)", desc: "한동안 성스러운/사악한 존재를 감지합니다." },
        { name: "치유의 손길 (Lay on Hands)", desc: "치유 풀을 사용해 터치로 치유합니다." }
      ],
      skills: { choose: 2, from: ["athletics","insight","intimidation","medicine","persuasion","religion"] }
    },
    {
      code: "ranger",
      name: "레인저",
      featuresLvl1: [
        { name: "자연 탐사", desc: "야외 탐색·추적에서 전술적 이점을 얻습니다." },
        { name: "선호 사냥감", desc: "특정 대상에 대한 정보/전술적 이점을 확보합니다." }
      ],
      // 공식 규칙은 3개지만, 사용자 요청에 맞춰 2개로 설정
      skills: { choose: 2, from: ["animalHandling","athletics","insight","investigation","nature","perception","stealth","survival"] }
    },
    {
      code: "rogue",
      name: "로그",
      featuresLvl1: [
        { name: "암습 (Sneak Attack)", desc: "조건을 만족하면 추가 피해를 입힙니다." },
        { name: "전문화 (Expertise)", desc: "선택한 기술/도구의 숙련 보너스를 두 배로 받습니다." },
        { name: "도둑의 은어 (Thieves’ Cant)", desc: "밀어 언어를 알고 사용합니다." }
      ],
      // 사용자 요청에 맞춰 3개
      skills: { choose: 3, from: ["acrobatics","athletics","deception","insight","intimidation","investigation","perception","performance","persuasion","sleightOfHand","stealth"] }
    },
    {
      code: "sorcerer",
      name: "소서러",
      featuresLvl1: [
        { name: "주문 시전", desc: "타고난 마력으로 주문을 시전합니다." },
        { name: "마력 혈통 선택", desc: "마법 혈통을 선택하고 고유 특징을 얻습니다." }
      ],
      skills: { choose: 2, from: ["arcana","deception","insight","intimidation","persuasion","religion"] }
    },
    {
      code: "warlock",
      name: "워락",
      featuresLvl1: [
        { name: "후견인 선택", desc: "다른 세계의 존재와 계약을 맺습니다." },
        { name: "계약 마법 (Pact Magic)", desc: "짧은 휴식으로 회복되는 주문 슬롯으로 주문을 시전합니다." }
      ],
      skills: { choose: 2, from: ["arcana","deception","history","intimidation","investigation","nature","religion"] }
    },
    {
      code: "wizard",
      name: "위저드",
      featuresLvl1: [
        { name: "주문 시전", desc: "주문서를 바탕으로 주문을 준비하고 시전합니다." },
        { name: "비전 회복 (Arcane Recovery)", desc: "짧은 휴식에 일부 주문 자원을 회복합니다." }
      ],
      skills: { choose: 2, from: ["arcana","history","insight","investigation","medicine","religion"] }
    },
    {
      code: "artificer",
      name: "아티피서",
      featuresLvl1: [
        { name: "마법 수공 (Magical Tinkering)", desc: "작은 물건에 간단한 마법적 효과를 부여합니다." },
        { name: "주문 시전", desc: "기술과 마법을 결합한 주문을 시전합니다." }
      ],
      skills: { choose: 2, from: ["arcana","history","investigation","medicine","nature","perception","sleightOfHand"] }
    }
  ],

  // 3) 나머지 선택 목록(그대로 유지)
  alignments: [
    "질서 선","중립 선","혼돈 선",
    "질서 중립","중립","혼돈 중립",
    "질서 악","중립 악","혼돈 악"
  ],
  species: [
    "인간","엘프","하프엘프","드워프","하플링",
    "노움","하프오크","티플링","드래곤본","아시마르"
  ],
  backgrounds: [
    "수도자(아콜라이트)","군인","현자","범죄자","민중 영웅",
    "귀족","연희가","길드 장인","은둔자","외지인","선원","거리의 아이"
  ],
};
