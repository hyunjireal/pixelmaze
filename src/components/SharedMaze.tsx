import { memo, useEffect, useRef, type CSSProperties } from 'react'
import './SharedMaze.css'
import homeMaze from '../assets/icons/home_maze.svg?raw'
import homeMazeConnect from '../assets/icons/home_maze_connect.svg?raw'

interface InlineSvgProps {
  className: string
  svg: string
}

function InlineSvg({ className, svg }: InlineSvgProps) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: svg }} />
}

const mazeDots = [
  { x: '6%', y: '50%', size: '9px', opacity: 0.34 },
  { x: '18%', y: '18%', size: '6px', opacity: 0.24 },
  { x: '50%', y: '5%', size: '7px', opacity: 0.3 },
  { x: '82%', y: '18%', size: '5px', opacity: 0.22 },
  { x: '94%', y: '50%', size: '8px', opacity: 0.32 },
  { x: '76%', y: '86%', size: '6px', opacity: 0.24 },
  { x: '23%', y: '82%', size: '7px', opacity: 0.28 },
]

interface SharedMazeProps {
  showDecor?: boolean
}

function SharedMaze({ showDecor = true }: SharedMazeProps) {
  const mazeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const drawableSegments = mazeRef.current?.querySelectorAll<SVGGeometryElement>(
      '.shared_maze_draw path, .shared_maze_draw circle, .shared_maze_draw ellipse, .shared_maze_draw line',
    )

    drawableSegments?.forEach((segment, index) => {
      const length = segment.getTotalLength()
      const originalDashArray = segment.getAttribute('stroke-dasharray')
      const forwardDelay = Math.min(index * 0.035, 1.45)
      const reverseDelay = Math.max(1.45 - forwardDelay, 0) * 0.42
      segment.style.strokeDasharray = originalDashArray ?? `${length}`
      segment.style.strokeDashoffset = `${length}`
      segment.style.setProperty('--segment_length', `${length}`)
      segment.style.setProperty('--segment_delay', `${forwardDelay}s`)
      segment.style.setProperty('--segment_reverse_delay', `${reverseDelay}s`)
    })
  }, [])

  return (
    <div className="shared_maze" aria-hidden="true" ref={mazeRef}>
      <InlineSvg
        className="shared_maze_core shared_maze_draw"
        svg={homeMaze}
      />
      {showDecor ? (
        <>
          <InlineSvg
            className="shared_maze_decor shared_maze_decor_connect shared_maze_draw"
            svg={homeMazeConnect}
          />
          <div className="shared_maze_orbit_dots">
            {mazeDots.map((dot) => (
              <span
                className="shared_maze_orbit_dot"
                key={`${dot.x}-${dot.y}`}
                style={
                  {
                    '--dot-x': dot.x,
                    '--dot-y': dot.y,
                    '--dot-size': dot.size,
                    '--dot-opacity': dot.opacity,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default memo(SharedMaze)
