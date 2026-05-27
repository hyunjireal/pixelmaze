import logo from '../assets/icons/logo.svg'
import './PageHeader.css'

type PageHeaderItem = {
  id: 'about' | 'work' | 'favorite' | 'contact'
  label: string
}

interface PageHeaderProps {
  activePage: PageHeaderItem['id']
  ariaLabel: string
  onHomeClick: () => void
  position?: 'sticky' | 'fixed'
}

const navItems: PageHeaderItem[] = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Works' },
  { id: 'favorite', label: 'Favorite' },
  { id: 'contact', label: 'Contact' },
]

function PageHeader({
  activePage,
  ariaLabel,
  onHomeClick,
  position = 'sticky',
}: PageHeaderProps) {
  return (
    <nav className={`page_header page_header_${position}`} aria-label={ariaLabel}>
      <a
        className="page_header_logo"
        href="#main"
        aria-label="Go to home"
        onClick={(event) => {
          event.preventDefault()
          onHomeClick()
        }}
      >
        <img className="page_header_logo_mark" src={logo} alt="" aria-hidden="true" />
        <span className="page_header_logo_text">hyunji</span>
      </a>
      <span className="page_header_pattern" aria-hidden="true" />
      <div className="page_header_nav_links">
        {navItems.map((item) => (
          <a
            className={item.id === activePage ? 'page_header_nav_active' : undefined}
            href={`#${item.id}`}
            key={item.id}
          >
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}

export default PageHeader
