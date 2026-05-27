import type { RefObject } from 'react'
import PageHeader from '../../components/PageHeader'
import profileImage from '../../assets/images/me_profile01.png'
import profileImage02 from '../../assets/images/me_profile02.png'
import './AboutPage.css'

interface AboutPageProps {
  isOpen: boolean
  pageRef: RefObject<HTMLElement | null>
  onHomeClick: () => void
}

function AboutPage({ isOpen, pageRef, onHomeClick }: AboutPageProps) {
  return (
    <section
      ref={pageRef}
      className="about_page"
      aria-hidden={!isOpen}
      data-lenis-prevent
      tabIndex={-1}
    >
      <PageHeader activePage="about" ariaLabel="About page navigation" onHomeClick={onHomeClick} />

      <header className="about_hero about_reveal">
        <h1>About Me</h1>
        <p>기술로 생각을 연결하고, 사용자 경험을 설계합니다.</p>
      </header>

      <article className="about_section about_intro about_reveal">
        <span className="about_section_number">01</span>
        <div className="about_section_body">
          <div className="about_intro_text">
            <p>사용자와 문제를 깊이 이해하고,</p>
            <p>기술로 해결책을 제시하는 개발자가 되고자 합니다.</p>
            <p>새로운 기술을 배우는 것을 즐기며,</p>
            <p>알아감 통해 더 큰 가치를 만듭니다.</p>
          </div>
          <div className="about_photo_pair" aria-label="Profile photos">
            <img src={profileImage} alt="Jang Hyunji profile 01" />
            <img src={profileImage02} alt="Jang Hyunji profile 02" />
          </div>
        </div>
      </article>

      <article className="about_section about_values about_reveal" id="values">
        <span className="about_section_number">02</span>
        <div className="about_section_body">
          <h2>My Values</h2>
          <ul className="about_value_grid">
            <li>
              <span>R</span>
              <strong>Responsibility</strong>
              <p>맡은 일은 끝까지 책임지고 완성합니다.</p>
            </li>
            <li>
              <span>P</span>
              <strong>Persistence</strong>
              <p>쉽게 포기하지 않고 방법을 찾아갑니다.</p>
            </li>
            <li>
              <span>D</span>
              <strong>Direction</strong>
              <p>과정이 복잡해져도 방향을 잃지 않습니다.</p>
            </li>
            <li>
              <span>O</span>
              <strong>Observation</strong>
              <p>작은 불편함도 그냥 지나치지 않고 살핍니다.</p>
            </li>
          </ul>
        </div>
      </article>

      <article className="about_section about_skills about_reveal">
        <span className="about_section_number">03</span>
        <div className="about_section_body">
          <h2>My Skills</h2>
          <div className="about_skill_columns">
            {[
              ['HTML / CSS', '90%'],
              ['JavaScript', '85%'],
              ['React', '80%'],
              ['TypeScript', '75%'],
              ['Next.js', '70%'],
              ['Figma', '85%'],
            ].map(([name, value]) => (
              <div className="about_skill_bar" key={name}>
                <div>
                  <strong>{name}</strong>
                  <span>{value}</span>
                </div>
                <i style={{ width: value }} />
              </div>
            ))}
          </div>
        </div>
      </article>

      <article className="about_section about_journey about_reveal">
        <span className="about_section_number">04</span>
        <div className="about_section_body">
          <h2>My Journey</h2>
          <ol className="about_timeline">
            <li>
              <strong>2021</strong>
              <p>웹 개발 입문 기초 학습 시작</p>
            </li>
            <li>
              <strong>2022</strong>
              <p>개인 프로젝트 경험 포트폴리오 제작</p>
            </li>
            <li>
              <strong>2023</strong>
              <p>실무 프로젝트 참여 협업 경험 확대</p>
            </li>
            <li>
              <strong>2024 - Now</strong>
              <p>프로덕트에 기여하고 성장 중</p>
            </li>
          </ol>
        </div>
      </article>

      <footer className="about_footer">
        <span>© 2024 M. All rights reserved.</span>
        <span>hello@m-portfolio.dev</span>
      </footer>
    </section>
  )
}

export default AboutPage
