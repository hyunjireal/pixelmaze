import TitAboutMe from '../../components/TitAboutMe'
import TrueFocus from '../../components/TrueFocus'
import type { RouteKey } from './homeTypes'

type HomeMenuItem = {
  classSuffix: string
  exbold: string
  href: string
  italic: string
  route: RouteKey
}

interface HomeMenuProps {
  activeRoute: RouteKey | null
  onRouteStart: (route: RouteKey) => void
}

const homeMenuItems: HomeMenuItem[] = [
  {
    classSuffix: 'profile',
    exbold: 'About',
    href: '#about',
    italic: 'Me',
    route: 'profile',
  },
  {
    classSuffix: 'work',
    exbold: 'My',
    href: '#work',
    italic: 'Works',
    route: 'work',
  },
  {
    classSuffix: 'contact',
    exbold: 'Contact',
    href: '#contact',
    italic: 'Me',
    route: 'contact',
  },
]

function HomeMenu({ activeRoute, onRouteStart }: HomeMenuProps) {
  return (
    <>
      {homeMenuItems.map((item) => (
        <a
          className={`home_note home_note_${item.classSuffix}${
            activeRoute === item.route ? ' home_note_active' : ''
          }`}
          href={item.href}
          key={item.route}
          onClick={(event) => {
            event.preventDefault()
            onRouteStart(item.route)
          }}
        >
          <TrueFocus>
            <TitAboutMe exbold={item.exbold} italic={item.italic} />
          </TrueFocus>
        </a>
      ))}
    </>
  )
}

export default HomeMenu
