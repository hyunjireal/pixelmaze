import type { ReactNode } from 'react'
import './TrueFocus.css'

interface TrueFocusProps {
  children: ReactNode
  className?: string
}

function TrueFocus({ children, className }: TrueFocusProps) {
  return (
    <span className={`true_focus${className ? ` ${className}` : ''}`}>
      <span className="true_focus_content">{children}</span>
      <span className="true_focus_corner true_focus_corner_top_left" aria-hidden="true" />
      <span className="true_focus_corner true_focus_corner_top_right" aria-hidden="true" />
      <span className="true_focus_corner true_focus_corner_bottom_left" aria-hidden="true" />
      <span className="true_focus_corner true_focus_corner_bottom_right" aria-hidden="true" />
    </span>
  )
}

export default TrueFocus
