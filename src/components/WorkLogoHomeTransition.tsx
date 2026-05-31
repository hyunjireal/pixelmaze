import { useEffect, useRef, useState, type ReactNode } from 'react'
import './WorkLogoHomeTransition.css'

interface WorkLogoHomeTransitionProps {
  children: ReactNode
  onComplete: () => void
}

const TRANSITION_DURATION_MS = 680

function WorkLogoHomeTransition({ children, onComplete }: WorkLogoHomeTransitionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    let firstFrame = 0
    let secondFrame = 0

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => setIsOpen(true))
    })

    const completeTimer = window.setTimeout(() => {
      onCompleteRef.current()
    }, TRANSITION_DURATION_MS - 60)

    return () => {
      window.cancelAnimationFrame(firstFrame)
      window.cancelAnimationFrame(secondFrame)
      window.clearTimeout(completeTimer)
    }
  }, [])

  return (
    <div
      className={`work_logo_home_transition${
        isOpen ? ' work_logo_home_transition_open' : ''
      }`}
      aria-hidden="true"
    >
      {children}
    </div>
  )
}

export default WorkLogoHomeTransition
