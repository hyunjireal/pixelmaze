/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameStatus = "BEFORE_START" | "PLAYING" | "PAUSED" | "GAME_OVER";

export interface Position {
  x: number;
  y: number;
}

export interface TetrominoType {
  matrix: number[][];
  color: string; // Tailwind class background
  borderColor: string; // Tailwind class border
  glowColor: string; // Tailwind shadow/glow style
  name: string;
  category: "Tech" | "Design" | "SoftSkill";
}

export interface PortfolioItem {
  id: string;
  title: string;
  subtitle: string;
  unlocked: boolean;
  unlockCondition: string;
  type: "skills" | "traits" | "hobbies" | "contact";
  colorTheme: string; // 'cyan' | 'purple' | 'emerald' | 'rose'
}

export interface SkillItem {
  name: string;
  percentage: number;
  icon: string; // Lucide icon name or emoji
  type: "design" | "tech";
  desc: string;
}

export interface TraitItem {
  title: string;
  type: "advantage" | "disadvantage";
  desc: string;
  badge: string;
}

export interface HobbyItem {
  name: string;
  icon: string;
  desc: string;
  color: string;
}
