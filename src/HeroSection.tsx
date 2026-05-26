import './HeroSection.css'
import heroMaze from './assets/icons/hero_maze.svg'
import heroMazeConnect from './assets/icons/hero_maze_connect.svg'
import heroMazeDot from './assets/icons/hero_maze_dot.svg'
import heroMazeOut from './assets/icons/hero_maze_out.svg'

function HeroSection() {
  return (
    <main className="portfolio-page">
      <section className="portfolio-hero" aria-labelledby="hero-title">
        <div className="hero-stage">
          <img className="hero-maze-out" src={heroMazeOut} alt="" aria-hidden="true" />

          <h1 className="hero-title" id="hero-title" aria-label="Finding my way">
            <span className="hero-title-finding">Finding</span>
            <span className="hero-title-my">my</span>
            <span className="hero-title-way">way</span>
          </h1>

          <div className="hero-maze-core" aria-hidden="true">
            <img className="hero-maze-connect" src={heroMazeConnect} alt="" />
            <img className="hero-maze-line" src={heroMaze} alt="" />
            <img className="hero-maze-dot" src={heroMazeDot} alt="" />
          </div>

          <a className="hero-note hero-note-profile" href="#about">
            대충 내 프로필로 이동
          </a>
          <a className="hero-note hero-note-work" href="#work">
            내 포트폴리오로 이동
          </a>
          <a className="hero-note hero-note-about" href="#about">
            나를 소개하는 곳, 내가 좋아하는거?
          </a>
          <a className="hero-note hero-note-contact" href="#contact">
            컨택트 미
          </a>
        </div>
      </section>
    </main>
  )
}

export default HeroSection
