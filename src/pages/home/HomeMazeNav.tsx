import logo from '../../assets/icons/logo.svg'
import attitudeRoute from '../../assets/icons/path_attitude.svg?raw'
import campingRoute from '../../assets/icons/path_camping.svg?raw'
import favoriteRoute from '../../assets/icons/path_favorite.svg?raw'
import gunitRoute from '../../assets/icons/path_gunit.svg?raw'
import meRoute from '../../assets/icons/path_me.svg?raw'
import simmonsRoute from '../../assets/icons/path_simmons.svg?raw'
import stanleyRoute from '../../assets/icons/path_stanley.svg?raw'
import type { RouteKey } from './homeTypes'

interface HomeMazeNavProps {
  activeRoute: RouteKey | null
}

const mazeCenter = { x: 2188, y: 2188 }

function getSvgPaths(svg: string) {
  return svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
}

function HomeMazeNav({ activeRoute }: HomeMazeNavProps) {
  return (
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
          <path d="M1035 780L300 420L-1790 420" />
          <circle className="home_maze_extension_start" cx="1035" cy="780" r="54" />
          <circle className="home_maze_extension_end" cx="-1790" cy="420" r="54" />
        </g>

        <g
          className={`home_maze_extension_line home_maze_extension_line_work${
            activeRoute === 'work' ? ' home_maze_extension_line_active' : ''
          }`}
        >
          <path d="M680 2490L-55 3279L-1990 3279" />
          <circle className="home_maze_extension_start" cx="680" cy="2490" r="54" />
          <circle className="home_maze_extension_end" cx="-1990" cy="3279" r="54" />
        </g>

        <g
          className={`home_maze_extension_line home_maze_extension_line_contact${
            activeRoute === 'contact' ? ' home_maze_extension_line_active' : ''
          }`}
        >
          <path d="M2278 3450L4568 3440L5065 3668L6195 3646" />
          <circle className="home_maze_extension_start" cx="2278" cy="3450" r="54" />
          <circle className="home_maze_extension_end" cx="6195" cy="3646" r="54" />
        </g>

        <g className="home_project_dot_layer">
          <g
            className="home_route home_route_gunit"
            transform="translate(2188 2188) rotate(-0.90) scale(0.9599) translate(-1896.65 -105.003)"
            dangerouslySetInnerHTML={{ __html: getSvgPaths(gunitRoute) }}
          />
          <g
            className="home_route home_route_simmons"
            transform="translate(2188 2188) rotate(1.01) scale(0.9751) translate(-1372.48 -1857.84)"
            dangerouslySetInnerHTML={{ __html: getSvgPaths(simmonsRoute) }}
          />
          <g
            className="home_route home_route_stanley"
            transform="translate(2188 2188) rotate(-0.39) scale(0.9689) translate(-3.63 -2.5)"
            dangerouslySetInnerHTML={{ __html: getSvgPaths(stanleyRoute) }}
          />
          <g
            className="home_route home_route_camping"
            transform="translate(2174 2188) rotate(3.72) scale(0.9748) translate(-527.051 -1390.11)"
            dangerouslySetInnerHTML={{ __html: getSvgPaths(campingRoute) }}
          />
          <path className="home_project_line" d="M1990 375L2220 80L2600 80" />
          <path className="home_project_line" d="M385 2118L170 2250L-600 2250" />
          <path className="home_project_line" d="M2405 3682L2240 4200L1550 4200" />
          <path className="home_project_line" d="M3198 1342L3650 1342L3850 560L4450 560" />
          <circle
            className="home_project_dot home_project_dot_simmons"
            cx="1990"
            cy="375"
            data-dot-name="simmons"
            r="34"
          />
          <circle
            className="home_project_dot home_project_dot_gunit"
            cx="385"
            cy="2118"
            data-dot-name="gunit"
            r="34"
          />
          <circle
            className="home_project_dot home_project_dot_stanley"
            cx="2405"
            cy="3682"
            data-dot-name="stanley"
            r="34"
          />
          <circle
            className="home_project_dot home_project_dot_camping"
            cx="3198"
            cy="1342"
            data-dot-name="camping"
            r="34"
          />
        </g>

        <image
          className="home_maze_symbol"
          href={logo}
          x={mazeCenter.x - 90}
          y={mazeCenter.y - 90}
          width="180"
          height="180"
        />
        <g className="home_blue_dot_layer">
          <g
            className="home_route home_route_me"
            transform="translate(2188 2188) rotate(6.08) scale(1.7672) translate(-721.049 -341.685)"
            dangerouslySetInnerHTML={{ __html: getSvgPaths(meRoute) }}
          />
          <g
            className="home_route home_route_favorite"
            transform="translate(2188 2188) rotate(2.31) scale(0.9393) translate(-2.5 -535.171)"
            dangerouslySetInnerHTML={{ __html: getSvgPaths(favoriteRoute) }}
          />
          <g
            className="home_route home_route_attitude"
            transform="translate(2188 2188) rotate(-10.91) scale(0.9158) translate(-3.63 -2.5)"
            dangerouslySetInnerHTML={{ __html: getSvgPaths(attitudeRoute) }}
          />
          <path className="home_blue_line" d="M1126 1472L700 1300L100 1300" />
          <path className="home_blue_line" d="M3946 1758L4200 2050L4800 2050" />
          <path className="home_blue_line" d="M2996 2738L3500 3350L4600 3350" />
          <circle
            className="home_blue_dot home_blue_dot_me"
            cx="1126"
            cy="1472"
            data-dot-name="me"
            r="30"
          />
          <circle
            className="home_blue_dot home_blue_dot_favorite"
            cx="3946"
            cy="1758"
            data-dot-name="favorite"
            r="30"
          />
          <circle
            className="home_blue_dot home_blue_dot_attitude"
            cx="2996"
            cy="2738"
            data-dot-name="attitude"
            r="30"
          />
        </g>
        {activeRoute === 'profile' ? (
          <circle
            className="home_destination_bloom home_destination_bloom_profile"
            cx="995"
            cy="700"
            r="34"
          />
        ) : null}
        {activeRoute === 'work' ? (
          <circle
            className="home_destination_bloom home_destination_bloom_work"
            cx="570"
            cy="2490"
            r="34"
          />
        ) : null}
      </svg>
    </div>
  )
}

export default HomeMazeNav
