/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Lock, 
  Unlock, 
  Mail, 
  Code, 
  Paintbrush, 
  Palette, 
  Image, 
  FileJson, 
  Trophy, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  Compass,
  Camera,
  Gamepad2,
  Coffee,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PROFILE_DATA, SKILL_DATA, TRAIT_DATA, HOBBY_DATA } from "../data";

interface PortfolioSectionsProps {
  totalLinesCleared: number;
  triggerUnlockAll: boolean;
  setTriggerUnlockAll: (val: boolean) => void;
  onInstantUnlock: () => void;
}

// Icon mapper helper
const renderSkillIcon = (iconName: string, colorClass: string) => {
  const props = { className: `w-5 h-5 ${colorClass}` };
  switch (iconName) {
    case "Figma":
      return <Palette {...props} />;
    case "Code":
      return <Code {...props} />;
    case "FileJson":
      return <FileJson {...props} />;
    case "Paintbrush":
      return <Paintbrush {...props} />;
    case "Palette":
      return <Palette {...props} />;
    case "Image":
      return <Image {...props} />;
    default:
      return <Code {...props} />;
  }
};

const renderHobbyIcon = (iconName: string) => {
  const props = { className: "w-5 h-5 text-white" };
  switch (iconName) {
    case "Climbing":
      return <Compass {...props} />;
    case "Camera":
      return <Camera {...props} />;
    case "Gamepad2":
      return <Gamepad2 {...props} />;
    case "Coffee":
      return <Coffee {...props} />;
    default:
      return <Sparkles {...props} />;
  }
};

export default function PortfolioSections({
  totalLinesCleared,
  triggerUnlockAll,
  onInstantUnlock
}: PortfolioSectionsProps) {

  // Unlock thresholds for Tetris rows:
  // Row 0: Basic profile is always unlocked immediately!
  // Row 1: Skills
  // Row 2: Traits (Pros/Cons)
  // Row 3: Hobbies
  // Row 4+: Contact / Special trophy

  const isSkillsUnlocked = triggerUnlockAll || totalLinesCleared >= 1;
  const isTraitsUnlocked = triggerUnlockAll || totalLinesCleared >= 2;
  const isHobbiesUnlocked = triggerUnlockAll || totalLinesCleared >= 3;
  const isContactUnlocked = triggerUnlockAll || totalLinesCleared >= 4;

  const currentUnlockCount = [true, isSkillsUnlocked, isTraitsUnlocked, isHobbiesUnlocked, isContactUnlocked].filter(Boolean).length;
  const totalSteps = 5;
  const progressPercent = Math.min(100, (currentUnlockCount / totalSteps) * 100);

  return (
    <div className="flex-1 flex flex-col gap-6" id="portfolio-container">
      {/* Portfolio Top Bar Status Gauge */}
      <div className="bg-zinc-900/90 border-2 border-zinc-800 rounded-2xl p-4 shadow-xl backdrop-blur-md relative overflow-hidden" id="unlock-status-panel">
        <div className="absolute top-0 right-0 p-1.5 bg-zinc-800 border-l border-b border-zinc-700 rounded-bl-xl">
          <span className="font-mono text-[9px] text-zinc-100 font-extrabold flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 animate-pulse" />
            LIVE PROFILE
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                포트폴리오 해금 상태
                <span className="text-xs font-normal text-zinc-400 font-mono">
                  ({currentUnlockCount}/{totalSteps})
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                테트리스 줄(Row)을 터뜨릴 때마다 숨겨진 세부 카드가 해금됩니다.
              </p>
            </div>

            {/* Quality-of-life Master Unlock button */}
            {!triggerUnlockAll && (
              <button
                onClick={onInstantUnlock}
                className="py-1 px-3 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-[10px] font-bold tracking-tight transition cursor-pointer flex items-center gap-1"
                id="btn-master-unlock"
              >
                <Unlock className="w-2.5 h-2.5" />
                모두 해금하기
              </button>
            )}
          </div>

          {/* Graphical Neon Progress Bar */}
          <div className="w-full h-3.5 bg-zinc-950 rounded-full border border-zinc-800 relative p-[2px] flex items-center">
            <motion.div 
              className="h-full rounded-full bg-gradient-to-r from-zinc-700 via-neutral-400 to-white shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            {/* Steps intervals dots */}
            <div className="absolute inset-0 flex justify-between px-3 pointer-events-none items-center">
              {[0, 1, 2, 3, 4].map((step) => {
                const stepUnlocked = triggerUnlockAll || totalLinesCleared >= step;
                return (
                  <div 
                    key={step} 
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      stepUnlocked 
                        ? "bg-white border border-neutral-300 shadow-[0_0_6px_rgba(255,255,255,0.7)]" 
                        : "bg-zinc-755 bg-zinc-800"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Stepper text */}
          <div className="grid grid-cols-5 text-[8px] sm:text-[10px] text-center font-mono font-bold tracking-tight mt-1 text-zinc-400 gap-1 leading-snug">
            <div className="text-white">❶ 프로필</div>
            <div className={isSkillsUnlocked ? "text-white font-extrabold" : "text-zinc-650 text-zinc-700"}>❷ 스킬셋 (1줄)</div>
            <div className={isTraitsUnlocked ? "text-white font-extrabold" : "text-zinc-650 text-zinc-700"}>❸ 장단점 (2줄)</div>
            <div className={isHobbiesUnlocked ? "text-white font-extrabold" : "text-zinc-650 text-zinc-700"}>❹ 취미생활 (3줄)</div>
            <div className={isContactUnlocked ? "text-white font-extrabold" : "text-zinc-650 text-zinc-700"}>❺ 최종 해금 (4줄)</div>
          </div>
        </div>
      </div>

      {/* PORTFOLIO ACCORDION CARDS CAROUSEL */}
      <div className="flex flex-col gap-5">
        
        {/* ========================================== */}
        {/* CARD 1: BASIC PROFILE (ALWAYS UNLOCKED) */}
        {/* ========================================== */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl hover:shadow-black/30 transition duration-300 relative overflow-hidden" id="card-basic-profile">
          <div className="absolute top-0 right-0 p-2.5 bg-zinc-800 text-white border-l border-b border-zinc-700 text-[10px] font-mono font-extrabold rounded-bl-2xl flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            기본 정보 (완료)
          </div>

          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left mt-1">
            {/* Visual Pixel Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-zinc-650 to-zinc-400 bg-neutral-600 p-1 flex items-center justify-center shadow-lg relative shrink-0">
              <div className="absolute inset-[3px] bg-zinc-950 rounded-[12px] flex items-center justify-center overflow-hidden">
                {/* Pixel Art Avatar Placeholder or Monogram */}
                <span className="font-mono text-xl font-extrabold bg-gradient-to-r from-white to-zinc-405 text-white">
                  SEAN
                </span>
                {/* Cute game background graphic elements */}
                <div className="absolute bottom-1 w-full text-center text-[7px] text-zinc-500 font-mono tracking-widest leading-none">
                  LEVEL.1
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-1.5">
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight leading-none mb-1.5">
                  {PROFILE_DATA.name}
                </h3>
                <p className="text-xs font-mono text-zinc-350 text-white font-bold">
                  {PROFILE_DATA.role}
                </p>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                {PROFILE_DATA.summary}
              </p>
              
              {/* Profile Meta Indicators */}
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 font-mono">
                <div>🎂 생년월일: <span className="text-zinc-200">{PROFILE_DATA.birth}</span></div>
                <div>📬 문의: <span className="text-zinc-200">{PROFILE_DATA.email}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* CARD 2: SKILLS SECTION (1 LINE CLEARED) */}
        {/* ========================================== */}
        <AnimatePresence mode="wait">
          {!isSkillsUnlocked ? (
            <motion.div 
              key="skills-locked"
              className="bg-zinc-950/60 border border-dashed border-zinc-800 text-center py-10 px-6 rounded-3xl flex flex-col items-center justify-center gap-3 group relative cursor-not-allowed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-full shadow-inner text-zinc-500 group-hover:text-white transition duration-300">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-zinc-300 font-bold text-sm">핵심 기술 & 장비 (Locked)</h3>
                <p className="text-xs text-zinc-500 mt-1">테트리스에서 <span className="text-white font-bold font-mono">최소 1줄</span>을 완전히 완료하여 해금하세요!</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="skills-unlocked"
              className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-5 shadow-xl relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <div className="absolute top-0 right-0 p-2.5 bg-zinc-800 text-white border-l border-b border-zinc-750 text-[10px] font-mono font-extrabold rounded-bl-2xl flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5 text-white" />
                나의 스킬셋 해제됨!
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-bold text-white tracking-tight">디자인 툴 & 전문 개발 기술</h3>
                <p className="text-xs text-zinc-400">디자인 감각과 코딩 능력을 가직성 있게 정량화한 지수입니다.</p>
              </div>

              {/* Grid lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SKILL_DATA.map((skill, index) => {
                  const isTech = skill.type === "tech";
                  const accentColor = "text-white";
                  const meterBarColor = "bg-white shadow-[0_0_6px_rgba(255,255,255,0.4)]";

                  return (
                    <div 
                      key={index}
                      className="bg-zinc-900 border border-zinc-850 p-3 rounded-2xl flex flex-col gap-2 hover:border-zinc-700 hover:scale-[1.01] transition-all"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5 font-bold">
                          {renderSkillIcon(skill.icon, accentColor)}
                          <span className="text-white font-mono">{skill.name}</span>
                          <span className={`text-[9px] px-1.5 rounded-full ${isTech ? "bg-zinc-800 text-white" : "bg-zinc-950 text-zinc-400"}`} style={{ fontSize: "8px" }}>
                            {isTech ? "CODE" : "DESIGN"}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-zinc-300">{skill.percentage}%</span>
                      </div>

                      {/* Micro glowing progress tracker */}
                      <div className="w-full h-2 bg-zinc-950 rounded-full border border-zinc-800 overflow-hidden relative">
                        <div 
                          className={`h-full rounded-full ${meterBarColor} shadow-[0_0_8px_inset]`}
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                      <p className="text-[10px] sm:text-xs text-zinc-400 leading-tight leading-normal">
                        {skill.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================== */}
        {/* CARD 3: TRAITS & PROS/CONS (2 LINES CLEARED) */}
        {/* ========================================== */}
        <AnimatePresence mode="wait">
          {!isTraitsUnlocked ? (
            <motion.div 
              key="traits-locked"
              className="bg-zinc-950/60 border border-dashed border-zinc-800 text-center py-10 px-6 rounded-3xl flex flex-col items-center justify-center gap-3 group relative cursor-not-allowed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-full shadow-inner text-zinc-500 group-hover:text-white transition duration-300">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-zinc-300 font-bold text-sm">성격 장단점 & 밸런스 (Locked)</h3>
                <p className="text-xs text-zinc-500 mt-1">테트리스에서 <span className="text-white font-bold font-mono">총 2줄</span>을 완전히 완료하여 해금하세요!</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="traits-unlocked"
              className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-5 shadow-xl relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <div className="absolute top-0 right-0 p-2.5 bg-zinc-800 text-white border-l border-b border-zinc-755 text-[10px] font-mono font-extrabold rounded-bl-2xl flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5 text-white" />
                나의 강점조각 해제됨!
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-bold text-white tracking-tight">나의 융합 밸런스 (장점 및 보완점)</h3>
                <p className="text-xs text-zinc-400">협업 성격과 장단점 조각을 정직하게 담아냈습니다.</p>
              </div>

              {/* List representing pros & cons mapping */}
              <div className="flex flex-col gap-3">
                {TRAIT_DATA.map((trait, index) => {
                  const isAdvantage = trait.type === "advantage";
                  
                  return (
                    <div 
                      key={index}
                      className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row gap-2.5 items-start ${
                        isAdvantage 
                          ? "bg-zinc-905 border-zinc-800 hover:border-zinc-700 bg-zinc-900/45" 
                          : "bg-zinc-950/90 border-zinc-900 hover:border-zinc-850"
                      } transition`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isAdvantage ? (
                          <div className="p-1.5 rounded-lg bg-zinc-800 text-white border border-zinc-700">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white leading-none">
                            {trait.title}
                          </h4>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-extrabold ${
                            isAdvantage ? "bg-zinc-800 text-white" : "bg-zinc-900 text-zinc-400"
                          }`}>
                            {trait.badge}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed leading-normal mt-1">
                          {trait.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================== */}
        {/* CARD 4: HOBBIES & INTERESTS (3 LINES CLEARED) */}
        {/* ========================================== */}
        <AnimatePresence mode="wait">
          {!isHobbiesUnlocked ? (
            <motion.div 
              key="hobbies-locked"
              className="bg-zinc-950/60 border border-dashed border-zinc-800 text-center py-10 px-6 rounded-3xl flex flex-col items-center justify-center gap-3 group relative cursor-not-allowed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-full shadow-inner text-zinc-500 group-hover:text-white transition duration-300">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-zinc-300 font-bold text-sm">라이프 취미 & 아날로그 (Locked)</h3>
                <p className="text-xs text-zinc-500 mt-1">테트리스에서 <span className="text-white font-bold font-mono">총 3줄</span>을 완전히 완료하여 해금하세요!</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="hobbies-unlocked"
              className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-5 shadow-xl relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <div className="absolute top-0 right-0 p-2.5 bg-zinc-800 text-white border-l border-b border-zinc-755 text-[10px] font-mono font-extrabold rounded-bl-2xl flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5 text-white" />
                나의 취미세계 해제됨!
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-bold text-white tracking-tight">좋아하는 일 & 아날로그 취미</h3>
                <p className="text-xs text-zinc-400">코딩을 마친 후 온전히 나를 충전시키는 행복 소품들입니다.</p>
              </div>

              {/* Bento Grid Hobbies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {HOBBY_DATA.map((hobby, index) => (
                  <div 
                    key={index}
                    className="bg-zinc-950/80 border border-zinc-850 rounded-2xl p-4 flex gap-3 hover:bg-zinc-900 hover:border-zinc-700 hover:scale-[1.01] transition duration-200"
                  >
                    <div className={`p-2 rounded-xl bg-gradient-to-tr ${hobby.color} shrink-0 aspect-square flex items-center justify-center self-start shadow-md`}>
                      {renderHobbyIcon(hobby.icon)}
                    </div>
                    
                    <div className="flex flex-col gap-1 text-left">
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {hobby.name}
                      </h4>
                      <p className="text-[11px] text-zinc-300 leading-relaxed font-normal">
                        {hobby.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================== */}
        {/* CARD 5: CAREER TROPHY CONTACT (4 LINES CLEARED) */}
        {/* ========================================== */}
        <AnimatePresence mode="wait">
          {!isContactUnlocked ? (
            <motion.div 
              key="contact-locked"
              className="bg-zinc-950/60 border border-dashed border-zinc-800 text-center py-10 px-6 rounded-3xl flex flex-col items-center justify-center gap-3 group relative cursor-not-allowed animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-full shadow-inner text-zinc-500 group-hover:text-white transition duration-300">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-zinc-300 font-bold text-sm">최종 트로피 & 컨택망 (Locked)</h3>
                <p className="text-xs text-zinc-500 mt-1">테트리스에서 <span className="text-white font-bold font-mono">총 4줄</span>을 완전히 완료하여 최종 커리어를 해금하세요!</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="contact-unlocked"
              className="bg-zinc-950 border-2 border-white/60 rounded-3xl p-6 shadow-[0_0_25px_rgba(255,255,255,0.12)] relative overflow-hidden text-center"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80 }}
            >
              {/* Silver sparkling borders */}
              <div className="absolute top-0 right-0 p-2.5 bg-white text-zinc-950 border-l border-b border-zinc-300 text-[10px] font-mono font-extrabold rounded-bl-xl flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 fill-current" />
                GAME MASTER TROPHY
              </div>

              <div className="flex flex-col items-center gap-2.5 mt-2">
                <div className="p-3 bg-white text-zinc-950 rounded-full shadow-xl animate-bounce">
                  <Trophy className="w-8 h-8 fill-current" />
                </div>
                
                <h3 className="text-xl font-extrabold text-white tracking-tight leading-none mt-1">
                  모든 줄을 해금하셨습니다!
                </h3>
                <p className="text-xs text-zinc-300 max-w-sm mx-auto leading-normal">
                  테트리스를 끝까지 채워 완벽하게 컴포넌트를 조율해내신 귀하를 환영합니다.<br/>
                  아래 링크를 통해 준비된 디자이너 & 개발자 김세환과의 티타임을 신청해보세요!
                </p>

                {/* Contact Actions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mt-5">
                  <a 
                    href={`mailto:${PROFILE_DATA.email}`}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-500 text-white font-mono text-xs font-bold transition hover:shadow-md cursor-pointer"
                    id="link-mail"
                  >
                    <Mail className="w-4 h-4 text-zinc-300" />
                    이메일 보내기
                  </a>

                  <a 
                    href={PROFILE_DATA.github}
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-500 text-white font-mono text-xs font-bold transition hover:shadow-md cursor-pointer"
                    id="link-github-tab"
                  >
                    <Code className="w-4 h-4 text-white" />
                    GitHub 방문하기
                  </a>
                </div>

                <div className="mt-5 text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-none">
                  Thank you for playing! 👾
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
