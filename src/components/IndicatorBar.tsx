import type { CSSProperties } from 'react'
import './IndicatorBar.css'

interface IndicatorBarProps {
  activeIndex: number
  className?: string
  color?: string
  total: number
}

const formatPageNumber = (value: number) => String(value).padStart(2, '0')

function IndicatorBar({ activeIndex, className, color, total }: IndicatorBarProps) {
  const currentPage = Math.min(Math.max(activeIndex + 1, 1), total)
  const indicatorStyle = color
    ? ({
        '--indicator-bar-color': color,
      } as CSSProperties & { '--indicator-bar-color': string })
    : undefined

  return (
    <aside
      className={`indicator_bar${className ? ` ${className}` : ''}`}
      aria-label={`Project ${currentPage} of ${total}`}
      style={indicatorStyle}
    >
      <div className="indicator_bar_page" aria-hidden="true">
        <span>{formatPageNumber(currentPage)}</span>
        <span>/</span>
        <span>{formatPageNumber(total)}</span>
      </div>
      <div className="indicator_bar_track" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span
            className={`indicator_bar_mark${
              index === activeIndex ? ' indicator_bar_mark_active' : ''
            }`}
            key={index}
          />
        ))}
      </div>
    </aside>
  )
}

export default IndicatorBar
