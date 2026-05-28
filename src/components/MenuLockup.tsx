import './MenuLockup.css'

interface MenuLockupProps {
  backdrop: string
  script: string
}

function MenuLockup({ backdrop, script }: MenuLockupProps) {
  return (
    <span className="menu_lockup">
      <span className="menu_lockup_backdrop">{backdrop}</span>
      <span className="menu_lockup_script">{script}</span>
    </span>
  )
}

export default MenuLockup
