import type { CSSProperties, ReactNode } from 'react'
import './WorkShowcase.css'

type HighlightText = {
  strong: string
  text: string
}

interface WorkShowcaseProps {
  ariaLabel: string
  backgroundColor?: string
  backgroundImage?: string
  captionItems?: [string, string, string]
  className?: string
  copyLines?: HighlightText[]
  frameImageAlt?: string
  frameImageSrc?: string
  frameTextureSrc?: string
  logoAriaLabel?: string
  logoColor?: string
  logoSvg?: string
  metaEnd?: string
  metaLabel?: string
  projectName?: string
  tagline?: ReactNode
}

function WorkShowcase({
  ariaLabel,
  backgroundColor = '#151515',
  backgroundImage,
  captionItems,
  className,
  copyLines = [],
  frameImageAlt,
  frameImageSrc,
  frameTextureSrc,
  logoAriaLabel,
  logoColor = 'rgba(255, 255, 255, 0.84)',
  logoSvg,
  metaEnd = '',
  metaLabel = '',
  projectName,
  tagline,
}: WorkShowcaseProps) {
  const showcaseStyle = {
    '--work-showcase-bg': backgroundImage
      ? `url(${backgroundImage}) center / cover no-repeat`
      : backgroundColor,
    '--work-showcase-logo-color': logoColor,
    '--work-showcase-frame-texture': frameTextureSrc ? `url(${frameTextureSrc})` : 'none',
  } as CSSProperties & {
    '--work-showcase-bg': string
    '--work-showcase-logo-color': string
    '--work-showcase-frame-texture': string
  }

  return (
    <section
      className={`work_showcase${className ? ` ${className}` : ''}`}
      style={showcaseStyle}
      aria-label={ariaLabel}
    >
      <div className="work_showcase_inner">
        <div className="work_showcase_meta" aria-hidden="true">
          <span>{metaLabel}</span>
          <span>{metaEnd}</span>
        </div>
        <div
          className={`work_showcase_frame${frameImageSrc ? '' : ' work_showcase_frame_placeholder'}${
            frameTextureSrc ? ' work_showcase_frame_textured' : ''
          }`}
        >
          {frameImageSrc ? (
            <img src={frameImageSrc} alt={frameImageAlt ?? ''} />
          ) : (
            <span>{projectName}</span>
          )}
        </div>
        <p className="work_showcase_copy">
          {copyLines.map((line) => (
            <span key={`${line.strong}${line.text}`}>
              <strong>{line.strong}</strong>
              {line.text}
            </span>
          ))}
        </p>
        {logoSvg ? (
          <span
            className="work_showcase_logo"
            role="img"
            aria-label={logoAriaLabel}
            dangerouslySetInnerHTML={{ __html: logoSvg }}
          />
        ) : (
          <span className="work_showcase_logo work_showcase_name_logo">{projectName}</span>
        )}
        {tagline ? <p className="work_showcase_tagline">{tagline}</p> : null}
        {captionItems ? (
          <p className="work_showcase_caption">
            {captionItems.map((item, index) => (
              <span className="work_showcase_caption_item" key={item}>
                {index > 0 ? <i aria-hidden="true" /> : null}
                {item}
              </span>
            ))}
          </p>
        ) : null}
      </div>
    </section>
  )
}

export default WorkShowcase
