import { useEffect, useRef, useState } from 'react'
import type { RouteKey } from '../pages/home/homeTypes'
import './MainTabClickTransition.css'

export type MainTabClickTransitionState = 'idle' | 'route-exiting' | 'maze-erasing'

export const mainTabClickTransitionTiming = {
  mazeEraseStartMs: 1700,
  pageOpenMs: 4100,
} as const

interface MainTabClickTransitionProps {
  activeRoute: RouteKey | null
  state?: MainTabClickTransitionState
}

interface UseMainTabClickTransitionOptions {
  onClearHover?: () => void
  onOpenRoute: (route: RouteKey) => void
  onResetPages?: () => void
}

export function MainTabClickTransition({
  activeRoute,
  state = 'idle',
}: MainTabClickTransitionProps) {
  return (
    <div
      className={`main_tab_click_transition main_tab_click_transition_${state}`}
      data-route={activeRoute ?? 'idle'}
      data-state={state}
      aria-hidden="true"
    />
  )
}

export function useMainTabClickTransition({
  onClearHover,
  onOpenRoute,
  onResetPages,
}: UseMainTabClickTransitionOptions) {
  const [activeRoute, setActiveRoute] = useState<RouteKey | null>(null)
  const [state, setState] = useState<MainTabClickTransitionState>('idle')
  const mazeTimerRef = useRef<number | null>(null)
  const pageTimerRef = useRef<number | null>(null)

  const clearTimers = () => {
    if (mazeTimerRef.current) {
      window.clearTimeout(mazeTimerRef.current)
      mazeTimerRef.current = null
    }

    if (pageTimerRef.current) {
      window.clearTimeout(pageTimerRef.current)
      pageTimerRef.current = null
    }
  }

  useEffect(() => clearTimers, [])

  const resetTransition = () => {
    clearTimers()
    setActiveRoute(null)
    setState('idle')
  }

  const startTransition = (route: RouteKey) => {
    clearTimers()
    onResetPages?.()
    onClearHover?.()
    setActiveRoute(route)
    setState('route-exiting')

    mazeTimerRef.current = window.setTimeout(() => {
      setState('maze-erasing')
      mazeTimerRef.current = null
    }, mainTabClickTransitionTiming.mazeEraseStartMs)

    pageTimerRef.current = window.setTimeout(() => {
      onOpenRoute(route)
      setState('idle')
      pageTimerRef.current = null
    }, mainTabClickTransitionTiming.pageOpenMs)
  }

  const transitionClassName = [
    state !== 'idle' ? 'main_tab_click_route_exiting' : '',
    state === 'maze-erasing' ? 'main_tab_click_maze_erasing' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return {
    activeRoute,
    clearTimers,
    resetTransition,
    startTransition,
    state,
    transitionClassName,
  }
}

export default MainTabClickTransition
