// 전역 데이터: 한국어 D&D 옵션 + 클래스(코드/표시명) & 레벨1 특성(통합)
// * 이 파일만 수정해도 콤보박스/미리보기/특성 모두 자동 갱신됩니다.
window.DND_OPTIONS = {
  classes: [
    {
      code: "barbarian",
      name: "야만용사",
      featuresLvl1: [
        { name: "분노 (Rage)", desc: "한정 횟수로 분노 상태에 들어가 공격/내성 등에 보너스를 얻습니다." },
        { name: "무장 방어 (Unarmored Defense)", desc: "방어구 없이도 능력치 기반의 방어를 사용합니다." }
      ]
    },
    {
      code: "bard",
      name: "바드",
      featuresLvl1: [
        { name: "바드의 고양 (Bardic Inspiration)", desc: "아군에게 주사위 보너스를 부여해 판정/공격/피해를 돕습니다." },
        { name: "주문 시전", desc: "바드 주문을 배워 시전합니다." }
      ]
    },
    {
      code: "cleric",
      name: "클레릭",
      featuresLvl1: [
        { name: "주문 시전", desc: "신성한 힘으로 치유·보호·지원 주문을 시전합니다." },
        { name: "도메인 선택", desc: "신앙 분야(도메인)를 정하고 관련 특징을 얻습니다." }
      ]
    },
    {
      code: "druid",
      name: "드루이드",
      featuresLvl1: [
        { name: "자연 주문", desc: "자연의 힘을 다루는 주문을 시전합니다." },
        { name: "드루이드어", desc: "드루이드만 사용하는 암호 언어를 알고 사용합니다." }
      ]
    },
    {
      code: "fighter",
      name: "파이터",
      featuresLvl1: [
        { name: "전투 스타일", desc: "전투 성향을 선택하여 특정 상황에서 보너스를 얻습니다." },
        { name: "재정비 (Second Wind)", desc: "보너스 행동으로 약간의 체력을 회복합니다." }
      ]
    },
    {
      code: "monk",
      name: "몽크",
      featuresLvl1: [
        { name: "무술 (Martial Arts)", desc: "맨손/간단 무기로 유연하고 연속적인 전투를 수행합니다." },
        { name: "무장 방어", desc: "방어구 없이도 능력치 기반의 방어를 사용합니다." }
      ]
    },
    {
      code: "paladin",
      name: "팔라딘",
      featuresLvl1: [
        { name: "신성 감지 (Divine Sense)", desc: "한동안 성스러운/사악한 존재를 감지합니다." },
        { name: "치유의 손길 (Lay on Hands)", desc: "치유 풀을 사용해 터치로 치유합니다." }
      ]
    },
    {
      code: "ranger",
      name: "레인저",
      featuresLvl1: [
        { name: "자연 탐사", desc: "야외 탐색·추적에서 전술적 이점을 얻습니다." },
        { name: "선호 사냥감", desc: "특정 대상에 대한 정보/전술적 이점을 확보합니다." }
      ]
    },
    {
      code: "rogue",
      name: "로그",
      featuresLvl1: [
        { name: "암습 (Sneak Attack)", desc: "조건을 만족하면 추가 피해를 입힙니다." },
        { name: "전문화 (Expertise)", desc: "선택한 기술/도구의 숙련 보너스를 두 배로 받습니다." },
        { name: "도둑의 은어 (Thieves’ Cant)", desc: "밀어 언어를 알고 사용합니다." }
      ]
    },
    {
      code: "sorcerer",
      name: "소서러",
      featuresLvl1: [
        { name: "주문 시전", desc: "타고난 마력으로 주문을 시전합니다." },
        { name: "마력 혈통 선택", desc: "마법 혈통을 선택하고 고유 특징을 얻습니다." }
      ]
    },
    {
      code: "warlock",
      name: "워락",
      featuresLvl1: [
        { name: "후견인 선택", desc: "다른 세계의 존재와 계약을 맺습니다." },
        { name: "계약 마법 (Pact Magic)", desc: "짧은 휴식으로 회복되는 주문 슬롯으로 주문을 시전합니다." }
      ]
    },
    {
      code: "wizard",
      name: "위저드",
      featuresLvl1: [
        { name: "주문 시전", desc: "주문서를 바탕으로 주문을 준비하고 시전합니다." },
        { name: "비전 회복 (Arcane Recovery)", desc: "짧은 휴식에 일부 주문 자원을 회복합니다." }
      ]
    },
    {
      code: "artificer",
      name: "아티피서",
      featuresLvl1: [
        { name: "마법 수공 (Magical Tinkering)", desc: "작은 물건에 간단한 마법적 효과를 부여합니다." },
        { name: "주문 시전", desc: "기술과 마법을 결합한 주문을 시전합니다." }
      ]
    }
  ],

  // 기존처럼 문자열 배열 유지 (원하면 추후 code/name 구조로 확장 가능)
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
  ]
};
