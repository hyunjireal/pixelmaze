import type { CSSProperties } from 'react'
import './WorkDetailPanel.css'

interface WorkDetailPanelProps {
  ariaLabel: string
  backgroundColor?: string
  backgroundImage?: string
  className?: string
  mockupAlt?: string
  mockupImage?: string
  projectName?: string
}

function WorkDetailPanel({
  ariaLabel,
  backgroundColor = '#242424',
  backgroundImage,
  className,
  mockupAlt,
  mockupImage,
  projectName,
}: WorkDetailPanelProps) {
  const panelStyle = {
    '--work-detail-bg': backgroundImage
      ? `url(${backgroundImage}) center / cover no-repeat`
      : backgroundColor,
  } as CSSProperties & { '--work-detail-bg': string }

  return (
    <section
      className={`work_detail_panel${className ? ` ${className}` : ''}`}
      style={panelStyle}
      aria-label={ariaLabel}
    >
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
