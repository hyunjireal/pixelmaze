import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from 'react'
import './HomeSection.css'
import AboutPage from '../about/AboutPage'
import MyWorkPage from '../work/MyWorkPage'
import HomeMazeNav, { type ProjectKey } from './HomeMazeNav'
import HomeMenu from './HomeMenu'
import type { RouteKey } from './homeTypes'

interface HomeSectionProps {
  isActive: boolean
  onHomeRouteStart?: () => void
  onWorkRouteStart?: () => void
}

function HomeSection({
  isActive,
  onHomeRouteStart,
  onWorkRouteStart,
}: HomeSectionProps) {
  const [activeRoute, setActiveRoute] = useState<RouteKey | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [workOpen, setWorkOpen] = useState(false)
  const [hoveredProject, setHoveredProject] = useState<ProjectKey | null>(null)
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
    setHoveredProject(null)

    if (route === 'work' && onWorkRouteStart) {
      onWorkRouteStart()
      return
    }

    setActiveRoute(route)
    setAboutOpen(route === 'profile')
    setWorkOpen(route === 'work')
  }

  const goHome = () => {
    if (onHomeRouteStart && (aboutOpen || workOpen)) {
      onHomeRouteStart()
      return
    }

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
    const projects: Array<{ key: ProjectKey; x: number; y: number }> = [
      { key: 'simmons', x: 1990, y: 375 },
      { key: 'gunit', x: 385, y: 2118 },
      { key: 'stanley', x: 2405, y: 3682 },
      { key: 'camping', x: 3198, y: 1342 },
    ]
    const nearestProject = projects
      .map((project) => {
        const x = rect.left + (project.x / 4377) * rect.width
        const y = rect.top + (project.y / 4377) * rect.height

        return {
          key: project.key,
          distance: Math.hypot(clientX - x, clientY - y),
        }
      })
      .sort((a, b) => a.distance - b.distance)[0]
    const nextHoveredProject = nearestProject.distance <= 38 ? nearestProject.key : null

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
            onClick={() => startRoute('work')}
          >
            My Works
          </button>

          <HomeMazeNav
            activeRoute={activeRoute}
            hoveredProject={hoveredProject}
            onHomeClick={goHome}
            onProjectHover={setHoveredProject}
          />
          <HomeMenu activeRoute={activeRoute} onRouteStart={startRoute} />
        </div>
      </section>

      <AboutPage isOpen={aboutOpen} pageRef={aboutPageRef} onHomeClick={goHome} />
      <MyWorkPage isOpen={workOpen} pageRef={workPageRef} onHomeClick={goHome} />
    </main>
  )
}

export default HomeSection
