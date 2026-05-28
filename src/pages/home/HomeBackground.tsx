import './HomeBackground.css'

const panels = [
  'home_background_panel_tl',
  'home_background_panel_top',
  'home_background_panel_tr',
  'home_background_panel_left',
  'home_background_panel_bottom_left',
  'home_background_panel_bottom',
  'home_background_panel_right',
  'home_background_panel_br',
]

const lines = [
  'home_background_line_v1',
  'home_background_line_v2',
  'home_background_line_v3',
  'home_background_line_h1',
  'home_background_line_h2',
  'home_background_line_h3',
  'home_background_line_diag',
]

const dotFields = [
  'home_background_dots_lt',
  'home_background_dots_rt',
  'home_background_dots_mid',
  'home_background_dots_rb',
]

function HomeBackground() {
  return (
    <div className="home_background" aria-hidden="true">
      <div className="home_background_wash" />
      <div className="home_background_grid" />
      {panels.map((panel) => (
        <span className={`home_background_panel ${panel}`} key={panel} />
      ))}
      {lines.map((line) => (
        <span className={`home_background_line ${line}`} key={line} />
      ))}
      {dotFields.map((field) => (
        <span className={`home_background_dots ${field}`} key={field} />
      ))}
      <span className="home_background_circle home_background_circle_left" />
      <span className="home_background_circle home_background_circle_right" />
      <span className="home_background_chip home_background_chip_left" />
      <span className="home_background_chip home_background_chip_right" />
      <span className="home_background_rule home_background_rule_bottom" />
      <span className="home_background_rule home_background_rule_lower" />
      <div className="home_background_grain" />
    </div>
  )
}

export default HomeBackground
