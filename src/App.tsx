import { useCallback, useRef, useState } from 'react'
import SharedMaze from './components/SharedMaze'
import WorkLogoHomeTransition from './components/WorkLogoHomeTransition'
import usePointerParallax from './components/usePointerParallax'
import HomeSection from './pages/home/HomeSection'
import IntroSection from './pages/intro/IntroSection'
import MyWorkPage from './pages/work/MyWorkPage'
import './App.css'

type AppPhase = 'intro' | 'home' | 'work' | 'work-to-home' | 'about-to-home'

function App() {
  const [phase, setPhase] = useState<AppPhase>('intro')
  const [homeResetKey, setHomeResetKey] = useState(0)
  const workPageRef = useRef<HTMLElement | null>(null)

  const enterHome = useCallback(() => {
    setPhase('home')
  }, [])

  const openWork = useCallback(() => {
    setPhase('work')
  }, [])

  const returnHomeFromWork = useCallback(() => {
    setPhase('work-to-home')
  }, [])

  const returnHomeFromAbout = useCallback(() => {
    setPhase('about-to-home')
  }, [])

  const finishReveal = useCallback(() => {
    setHomeResetKey((current) => current + 1)
    setPhase('home')
  }, [])

  const handlePointerMove = usePointerParallax()

  return (
    <div
      className={`app_shell app_shell_${phase}`}
      onPointerMove={handlePointerMove}
    >
      <SharedMaze showDecor={phase === 'home'} />
      {phase === 'intro' ? (
        <IntroSection
          onEnter={enterHome}
        />
      ) : null}
      {(phase === 'home' || phase === 'about-to-home') ? (
        <HomeSection
          key={homeResetKey}
          isActive
          onHomeRouteStart={returnHomeFromAbout}
          onWorkRouteStart={openWork}
        />
      ) : null}
      {(phase === 'work' || phase === 'work-to-home') ? (
        <div className="home_page_work_open">
          <MyWorkPage
            isOpen
            pageRef={workPageRef}
            onHomeClick={returnHomeFromWork}
          />
        </div>
      ) : null}
      {(phase === 'work-to-home' || phase === 'about-to-home') ? (
        <WorkLogoHomeTransition onComplete={finishReveal}>
          <HomeSection isActive={false} onHomeRouteStart={() => {}} onWorkRouteStart={() => {}} />
        </WorkLogoHomeTransition>
      ) : null}
    </div>
  )
}

export default App
