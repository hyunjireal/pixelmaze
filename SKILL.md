# 홈 종이 전환 작업 이력

## 최종 목표

인트로에서 Enter를 눌렀을 때 중앙 미로는 그대로 남기고, 중앙 미로를 제외한 홈 요소들이 종이 한 장처럼 오른쪽 위에서 들어오며 홈으로 전환되게 만든다.

## 현재 채택한 방식

캡처 이미지 방식은 앱 연결에서 제외하고 보관했다. 현재 앱은 실제 `HomeSection` DOM 자체가 종이 레이어처럼 들어오고, 애니메이션이 끝나면 그 DOM이 그대로 최종 홈이 되는 구조다.

## 현재 레이어 구조

- `SharedMaze`
  - 인트로부터 홈까지 유지되는 중앙 미로 담당
  - `home` 단계에서만 장식 요소를 추가로 표시
- `IntroSection`
  - 인트로 콘텐츠와 Enter 버튼 담당
  - Enter 후 `paper-entering` 단계에서 leaving 상태가 된다.
- `HomeSection`
  - 탭 메뉴, 닷, 카드, 기타 홈 UI 담당
  - `paper-entering` 단계에서는 실제 DOM 종이 레이어로 진입한다.
  - `home` 단계에서는 최종 홈 DOM으로 그대로 남는다.

## 캡처 방식 보관

- `capture.md`를 생성했다.
- `capture.md`에는 캡처 이미지 방식의 목적, 관련 파일, 작동 방식, 장점, 한계, 나중에 다시 살리는 방법을 기록했다.
- `src/components/ThreePaperTurnTransition.tsx`와 `src/components/ThreePaperTurnTransition.css`는 삭제하지 않고 보존했다.
- 현재 `App.tsx`에서는 `ThreePaperTurnTransition`, `html-to-image`, 캡처용 `HomeSection` 연결을 사용하지 않는다.

## 앱 구조 변경

- `src/App.tsx`
  - 기존 단계 `intro`, `paper-turning`, `paper-settling`, `home`을 `intro`, `paper-entering`, `home`으로 단순화했다.
  - Enter를 누르면 바로 `paper-entering`으로 전환한다.
  - `paper-entering`에서는 실제 `HomeSection` DOM 하나를 렌더한다.
  - `HomeSection`의 종이 진입 애니메이션이 끝나면 `home`으로 전환한다.
  - 캡처 이미지 준비 로직과 Three.js 전환 연결을 제거했다.

- `src/pages/home/HomeSection.tsx`
  - `paperState` prop을 추가했다.
  - 값은 `entering` 또는 `settled`이다.
  - `paperState="entering"`일 때 `home_page_paper_entering` 클래스를 붙인다.
  - `onPaperEnterComplete` prop을 추가했다.
  - 메인 종이 레이어 애니메이션이 끝나면 `onPaperEnterComplete`를 호출한다.

- `src/pages/home/HomeSection.css`
  - `home_dom_paper_enter` 키프레임을 추가했다.
  - 실제 홈 DOM 레이어가 오른쪽 위에서 대각선으로 들어오며 펼쳐지는 효과를 만든다.
  - `home_dom_paper_surface` 키프레임을 추가했다.
  - 내부 `home_stage`에 살짝 휘고 기울어지는 표면감을 준다.
  - `home_view`의 화면 비율 보정 transform과 충돌하지 않도록 표면 애니메이션은 `home_stage`에만 적용했다.

## 경로 숨김 처리

종이 진입 중에는 중앙에서 뻗어 나오는 경로가 보이지 않도록 다음 계열을 숨겼다.

- `.home_maze_extension_path_base`
- `.home_maze_extension_path_progress`
- `.home_route`
- `.home_project_line`
- `.home_blue_line`
- `.home_route_project_dash`
- `.home_route_project_runner`

이 처리는 `home_page_paper_entering` 상태에만 적용된다.

## 검증 결과

- `npm.cmd run build` 통과.
- 앱 연결에서 캡처/Three.js 전환이 빠지면서 JS 번들이 약 `822 kB`에서 약 `295 kB`로 줄었다.
- 브라우저에서 Enter 전 상태:
  - `app_shell_intro`
  - 홈 DOM 없음
  - 캔버스 없음
- Enter 후 약 `0.1s` 상태:
  - `app_shell_paper-entering`
  - 실제 `HomeSection` DOM 1개 존재
  - `home_page_paper_entering` 적용
  - 캔버스 없음
  - 진입 중 숨겨야 할 경로 표시 개수 `0`
- Enter 후 약 `1.5s` 상태:
  - `app_shell_home`
  - `home_page_paper_settled` 적용
  - 인트로 제거
  - 캔버스 없음

## 다음 조정 후보

- 종이 진입 시작 위치를 더 오른쪽 위 바깥으로 밀기
- 펼쳐지는 clip-path 각도를 더 책장 넘김처럼 조정하기
- 그림자와 회전값을 더 부드럽게 줄이기
- 중앙 미로와 홈 DOM의 z-index 관계를 더 세밀하게 맞추기
- 종이 진입 중 어떤 닷과 탭을 먼저 보이게 할지 정리하기

## 2026-05-29: 종이 진입 모션 부드럽게 조정

사용자 피드백:

- 현재 DOM 종이 레이어 방식은 나쁘지 않다.
- 다만 덮여오는 종이가 조금 뻣뻣하고, 평평한 판처럼 들어오는 느낌이 있다.
- 더 부드럽게 곡선으로 들어오고, 종이 가장자리와 표면이 팔락이는 느낌이 필요하다.

적용한 변경:

- `src/pages/home/HomeSection.css`
  - `home_page_paper_entering`의 perspective를 키우고 전체 애니메이션 시간을 `1.52s`로 늘렸다.
  - `home_dom_paper_enter`의 clip-path 포인트를 더 촘촘하게 나누어, 오른쪽 위 모서리에서 한 번에 판처럼 열리지 않고 굽이치며 열리는 느낌을 만들었다.
  - 중간 키프레임을 추가해 종이가 들어오다 살짝 넘치고 다시 정착하는 움직임을 넣었다.
  - `home_page_paper_entering::before`를 추가해 앞쪽 접힘 하이라이트를 만들었다.
  - `home_page_paper_entering::after`를 추가해 뒤따르는 그림자와 얇은 종이 가장자리 느낌을 만들었다.
  - `home_stage`에는 별도 `home_dom_paper_surface` 애니메이션을 적용해 내부 콘텐츠가 살짝 늦게 따라오며 펴지는 느낌을 만들었다.

검증:

- `npm.cmd run build` 통과.
- 브라우저에서 Enter 후 `app_shell_paper-entering` 단계 진입 확인.
- 진입 중 다음 애니메이션이 적용되는 것을 확인했다.
  - `home_dom_paper_enter`
  - `home_dom_paper_surface`
  - `home_dom_paper_leading_edge`
  - `home_dom_paper_trailing_shadow`
- 진입 중 숨겨야 할 경로 표시 개수는 `0`으로 유지된다.
- 전환 완료 후 `app_shell_home`으로 정상 전환된다.

## 2026-05-29: 말림 정도와 탭메뉴 선 포함 조정

사용자 요청:

- 끝부분에 살짝 넘쳤다가 정착하는 움직임은 제거한다.
- 말려 있다가 펼쳐지는 느낌은 과하지 않게 적당히 추가한다.
- 중앙 미로 깜박임 현상은 추후 따로 확인하고, 지금은 수정하지 않는다.
- 탭메뉴 선도 종이에 포함되어 함께 펼쳐져야 한다.

적용한 변경:

- `src/pages/home/HomeSection.css`
  - `home_dom_paper_enter`의 후반부 반대 방향 보정 키프레임을 제거했다.
  - 후반부 움직임은 음수 방향으로 튕기지 않고 `0`으로 자연스럽게 수렴하도록 조정했다.
  - 초반 `rotateY`, `clip-path`, edge 하이라이트를 아주 조금 강화해 적당히 말려 있다가 펼쳐지는 느낌을 추가했다.
  - `home_dom_paper_surface`의 후반 반대 방향 보정을 줄여 내부 콘텐츠도 튕기지 않게 했다.
  - `home_page_paper_entering` 상태에서 `.home_maze_extension_path_base`, `.home_maze_extension_path_progress`를 더 이상 숨기지 않도록 했다.
  - 컬러 닷 경로 계열인 `.home_route`, `.home_project_line`, `.home_blue_line`, route dash/runner 계열은 계속 숨긴다.

검증:

- `npm.cmd run build` 통과.
- 브라우저에서 Enter 후 `app_shell_paper-entering` 단계 진입 확인.
- 종이 진입 중 탭메뉴 선은 6개 모두 표시되는 것을 확인했다.
- 종이 진입 중 숨겨야 하는 컬러 닷 경로 표시 개수는 `0`으로 유지된다.
- 전환 완료 후 `app_shell_home`으로 정상 전환된다.
- 중앙 미로 깜박임 현상은 이번 작업에서 수정하지 않았다.

## 2026-05-29: 분절돼 보이는 모션 수정 전 상태 백업

사용자 피드백:

- 실제 프레임이 끊기는 것이라기보다, 종이가 자연스럽게 흐르지 않고 몇 번 나뉘어 내려오는 느낌이 있다.
- 수정 전 상태를 기록해두고 되돌릴 수 있게 해달라고 요청했다.

수정 전 원인 판단:

- 본체, 내부 표면, 앞쪽 하이라이트, 뒤쪽 그림자가 서로 다른 키프레임 지점에서 방향을 바꾸고 있었다.
- 그래서 렌더링 프레임 드랍이라기보다, 포즈가 여러 번 바뀌는 듯한 모션 설계 문제가 더 유력했다.

수정 전 주요 키프레임 구조:

- `home_dom_paper_enter`
  - `0%`: `clip-path: polygon(90% 0, 100% 0, 100% 0, 100% 16%, 97% 24%, 93% 19%)`
  - `0%`: `transform: translate3d(39vw, -28vh, 0) rotateX(14deg) rotateY(-31deg) rotateZ(9deg) scale(0.982)`
  - `18%`: `clip-path: polygon(64% 0, 100% 0, 100% 46%, 94% 60%, 80% 46%, 55% 33%)`
  - `18%`: `transform: translate3d(26vw, -18vh, 0) rotateX(10deg) rotateY(-23deg) rotateZ(6.5deg) scale(0.988)`
  - `43%`: `clip-path: polygon(22% 0, 100% 0, 100% 100%, 74% 100%, 50% 78%, 13% 58%)`
  - `43%`: `transform: translate3d(10vw, -7vh, 0) rotateX(6deg) rotateY(-13deg) rotateZ(3.4deg) scale(0.997)`
  - `68%`: `clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%)`
  - `68%`: `transform: translate3d(1.6vw, -1.1vh, 0) rotateX(2.2deg) rotateY(-3.8deg) rotateZ(0.9deg) scale(1)`
  - `88%`: `transform: translate3d(0.35vw, -0.18vh, 0) rotateX(0.55deg) rotateY(-0.8deg) rotateZ(0.18deg) scale(1)`
  - `100%`: `filter: none`
  - `100%`: `transform: translate3d(0, 0, 0) rotateX(0) rotateY(0) rotateZ(0) scale(1)`

- `home_dom_paper_surface`
  - 키프레임 지점: `0%`, `34%`, `72%`, `88%`, `100%`
  - 내부 콘텐츠가 본체와 다른 지점에서 방향을 바꾸고 있었다.

- `home_dom_paper_leading_edge`
  - 키프레임 지점: `0%`, `38%`, `72%`, `100%`
  - 앞쪽 하이라이트가 본체와 다른 박자로 따라오고 있었다.

- `home_dom_paper_trailing_shadow`
  - 키프레임 지점: `0%`, `44%`, `78%`, `100%`
  - 뒤쪽 그림자 역시 본체와 다른 박자로 따라오고 있었다.

되돌리는 방법:

- `src/pages/home/HomeSection.css`에서 위 키프레임 값을 다시 적용하면 이 시점의 모션으로 되돌릴 수 있다.

## 2026-05-29: 분절감 완화를 위한 키프레임 단순화

수정 방향:

- 실제 프레임 드랍보다 모션 포즈가 여러 번 바뀌는 문제가 더 유력하다고 판단했다.
- 전체 `clip-path`는 유지하되, 키프레임 지점을 줄여 종이가 한 흐름으로 내려오게 조정했다.
- 본체, 표면, 앞쪽 하이라이트, 뒤쪽 그림자의 방향 전환 지점을 줄였다.

적용한 변경:

- `home_dom_paper_enter`
  - 기존 `0%`, `18%`, `43%`, `68%`, `88%`, `100%` 구조를 `0%`, `52%`, `82%`, `100%`로 단순화했다.
  - 중간 포즈 수를 줄여 포즈를 갈아타는 느낌을 완화했다.
  - 후반부는 반대 방향 보정 없이 최종 상태로 자연스럽게 수렴한다.

- `home_dom_paper_surface`
  - 기존 `0%`, `34%`, `72%`, `88%`, `100%` 구조를 `0%`, `72%`, `100%`로 단순화했다.
  - 내부 콘텐츠가 본체와 다른 박자로 여러 번 꺾이는 느낌을 줄였다.

- `home_dom_paper_leading_edge`
  - 기존 `0%`, `38%`, `72%`, `100%` 구조를 `0%`, `62%`, `100%`로 단순화했다.

- `home_dom_paper_trailing_shadow`
  - 기존 `0%`, `44%`, `78%`, `100%` 구조를 `0%`, `66%`, `100%`로 단순화했다.

검증:

- `npm.cmd run build` 통과.
- 브라우저에서 Enter 후 `app_shell_paper-entering` 단계 진입 확인.
- 종이 본체, 내부 표면, 앞쪽 하이라이트, 뒤쪽 그림자 애니메이션이 모두 적용되는 것을 확인했다.
- 탭메뉴 선은 종이 진입 중 6개 모두 보인다.
- 숨겨야 하는 컬러 경로 계열 표시 개수는 `0`으로 유지된다.
- 전환 완료 후 `app_shell_home`으로 정상 전환된다.

## 2026-05-29: 중간 멈칫 지점 추가 완화

사용자 피드백:

- 이전보다 많이 좋아졌지만, 중간에 한 번 멈칫하는 느낌이 아직 남아 있다.

원인 판단:

- 본체의 `52%` 키프레임에서 `clip-path`와 `transform` 변화량이 아직 크게 느껴질 수 있었다.
- 보조 edge/shadow 레이어가 `62~66%` 근처에서 빠르게 사라지며 본체 움직임과 겹쳐 중간 멈칫처럼 보일 수 있었다.

적용한 변경:

- `home_page_paper_entering`
  - 애니메이션 시간을 `1.52s`에서 `1.58s`로 살짝 늘렸다.
  - easing을 `cubic-bezier(0.2, 0.74, 0.16, 1)`로 바꿔 중간 가속 변화를 완화했다.

- `home_dom_paper_enter`
  - 중간 키프레임을 `52%`에서 `48%`로 옮기고 변화량을 덜 극적으로 조정했다.
  - `82%`를 `76%`로 당긴 뒤 `92%` 보정 지점을 추가해 후반부가 더 길게 풀리도록 했다.

- `home_dom_paper_surface`
  - `64%`, `88%` 보정 지점을 추가해 내부 표면이 한 번에 멈추지 않고 계속 풀리게 했다.

- `home_dom_paper_leading_edge`
  - 중간 지점을 `62%`에서 `72%`로 늦춰 앞쪽 하이라이트가 더 오래 따라오게 했다.

- `home_dom_paper_trailing_shadow`
  - 중간 지점을 `66%`에서 `76%`로 늦춰 뒤쪽 그림자도 더 천천히 사라지게 했다.

검증:

- `npm.cmd run build` 통과.
- 브라우저에서 Enter 후 `app_shell_paper-entering` 진입 확인.
- 종이 본체, 내부 표면, 앞쪽 하이라이트, 뒤쪽 그림자 애니메이션 적용 확인.
- 탭메뉴 선은 6개 모두 표시된다.
- 숨겨야 하는 컬러 경로 계열 표시 개수는 `0`으로 유지된다.
- 전환 완료 후 `app_shell_home`으로 정상 전환된다.

## 2026-05-29: 중간 멈칫 추가 완화 작업 되돌림

사용자 피드백:

- 중간 멈칫 추가 완화 작업 이후 오히려 끊김이 늘었다.
- 따라서 그 직전 상태로 되돌려달라고 요청했다.

되돌린 내용:

- `home_page_paper_entering` 애니메이션 시간을 `1.58s`에서 `1.52s`로 되돌렸다.
- easing을 `cubic-bezier(0.16, 0.82, 0.18, 1)` 계열로 되돌렸다.
- `home_dom_paper_enter`를 직전 단순화 버전인 `0%`, `52%`, `82%`, `100%` 구조로 되돌렸다.
- `home_dom_paper_surface`를 `0%`, `72%`, `100%` 구조로 되돌렸다.
- `home_dom_paper_leading_edge`를 `0%`, `62%`, `100%` 구조로 되돌렸다.
- `home_dom_paper_trailing_shadow`를 `0%`, `66%`, `100%` 구조로 되돌렸다.

검증:

- `npm.cmd run build` 통과.

## 2026-05-29: 고정 지점 끊김 원인 재판단

사용자 피드백:

- 끊김이 항상 같은 부분에서 같은 정도로 발생한다.
- 따라서 성능 문제보다 값이나 코드 문제에 가까워 보인다고 판단했다.

원인 재판단:

- `clip-path: polygon(...)` 키프레임 간 점 개수가 달랐다.
- `home_dom_paper_enter`
  - `0%`: polygon 점 4개
  - `52%`: polygon 점 6개
  - `82%`: polygon 점 4개
  - `100%`: polygon 점 4개
- `home_dom_paper_leading_edge`
  - `0%`: polygon 점 4개
  - `62%`: polygon 점 4개
  - `100%`: polygon 점 4개
- `home_dom_paper_trailing_shadow`
  - `0%`: polygon 점 4개
  - `66%`: polygon 점 4개
  - `100%`: polygon 점 4개

판단:

- CSS `clip-path: polygon(...)`은 키프레임 간 점 개수가 같아야 더 자연스럽게 보간된다.
- 본체 `home_dom_paper_enter`에서 `4점 → 6점 → 4점`으로 바뀌는 것이 특정 구간에서 모양이 교체되는 듯한 끊김을 만들 가능성이 높다.

수정 방향:

- 본체 `home_dom_paper_enter`의 모든 polygon을 6점으로 통일한다.
- 사각형처럼 보이는 후반부도 6점 polygon으로 유지해 보간 불연속을 줄인다.

적용한 변경:

- `src/pages/home/HomeSection.css`
  - `home_dom_paper_enter`의 `0%`, `52%`, `82%`, `100%` polygon을 모두 6점으로 맞췄다.
  - `0%`는 기존 4점 말림 형태를 유지하되 보간을 위해 보조 점 2개를 추가했다.
  - `82%`, `100%`는 화면 전체 사각형처럼 보이지만 6점 polygon으로 유지했다.

검증:

- `npm.cmd run build` 통과.
- 브라우저에서 Enter 후 `app_shell_paper-entering` 단계 진입 확인.
- 중간 시점의 계산된 `clip-path`가 6점 polygon으로 보간되는 것을 확인했다.
- 탭메뉴 선은 6개 모두 표시된다.
- 숨겨야 하는 컬러 경로 계열 표시 개수는 `0`으로 유지된다.
- 전환 완료 후 `app_shell_home`으로 정상 전환된다.

## 2026-05-29: 중앙 연결 path 정리

사용자 요청:

- 중앙에서 컬러 닷으로 이어지는 `path_*` 계열은 숨김 처리만 하지 말고 홈과의 연결 자체를 끊는다.
- 캡처 이미지 방식으로 다시 돌아갈 가능성이 있으므로, 캡처에 불필요한 중앙 연결 경로가 섞이지 않게 정리한다.

적용한 변경:

- `src/pages/home/HomeMazeNav.tsx`
  - `path_me.svg`, `path_favorite.svg`, `path_attitude.svg` raw import를 제거했다.
  - 위 SVG를 `dangerouslySetInnerHTML`로 넣던 `home_route_me`, `home_route_favorite`, `home_route_attitude` 렌더링을 제거했다.
  - 단순히 CSS로 숨겨져 있던 파란 닷 연결선 `home_blue_line_*` path 렌더링을 제거했다.
  - 단순히 CSS로 숨겨져 있던 프로젝트 닷 연결선 `home_project_line` path 렌더링을 제거했다.
  - 프로젝트 hover route도 실제 DOM에 렌더되지 않도록 `shouldRenderProjectHoverRoutes = false`로 연결을 끊었다.
- `src/pages/home/HomeSection.css`
  - DOM에서 제거된 `home_project_line`, `home_blue_line_*`, `home_route_me/favorite/attitude` 관련 스타일을 정리했다.
  - 더 이상 쓰지 않는 `home_color_line_in` 키프레임을 제거했다.

남겨둔 것:

- 컬러 닷과 히트 영역은 그대로 유지했다.
- 프로젝트 hover route 데이터와 컴포넌트는 나중에 다시 살릴 수 있도록 파일 안에 남겼지만, 현재 홈 DOM에는 연결하지 않는다.

## 2026-05-29: 캡처 이미지 기반 Three.js 전환 재연결

사용자 요청:

- DOM 종이 레이어 방식에서 다시 캡처 이미지 방식으로 돌아간다.
- `C:\장현지\00.A\3d-book-page-turner` 폴더 속 책장 넘김 연출 느낌을 최대한 살린다.
- 소리는 가져오지 않는다.

적용한 변경:

- `src/App.tsx`
  - 앱 단계를 `intro`, `paper-turning`, `paper-settling`, `home`으로 되돌렸다.
  - `ThreePaperTurnTransition`을 다시 연결했다.
  - 인트로 단계에서 캡처용 `HomeSection`을 화면 밖에 렌더하고, `html-to-image`로 미리 캡처해 `imageDataUrl`로 보관한다.
  - Enter 후 `paper-turning`에서는 캡처 이미지 기반 Three.js 캔버스가 전환을 담당한다.
  - 전환 후반부 `paper-settling`에서는 실제 홈 DOM을 뒤에 켜고, 캔버스가 끝까지 재생된 뒤 `home`으로 넘어간다.
  - `paper-settling`으로 들어가도 캔버스 컴포넌트가 언마운트되지 않도록 유지했다.

- `src/components/ThreePaperTurnTransition.tsx`
  - 캡처 이미지 텍스처를 `THREE.PlaneGeometry`에 입혀 넘기는 방식을 유지했다.
  - 참고 폴더의 핵심값인 `bendStrength: 1.3`, `cornerSkew: -0.12` 개념을 반영했다.
  - 오른쪽에서 말려 있던 페이지가 풀려 화면에 정착하는 방향으로 geometry 원점과 정점 변형을 조정했다.
  - 세그먼트를 `72 x 32`로 늘려 곡면이 더 부드럽게 보이도록 했다.
  - 캡처 배경을 `#f7f7f6`로 지정해 투명 요소만 떠다니는 느낌보다 종이 면에 그려진 느낌을 강화했다.

검증:

- `npm.cmd run build` 통과.
- 브라우저에서 긴 프리캡처 대기 후 Enter를 누르면 `three_paper_turn_transition canvas`가 즉시 생성되는 것을 확인했다.
- 전환 완료 후 `app_shell_home`으로 정상 진입한다.
- DOM 종이 전환 클래스 `home_page_paper_entering`은 사용되지 않는다.
- 중앙 연결 경로 계열은 계속 DOM에 렌더되지 않는다.

주의:

- 새로고침 직후 바로 Enter를 누르면 프리캡처가 아직 끝나지 않아 캔버스 생성이 늦을 수 있다.
- 이 경우 `ThreePaperTurnTransition`이 fallback으로 직접 캡처를 수행하므로 전환은 진행되지만, Enter 직후 반응은 느릴 수 있다.

## 2026-05-29: 오른쪽 화면 라인을 축으로 한 페이지 전환 재조정

사용자 정리:

- 우리 화면의 오른쪽 라인이 종이의 축이다.
- 시점은 참고 폴더처럼 책을 위에서 내려다보는 시점이 맞다.
- 차이는 참고 폴더에는 책 주변 공백이 있고, 우리 화면은 페이지가 화면에 꽉 차 있다는 점이다.
- 현재 Three.js 방식 자체는 유지하되, 팔락 넘어오는 부드러운 책장 모션으로 보이게 수정한다.

적용한 변경:

- `src/components/ThreePaperTurnTransition.tsx`
  - 페이지 전체를 크게 이동시키던 값을 줄여 오른쪽 edge가 축처럼 느껴지도록 조정했다.
  - `BEND_STRENGTH`를 `1.3`에서 `0.64`로 낮춰 화면 전체가 과하게 휘는 판처럼 보이는 느낌을 줄였다.
  - `CORNER_SKEW`를 `0.1`로 조정해 오른쪽 위 코너가 먼저 팔락 내려오는 흐름을 만들었다.
  - 중간 정점들이 `Math.PI`에 과하게 눌려 접힌 면처럼 보이는 현상을 줄이기 위해 bending 가중치를 바깥쪽 edge 중심으로 재분배했다.
  - 초반은 바로 반응하고 후반은 부드럽게 정착하도록 `easeInOutSoft`와 `easeOutCubic`을 분리해 사용했다.
  - 최종 정착 전환은 계속 `paper-settling` 뒤에 실제 홈 DOM이 켜지는 구조를 유지한다.

검증:

- `npm.cmd run build` 통과.
- 브라우저에서 프리캡처 후 Enter 시 `three_paper_turn_transition canvas`가 생성된다.
- DOM 종이 전환 클래스 `home_page_paper_entering`은 생성되지 않는다.
- 전환 중 `paper-settling`에서 실제 홈 DOM이 뒤에 켜지고, 완료 후 `app_shell_home`으로 정상 진입한다.

## 2026-05-29: 종이 크기 확대처럼 보이는 문제 수정

사용자 피드백:

- 화면 오른쪽에서 책장 중심축까지 통째로 넘어오는 것처럼 보인다.
- 크기가 안 맞는 종이가 넘어와서 갑자기 확대되는 과정처럼 보인다.
- 의도는 같은 크기의 종이가 오른쪽 축을 기준으로 넘어오는 것이다.

원인 판단:

- `ThreePaperTurnTransition`에서 `PerspectiveCamera`를 사용하고 있었다.
- 접힌 종이가 오른쪽 바깥과 z축 방향에 있을 때 원근 때문에 작게 보이고, 정착하면서 화면 크기로 커지는 것처럼 보였다.
- 이 때문에 실제 종이 크기가 바뀌지 않아도 화면상으로는 축과 종이가 통째로 이동하고 확대되는 느낌이 생겼다.

적용한 변경:

- `src/components/ThreePaperTurnTransition.tsx`
  - `PerspectiveCamera`를 `OrthographicCamera`로 교체했다.
  - 카메라 투영 영역을 현재 화면 비율의 `pageWidth/pageHeight`에 맞춰 고정했다.
  - z축으로 종이가 들리거나 접혀도 화면상 크기가 변하지 않도록 했다.

검증:

- `npm.cmd run build` 통과.
- 브라우저에서 Enter 후 `three_paper_turn_transition canvas` 생성 확인.
- 전환 완료 후 `app_shell_home`으로 정상 진입 확인.

## 2026-05-29: 종이 배경 투명화

사용자 요청:

- 넘어오는 종이에 깔린 회색/오프화이트 배경을 투명하게 만든다.

적용한 변경:

- `src/App.tsx`
  - 프리캡처 `toPng` 옵션에서 `backgroundColor: '#f7f7f6'`를 제거했다.
- `src/components/ThreePaperTurnTransition.tsx`
  - fallback 캡처 `toPng` 옵션에서 `backgroundColor: '#f7f7f6'`를 제거했다.
  - `MeshStandardMaterial`의 기본 `color: '#f7f7f6'`를 제거했다.

결과:

- 캡처 이미지와 Three.js 종이 면이 회백색 바탕을 강제로 깔지 않는다.
- 종이 자체의 면감은 줄고, 탭/닷/메뉴 같은 캡처 요소가 투명 배경 위에서 넘어오는 느낌이 강해진다.

검증:

- `npm.cmd run build` 통과.
- 브라우저에서 Enter 후 캔버스 전환 생성 확인.
- 전환 완료 후 `app_shell_home`으로 정상 진입 확인.

## 2026-05-29: 인트로 미로 외곽 dash 보존

사용자 요청:

- 인트로에서도 홈과 같이 미로 제일 바깥 라인의 dash 패턴을 살려서 그리게 한다.

원인:

- `SharedMaze.tsx`의 draw 초기화가 모든 path의 `strokeDasharray`를 실제 path 길이값으로 덮어쓰고 있었다.
- 이 때문에 원본 SVG의 `stroke-dasharray="19 30"`이 인트로에서 사라져 바깥 라인이 실선처럼 보였다.

적용한 변경:

- `src/components/SharedMaze.tsx`
  - 각 segment의 원본 `stroke-dasharray`를 읽는다.
  - 원본 dash가 있는 경우에는 그 값을 유지한다.
  - 원본 dash가 없는 path에만 기존처럼 전체 path 길이를 `strokeDasharray`로 넣는다.

검증:

- `npm.cmd run build` 통과.
- 브라우저에서 인트로와 홈 모두 미로 외곽선의 계산된 `strokeDasharray`가 `19px, 30px`으로 유지되는 것을 확인했다.

## 2026-05-29: 중앙 미로 깜박임 1차 완화

사용자 요청:

- 종이가 넘어와서 덮을 때 중앙 미로가 깜박이는 현상을 줄이기 위해 1차 조정을 진행한다.
- 우선 `paper-settling` 동안 실제 홈 DOM의 `.home_maze_nav`만 숨긴다.

원인:

- `paper-settling` 단계에서 `SharedMaze`, 실제 홈의 `.home_maze_nav`, Three.js 캔버스가 동시에 존재할 수 있다.
- 이때 홈 미로/탭 레이어가 중앙 미로 위에 겹치면서 깜박임처럼 보일 수 있다.

적용한 변경:

- `src/App.tsx`
  - `HomeSection`에 `isPaperSettling={isPaperSettling}` prop을 전달했다.
- `src/pages/home/HomeSection.tsx`
  - `isPaperSettling` prop을 추가했다.
  - 해당 상태일 때 `home_page_paper_settling` 클래스를 붙인다.
- `src/pages/home/HomeSection.css`
  - `.home_page_after_paper.home_page_paper_settling .home_maze_nav { opacity: 0; }` 규칙을 추가했다.
  - 기존 `.home_page_after_paper .home_maze_nav { opacity: 1; }` 규칙보다 우선하도록 specificity를 높였다.

검증:

- `npm.cmd run build` 통과.
- 브라우저에서 전환 완료 후 `app_shell_home`으로 정상 진입 확인.

## 2026-05-29: 캡처 종이 도착 좌표계 조정

사용자 요청:

- 종이가 도착하는 지점이 최종 홈 DOM과 맞지 않아 보이는 문제를 확인하고 수정한다.
- 반응형에서도 최종 홈과 같은 방식으로 보이도록 한다.

원인:

- 현재 viewport는 `798 x 832`였지만, 실제 홈의 `.home_view`는 `1479 x 832`였다.
- 기존 Three.js plane은 viewport 비율인 `798 x 832` 기준으로 만들어져, `1479 x 832` 캡처 이미지를 화면 안에 압축해 보여주는 상태였다.
- 최종 홈은 `1479 x 832` 레이아웃을 유지하고 viewport로 일부만 보는 구조라서, 전환 이미지와 실제 DOM의 좌표계가 달랐다.

적용한 변경:

- `src/components/ThreePaperTurnTransition.tsx`
  - `sourceRef.current.getBoundingClientRect()`로 캡처 대상 `.home_view`의 실제 크기를 읽는다.
  - 종이 plane은 viewport가 아니라 `.home_view`의 비율로 만든다.
  - `OrthographicCamera`는 viewport 비율만큼만 보여주도록 유지한다.
  - 캡처용 `.home_page`가 `.home_view` 안에서 실제로 보고 있는 crop 위치를 계산해 camera `x/y` 위치에 반영한다.

반응형 기준:

- 화면 비율이 바뀌면 `.home_view` 크기도 바뀌고, 프리캡처도 다시 생성된다.
- 전환 종이는 매번 현재 `.home_view` 비율과 crop 위치를 기준으로 만들어진다.
- 따라서 세로형 화면에서도 최종 홈과 같은 좌표계를 쓰도록 맞춘다.

검증:

- `npm.cmd run build` 통과.
- 브라우저에서 현재 viewport `798 x 832`, 캡처 `.home_view` `1479 x 832`, 전환 캔버스 `798 x 832`, 최종 홈 `.home_view` `1479 x 832` 상태를 확인했다.
- 전환 완료 후 `app_shell_home` 정상 진입 확인.

## 2026-05-29: 전환 후 깜박임 handoff 완화

사용자 요청:

- 페이지 전환 다음에 깜박거림이 심하므로 레이어 전환을 더 부드럽게 줄인다.

원인:

- 기존에는 `paper-turning`에서 캔버스만 보이다가 거의 마지막 순간 `home`으로 넘어가며 홈 DOM, 홈 미로, 로고, SharedMaze decor가 한꺼번에 등장했다.
- `paper-settling` 구간이 짧거나 체감되지 않아 화면상으로는 캔버스와 실제 홈이 교체되는 것처럼 보였다.

적용한 변경:

- `src/App.tsx`
  - `SharedMaze` decor를 `home`이 아니라 `paper-settling`부터 미리 켜도록 변경했다.
- `src/components/ThreePaperTurnTransition.tsx`
  - `onSettleStart` 호출 시점을 `raw >= 0.88`에서 `raw >= 0.72`로 앞당겼다.
  - 캔버스 fade-out 시작 시점은 `raw >= 0.9`로 분리했다.
  - 전환 애니메이션이 끝난 뒤 바로 complete하지 않고 `360ms` 후 complete하도록 조정했다.
  - cleanup 시 complete timer를 정리하도록 했다.
- `src/components/ThreePaperTurnTransition.css`
  - 캔버스 컨테이너 opacity transition을 `0.24s`에서 `0.42s`로 늘렸다.

검증:

- `npm.cmd run build` 통과.
- 브라우저 샘플링 결과:
  - 약 `1150ms`: `paper-settling` 진입, 홈 DOM과 SharedMaze decor가 캔버스 뒤에 미리 깔림.
  - 약 `1300ms~1600ms`: 캔버스 opacity가 `1 → 0`으로 서서히 감소.
  - 이후 `home` 진입 후 `.home_maze_nav` opacity가 `0 → 1`로 서서히 올라옴.

남은 후보:

- 아직 깜박임이 느껴지면 `.home_maze_logo`도 `paper-settling` 동안 숨겼다가 `home`에서 천천히 올리는 방식으로 추가 조정한다.

## 2026-05-29: 홈 배경 장식 레이어 연결 해제

사용자 요청:

- 홈 배경에 이미지처럼 깔려 보이는 요소의 연결을 끊는다.

확인:

- 실제 외부 이미지 파일이 아니라 `HomeBackground` 컴포넌트와 `HomeBackground.css`가 만드는 장식용 배경 레이어였다.
- 이 레이어는 홈 화면뿐 아니라 전환용 캡처 소스에도 함께 들어갈 수 있었다.

적용한 변경:

- `src/pages/home/HomeSection.tsx`
  - `HomeBackground` import를 제거했다.
  - `<HomeBackground />` 렌더링을 제거했다.

보존한 것:

- `src/pages/home/HomeBackground.tsx`
- `src/pages/home/HomeBackground.css`

따라서 필요하면 나중에 `HomeSection.tsx`에서 import와 렌더링만 다시 연결해 복구할 수 있다.

## 2026-05-29: rotateY 접힘 모션 추가 및 gap 완화

사용자 피드백:

- 캡처 이미지와 실제 DOM 사이의 교체 gap이 너무 눈에 띈다.
- 종이가 평평한 판처럼 들어오는 느낌이어서, 뒤집혀있다가 펼쳐지는 표현이 더 강하게 보이면 좋겠다.
- 마지막에 종이가 도착하는 위치와 실제 홈 DOM 위치가 맞지 않아 보인다.

원인 분석:

- `OrthographicCamera` + `deformPage` 만으로는 z축 깊이가 원근으로 표현되지 않아 "평판이 이동하는" 느낌에 그쳤다.
- `deformPage(0)` 상태에서는 geometry vertices가 theta≈π로 뒤집혀 화면 오른쪽 밖에 몰려 있고, raw가 진행되면서 제자리로 돌아오는 방식이었다. 이 X축 압축만으로는 "접혀있다가 펼쳐진다"는 인상을 주기 어려웠다.
- fade가 `raw >= 0.9`에서 시작해 `0.42s` 지속되어, 캡처 이미지와 DOM이 0.42초 동안 겹쳐 보이면서 위치 불일치가 드러났다.
- `raw=0.9`에서는 아직 미세한 position/rotation offset이 남아 있어 캡처와 DOM이 완벽히 정렬되지 않은 상태에서 fade가 진행됐다.

적용한 변경:

- `src/components/ThreePaperTurnTransition.tsx`
  - `FOLD_ANGLE_START = Math.PI * 0.40` (~72°) 상수를 추가했다.
  - `renderFrame`에 `ry = FOLD_ANGLE_START * (1 - settle)` Y축 회전을 추가했다.
  - `pivotX = (pageWidth / 2) * (1 - Math.cos(ry))`로 position.x를 보상해, 회전 중에도 종이의 우측 edge가 `pageWidth/2` 위치에 고정되도록 했다.
  - `paperGroup.position`을 `(pivotX, small_y, small_z)`로 변경했다. 기존의 별도 X drift를 제거하고 pivot 보상만 사용한다.
  - X, Z rotation을 각각 `0.035 → 0.015`, `0.018 → 0.008`로 줄였다.
  - `BEND_STRENGTH`를 `0.64`에서 `0.78`로 올려 진입 중 곡면감을 강화했다.
  - `CORNER_SKEW`를 `0.1`에서 `0.06`으로 줄여 코너 왜곡을 완화했다.
  - fade 시작 시점을 `raw >= 0.9`에서 `raw >= 0.96`으로 늦췄다. `raw=0.96`에서는 `ry ≈ 0.016°`로 사실상 완전히 평탄하다.
  - complete 타이머를 `360ms`에서 `150ms`로 줄였다.

- `src/components/ThreePaperTurnTransition.css`
  - CSS opacity transition을 `0.42s`에서 `0.15s`로 단축했다.

결과:

- `paperGroup.rotation.y`가 `~72° → 0`으로 애니메이션되면서 종이가 오른쪽 edge를 축으로 접혀있다가 펼쳐지는 X축 압축 효과가 추가된다.
- `deformPage`의 곡면 변형과 rotateY가 합산되어 진입 초반에는 오른쪽에 얇은 슬라이브만 보이다가 화면을 채우는 방식으로 바뀐다.
- fade 노출 구간이 `0.42s → 0.15s`로 줄어들고, 시작 시점도 종이가 완전히 정착한 이후(96%)로 늦춰져 캡처-DOM 불일치가 드러나는 시간이 크게 줄었다.
- `raw=1`에서 `ry=0`, `pivotX=0`, `paperGroup.position=(0,0,0)`, `rotation=(0,0,0)`이 되어 final 정렬은 그대로 유지된다.

검증:

- `npm.cmd run build` 통과.
## 2026-05-29: 홈 오른쪽 상단 카드 제거

사용자 요청:

- 홈 오른쪽 위에 추가되어 있던 카드 요소를 제거한다.
- 전환용 종이가 트랜지션 시작 전에 옆에 보이는 문제는 별도로 다시 확인한다.

적용한 변경:

- `src/pages/home/HomeSection.tsx`
  - 오른쪽 상단 `home_case_card` 렌더링을 제거했다.
  - 카드 문구 데이터인 `defaultCaseCard`, `projectCaseCards`를 제거했다.

보존한 것:

- 관련 CSS는 아직 남겨두었다. 화면에는 렌더링되지 않으므로 보이지 않지만, 나중에 카드 복구가 필요하면 재사용할 수 있다.
## 2026-05-29: 전환 중 실제 홈 DOM 겹침 제거

사용자 요청:

- 캡처 이미지 종이가 다 펼쳐진 뒤에 실제 홈 DOM을 나타나게 조절한다.
- 전환 중 캡처 이미지와 실제 DOM이 동시에 보이며 탭 메뉴/닷/버튼이 겹치는 현상을 줄인다.

원래 상태:

- `paper-settling` 단계에서 실제 `HomeSection` DOM을 미리 렌더링했다.
- 같은 단계에서 `SharedMaze` 장식 요소도 미리 켰다.
- 이 때문에 Three.js 캔버스 안의 캡처 이미지와 실제 홈 DOM이 동시에 보였다.

적용한 변경:

- `src/App.tsx`
  - `shouldShowHome`을 `phase === 'home'`일 때만 true가 되도록 변경했다.
  - `SharedMaze` 장식 요소도 `phase === 'home'`일 때만 보이게 변경했다.
  - `paper-settling` 단계에서는 실제 홈 DOM을 렌더링하지 않도록 했다.

의도:

- 전환 캔버스가 살아있는 동안에는 중앙 미로만 아래에 남긴다.
- 탭 메뉴, 닷, 버튼 등 홈 요소는 캡처 이미지 종이 안에서만 보이게 한다.
- 전환이 끝난 뒤 실제 홈 DOM을 켜서 겹쳐 보이는 구간을 없앤다.
## 2026-05-29: 종이 도착 직후 DOM 선표시 타이밍 조정

사용자 요청:

- 종이가 다 붙고 위치가 잡힌 뒤에는 실제 DOM이 미리 나타나 있어야 한다.
- 캡처 이미지가 사라지는 순간과 실제 DOM이 나타나는 사이의 갭이 보이지 않아야 한다.

이전 상태:

- 전환 중 겹침을 없애기 위해 `paper-settling` 단계에서도 실제 홈 DOM을 렌더링하지 않았다.
- 그 결과 캔버스가 사라진 뒤 실제 DOM이 켜지며 짧은 갭이 느껴질 수 있었다.

적용한 변경:

- `src/App.tsx`
  - `paper-settling` 단계에서 실제 `HomeSection`과 `SharedMaze` 장식 요소를 다시 렌더링하도록 복구했다.
  - 단, 이 단계가 너무 일찍 오지 않도록 Three.js 쪽 타이밍을 뒤로 미뤘다.
- `src/components/ThreePaperTurnTransition.tsx`
  - `onSettleStart` 호출 시점을 `raw >= 0.72`에서 `raw >= 0.975`로 늦췄다.
  - 캔버스 fade-out 시작 시점을 `raw >= 0.96`에서 `raw >= 0.992`로 늦췄다.

의도:

- 종이가 거의 완전히 평평해지고 위치가 잡힌 뒤에만 실제 홈 DOM을 아래에 미리 깐다.
- 그 다음 캔버스를 페이드아웃해서, 캡처 이미지가 사라지는 동안 실제 DOM이 이미 뒤에 존재하게 한다.
- 너무 이른 겹침은 줄이고, 너무 늦은 DOM 등장으로 생기는 빈틈도 줄인다.
## 2026-05-29: 종이 전환 컴포넌트 앱 연결 해제

사용자 요청:

- 트랜지션 컴포넌트 연결을 정리한다.
- 컴포넌트 파일은 나중에 다시 불러올 수 있도록 보존한다.

적용한 변경:

- `src/App.tsx`
  - `ThreePaperTurnTransition` import와 렌더링 연결을 제거했다.
  - `html-to-image`의 `toPng` import와 인트로 중 선캡처 로직을 제거했다.
  - 전환용 `paper-turning`, `paper-settling` 단계 연결을 제거했다.
  - 화면 밖 캡처용 `HomeSection` 렌더링을 제거했다.
  - 현재 앱 흐름을 `intro -> home`으로 단순화했다.

보존한 컴포넌트:

- `src/components/ThreePaperTurnTransition.tsx`
- `src/components/ThreePaperTurnTransition.css`
- `src/components/PaperEnterTransition.tsx`
- `src/components/PaperEnterTransition.css`

현재 상태:

- 인트로에서는 중앙 미로와 인트로만 렌더링된다.
- Enter를 누르면 홈으로 바로 전환된다.
- 종이 전환은 앱에 연결되어 있지 않지만, 컴포넌트 파일은 그대로 남아 있어 나중에 다시 import해서 연결할 수 있다.
## 2026-05-29: 탭 메뉴 페이지 전환 인터랙션 연결 해제

사용자 요청:

- 탭메뉴에 연결된 페이지 전환 인터랙션을 컴포넌트로만 남기고 연결을 정리한다.

적용한 변경:

- `src/pages/home/HomeSection.tsx`
  - `MainTabClickTransition` import와 렌더링을 제거했다.
  - `useMainTabClickTransition` hook 연결을 제거했다.
  - 탭 클릭 시 미로를 지우고 딜레이 후 페이지를 여는 전환 연출을 제거했다.
  - 페이지 열림 자체는 유지했다. `profile` 클릭 시 About, `work` 클릭 시 Work가 바로 열린다.

보존한 컴포넌트:

- `src/components/MainTabClickTransition.tsx`
- `src/components/MainTabClickTransition.css`

현재 상태:

- 탭메뉴 클릭 전환 연출은 홈에 연결되어 있지 않다.
- 컴포넌트 파일은 남아 있으므로 나중에 다시 import해서 연결할 수 있다.
