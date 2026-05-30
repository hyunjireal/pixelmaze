import { type CSSProperties, type PointerEvent, type ReactNode, useState } from 'react'
import './MagicHoverCta.css'

type Ripple = {
  id: number
  x: number
  y: number
}

interface MagicHoverCtaProps {
  ariaLabel?: string
  children: ReactNode
  className?: string
  glowColor?: string
}

const particles = Array.from({ length: 10 }, (_, index) => index)

function MagicHoverCta({
  ariaLabel,
  children,
  className,
  glowColor = '228, 251, 46',
}: MagicHoverCtaProps) {
  const [isActive, setIsActive] = useState(false)
  const [ripples, setRipples] = useState<Ripple[]>([])

  const setPointerVars = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    event.currentTarget.style.setProperty('--magic-x', `${x}%`)
    event.currentTarget.style.setProperty('--magic-y', `${y}%`)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    setPointerVars(event)
  }

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    setPointerVars(event)
    setIsActive(true)
  }

  const handlePointerLeave = () => {
    setIsActive(false)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const id = window.performance.now()
    const ripple = {
      id,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }

    setRipples((currentRipples) => [...currentRipples, ripple])
    window.setTimeout(() => {
      setRipples((currentRipples) =>
        currentRipples.filter((currentRipple) => currentRipple.id !== id),
      )
    }, 620)
  }

  const style = {
    '--magic-glow-rgb': glowColor,
  } as CSSProperties

  return (
    <div
      className={`magic_hover_cta${isActive ? ' magic_hover_cta_active' : ''}${
        className ? ` ${className}` : ''
      }`}
      style={style}
      aria-label={ariaLabel}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
    >
      <span className="magic_hover_cta_spotlight" aria-hidden="true" />
      <span className="magic_hover_cta_particles" aria-hidden="true">
        {particles.map((particle) => (
          <span className="magic_hover_cta_particle" key={particle} />
        ))}
      </span>
      {children}
      {ripples.map((ripple) => (
        <span
          className="magic_hover_cta_ripple"
          key={ripple.id}
          style={
            {
              '--magic-ripple-x': `${ripple.x}px`,
              '--magic-ripple-y': `${ripple.y}px`,
            } as CSSProperties
          }
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export default MagicHoverCta
