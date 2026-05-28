import { useEffect, useState, type CSSProperties } from 'react'
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

const getLuminance = (red: number, green: number, blue: number) =>
  0.2126 * red + 0.7152 * green + 0.0722 * blue

const getLogoColorForLuminance = (luminance: number) =>
  luminance > LUMINANCE_THRESHOLD ? DARK_LOGO_COLOR : LIGHT_LOGO_COLOR

const getLuminanceFromColor = (color: string) => {
  const hexMatch = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)

  if (hexMatch) {
    const rawHex = hexMatch[1]
    const hex =
      rawHex.length === 3
        ? rawHex
            .split('')
            .map((part) => part + part)
            .join('')
        : rawHex

    return getLuminance(
      Number.parseInt(hex.slice(0, 2), 16),
      Number.parseInt(hex.slice(2, 4), 16),
      Number.parseInt(hex.slice(4, 6), 16),
    )
  }

  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i)

  if (!rgbMatch) return null

  return getLuminance(
    Number.parseInt(rgbMatch[1], 10),
    Number.parseInt(rgbMatch[2], 10),
    Number.parseInt(rgbMatch[3], 10),
  )
}

const getLuminanceFromImage = (src: string) =>
  new Promise<number>((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      const canvas = document.createElement('canvas')
      const size = 32
      const context = canvas.getContext('2d', { willReadFrequently: true })

      if (!context) {
        reject(new Error('Canvas context unavailable'))
        return
      }

      canvas.width = size
      canvas.height = size
      context.drawImage(image, 0, 0, size, size)

      const { data } = context.getImageData(0, 0, size, size)
      let red = 0
      let green = 0
      let blue = 0
      let count = 0
      const sampleStartX = Math.floor(size * 0.62)
      const sampleEndX = size
      const sampleStartY = 0
      const sampleEndY = Math.ceil(size * 0.34)

      for (let y = sampleStartY; y < sampleEndY; y += 1) {
        for (let x = sampleStartX; x < sampleEndX; x += 1) {
          const index = (y * size + x) * 4
          red += data[index]
          green += data[index + 1]
          blue += data[index + 2]
          count += 1
        }
      }

      resolve(getLuminance(red / count, green / count, blue / count))
    }

    image.onerror = () => reject(new Error('Image load failed'))
    image.src = src
  })

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
