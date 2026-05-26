import { useEffect, useRef, useState } from 'react'
import './HomeSection.css'
import AboutPage from '../about/AboutPage'
import TitAboutMe from '../../components/TitAboutMe'
import TrueFocus from '../../components/TrueFocus'
import homeMazePath01 from '../../assets/icons/home_maze_path01.svg?raw'
import homeMazePath02 from '../../assets/icons/home_maze_path02.svg?raw'
import homeMazePath03 from '../../assets/icons/home_maze_path03.svg?raw'
import homeMazePath04 from '../../assets/icons/home_maze_path04.svg?raw'
import symbol from '../../assets/icons/symbol.svg'

type RouteKey = 'profile' | 'work' | 'favorite' | 'contact'

type RouteConfig = {
  path: string
  duration: string
  keySplines: string
}

type Point = {
  x: number
  y: number
}

const mazeCenter: Point = { x: 2188, y: 2188 }

const extractRoutePath = (svg: string) =>
  Array.from(svg.matchAll(/<path[^>]* d="([^"]+)"/g), (match) => match[1])
    .map((path, index) => (index === 0 ? path : path.replace(/^M\s*/, 'L')))
    .join(' ')

const formatPathNumber = (value: number) =>
  Number(value.toFixed(2)).toString()

const transformRoutePoint = (
  point: Point,
  sourceStart: Point,
  sourceEnd: Point,
  targetEnd: Point,
) => {
  const sourceDx = sourceEnd.x - sourceStart.x
  const sourceDy = sourceEnd.y - sourceStart.y
  const targetDx = targetEnd.x - mazeCenter.x
  const targetDy = targetEnd.y - mazeCenter.y
  const sourceLength = Math.hypot(sourceDx, sourceDy)
  const targetLength = Math.hypot(targetDx, targetDy)
  const scale = targetLength / sourceLength
  const rotation = Math.atan2(targetDy, targetDx) - Math.atan2(sourceDy, sourceDx)
  const cos = Math.cos(rotation)
  const sin = Math.sin(rotation)
  const x = (point.x - sourceStart.x) * scale
  const y = (point.y - sourceStart.y) * scale

  return {
    x: mazeCenter.x + x * cos - y * sin,
    y: mazeCenter.y + x * sin + y * cos,
  }
}

const transformRoutePath = (
  path: string,
  sourceStart: Point,
  sourceEnd: Point,
  targetEnd: Point,
) => {
  const tokens = path.match(/[A-Za-z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? []
  const transformedTokens: string[] = []
  let command = ''
  let index = 0

  const transformPair = () => {
    const point = transformRoutePoint(
      { x: Number(tokens[index]), y: Number(tokens[index + 1]) },
      sourceStart,
      sourceEnd,
      targetEnd,
    )

    transformedTokens.push(formatPathNumber(point.x), formatPathNumber(point.y))
    index += 2
  }

  while (index < tokens.length) {
    const token = tokens[index]

    if (/^[A-Za-z]$/.test(token)) {
      command = token
      transformedTokens.push(token)
      index += 1
      continue
    }

    if (command === 'M' || command === 'L') {
      transformPair()
      continue
    }

    if (command === 'C') {
      transformPair()
      transformPair()
      transformPair()
      continue
    }

    transformedTokens.push(token)
    index += 1
  }

  return transformedTokens.join(' ')
}

const createRoutePath = (
  svg: string,
  sourceStart: Point,
  sourceEnd: Point,
  targetEnd: Point,
) => transformRoutePath(extractRoutePath(svg), sourceStart, sourceEnd, targetEnd)

const routeConfigs: Record<RouteKey, RouteConfig> = {
  profile: {
    duration: '11s',
    keySplines: '0.44 0 0.18 1',
    path: createRoutePath(
      homeMazePath01,
      { x: 1728.12, y: 1418.57 },
      { x: 520.633, y: 5.5 },
      { x: 995, y: 700 },
    ),
  },
  work: {
    duration: '16s',
    keySplines: '0.32 0 0.28 1',
    path: createRoutePath(
      homeMazePath02,
      { x: 1502.6, y: 183.152 },
      { x: 5.5, y: 558.172 },
      { x: 570, y: 2490 },
    ),
  },
  favorite: {
    duration: '11s',
    keySplines: '0.44 0 0.18 1',
    path: createRoutePath(
      homeMazePath03,
      { x: 5.5, y: 609.939 },
      { x: 696.232, y: 527.808 },
      { x: 2910, y: 2144 },
    ),
  },
  contact: {
    duration: '11s',
    keySplines: '0.44 0 0.18 1',
    path: createRoutePath(
      homeMazePath04,
      { x: 468.658, y: 5.50195 },
      { x: 543.067, y: 1273.42 },
      { x: 2278, y: 3450 },
    ),
  },
}

const routeTrailOffsets = [0, 0.032, 0.07, 0.114, 0.164, 0.22, 0.282, 0.35]
const centerSymbolPoint: Point = { x: 2188, y: 2188 }

interface HomeSectionProps {
  isActive: boolean
}

const getDurationMs = (duration: string) => Number.parseFloat(duration) * 1000
const routeDurationScale = 0.55
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const easeInOutCubic = (value: number) =>
  value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2

function HomeSection({ isActive }: HomeSectionProps) {
  const [activeRoute, setActiveRoute] = useState<RouteKey | null>(null)
  const [routeRun, setRouteRun] = useState(0)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [routeProgress, setRouteProgress] = useState(0)
  const routeMeasureRef = useRef<SVGPathElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const progressRef = useRef(0)
  const pendingRouteRef = useRef<RouteKey | null>(null)
  const activeRouteRef = useRef<RouteKey | null>(null)
  const destinationTimerRef = useRef<number | null>(null)
  const aboutPageRef = useRef<HTMLElement | null>(null)
  const currentRoute = activeRoute ? routeConfigs[activeRoute] : null

  const stopRouteAnimation = () => {
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }

  useEffect(() => {
    activeRouteRef.current = activeRoute
  }, [activeRoute])

  useEffect(() => {
    return () => {
      stopRouteAnimation()
      if (destinationTimerRef.current) {
        window.clearTimeout(destinationTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!aboutOpen) return

    aboutPageRef.current?.focus({ preventScroll: true })
    aboutPageRef.current?.scrollTo({ top: 0 })
  }, [aboutOpen])

  const updateRoutePosition = (progress: number) => {
    const routePath = routeMeasureRef.current

    if (!routePath) return

    progressRef.current = progress
    setRouteProgress(progress)
  }

  const runRouteAnimation = (
    route: RouteKey,
    fromProgress: number,
    durationMs: number,
  ) => {
    stopRouteAnimation()

    const startedAt = performance.now()

    const step = (time: number) => {
      const elapsed = time - startedAt
      const rawProgress = clamp(elapsed / durationMs, 0, 1)
      const easedProgress = fromProgress + (1 - fromProgress) * easeInOutCubic(rawProgress)

      updateRoutePosition(easedProgress)

      if (rawProgress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(step)
        return
      }

      animationFrameRef.current = null
      progressRef.current = 1

      if (route === 'profile') {
        setAboutOpen(true)
      }
    }

    animationFrameRef.current = window.requestAnimationFrame(step)
  }

  useEffect(() => {
    if (!currentRoute || !activeRoute) return

    const pendingRoute = pendingRouteRef.current
    pendingRouteRef.current = null

    if (pendingRoute !== activeRoute) return

    progressRef.current = 0
    updateRoutePosition(0)
    runRouteAnimation(activeRoute, 0, getDurationMs(currentRoute.duration) * routeDurationScale)
  }, [activeRoute, currentRoute, routeRun])

  const startRoute = (route: RouteKey) => {
    if (destinationTimerRef.current) {
      window.clearTimeout(destinationTimerRef.current)
      destinationTimerRef.current = null
    }

    setAboutOpen(false)

    const routeInFlight = activeRouteRef.current === route
    const sameRouteIsPending = pendingRouteRef.current === route

    if (sameRouteIsPending && !routeInFlight) {
      return
    }

    if (routeInFlight && progressRef.current >= 0.98) {
      if (route === 'profile') {
        setAboutOpen(true)
      }
      return
    }

    if (routeInFlight && progressRef.current < 0.98) {
      const routeDuration = getDurationMs(routeConfigs[route].duration)
      const remainingDuration = routeDuration * routeDurationScale * (1 - progressRef.current)
      const boostedDuration = clamp(remainingDuration * 0.32, 1600, 3200)

      runRouteAnimation(route, progressRef.current, boostedDuration)
      return
    }

    pendingRouteRef.current = route
    progressRef.current = 0
    setRouteProgress(0)
    setActiveRoute(route)
    setRouteRun((run) => run + 1)
  }

  return (
    <main
      className={`home_page${isActive ? ' home_page_active' : ''}${
        aboutOpen ? ' home_page_about_open' : ''
      }`}
    >
      <section className="home_view">
        <div className="home_stage">
          <div className="home_maze_nav" aria-hidden="true">
            <svg
              className="home_maze_extension"
              viewBox="0 0 4377 4377"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                className={`home_maze_extension_line home_maze_extension_line_profile${
                  activeRoute === 'profile' ? ' home_maze_extension_line_active' : ''
                }`}
              >
                <path d="M995 700L0 1463L-1790 1463" />
                <circle className="home_maze_extension_start" cx="995" cy="700" r="34" />
                <circle className="home_maze_extension_end" cx="-1790" cy="1463" r="48" />
              </g>

              <g
                className={`home_maze_extension_line home_maze_extension_line_work${
                  activeRoute === 'work' ? ' home_maze_extension_line_active' : ''
                }`}
              >
                <path d="M570 2490L-55 3279L-1990 3279" />
                <circle className="home_maze_extension_start" cx="570" cy="2490" r="34" />
                <circle className="home_maze_extension_end" cx="-1990" cy="3279" r="48" />
              </g>

              <g
                className={`home_maze_extension_line home_maze_extension_line_about${
                  activeRoute === 'favorite' ? ' home_maze_extension_line_active' : ''
                }`}
              >
                <path d="M2910 2144L3325 1465L5748 1465" />
                <circle className="home_maze_extension_start" cx="2910" cy="2144" r="34" />
                <circle className="home_maze_extension_end" cx="5748" cy="1465" r="48" />
              </g>

              <g
                className={`home_maze_extension_line home_maze_extension_line_contact${
                  activeRoute === 'contact' ? ' home_maze_extension_line_active' : ''
                }`}
              >
                <path d="M2278 3450L4568 3440L5065 3668L6195 3646" />
                <circle className="home_maze_extension_start" cx="2278" cy="3450" r="34" />
                <circle className="home_maze_extension_end" cx="6195" cy="3646" r="48" />
              </g>

              {currentRoute ? (
                <g className="home_route_layer">
                  <path
                    ref={routeMeasureRef}
                    className="home_route_measure_path"
                    d={currentRoute.path}
                  />
                  {routeTrailOffsets.map((offset, index) => (
                    <path
                      key={`${activeRoute}_route_trace_${routeRun}_${index}`}
                      className="home_route_trace_dash"
                      d={currentRoute.path}
                      pathLength="1"
                      style={{
                        opacity: routeProgress > offset ? clamp(0.78 - index * 0.09, 0.06, 0.78) : 0,
                        strokeDasharray: `${clamp(0.034 - index * 0.0018, 0.018, 0.034)} 1`,
                        strokeDashoffset: -(routeProgress - offset),
                      }}
                    />
                  ))}
                </g>
              ) : (
                <image
                  className="home_maze_symbol"
                  href={symbol}
                  x={centerSymbolPoint.x - 90}
                  y={centerSymbolPoint.y - 90}
                  width="180"
                  height="180"
                />
              )}
              {activeRoute === 'profile' ? (
                <circle className="home_destination_bloom" cx="995" cy="700" r="34" />
              ) : null}
            </svg>
          </div>

          <a
            className={`home_note home_note_profile${
              activeRoute === 'profile' ? ' home_note_active' : ''
            }`}
            href="#about"
            onClick={(event) => {
              event.preventDefault()
              startRoute('profile')
            }}
          >
            <TrueFocus>
              <TitAboutMe exbold="About" italic="Me" />
            </TrueFocus>
          </a>
          <a
            className={`home_note home_note_work${
              activeRoute === 'work' ? ' home_note_active' : ''
            }`}
            href="#work"
            onClick={(event) => {
              event.preventDefault()
              startRoute('work')
            }}
          >
            <TrueFocus>
              <TitAboutMe exbold="My" italic="Works" />
            </TrueFocus>
          </a>
          <a
            className={`home_note home_note_about${
              activeRoute === 'favorite' ? ' home_note_active' : ''
            }`}
            href="#about"
            onClick={(event) => {
              event.preventDefault()
              startRoute('favorite')
            }}
          >
            <TrueFocus>
              <TitAboutMe exbold="My" italic="Favorite" />
            </TrueFocus>
          </a>
          <a
            className={`home_note home_note_contact${
              activeRoute === 'contact' ? ' home_note_active' : ''
            }`}
            href="#contact"
            onClick={(event) => {
              event.preventDefault()
              startRoute('contact')
            }}
          >
            <TrueFocus>
              <TitAboutMe exbold="Contact" italic="Me" />
            </TrueFocus>
          </a>

        </div>
      </section>

      <AboutPage isOpen={aboutOpen} pageRef={aboutPageRef} />
    </main>
  )
}

export default HomeSection
