/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SkillItem, TraitItem, HobbyItem } from "./types";

export interface ProfileInfo {
  name: string;
  englishName: string;
  role: string;
  greeting: string;
  birth: string;
  email: string;
  github: string;
  portfolioUrl: string;
  summary: string;
}

export const PROFILE_DATA: ProfileInfo = {
  name: "김세환 (Kim Se-hwan)",
  englishName: "Sean Kim",
  role: "Creative UI/UX Designer & Frontend Developer",
  greeting: "안녕하세요! 개발하는 디자이너이자 디자인하는 개발자, 김세환입니다.",
  birth: "1998. 06. 12",
  email: "cerealcocoa98@gmail.com",
  github: "https://github.com/cerealcocoa98",
  portfolioUrl: "https://github.com/cerealcocoa98/tetris-portfolio",
  summary: "테트리스 게임의 완벽한 결합처럼, 시각적인 조화(Design)와 논리적인 구조(Code)가 맞물려 돌아가는 상태를 좋아합니다. 디자이너의 심미안으로 화면을 그리고, 개발자의 손끝으로 무한한 사용자 경험(UX)을 빌딩합니다."
};

export const SKILL_DATA: SkillItem[] = [
  {
    name: "Figma",
    percentage: 95,
    icon: "Figma",
    type: "design",
    desc: "컴포넌트 패턴 구축, 오토레이아웃 활용 및 프로토타이핑 시스템 완벽 활용"
  },
  {
    name: "React.js",
    percentage: 88,
    icon: "Code",
    type: "tech",
    desc: "React 19, functional hooks, 커스텀 훅 설계 및 최적화된 상태 관리 구축"
  },
  {
    name: "Vite / TS",
    percentage: 85,
    icon: "FileJson",
    type: "tech",
    desc: "TypeScript를 통한 안전한 타입 설계 및 고성능 Vite 컴파일 빌드 구성"
  },
  {
    name: "Tailwind CSS",
    percentage: 92,
    icon: "Paintbrush",
    type: "tech",
    desc: "원하는 디자인을 100% 모던 유틸리티 클래스로 유려하고 신속하게 구현"
  },
  {
    name: "Illustrator",
    percentage: 85,
    icon: "Palette",
    type: "design",
    desc: "벡터 기반 로고 디자인, 일러스트레이션 및 픽셀 아이콘 소스 제작"
  },
  {
    name: "Photoshop",
    percentage: 80,
    icon: "Image",
    type: "design",
    desc: "정밀 이미지 합성, 색감 리터칭 및 완성도 높은 비주얼 톤 보정"
  }
];

export const TRAIT_DATA: TraitItem[] = [
  {
    title: "시각과 기능의 완벽한 조율",
    type: "advantage",
    desc: "디자이너와 프론트엔드 개발자 그 경계에 서서 두 파트의 언어를 모두 이해합니다. 협업 시 소통 불필요 비용(Cost)을 정밀하게 단축시킵니다.",
    badge: "융합형 인재"
  },
  {
    title: "1px에도 집요한 디테일",
    type: "advantage",
    desc: "마치 완벽하게 맞물리는 테트리스처럼, 컴포넌트의 레이아웃 오차와 통일되지 않은 그림자 등을 그냥 지치지 못합니다. 디테일이 퀄리티를 바꿉니다.",
    badge: "완성도 과몰입"
  },
  {
    title: "새로운 기술을 향한 클라이밍",
    type: "advantage",
    desc: "Spline 3D 브라우저 그래픽스, 모션 웹 애니메이션 등 최신 트렌드를 빠르게 학습하여 사용자의 주의력을 모으는 특별한 인터랙팅을 구축합니다.",
    badge: "성장 러너"
  },
  {
    title: "끝을 봐야 직성이 풀리는 집요함",
    type: "disadvantage",
    desc: "에러 해결법이나 마이크로 애니메이션 모션이 원하는 프레임 리듬대로 실행될 때까지 해결의 끈을 놓지 않습니다. 때로는 집중이 과도해질 때가 있어 '타임박싱(Time Boxing)'을 도입해 시간 관리를 철저히 훈련 중입니다.",
    badge: "집념의 끝판왕"
  }
];

export const HOBBY_DATA: HobbyItem[] = [
  {
    name: "실내 및 자연 클라이밍",
    icon: "Climbing",
    desc: "루트 파인딩(계획 수립)을 하고 무수한 실패 끝에 탑 홀드를 움켜쥐었을 때의 성취감. 복잡한 알고리즘을 푸는 쾌감과 흡사하여 사랑하는 취미입니다.",
    color: "from-zinc-700 to-zinc-900 shadow-zinc-950/40"
  },
  {
    name: "필름 카메라 아날로그 출사",
    icon: "Camera",
    desc: "디지털의 무제한 셔터가 아닌, 단 36장의 한정된 소중함 속에 프레이밍과 빛의 온도를 정확히 담아내는 아날로그 출사로 미적 감각을 재충전합니다.",
    color: "from-neutral-500 to-neutral-800 shadow-neutral-950/40"
  },
  {
    name: "레트로 아케이드 & 아날로그 DIY",
    icon: "Gamepad2",
    desc: "8비트 로우파이(Lo-Fi) 감성의 픽셀 디자인과 사운드에서 깊은 UI/UX 아이디어를 얻습니다. 아카이빙된 사운드 트랙과 하드웨어 개조도 직접 맛봅니다.",
    color: "from-slate-600 to-slate-900 shadow-slate-950/40"
  },
  {
    name: "스페셜티 드립 커피 탐구",
    icon: "Coffee",
    desc: "원두의 원산지, 로스팅 상태에 따른 온도, 가스 추출 정량을 섬세히 과학적으로 조절하고 테이스팅하는 나만의 차분하고 우아한 브루잉 미학이 있습니다.",
    color: "from-gray-500 to-gray-800 shadow-gray-950/40"
  }
];

// Details of Tetromino forms and custom labels
export const TETROMINOES: Record<string, { matrix: number[][]; name: string; color: string; border: string; glow: string; type: string }> = {
  I: {
    matrix: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    name: "React.js",
    color: "bg-white",
    border: "border-neutral-300",
    glow: "shadow-white/40",
    type: "tech"
  },
  O: {
    matrix: [
      [1, 1],
      [1, 1]
    ],
    name: "Figma",
    color: "bg-neutral-300",
    border: "border-neutral-200",
    glow: "shadow-neutral-300/40",
    type: "design"
  },
  T: {
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    name: "TypeScript",
    color: "bg-zinc-400",
    border: "border-zinc-300",
    glow: "shadow-zinc-400/40",
    type: "tech"
  },
  S: {
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    name: "Tailwind CSS",
    color: "bg-neutral-400",
    border: "border-neutral-300",
    glow: "shadow-neutral-400/40",
    type: "tech"
  },
  Z: {
    matrix: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    name: "Photoshop",
    color: "bg-zinc-650 bg-stone-500",
    border: "border-stone-400",
    glow: "shadow-stone-500/40",
    type: "design"
  },
  J: {
    matrix: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    name: "Illustrator",
    color: "bg-slate-300",
    border: "border-slate-200",
    glow: "shadow-slate-300/40",
    type: "design"
  },
  L: {
    matrix: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    name: "Communication",
    color: "bg-neutral-100",
    border: "border-white",
    glow: "shadow-neutral-200/40",
    type: "soft"
  }
};
