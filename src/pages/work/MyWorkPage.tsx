import { useEffect, useRef, useState, type RefObject, type WheelEvent } from 'react'
import IndicatorBar from '../../components/IndicatorBar'
import WorkDetailPanel from '../../components/WorkDetailPanel'
import WorkShowcase from '../../components/WorkShowcase'
import { getLuminanceFromColor, getLuminanceFromImage } from '../../utils/backgroundLuminance'
import gunitLogo from '../../assets/icons/work_gunit_logo.svg?raw'
import simmonsLogo from '../../assets/icons/work_simmons_logo.svg?raw'
import gunitBackground from '../../assets/images/work_gunit_lbg.png'
import gunitDetailBackground from '../../assets/images/work_gunit_rbg.png'
import gunitMockup from '../../assets/images/work_gunit_mokup.png'
import gunitFrame from '../../assets/images/work_gunit_frame.png'
import gunitShowcase01 from '../../assets/images/work_gunit_showcase01.png'
import simmonsBackground from '../../assets/images/work_simmons_lbg.png'
import simmonsDetailBackground from '../../assets/images/work_simmons_rbg.png'
import simmonsFrame from '../../assets/images/work_simmons_frame.png'
import simmonsShowcase01 from '../../assets/images/work_simmons_showcase01.png'
import './MyWorkPage.css'

interface MyWorkPageProps {
  isOpen: boolean
  pageRef: RefObject<HTMLElement | null>
  onHomeClick: () => void
}

const workImageUrls = [
  gunitBackground,
  gunitDetailBackground,
  gunitFrame,
  gunitMockup,
  gunitShowcase01,
  simmonsBackground,
  simmonsDetailBackground,
  simmonsFrame,
  simmonsShowcase01,
]

const LIGHT_INDICATOR_COLOR = '#E4FB2E'
const DARK_INDICATOR_COLOR = '#5F3336'
const LUMINANCE_THRESHOLD = 150

const getIndicatorColorForLuminance = (luminance: number) =>
  luminance > LUMINANCE_THRESHOLD ? DARK_INDICATOR_COLOR : LIGHT_INDICATOR_COLOR

const works = [
  {
    id: 'gunit',
    detail: {
      ariaLabel: 'G-UNIT project detail',
      backgroundImage: gunitDetailBackground,
      mockupAlt: 'G-UNIT mobile app mockup',
      mockupImage: gunitMockup,
    },
    showcase: {
      ariaLabel: 'G-UNIT project overview',
      backgroundImage: gunitBackground,
      captionItems: ['Team Project', 'AI 챗봇 팬덤 커뮤니티', '2026'] as [string, string, string],
      copyLines: [
        { strong: '에어소프트 입문', text: '부터' },
        { strong: '커뮤니티, 팀매칭, 장비관리', text: '까지' },
      ],
      ctaLinks: [
        { label: 'Landing Page', href: '#work' },
        { label: 'Live Site', href: '#work' },
      ],
      frameImageAlt: 'G-UNIT app showcase',
      frameImageSrc: gunitShowcase01,
      frameTextureSrc: gunitFrame,
      logoAriaLabel: 'G-UNIT',
      logoColor: 'rgba(255, 255, 255, 0.84)',
      logoSvg: gunitLogo,
      metaEnd: '2026',
      metaLabel: 'AI MOBILE APP',
    },
  },
  {
    id: 'simmons',
    detail: {
      ariaLabel: 'Simmons project detail',
      backgroundImage: simmonsDetailBackground,
      homeLogoColorOverride: '#5F3336',
    },
    showcase: {
      ariaLabel: 'Simmons project overview',
      backgroundImage: simmonsBackground,
      captionItems: ['Team Project', 'K-Brand Contents', '2026'] as [string, string, string],
      copyLines: [
        { strong: '좋은 잠', text: '이라는' },
        { strong: '라이프 스타일 가치', text: '를 전달합니다.' },
      ],
      ctaLinks: [
        { label: 'Landing Page', href: '#work' },
        { label: 'Live Site', href: '#work' },
      ],
      frameImageAlt: 'Simmons renewal showcase',
      frameImageSrc: simmonsShowcase01,
      frameTextureSrc: simmonsFrame,
      logoAriaLabel: 'Simmons',
      logoColor: '#5F3336',
      logoSvg: simmonsLogo,
      metaEnd: '2026',
      metaLabel: 'WEB RENEWAL',
    },
  },
  {
    id: 'stanley',
    detail: {
      ariaLabel: 'Stanley project detail',
      backgroundColor: '#2F493F',
      projectName: 'STANLEY',
    },
    showcase: {
      ariaLabel: 'Stanley project overview',
      backgroundColor: '#B7A16B',
      metaEnd: '2026',
      metaLabel: 'COMING SOON',
      projectName: 'STANLEY',
    },
  },
  {
    id: 'camping-camfit',
    detail: {
      ariaLabel: 'Camping Camfit project detail',
      backgroundColor: '#D8D5C6',
      projectName: 'CAMPING CAMFIT',
    },
    showcase: {
      ariaLabel: 'Camping Camfit project overview',
      backgroundColor: '#6E7664',
      metaEnd: '2026',
      metaLabel: 'COMING SOON',
      projectName: 'CAMPING CAMFIT',
    },
  },
]

function MyWorkPage({ isOpen, pageRef, onHomeClick }: MyWorkPageProps) {
  const [activeWorkIndex, setActiveWorkIndex] = useState(0)
  const [indicatorColor, setIndicatorColor] = useState(LIGHT_INDICATOR_COLOR)
  const [previousWorkIndex, setPreviousWorkIndex] = useState<number | null>(null)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const preloadedImagesRef = useRef<HTMLImageElement[]>([])
  const wheelLockRef = useRef(false)

  useEffect(() => {
    if (!isOpen || preloadedImagesRef.current.length > 0) return

    preloadedImagesRef.current = workImageUrls.map((url) => {
      const image = new Image()
      image.decoding = 'async'
      image.src = url
      image.decode?.().catch(() => undefined)
      return image
    })
  }, [isOpen])

  useEffect(() => {
    let isCurrent = true
    const activeShowcase = works[activeWorkIndex]?.showcase
    const backgroundImage =
      activeShowcase && 'backgroundImage' in activeShowcase
        ? activeShowcase.backgroundImage
        : undefined
    const backgroundColor =
      activeShowcase && 'backgroundColor' in activeShowcase
        ? activeShowcase.backgroundColor
        : undefined

    if (backgroundImage) {
      getLuminanceFromImage(backgroundImage, 'leftCenter')
        .then((luminance) => {
          if (isCurrent) setIndicatorColor(getIndicatorColorForLuminance(luminance))
        })
        .catch(() => {
          if (isCurrent) setIndicatorColor(LIGHT_INDICATOR_COLOR)
        })

      return () => {
        isCurrent = false
      }
    }

    if (backgroundColor) {
      const colorLuminance = getLuminanceFromColor(backgroundColor)
      setIndicatorColor(
        colorLuminance === null
          ? LIGHT_INDICATOR_COLOR
          : getIndicatorColorForLuminance(colorLuminance),
      )
    } else {
      setIndicatorColor(LIGHT_INDICATOR_COLOR)
    }

    return () => {
      isCurrent = false
    }
  }, [activeWorkIndex])

  const getPanelState = (index: number) => {
    if (index === activeWorkIndex) return 'active'
    if (index === previousWorkIndex) {
      return direction === 'next' ? 'before' : 'after'
    }
    return direction === 'next' ? 'after' : 'before'
  }

  const handleWheel = (event: WheelEvent<HTMLElement>) => {
    if (!isOpen || wheelLockRef.current || Math.abs(event.deltaY) < 24) return

    const nextDirection = event.deltaY > 0 ? 'next' : 'prev'
    const nextIndex =
      nextDirection === 'next'
        ? (activeWorkIndex + 1) % works.length
        : (activeWorkIndex - 1 + works.length) % works.length

    wheelLockRef.current = true
    setDirection(nextDirection)
    setPreviousWorkIndex(activeWorkIndex)
    setActiveWorkIndex(nextIndex)

    window.setTimeout(() => {
      wheelLockRef.current = false
    }, 900)
  }

  return (
    <section
      ref={pageRef}
      className="work_page"
      aria-hidden={!isOpen}
      data-lenis-prevent
      tabIndex={-1}
      onWheel={handleWheel}
    >
      <div className={`work_split work_mask_${direction}`} id="work">
        <div className="work_mask_viewport work_mask_viewport_left">
          {works.map((work, index) => (
            <WorkShowcase
              key={`${work.id}-showcase`}
              {...work.showcase}
              className={`work_mask_panel work_mask_panel_${getPanelState(index)}`}
            />
          ))}
        </div>
        <div className="work_mask_viewport work_mask_viewport_right">
          {works.map((work, index) => (
            <WorkDetailPanel
              key={`${work.id}-detail`}
              {...work.detail}
              onHomeClick={onHomeClick}
              className={`work_mask_panel work_mask_panel_${getPanelState(index)}`}
            />
          ))}
        </div>
        <IndicatorBar
          activeIndex={activeWorkIndex}
          className="work_indicator_bar"
          color={indicatorColor}
          total={works.length}
        />
      </div>
    </section>
  )
}

export default MyWorkPage
