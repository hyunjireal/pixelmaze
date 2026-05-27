import type { PointerEvent } from 'react'
import SharedMaze from './components/SharedMaze'
import HomeSection from './pages/home/HomeSection'
import './App.css'

function App() {
  const phase = 'home'

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
      <SharedMaze />
      <HomeSection isActive={phase === 'home'} />
    </div>
  )
}

export default App
