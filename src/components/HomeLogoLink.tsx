import type { CSSProperties } from 'react'
import './HomeLogoLink.css'

interface HomeLogoLinkProps {
  className?: string
  color?: string
  href?: string
  label?: string
  onClick: () => void
  position?: 'inline' | 'topRight'
}

function HomeLogoLink({
  className,
  color,
  href = '#main',
  label = 'Go to home',
  onClick,
  position = 'inline',
}: HomeLogoLinkProps) {
  const logoStyle = color
    ? ({
        '--home-logo-color': color,
      } as CSSProperties & { '--home-logo-color': string })
    : undefined

  return (
    <a
      className={`home_logo_link home_logo_link_${position}${className ? ` ${className}` : ''}`}
      href={href}
      aria-label={label}
      style={logoStyle}
      onClick={(event) => {
        event.preventDefault()
        onClick()
      }}
    >
      <span className="home_logo_orbit home_logo_orbit_left" aria-hidden="true">
        <svg viewBox="0 0 489 476" focusable="false">
          <path d="M92.5106 343.824C72.3099 314.977 60.7627 280.963 59.2259 245.78C57.689 210.596 66.2265 175.705 83.8349 145.206C101.443 114.708 127.391 89.8686 158.629 73.6078C189.867 57.3471 225.098 50.3404 260.181 53.4111" />
          <path d="M110.047 348.538C115.846 348.538 120.547 353.239 120.547 359.038C120.547 364.837 115.846 369.538 110.047 369.538C104.248 369.538 99.5474 364.837 99.5474 359.038C99.5474 353.239 104.248 348.538 110.047 348.538Z" />
        </svg>
      </span>
      <span className="home_logo_orbit home_logo_orbit_right" aria-hidden="true">
        <svg viewBox="0 0 489 476" focusable="false">
          <path d="M395.592 131.591C415.793 160.439 427.34 194.452 428.877 229.636C430.414 264.819 421.876 299.71 404.268 330.209C386.66 360.708 360.712 385.547 329.474 401.808C298.235 418.068 263.005 425.075 227.922 422.004" />
          <path d="M358.049 87.5376C363.296 87.5376 367.549 91.7909 367.549 97.0376C367.549 102.284 363.296 106.538 358.049 106.538C352.803 106.538 348.549 102.284 348.549 97.0376C348.549 91.7909 352.803 87.5376 358.049 87.5376Z" />
          <path d="M377.547 107.538C380.861 107.538 383.547 110.224 383.547 113.538C383.547 116.851 380.861 119.538 377.547 119.538C374.234 119.538 371.547 116.851 371.547 113.538C371.547 110.224 374.234 107.538 377.547 107.538Z" />
        </svg>
      </span>
      <span className="home_logo_initial" aria-hidden="true">
        HJ
      </span>
      <span className="home_logo_text" aria-hidden="true">
        HyunJi
      </span>
    </a>
  )
}

export default HomeLogoLink
