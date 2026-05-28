import type { CSSProperties } from 'react'
import type { ProjectKey } from './HomeMazeNav'

interface ProjectHoverRouteProps {
  dashColor: string
  glowSoft: string
  glowStrong: string
  isHovered: boolean
  pathD: string
  project: ProjectKey
  runnerColor: string
  runnerPathD?: string
  transform: string
}

function ProjectHoverRoute({
  dashColor,
  glowSoft,
  glowStrong,
  isHovered,
  pathD,
  project,
  runnerColor,
  runnerPathD,
  transform,
}: ProjectHoverRouteProps) {
  const routeStyle = {
    '--project-route-dash-color': dashColor,
    '--project-route-glow-soft': glowSoft,
    '--project-route-glow-strong': glowStrong,
    '--project-route-runner-color': runnerColor,
  } as CSSProperties

  return (
    <g
      className={`home_route home_route_${project}${
        isHovered ? ` home_route_${project}_hovered` : ''
      }`}
      style={routeStyle}
      transform={transform}
    >
      <g className="home_route_project_dash">
        <path d={pathD} />
      </g>
      <g className="home_route_project_runner">
        <path d={runnerPathD ?? pathD} />
      </g>
    </g>
  )
}

export default ProjectHoverRoute
