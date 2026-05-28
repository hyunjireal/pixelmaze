import MenuLockup from '../../components/MenuLockup'
import TrueFocus from '../../components/TrueFocus'
import type { RouteKey } from './homeTypes'

type HomeMenuItem = {
  backdrop: string
  classSuffix: string
  href: string
  route: RouteKey
  script: string
}

interface HomeMenuProps {
  activeRoute: RouteKey | null
  onRouteStart: (route: RouteKey) => void
}

const homeMenuItems: HomeMenuItem[] = [
  {
    backdrop: 'about',
    classSuffix: 'profile',
    href: '#about',
    route: 'profile',
    script: 'ME',
  },
  {
    backdrop: 'portfolio',
    classSuffix: 'work',
    href: '#work',
    route: 'work',
    script: 'WORKS',
  },
  {
    backdrop: 'contact',
    classSuffix: 'contact',
    href: '#contact',
    route: 'contact',
    script: 'ME',
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
            <MenuLockup backdrop={item.backdrop} script={item.script} />
          </TrueFocus>
        </a>
      ))}
    </>
  )
}

export default HomeMenu
