import { useEffect, useState, type RefObject } from 'react'
import { Calendar, Lock, Mail, MapPin, Unlock, Trophy, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import HomeLogoLink from '../../components/HomeLogoLink'
import TetrisGame from './components/TetrisGame'
import PortfolioSections from './components/PortfolioSections'
import { PROFILE_DATA, SKILL_DATA } from './data'
import { sfx } from './utils/audio'
import meProfile from '../../assets/images/me_profile01.png'
import './AboutPage.css'

interface AboutPageProps {
  isOpen: boolean
  onHomeClick: () => void
  pageRef: RefObject<HTMLElement | null>
}

const TOOLS = SKILL_DATA.map((skill) => skill.name)

function AboutPage({ isOpen, onHomeClick, pageRef }: AboutPageProps) {
  const [totalLinesCleared, setTotalLinesCleared] = useState(0)
  const [score, setScore] = useState(0)
  const [gameStatus, setGameStatus] = useState<
    'BEFORE_START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'
  >('BEFORE_START')
  const [triggerUnlockAll, setTriggerUnlockAll] = useState(false)
  const [activeUnlockToast, setActiveUnlockToast] = useState<{
    show: boolean
    title: string
    description: string
    sectionName: string
  } | null>(null)

  useEffect(() => {
    if (!activeUnlockToast?.show) return
    const timer = window.setTimeout(() => {
      setActiveUnlockToast((current) => (current ? { ...current, show: false } : current))
    }, 4500)
    return () => window.clearTimeout(timer)
  }, [activeUnlockToast])

  const activeStep = triggerUnlockAll ? 4 : Math.min(totalLinesCleared, 4)
  const isSkillUnlocked = triggerUnlockAll || totalLinesCleared >= 1
  const isAttitudeUnlocked = triggerUnlockAll || totalLinesCleared >= 2
  const isLikeUnlocked = triggerUnlockAll || totalLinesCleared >= 3
  const isContactUnlocked = triggerUnlockAll || totalLinesCleared >= 4

  const handleLineClear = (clearedCount: number, clearedNames: string[]) => {
    const next = totalLinesCleared + clearedCount
    let title = 'Portfolio block cleared'
    let description = `Matched ${clearedNames.join(', ') || 'skill blocks'} into a clean row.`
    let sectionName = `Score ${score + clearedCount * 100}`

    if (next >= 1 && totalLinesCleared < 1) {
      title = 'Core skill set unlocked'
      sectionName = 'Level 1'
      description = 'Design and frontend skill cards are now available.'
      sfx.playUnlock()
    } else if (next >= 2 && totalLinesCleared < 2) {
      title = 'Traits unlocked'
      sectionName = 'Level 2'
      description = 'Strengths, working style, and growth notes have opened.'
      sfx.playUnlock()
    } else if (next >= 3 && totalLinesCleared < 3) {
      title = 'Hobbies unlocked'
      sectionName = 'Level 3'
      description = 'Personal interests and off-screen rhythms are revealed.'
      sfx.playUnlock()
    } else if (next >= 4 && totalLinesCleared < 4) {
      title = 'Portfolio fully unlocked'
      sectionName = 'Master clear'
      description = 'The final contact trophy is open.'
      sfx.playUnlock()
    }

    setActiveUnlockToast({ show: true, title, description, sectionName })
  }

  const triggerMasterUnlock = () => {
    sfx.playUnlock()
    setTriggerUnlockAll(true)
    setTotalLinesCleared(4)
    setScore(500)
    setActiveUnlockToast({
      show: true,
      title: 'All portfolio cards unlocked',
      sectionName: 'Full profile',
      description: 'Everything is open for quick browsing.',
    })
  }

  return (
    <section
      ref={pageRef}
      className="about_page"
      aria-hidden={!isOpen}
      data-lenis-prevent
      tabIndex={-1}
    >
      <div className="about_layout">
        <div className="about_left">
          <div className="about_game_card">
            <div className="about_game_card_header">
              <span className="about_game_card_title">
                <span className="about_game_dot" />
                ARCADE CABINET <span className="about_game_version">v1.99</span>
              </span>
              <span className="about_game_card_label">INTERACTIVE PORTFOLIO</span>
            </div>

            <div className="about_game_body">
              <TetrisGame
                onLineClear={handleLineClear}
                gameStatus={gameStatus}
                setGameStatus={setGameStatus}
                totalLinesCleared={totalLinesCleared}
                setTotalLinesCleared={setTotalLinesCleared}
                score={score}
                setScore={setScore}
              />
            </div>
          </div>
        </div>

        <div className="about_center">
          <div className="about_content_slot">
            {activeStep === 0 ? (
              <div className="about_profile_card about_stage_card">
                <div className="about_card_header">
                  <div className="about_card_title_row">
                    <span className="about_section_num">01</span>
                    <div>
                      <h1 className="about_section_name">ABOUT ME</h1>
                      <p className="about_section_sub">저에 대해 더 알아보세요.</p>
                    </div>
                  </div>
                  <div className="about_unlock_badge">
                    {totalLinesCleared > 0 ? (
                      <Unlock size={13} strokeWidth={2} />
                    ) : (
                      <Lock size={13} strokeWidth={2} />
                    )}
                    <span>{totalLinesCleared} LINES UNLOCKED</span>
                  </div>
                </div>

                <div className="about_divider" />

                <div className="about_profile_body">
                  <div className="about_photo_wrap">
                    <img src={meProfile} alt="Profile" className="about_photo" />
                  </div>

                  <div className="about_info">
                    <p className="about_greeting">Hi, I'm</p>
                    <p className="about_role">{PROFILE_DATA.role}</p>

                    <p className="about_summary">
                      I design with clarity and build with purpose.
                      This portfolio is an interactive experience.
                      Play a round of Tetris to unlock my work.
                    </p>

                    <ul className="about_meta_list">
                      <li>
                        <Calendar size={14} strokeWidth={1.8} />
                        <span>{PROFILE_DATA.birth}</span>
                      </li>
                      <li>
                        <MapPin size={14} strokeWidth={1.8} />
                        <span>Based in Seoul, KR</span>
                      </li>
                      <li>
                        <Mail size={14} strokeWidth={1.8} />
                        <span>{PROFILE_DATA.email}</span>
                      </li>
                    </ul>

                    <div className="about_tools">
                      <p className="about_tools_label">TOOLS &amp; TECHNOLOGIES</p>
                      <div className="about_tools_tags">
                        {TOOLS.map((tool) => (
                          <span key={tool} className="about_tag">{tool}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="about_sections_wrap">
                <PortfolioSections
                  totalLinesCleared={totalLinesCleared}
                  triggerUnlockAll={triggerUnlockAll}
                  setTriggerUnlockAll={setTriggerUnlockAll}
                  onInstantUnlock={triggerMasterUnlock}
                />
              </div>
            )}
          </div>
        </div>

        <nav className="about_nav" aria-label="Portfolio sections">
          <div className="about_nav_logo_slot">
            <HomeLogoLink
              className="about_home_logo"
              color="#1a1a1a"
              onClick={onHomeClick}
            />
          </div>
          <div className={`about_nav_item ${activeStep === 0 ? 'about_nav_active' : 'about_nav_inactive'}`}>
            <span className="about_nav_indicator" aria-hidden="true">•</span>
            <div className="about_nav_text">
              <span className="about_nav_num">01</span>
              <span className="about_nav_label">ABOUT ME</span>
            </div>
          </div>

          <div className={`about_nav_item ${activeStep === 1 ? 'about_nav_active' : isSkillUnlocked ? 'about_nav_unlocked' : 'about_nav_locked'}`}>
            {isSkillUnlocked
              ? <Unlock size={13} strokeWidth={1.8} />
              : <Lock size={13} strokeWidth={1.8} />}
            <div className="about_nav_text">
              <span className="about_nav_num">02</span>
              <span className="about_nav_label">SKILL</span>
              {!isSkillUnlocked && (
                <span className="about_nav_unlock_hint">Unlocks at<br />1 LINE</span>
              )}
            </div>
          </div>

          <div className={`about_nav_item ${activeStep === 2 ? 'about_nav_active' : isAttitudeUnlocked ? 'about_nav_unlocked' : 'about_nav_locked'}`}>
            {isAttitudeUnlocked
              ? <Unlock size={13} strokeWidth={1.8} />
              : <Lock size={13} strokeWidth={1.8} />}
            <div className="about_nav_text">
              <span className="about_nav_num">03</span>
              <span className="about_nav_label">ATTITUDE</span>
              {!isAttitudeUnlocked && (
                <span className="about_nav_unlock_hint">Unlocks at<br />2 LINES</span>
              )}
            </div>
          </div>

          <div className={`about_nav_item ${activeStep === 3 ? 'about_nav_active' : isLikeUnlocked ? 'about_nav_unlocked' : 'about_nav_locked'}`}>
            {isLikeUnlocked
              ? <Unlock size={13} strokeWidth={1.8} />
              : <Lock size={13} strokeWidth={1.8} />}
            <div className="about_nav_text">
              <span className="about_nav_num">04</span>
              <span className="about_nav_label">LIKE</span>
              {!isLikeUnlocked && (
                <span className="about_nav_unlock_hint">Unlocks at<br />3 LINES</span>
              )}
            </div>
          </div>

          <div className={`about_nav_item ${activeStep === 4 ? 'about_nav_active' : isContactUnlocked ? 'about_nav_unlocked' : 'about_nav_locked'}`}>
            {isContactUnlocked
              ? <Unlock size={13} strokeWidth={1.8} />
              : <Lock size={13} strokeWidth={1.8} />}
            <div className="about_nav_text">
              <span className="about_nav_num">05</span>
              <span className="about_nav_label">CONTACT US</span>
              {!isContactUnlocked && (
                <span className="about_nav_unlock_hint">Unlocks at<br />4 LINES</span>
              )}
            </div>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {activeUnlockToast?.show ? (
          <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full px-4 sm:px-0">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="about_toast"
            >
              <div className="about_toast_bar" />
              <div className="p-2 bg-white border border-stone-200 rounded-xl shrink-0 self-start text-stone-700">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="flex-1 flex flex-col gap-0.5 text-left pr-2">
                <span className="about_toast_section">{activeUnlockToast.sectionName}</span>
                <h4 className="about_toast_title">{activeUnlockToast.title}</h4>
                <p className="about_toast_desc">{activeUnlockToast.description}</p>
              </div>
              <button
                onClick={() => setActiveUnlockToast((current) => current ? { ...current, show: false } : current)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition self-start"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}

export default AboutPage
