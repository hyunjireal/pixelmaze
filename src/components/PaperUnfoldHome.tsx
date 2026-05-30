import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * PaperUnfoldHome — A안 구현
 *
 * 원본 컴포넌트 구조 그대로 유지.
 * 왼쪽·오른쪽 절반 슬롯에 HomeSection을 CSS 클리핑으로 나눠 넣음.
 *
 * ┌─────────────────────────────────────────┐
 * │  왼쪽 절반 (fold panel)  │  오른쪽 절반  │
 * │  rotateY(178°→0°)        │  항상 보임    │
 * │  접힘 → 펼쳐짐           │               │
 * └─────────────────────────────────────────┘
 *                 ↑ 중앙 fold 선 기준으로 회전
 *
 * 각 절반은 overflow:hidden + width:200% 로
 * HomeSection의 해당 부분만 보이게 클리핑.
 */

interface PaperUnfoldHomeProps {
  /** 왼쪽 절반에 들어갈 홈 콘텐츠 */
  leftContent: ReactNode
  /** 오른쪽 절반에 들어갈 홈 콘텐츠 */
  rightContent: ReactNode
  onComplete: () => void
}

// ── 종이 본체 진입 애니메이션 ──
const PAPER_ENTER_DURATION = '1.1s'
const PAPER_ENTER_EASING   = 'cubic-bezier(.34, 1.1, .5, 1)'
const PAPER_CLOSED = 'scale(.48) rotateX(-55deg) rotateZ(-5deg)'
const PAPER_OPEN   = 'scale(1)   rotateX(0deg)  rotateZ(0deg)'

// ── 왼쪽 절반 fold 애니메이션 ──
const FOLD_DURATION = '1.05s'
const FOLD_EASING   = 'cubic-bezier(.34, 1.05, .5, 1)'
const FOLD_CLOSED = 'rotateY(178deg)' // 접힌 상태: 얇은 슬라이버(중앙 fold 선)만 보임
const FOLD_OPEN   = 'rotateY(0deg)'   // 펼친 상태: 왼쪽 절반 전체 노출

// ── 타이밍 (ms) ──
const ENTER_FRAME_MS  = 20
const UNFOLD_DELAY_MS = 600  // 종이가 어느 정도 들어온 뒤 왼쪽 절반 펼침 시작
const FOLD_ANIM_MS    = 1050
// fold 애니메이션이 끝나기 전에 홈을 미리 올려서 공백 없이 연결
const COMPLETE_EARLY  = 200

export default function PaperUnfoldHome({
  leftContent,
  rightContent,
  onComplete,
}: PaperUnfoldHomeProps) {
  const [entered,  setEntered]  = useState(false)
  const [unfolded, setUnfolded] = useState(false)
  const timers       = useRef<number[]>([])
  const onCompleteRef = useRef(onComplete)

  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])

  useEffect(() => {
    const t1 = window.setTimeout(() => setEntered(true),  ENTER_FRAME_MS)
    const t2 = window.setTimeout(() => setUnfolded(true), ENTER_FRAME_MS + UNFOLD_DELAY_MS)
    const t3 = window.setTimeout(
      () => onCompleteRef.current(),
      ENTER_FRAME_MS + UNFOLD_DELAY_MS + FOLD_ANIM_MS - COMPLETE_EARLY,
    )
    timers.current = [t1, t2, t3]
    return () => timers.current.forEach(clearTimeout)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        perspective: 1800,
        perspectiveOrigin: '88% 8%',
        pointerEvents: 'none',
      }}
    >
      {/* ════ 종이 본체: 오른쪽 상단 모서리 기준으로 기울어져 들어옴 ════ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: '100% 0%',
          transformStyle: 'preserve-3d',
          opacity: entered ? 1 : 0,
          transform: entered ? PAPER_OPEN : PAPER_CLOSED,
          transition: `transform ${PAPER_ENTER_DURATION} ${PAPER_ENTER_EASING},
                       opacity .4s ease`,
        }}
      >

        {/* ── 오른쪽 절반: 종이가 들어오는 순간부터 항상 보임 ── */}
        <div
          style={{
            position: 'absolute',
            top: 0, bottom: 0,
            left: '50%', right: 0,
            overflow: 'hidden',
            background: 'var(--bg-main, #F3F2F2)',
          }}
        >
          {/*
            HomeSection을 전체 너비(200% = 100vw)로 렌더하되
            right:0 정렬 → 오른쪽 절반만 클리핑되어 보임
          */}
          <div
            style={{
              position: 'absolute',
              top: 0, bottom: 0, right: 0,
              width: '200%',
            }}
          >
            {rightContent}
          </div>
        </div>

        {/* ── 왼쪽 절반: 178° 접힌 상태 → 0° 펼친 상태 ── */}
        <div
          style={{
            position: 'absolute',
            top: 0, bottom: 0,
            left: 0, right: '50%',
            /*
              fold 축 = 오른쪽 edge (중앙 fold 선)
              178°: 종이 뒷면이 얇은 슬라이버로 보임
              0°  : 왼쪽 절반 콘텐츠 전체 노출
            */
            transformOrigin: '100% 50%',
            transform: unfolded ? FOLD_OPEN : FOLD_CLOSED,
            transition: `transform ${FOLD_DURATION} ${FOLD_EASING},
                         box-shadow .9s ease`,
            /* 178° 일 때 보이는 종이 뒷면 색 */
            background: 'linear-gradient(to left, #d8d4ce 0%, #e8e4de 40%, #f0ede8 100%)',
            boxShadow: unfolded
              ? 'none'
              : '-6px 0 28px rgba(0,0,0,.28)',
          }}
        >
          {/*
            앞면 콘텐츠: 178° 상태(뒷면이 시청자 방향)일 때 숨김.
            backfaceVisibility:hidden 으로 종이가 접혀 있을 땐 내용 비노출.
          */}
          <div
            style={{
              position: 'absolute', inset: 0,
              overflow: 'hidden',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden' as 'hidden',
              background: 'var(--bg-main, #F3F2F2)',
            }}
          >
            {/*
              HomeSection을 전체 너비(200% = 100vw)로 렌더하되
              left:0 정렬 → 왼쪽 절반만 클리핑되어 보임
            */}
            <div
              style={{
                position: 'absolute',
                top: 0, bottom: 0, left: 0,
                width: '200%',
              }}
            >
              {leftContent}
            </div>
          </div>
        </div>

        {/* ── 중앙 fold 선: 펼쳐지면 사라짐 ── */}
        <div
          style={{
            position: 'absolute',
            top: 0, bottom: 0,
            left: '50%',
            width: 1,
            transform: 'translateX(-0.5px)',
            background: 'rgba(0,0,0,.18)',
            zIndex: 10,
            opacity: unfolded ? 0 : 1,
            transition: 'opacity .5s ease',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  )
}
