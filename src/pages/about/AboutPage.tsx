import { useEffect, useState, type RefObject } from 'react'
import {
  Trophy,
  X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import HomeLogoLink from '../../components/HomeLogoLink'
import TetrisGame from './components/TetrisGame'
import PortfolioSections from './components/PortfolioSections'
import { sfx } from './utils/audio'
import './AboutPage.css'

interface AboutPageProps {
  isOpen: boolean
  onHomeClick: () => void
  pageRef: RefObject<HTMLElement | null>
}

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

  const handleLineClear = (clearedCount: number, clearedNames: string[]) => {
    const predictedTotal = totalLinesCleared + clearedCount
    let title = 'Portfolio block cleared'
    let description = `Matched ${clearedNames.join(', ') || 'skill blocks'} into a clean row.`
    let sectionName = `Score ${score + clearedCount * 100}`

    if (predictedTotal >= 1 && totalLinesCleared < 1) {
      title = 'Core skill set unlocked'
      sectionName = 'Level 1'
      description = 'Design and frontend skill cards are now available.'
      sfx.playUnlock()
    } else if (predictedTotal >= 2 && totalLinesCleared < 2) {
      title = 'Traits unlocked'
      sectionName = 'Level 2'
      description = 'Strengths, working style, and growth notes have opened.'
      sfx.playUnlock()
    } else if (predictedTotal >= 3 && totalLinesCleared < 3) {
      title = 'Hobbies unlocked'
      sectionName = 'Level 3'
      description = 'Personal interests and off-screen rhythms are revealed.'
      sfx.playUnlock()
    } else if (predictedTotal >= 4 && totalLinesCleared < 4) {
      title = 'Portfolio fully unlocked'
      sectionName = 'Master clear'
      description = 'The final contact trophy is open.'
      sfx.playUnlock()
    }

    setActiveUnlockToast({
      show: true,
      title,
      description,
      sectionName,
    })
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
      <div
        className="about_tetris min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none relative overflow-x-hidden"
        id="about-tetris-portfolio"
      >
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-zinc-900/10 via-zinc-950/0 to-transparent pointer-events-none z-0" />

        <HomeLogoLink color="#BDBAB6" onClick={onHomeClick} position="topRight" />

        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative z-10">
          <section className="col-span-12 md:col-span-5 lg:col-span-4 flex flex-col gap-4 self-center md:self-start md:sticky md:top-24">
            <div className="text-center mb-1">
              <p className="font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-none">
                interactive controller
              </p>
            </div>
            <TetrisGame
              onLineClear={handleLineClear}
              gameStatus={gameStatus}
              setGameStatus={setGameStatus}
              totalLinesCleared={totalLinesCleared}
              setTotalLinesCleared={setTotalLinesCleared}
              score={score}
              setScore={setScore}
            />
          </section>

          <section className="col-span-12 md:col-span-7 lg:col-span-8 flex flex-col gap-4">
            <PortfolioSections
              totalLinesCleared={totalLinesCleared}
              triggerUnlockAll={triggerUnlockAll}
              setTriggerUnlockAll={setTriggerUnlockAll}
              onInstantUnlock={triggerMasterUnlock}
            />
          </section>
        </main>

        <AnimatePresence>
          {activeUnlockToast?.show ? (
            <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full px-4 sm:px-0">
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="p-4 rounded-2xl border-2 shadow-[0_10px_30px_rgba(0,0,0,0.7)] bg-zinc-950 flex gap-3 relative overflow-hidden border-zinc-700"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-zinc-500 to-white" />
                <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl shrink-0 self-start text-white animate-pulse">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="flex-1 flex flex-col gap-0.5 text-left pr-2">
                  <span className="font-mono text-[8px] text-zinc-400 font-extrabold tracking-widest uppercase">
                    {activeUnlockToast.sectionName}
                  </span>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white leading-tight">
                    {activeUnlockToast.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-zinc-400 leading-snug mt-1">
                    {activeUnlockToast.description}
                  </p>
                </div>
                <button
                  onClick={() => setActiveUnlockToast((current) => current ? { ...current, show: false } : current)}
                  className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition self-start"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>

        <footer className="mt-auto px-6 py-6 border-t border-zinc-900 bg-zinc-950 text-center font-mono text-[10px] text-zinc-500 tracking-wide">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
            <p>2026 Hyunji. All rights reserved.</p>
            <p>React 19 + Tetris portfolio interaction</p>
          </div>
        </footer>
      </div>
    </section>
  )
}

export default AboutPage
