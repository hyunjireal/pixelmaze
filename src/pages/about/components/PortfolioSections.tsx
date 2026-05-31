import {
  AlertTriangle,
  Camera,
  Code,
  Coffee,
  Compass,
  FileJson,
  Gamepad2,
  Image,
  Mail,
  Paintbrush,
  Palette,
  Sparkles,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { HOBBY_DATA, PROFILE_DATA, SKILL_DATA, TRAIT_DATA } from '../data'

interface PortfolioSectionsProps {
  totalLinesCleared: number
  triggerUnlockAll: boolean
  setTriggerUnlockAll: (val: boolean) => void
  onInstantUnlock: () => void
}

const renderSkillIcon = (iconName: string, colorClass: string) => {
  const props = { className: `w-5 h-5 ${colorClass}` }
  switch (iconName) {
    case 'Figma':
      return <Palette {...props} />
    case 'Code':
      return <Code {...props} />
    case 'FileJson':
      return <FileJson {...props} />
    case 'Paintbrush':
      return <Paintbrush {...props} />
    case 'Palette':
      return <Palette {...props} />
    case 'Image':
      return <Image {...props} />
    default:
      return <Code {...props} />
  }
}

const renderHobbyIcon = (iconName: string) => {
  const props = { className: 'w-5 h-5 text-white' }
  switch (iconName) {
    case 'Climbing':
      return <Compass {...props} />
    case 'Camera':
      return <Camera {...props} />
    case 'Gamepad2':
      return <Gamepad2 {...props} />
    case 'Coffee':
      return <Coffee {...props} />
    default:
      return <Sparkles {...props} />
  }
}

export default function PortfolioSections({
  totalLinesCleared,
  triggerUnlockAll,
}: PortfolioSectionsProps) {
  const activeStep = triggerUnlockAll ? 4 : Math.min(totalLinesCleared, 4)

  if (activeStep < 1) return null

  return (
    <div className="about_active_section" id="portfolio-container">
      <AnimatePresence mode="wait">
        {activeStep === 1 ? (
          <motion.div
            key="skills-unlocked"
            className="about_stage_card bg-zinc-900/40 border border-zinc-800 rounded-3xl p-5 shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.98, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          >
            <div className="absolute top-0 right-0 p-2.5 bg-zinc-800 text-white border-l border-b border-zinc-750 text-[10px] font-mono font-extrabold rounded-bl-2xl flex items-center gap-1.5">
              SKILL UNLOCKED
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-white tracking-tight">Design & Frontend Skills</h3>
              <p className="text-xs text-zinc-400">디자인 감각과 구현 역량을 함께 정리한 스킬 카드입니다.</p>
            </div>

            <div className="flex flex-wrap gap-4">
              {SKILL_DATA.map((skill, index) => {
                const isTech = skill.type === 'tech'

                return (
                  <div
                    key={index}
                    className="bg-zinc-900 border border-zinc-850 p-3 rounded-2xl flex flex-col gap-2 hover:border-zinc-700 hover:scale-[1.01] transition-all flex-[1_1_240px]"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1.5 font-bold">
                        {renderSkillIcon(skill.icon, 'text-white')}
                        <span className="text-white font-mono">{skill.name}</span>
                        <span className={`text-[9px] px-1.5 rounded-full ${isTech ? 'bg-zinc-800 text-white' : 'bg-zinc-950 text-zinc-400'}`}>
                          {isTech ? 'CODE' : 'DESIGN'}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-zinc-300">{skill.percentage}%</span>
                    </div>

                    <div className="w-full h-2 bg-zinc-950 rounded-full border border-zinc-800 overflow-hidden relative">
                      <div
                        className="h-full rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.4)]"
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>
                    <p className="text-[10px] sm:text-xs text-zinc-400 leading-normal">
                      {skill.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ) : null}

        {activeStep === 2 ? (
          <motion.div
            key="traits-unlocked"
            className="about_stage_card bg-zinc-900/40 border border-zinc-800 rounded-3xl p-5 shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.98, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          >
            <div className="absolute top-0 right-0 p-2.5 bg-zinc-800 text-white border-l border-b border-zinc-755 text-[10px] font-mono font-extrabold rounded-bl-2xl flex items-center gap-1.5">
              ATTITUDE UNLOCKED
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-white tracking-tight">Attitude & Balance</h3>
              <p className="text-xs text-zinc-400">협업 성격과 장단점 조각을 정리한 카드입니다.</p>
            </div>

            <div className="flex flex-col gap-3">
              {TRAIT_DATA.map((trait, index) => {
                const isAdvantage = trait.type === 'advantage'

                return (
                  <div
                    key={index}
                    className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row gap-2.5 items-start ${
                      isAdvantage
                        ? 'bg-zinc-900/45 border-zinc-800 hover:border-zinc-700'
                        : 'bg-zinc-950/90 border-zinc-900 hover:border-zinc-850'
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
                        <h4 className="text-sm font-bold text-white leading-none">{trait.title}</h4>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-extrabold ${
                          isAdvantage ? 'bg-zinc-800 text-white' : 'bg-zinc-900 text-zinc-400'
                        }`}>
                          {trait.badge}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-normal mt-1">{trait.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ) : null}

        {activeStep === 3 ? (
          <motion.div
            key="hobbies-unlocked"
            className="about_stage_card bg-zinc-900/40 border border-zinc-800 rounded-3xl p-5 shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.98, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          >
            <div className="absolute top-0 right-0 p-2.5 bg-zinc-800 text-white border-l border-b border-zinc-755 text-[10px] font-mono font-extrabold rounded-bl-2xl flex items-center gap-1.5">
              LIKE UNLOCKED
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-white tracking-tight">Like & Personal Rhythm</h3>
              <p className="text-xs text-zinc-400">일 밖에서 나를 충전시키는 것들을 모은 카드입니다.</p>
            </div>

            <div className="flex flex-wrap gap-4">
              {HOBBY_DATA.map((hobby, index) => (
                <div
                  key={index}
                  className="bg-zinc-950/80 border border-zinc-850 rounded-2xl p-4 flex gap-3 hover:bg-zinc-900 hover:border-zinc-700 hover:scale-[1.01] transition duration-200 flex-[1_1_220px]"
                >
                  <div className={`p-2 rounded-xl bg-gradient-to-tr ${hobby.color} shrink-0 aspect-square flex items-center justify-center self-start shadow-md`}>
                    {renderHobbyIcon(hobby.icon)}
                  </div>

                  <div className="flex flex-col gap-1 text-left">
                    <h4 className="text-sm font-bold text-white tracking-tight">{hobby.name}</h4>
                    <p className="text-[11px] text-zinc-300 leading-relaxed font-normal">{hobby.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}

        {activeStep === 4 ? (
          <motion.div
            key="contact-unlocked"
            className="about_stage_card bg-zinc-950 border-2 border-white/60 rounded-3xl p-6 shadow-[0_0_25px_rgba(255,255,255,0.12)] relative overflow-hidden text-center"
            initial={{ opacity: 0, scale: 0.98, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          >
            <div className="absolute top-0 right-0 p-2.5 bg-white text-zinc-950 border-l border-b border-zinc-300 text-[10px] font-mono font-extrabold rounded-bl-xl flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 fill-current" />
              CONTACT UNLOCKED
            </div>

            <div className="flex flex-col items-center justify-center gap-2.5 h-full mt-2">
              <div className="p-3 bg-white text-zinc-950 rounded-full shadow-xl">
                <Trophy className="w-8 h-8 fill-current" />
              </div>

              <h3 className="text-xl font-extrabold text-white tracking-tight leading-none mt-1">
                Contact Us
              </h3>
              <p className="text-xs text-zinc-300 max-w-sm mx-auto leading-normal">
                테트리스 섹션을 모두 해금했습니다. 아래 링크로 다음 대화를 시작할 수 있습니다.
              </p>

              <div className="flex flex-wrap gap-3 w-full max-w-md mt-5">
                <a
                  href={`mailto:${PROFILE_DATA.email}`}
                  className="flex flex-[1_1_180px] items-center justify-center gap-2 py-3 px-4 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-500 text-white font-mono text-xs font-bold transition hover:shadow-md cursor-pointer"
                  id="link-mail"
                >
                  <Mail className="w-4 h-4 text-zinc-300" />
                  이메일 보내기
                </a>

                <a
                  href={PROFILE_DATA.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-[1_1_180px] items-center justify-center gap-2 py-3 px-4 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-500 text-white font-mono text-xs font-bold transition hover:shadow-md cursor-pointer"
                  id="link-github-tab"
                >
                  <Code className="w-4 h-4 text-white" />
                  GitHub 방문하기
                </a>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
