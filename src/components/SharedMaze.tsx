import { memo, useEffect, useRef } from 'react'
import './SharedMaze.css'
import homeMaze from '../assets/icons/home_maze.svg?raw'
import homeMazeConnect from '../assets/icons/home_maze_connect.svg?raw'
import homeMazeDot from '../assets/icons/home_maze_dot.svg?raw'

interface InlineSvgProps {
  className: string
  svg: string
}

function InlineSvg({ className, svg }: InlineSvgProps) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: svg }} />
}

function SharedMaze() {
  const mazeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const drawableSegments = mazeRef.current?.querySelectorAll<SVGGeometryElement>(
      '.shared_maze_draw path, .shared_maze_draw circle, .shared_maze_draw ellipse, .shared_maze_draw line',
    )

    drawableSegments?.forEach((segment, index) => {
      const length = segment.getTotalLength()
      segment.style.strokeDasharray = `${length}`
      segment.style.strokeDashoffset = `${length}`
      segment.style.setProperty('--segment_delay', `${Math.min(index * 0.035, 1.45)}s`)
    })
  }, [])

  return (
    <div className="shared_maze" aria-hidden="true" ref={mazeRef}>
      <InlineSvg
        className="shared_maze_connect shared_maze_draw shared_maze_svg_layer"
        svg={homeMazeConnect}
      />
      <InlineSvg
        className="shared_maze_line shared_maze_draw shared_maze_svg_layer"
        svg={homeMaze}
      />
      <InlineSvg
        className="shared_maze_dot shared_maze_points shared_maze_svg_layer"
        svg={homeMazeDot}
      />
    </div>
  )
}

export default memo(SharedMaze)
