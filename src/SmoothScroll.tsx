import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'

type SmoothScrollProps = {
  children: ReactNode
}

function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    })

    let animationFrame = 0

    const scrollFrame = (time: number) => {
      lenis.raf(time)
      animationFrame = requestAnimationFrame(scrollFrame)
    }

    animationFrame = requestAnimationFrame(scrollFrame)

    return () => {
      cancelAnimationFrame(animationFrame)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}

export default SmoothScroll
