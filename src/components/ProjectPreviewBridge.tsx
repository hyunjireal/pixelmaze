import gunitFavicon from '../assets/images/gunti_favicon.png'
import gunitBackground from '../assets/images/work_gunit_lbg.png'
import simmonsFavicon from '../assets/images/simmons_favicon.png'
import './ProjectPreviewBridge.css'

interface ProjectPreviewBridgeProps {
  isActive: boolean
}

const bridgeDots = [
  {
    className: 'project_preview_bridge_dot_simmons',
    image: simmonsFavicon,
    label: 'Simmons project preview',
  },
  {
    className: 'project_preview_bridge_dot_gunit',
    image: gunitFavicon,
    label: 'G-UNIT project preview',
  },
  {
    className: 'project_preview_bridge_dot_stanley',
    label: 'Stanley project preview',
  },
  {
    className: 'project_preview_bridge_dot_camping',
    label: 'Camping Camfit project preview',
  },
]

function ProjectPreviewBridge({ isActive }: ProjectPreviewBridgeProps) {
  if (!isActive) return null

  return (
    <div className="project_preview_bridge" aria-hidden="true">
      <div className="project_preview_bridge_scrim" />
      <div
        className="project_preview_bridge_reveal"
        style={{ backgroundImage: `url(${gunitBackground})` }}
      />
      <div className="project_preview_bridge_cluster">
        {bridgeDots.map((dot) => (
          <span
            className={`project_preview_bridge_dot ${dot.className}`}
            key={dot.className}
            role="img"
            aria-label={dot.label}
          >
            {dot.image ? <img src={dot.image} alt="" /> : null}
          </span>
        ))}
      </div>
      <div className="project_preview_bridge_detail_hint" />
    </div>
  )
}

export default ProjectPreviewBridge
