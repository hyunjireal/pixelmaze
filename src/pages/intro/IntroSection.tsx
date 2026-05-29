import { useEffect, useState } from 'react'
import './IntroSection.css'

interface IntroSectionProps {
  onEnter: () => void
}

function IntroSection({ onEnter }: IntroSectionProps) {
  const [hasClicked, setHasClicked] = useState(false)

  const handleEnter = () => {
    if (hasClicked) return

    setHasClicked(true)
    onEnter()
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter') return
      handleEnter()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hasClicked, onEnter])

  return (
    <main className="intro_page">
      <div className="intro_content">
        <h1 className="intro_title">
          FINDING<br />MY WAY
        </h1>
        <p className="intro_sub">A PLACE OF ME</p>
        <button className="intro_enter" type="button" onClick={handleEnter}>
          ENTER
        </button>
      </div>
    </main>
  )
}

export default IntroSection
