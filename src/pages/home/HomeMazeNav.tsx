import logo from '../../assets/icons/logo.svg'
import attitudeRoute from '../../assets/icons/path_attitude.svg?raw'
import campingRoute from '../../assets/icons/path_camping.svg?raw'
import favoriteRoute from '../../assets/icons/path_favorite.svg?raw'
import gunitRoute from '../../assets/icons/path_gunit.svg?raw'
import meRoute from '../../assets/icons/path_me.svg?raw'
import stanleyRoute from '../../assets/icons/path_stanley.svg?raw'
import type { RouteKey } from './homeTypes'

interface HomeMazeNavProps {
  activeRoute: RouteKey | null
  hoveredProject: 'simmons' | null
  onProjectHover: (project: 'simmons' | null) => void
}

const mazeCenter = { x: 2188, y: 2188 }

function getSvgPaths(svg: string) {
  return svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
}

function HomeMazeNav({ activeRoute, hoveredProject, onProjectHover }: HomeMazeNavProps) {
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
          >
            <g className="home_route_gunit_pathwork" dangerouslySetInnerHTML={{ __html: getSvgPaths(gunitRoute) }} />
            <g className="home_route_gunit_markers">
              <circle cx="1248.79" cy="467.778" r="18" />
              <circle cx="1433.26" cy="662.146" r="16" />
              <circle cx="1482.62" cy="1303.84" r="20" />
            </g>
          </g>
          <g
            className={`home_route home_route_simmons${
              hoveredProject === 'simmons' ? ' home_route_simmons_hovered' : ''
            }`}
            transform="translate(2188 2188) rotate(1.01) scale(0.9751) translate(-1372.48 -1857.84)"
          >
            <g
              className="home_route_simmons_runner home_route_simmons_runner_lead"
            >
              <path
                d="M1372.48 1857.84V1404.81C1280.49 1415.93 1210.02 1438.06 1182.7 1449.12C1146.73 1467.55 1108.72 1490.33 1085.24 1502.74C1051.54 1522.25 1029.75 1536.54 1007.73 1561.21C997.153 1547.07 954.609 1527.55 890.82 1497.88C842.931 1473.95 808.351 1457.09 787.039 1449.54C793.207 1420.34 821.552 1385.77 837.054 1372.04C869.427 1329.93 918.472 1263.42 959.873 1234.16C927.92 1209.5 878.29 1176.44 806.852 1119.09C764.155 1085.45 750.591 1072.39 734.449 1058.76C703.46 1070.73 644.561 1113.49 582.844 1184.23C553.635 1215.97 519.951 1276.24 493.305 1342.1C368.708 1295.86 265.095 1216.23 178.957 1161.53C106.962 1119.26 48.1357 1075.68 2.5 1049.4C23.2095 983.699 70.2993 933.14 129.125 867.398C232.299 758.678 390.466 650.42 521.692 566.871C598.548 514.235 662.276 488.581 679.662 480.252C646.468 386.177 622.228 326.603 579.957 230.99C625.489 185.375 743.868 134.837 823.569 102.246C908.069 68.3052 1007.36 32.6597 1136.64 2.5"
              />
            </g>
          </g>
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
            className="home_project_hit home_project_hit_simmons"
            cx="1990"
            cy="375"
            data-dot-name="simmons-hit"
            onMouseEnter={() => onProjectHover('simmons')}
            onMouseLeave={() => onProjectHover(null)}
            onPointerEnter={() => onProjectHover('simmons')}
            onPointerLeave={() => onProjectHover(null)}
            r="180"
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
