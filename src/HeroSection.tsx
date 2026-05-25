import './HeroSection.css'
import heroMaze from './assets/icons/hero_maze.svg'
import heroMazeConnect from './assets/icons/hero_maze_connect.svg'
import heroMazeDot from './assets/icons/hero_maze_dot.svg'
import heroMazeOut from './assets/icons/hero_maze_out.svg'

const navItems = ['WORK', 'ABOUT', 'LAB', 'NOTES']

function HeroSection() {
  return (
    <main className="portfolio-page">
      <section className="portfolio-hero" aria-labelledby="hero-title">
        <header className="hero-header" aria-label="Primary">
          <a className="hero-brand" href="/" aria-label="Antonio Segurado home">
            ANTONIO
            <span>SEGURADO</span>
          </a>

          <nav className="hero-nav" aria-label="Portfolio navigation">
            {navItems.map((item) => (
              <a href={`#${item.toLowerCase()}`} key={item}>
                {item}
              </a>
            ))}
            <button className="menu-button" type="button" aria-label="Open menu">
              <span />
              <span />
              <span />
            </button>
          </nav>
        </header>

        <div className="hero-stage">
          <img
            className="hero-maze-out hero-maze-out-final"
            src={heroMazeOut}
            alt=""
            aria-hidden="true"
          />
          <img
            className="hero-maze-out hero-maze-out-left"
            src={heroMazeOut}
            alt=""
            aria-hidden="true"
          />
          <img
            className="hero-maze-out hero-maze-out-right"
            src={heroMazeOut}
            alt=""
            aria-hidden="true"
          />

          <div className="hero-maze-core" aria-hidden="true">
            <img className="hero-maze-connect" src={heroMazeConnect} alt="" />
            <img className="hero-maze-line hero-maze-line-base" src={heroMaze} alt="" />
            <img className="hero-maze-line hero-maze-line-a" src={heroMaze} alt="" />
            <img className="hero-maze-line hero-maze-line-b" src={heroMaze} alt="" />
            <img className="hero-maze-line hero-maze-line-c" src={heroMaze} alt="" />
            <img className="hero-maze-dot" src={heroMazeDot} alt="" />
          </div>

          <div className="hero-centerpiece">
            <h1 className="hero-title" id="hero-title" aria-label="Find your way in">
              <span data-text="FIND">FIND</span>
              <span data-text="YOUR">YOUR</span>
              <span data-text="WAY IN">WAY IN</span>
            </h1>
          </div>

          <aside className="hero-aside" aria-label="Portfolio introduction">
            <p>
              길을 잃지 않게 설계하면서도
              <br />
              작은 재미를 남기는
              <br />
              디자이너의 포트폴리오.
            </p>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default HeroSection
