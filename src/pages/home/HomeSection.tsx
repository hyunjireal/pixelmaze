import { useEffect, useRef, useState } from 'react'
import './HomeSection.css'
import AboutPage from '../about/AboutPage'
import MyWorkPage from '../work/MyWorkPage'
import HomeMazeNav from './HomeMazeNav'
import HomeMenu from './HomeMenu'
import type { RouteKey } from './homeTypes'

interface HomeSectionProps {
  isActive: boolean
}

function HomeSection({ isActive }: HomeSectionProps) {
  const [activeRoute, setActiveRoute] = useState<RouteKey | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [workOpen, setWorkOpen] = useState(false)
  const aboutPageRef = useRef<HTMLElement | null>(null)
  const workPageRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!aboutOpen) return

    aboutPageRef.current?.focus({ preventScroll: true })
    aboutPageRef.current?.scrollTo({ top: 0 })
  }, [aboutOpen])

  useEffect(() => {
    if (!workOpen) return

    workPageRef.current?.focus({ preventScroll: true })
    workPageRef.current?.scrollTo({ top: 0 })
  }, [workOpen])

  const startRoute = (route: RouteKey) => {
    setAboutOpen(false)
    setWorkOpen(false)
    setActiveRoute(route)
  }

  const goHome = () => {
    setActiveRoute(null)
    setAboutOpen(false)
    setWorkOpen(false)
  }

  return (
    <main
      id="main"
      className={`home_page${isActive ? ' home_page_active' : ''}${
        aboutOpen ? ' home_page_about_open' : ''
      }${workOpen ? ' home_page_work_open' : ''}`}
    >
      <section className="home_view">
        <div className="home_stage">
          <button
            className="home_work_quick_link"
            type="button"
            onClick={() => {
              setAboutOpen(false)
              setWorkOpen(true)
            }}
          >
            My Works
          </button>

          <HomeMazeNav activeRoute={activeRoute} />
          <HomeMenu activeRoute={activeRoute} onRouteStart={startRoute} />
        </div>
      </section>

      <span
        className={`home_work_reveal_bloom${
          activeRoute === 'work' ? ' home_work_reveal_bloom_active' : ''
        }`}
        aria-hidden="true"
      />
      <AboutPage isOpen={aboutOpen} pageRef={aboutPageRef} onHomeClick={goHome} />
      <MyWorkPage isOpen={workOpen} pageRef={workPageRef} onHomeClick={goHome} />
    </main>
  )
}

export default HomeSection
