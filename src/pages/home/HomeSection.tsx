import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import './HomeSection.css'
import MainTabClickTransition, {
  useMainTabClickTransition,
} from '../../components/MainTabClickTransition'
import AboutPage from '../about/AboutPage'
import MyWorkPage from '../work/MyWorkPage'
import HomeMazeNav, { type ProjectKey } from './HomeMazeNav'
import HomeBackground from './HomeBackground'
import HomeMenu from './HomeMenu'
import type { RouteKey } from './homeTypes'

interface HomeSectionProps {
  isActive: boolean
}

const defaultCaseCard = {
  title: 'HyunJi Studio',
  description: 'Visual identity and digital experience for a personal portfolio system.',
  action: 'View Case Study',
}

const projectCaseCards: Partial<
  Record<ProjectKey, { title: string; description: string; action: string }>
> = {
  simmons: {
    title: 'Simmons Review',
    description:
      'A quiet review archive focused on sleep mood, product tone, and refined brand moments.',
    action: 'View Review',
  },
  gunit: {
    title: 'Gunit Archive',
    description:
      'A brand case note collecting bold product rhythm, sharp color cues, and launch page details.',
    action: 'View Archive',
  },
  stanley: {
    title: 'Stanley Study',
    description:
      'A compact product review around utility, outdoor texture, and durable visual storytelling.',
    action: 'View Study',
  },
  camping: {
    title: 'Camping Camfit',
    description:
      'A soft travel-service review shaped around campsite discovery, booking flow, and warm UI moments.',
    action: 'View Camfit',
  },
}

function HomeSection({ isActive }: HomeSectionProps) {
  const [activeRoute, setActiveRoute] = useState<RouteKey | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [workOpen, setWorkOpen] = useState(false)
  const [hoveredProject, setHoveredProject] = useState<ProjectKey | null>(null)
  const aboutPageRef = useRef<HTMLElement | null>(null)
  const workPageRef = useRef<HTMLElement | null>(null)
  const routeTransition = useMainTabClickTransition({
    onClearHover: () => setHoveredProject(null),
    onOpenRoute: (route) => {
      if (route === 'profile') {
        setAboutOpen(true)
      }

      if (route === 'work') {
        setWorkOpen(true)
      }
    },
    onResetPages: () => {
      setAboutOpen(false)
      setWorkOpen(false)
    },
  })

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
    setActiveRoute(route)
    routeTransition.startTransition(route)
  }

  const goHome = () => {
    routeTransition.resetTransition()
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
  const caseCard = hoveredProject ? projectCaseCards[hoveredProject] ?? defaultCaseCard : defaultCaseCard

  return (
    <main
      id="main"
      className={`home_page${isActive ? ' home_page_active' : ''}${
        aboutOpen ? ' home_page_about_open' : ''
      }${workOpen ? ' home_page_work_open' : ''}${
        routeTransition.transitionClassName ? ` ${routeTransition.transitionClassName}` : ''
      }`}
    >
      <section className="home_view">
        <div
          className="home_stage"
          onPointerLeave={() => setHoveredProject(null)}
          onPointerMove={handleStageMouseMove}
          onMouseMove={handleStageMouseMove}
        >
          <HomeBackground />
          <MainTabClickTransition
            activeRoute={routeTransition.activeRoute}
            state={routeTransition.state}
          />

          <button
            className="home_work_quick_link"
            type="button"
            onClick={() => startRoute('work')}
          >
            My Works
          </button>

          <aside
            className={`home_case_card${
              hoveredProject ? ` home_case_card_${hoveredProject}` : ''
            }`}
            aria-label="Featured case card"
          >
            <span className="home_case_card_preview" aria-hidden="true" />
            <div className="home_case_card_body">
              <strong>{caseCard.title}</strong>
              <p>{caseCard.description}</p>
            </div>
            <button className="home_case_card_link" type="button" onClick={() => startRoute('work')}>
              <span>{caseCard.action}</span>
              <i aria-hidden="true" />
            </button>
            <span className="home_case_card_open" aria-hidden="true" />
          </aside>

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
