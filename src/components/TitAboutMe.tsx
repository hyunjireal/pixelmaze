import '../style/global.css'

interface TitAboutMeProps {
  exbold: string
  italic: string
  className?: string
}

export default function TitAboutMe({ exbold, italic, className }: TitAboutMeProps) {
  return (
    <span className={className}>
      <span className="tit_exbold_32">{exbold}</span>
      <span className="tit_italic_32"> {italic}</span>
    </span>
  )
}
