import { useEffect, useState, type CSSProperties } from 'react'
import { getLuminanceFromColor, getLuminanceFromImage } from '../utils/backgroundLuminance'
import HomeLogoLink from './HomeLogoLink'
import './WorkDetailPanel.css'

interface WorkDetailPanelProps {
  ariaLabel: string
  backgroundColor?: string
  backgroundImage?: string
  className?: string
  homeLogoColorOverride?: string
  mockupAlt?: string
  mockupImage?: string
  onHomeClick: () => void
  projectName?: string
}

const LIGHT_LOGO_COLOR = '#BDBAB6'
const DARK_LOGO_COLOR = '#5F3336'
const LUMINANCE_THRESHOLD = 150

const getLogoColorForLuminance = (luminance: number) =>
  luminance > LUMINANCE_THRESHOLD ? DARK_LOGO_COLOR : LIGHT_LOGO_COLOR

function WorkDetailPanel({
  ariaLabel,
  backgroundColor = '#242424',
  backgroundImage,
  className,
  homeLogoColorOverride,
  mockupAlt,
  mockupImage,
  onHomeClick,
  projectName,
}: WorkDetailPanelProps) {
  const [homeLogoColor, setHomeLogoColor] = useState(LIGHT_LOGO_COLOR)
  const panelStyle = {
    '--work-detail-bg': backgroundImage
      ? `url(${backgroundImage}) center / cover no-repeat`
      : backgroundColor,
  } as CSSProperties & { '--work-detail-bg': string }

  useEffect(() => {
    let isCurrent = true

    if (homeLogoColorOverride) {
      setHomeLogoColor(homeLogoColorOverride)
      return () => {
        isCurrent = false
      }
    }

    if (backgroundImage) {
      getLuminanceFromImage(backgroundImage)
        .then((luminance) => {
          if (isCurrent) setHomeLogoColor(getLogoColorForLuminance(luminance))
        })
        .catch(() => {
          if (isCurrent) setHomeLogoColor(LIGHT_LOGO_COLOR)
        })

      return () => {
        isCurrent = false
      }
    }

    const colorLuminance = getLuminanceFromColor(backgroundColor)
    setHomeLogoColor(
      colorLuminance === null ? LIGHT_LOGO_COLOR : getLogoColorForLuminance(colorLuminance),
    )

    return () => {
      isCurrent = false
    }
  }, [backgroundColor, backgroundImage, homeLogoColorOverride])

  return (
    <section
      className={`work_detail_panel${className ? ` ${className}` : ''}`}
      style={panelStyle}
      aria-label={ariaLabel}
    >
      <HomeLogoLink color={homeLogoColor} onClick={onHomeClick} position="topRight" />
      <div className="work_detail_panel_inner">
        {mockupImage ? (
          <div className="work_detail_artboard">
            <img className="work_detail_mockup" src={mockupImage} alt={mockupAlt ?? ''} />
          </div>
        ) : projectName ? (
          <p className="work_detail_placeholder_name">{projectName}</p>
        ) : null}
      </div>
    </section>
  )
}

export default WorkDetailPanel
