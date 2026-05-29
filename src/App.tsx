import { useCallback, useRef, useState, type PointerEvent } from 'react'
import SharedMaze from './components/SharedMaze'
import HomeSection from './pages/home/HomeSection'
import IntroSection from './pages/intro/IntroSection'
import MyWorkPage from './pages/work/MyWorkPage'
import './App.css'

type AppPhase = 'intro' | 'home' | 'work'

function App() {
  const [phase, setPhase] = useState<AppPhase>('intro')
  const workPageRef = useRef<HTMLElement | null>(null)

  const enterHome = useCallback(() => {
    setPhase('home')
  }, [])

  const openWork = useCallback(() => {
    setPhase('work')
  }, [])

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const x = event.clientX / window.innerWidth - 0.5
    const y = event.clientY / window.innerHeight - 0.5

    event.currentTarget.style.setProperty('--maze_tx', `${x * 7}px`)
    event.currentTarget.style.setProperty('--maze_ty', `${y * 7}px`)
    event.currentTarget.style.setProperty('--point_tx', `${x * 18}px`)
    event.currentTarget.style.setProperty('--point_ty', `${y * 16}px`)
    event.currentTarget.style.setProperty('--content_tx', `${x * 5}px`)
    event.currentTarget.style.setProperty('--content_ty', `${y * 4}px`)
    event.currentTarget.style.setProperty('--button_tx', `${x * 8}px`)
    event.currentTarget.style.setProperty('--button_ty', `${y * 6}px`)
  }

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
      {phase === 'home' ? (
        <HomeSection
          isActive
          onWorkRouteStart={openWork}
        />
      ) : null}
      {phase === 'work' ? (
        <div className="home_page_work_open">
          <MyWorkPage
            isOpen
            pageRef={workPageRef}
            onHomeClick={() => setPhase('home')}
          />
        </div>
      ) : null}
    </div>
  )
}

export default App
