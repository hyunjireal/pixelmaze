import { useState } from 'react'
import './IntroSection.css'

interface IntroSectionProps {
  isLeaving: boolean
  onEnter: () => void
}

function IntroSection({ isLeaving, onEnter }: IntroSectionProps) {
  const [hasClicked, setHasClicked] = useState(false)

  const handleEnter = () => {
    if (isLeaving || hasClicked) return

    setHasClicked(true)
    onEnter()
  }

  return (
    <main className={`intro_page${isLeaving ? ' intro_page_leaving' : ''}`}>
      <div className="intro_content">
        <h1 className="intro_title">
          FINDING<br />MY WAY
        </h1>
        <p className="intro_sub">A PLACE OF ME</p>
        <button className="intro_enter" onClick={handleEnter}>
          ENTER
        </button>
      </div>
    </main>
  )
}

export default IntroSection
