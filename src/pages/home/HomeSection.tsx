import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react'
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
  const [hoveredProject, setHoveredProject] = useState<'simmons' | null>(null)
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

  const updateProjectHover = (clientX: number, clientY: number, stage: HTMLElement) => {
    const mazeNav = stage.querySelector<HTMLElement>('.home_maze_nav')

    if (!mazeNav) {
      setHoveredProject(null)
      return
    }

    const rect = mazeNav.getBoundingClientRect()
    const simmonsX = rect.left + (1990 / 4377) * rect.width
    const simmonsY = rect.top + (375 / 4377) * rect.height
    const distance = Math.hypot(clientX - simmonsX, clientY - simmonsY)
    const nextHoveredProject = distance <= 38 ? 'simmons' : null

    setHoveredProject((current) => (current === nextHoveredProject ? current : nextHoveredProject))
  }

  const handleStageMouseMove = (event: MouseEvent<HTMLDivElement> | PointerEvent<HTMLDivElement>) => {
    updateProjectHover(event.clientX, event.clientY, event.currentTarget)
  }

  return (
    <main
      id="main"
      className={`home_page${isActive ? ' home_page_active' : ''}${
        aboutOpen ? ' home_page_about_open' : ''
      }${workOpen ? ' home_page_work_open' : ''}`}
    >
      <section className="home_view">
        <div
          className="home_stage"
          onPointerLeave={() => setHoveredProject(null)}
          onPointerMove={handleStageMouseMove}
          onMouseMove={handleStageMouseMove}
        >
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

          <HomeMazeNav
            activeRoute={activeRoute}
            hoveredProject={hoveredProject}
            onProjectHover={setHoveredProject}
          />
          <HomeMenu activeRoute={activeRoute} onRouteStart={startRoute} />
        </div>
      </section>

      <span
        className={`home_work_reveal_bloom${
          activeRoute === 'work' ? ' home_work_reveal_bloom_active' : ''
        }`}
        aria-hidden="true"
      />
      <AboutPage isOpen={aboutOpen} pageRef={aboutPageRef} />
      <MyWorkPage isOpen={workOpen} pageRef={workPageRef} onHomeClick={goHome} />
    </main>
  )
}

export default HomeSection
