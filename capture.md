# 캡처 이미지 기반 종이 전환 보관 기록

## 왜 만들었는지

인트로에서 Enter를 눌렀을 때 중앙 미로는 그대로 두고, 홈의 나머지 요소를 종이 한 장처럼 넘겨 홈으로 들어오는 효과를 만들기 위해 시도했다.

## 관련 파일

- `src/components/ThreePaperTurnTransition.tsx`
- `src/components/ThreePaperTurnTransition.css`
- `src/pages/home/HomeSection.tsx`
- `src/pages/home/HomeSection.css`
- `src/App.tsx`의 이전 `paper-turning`, `paper-settling` 연결 코드

## 작동 방식

1. 캡처용 `HomeSection`을 화면 밖에 렌더한다.
2. `html-to-image`로 `.home_view`를 이미지로 캡처한다.
3. 캡처 이미지를 `THREE.Texture`로 만든다.
4. 세그먼트가 많은 `THREE.PlaneGeometry`에 텍스처를 입힌다.
5. 정점을 변형해 종이가 넘어오는 듯한 Three.js 애니메이션을 만든다.
6. 전환 후반부에 실제 홈 DOM을 아래에 렌더하고 캔버스를 fade-out한다.

## 장점

- 실제 종이처럼 휘어지는 3D 곡면 표현이 가능하다.
- 캡처 이미지를 하나의 텍스처로 다루기 때문에 Three.js 변형은 비교적 단순하다.

## 한계

- 캡처 이미지와 실제 홈 DOM은 서로 다른 렌더 결과라서 끝 지점 연결이 어색할 수 있다.
- 중앙 미로, 경로, 탭, 닷처럼 겹치는 요소를 캡처에서 정확히 제외하기 어렵다.
- 캡처 이미지 안의 미로 크기와 실제 `SharedMaze` 크기가 달라 보일 수 있다.
- 캡처/이미지 디코딩/텍스처 생성 비용 때문에 Enter 직후 반응이 느껴질 수 있다.
- 캡처용 스타일이 실제 홈 스타일과 조금만 달라도 전환 끝에서 바뀌는 느낌이 난다.

## 나중에 다시 살리는 방법

1. `App.tsx`에서 `ThreePaperTurnTransition`을 다시 import한다.
2. `AppPhase`에 `paper-turning`, `paper-settling` 단계를 다시 추가한다.
3. 캡처용 `HomeSection`을 `forcePaperVisible`, `isCaptureSource`, `captureRef`와 함께 렌더한다.
4. `html-to-image`로 미리 캡처한 이미지 또는 캡처 대상 ref를 `ThreePaperTurnTransition`에 전달한다.
5. 전환 후반부에 실제 홈을 먼저 렌더하고 캔버스를 fade-out한다.

## 현재 결정

2026-05-29 기준으로 캡처 이미지 방식을 다시 실제 앱에 연결했다.

- `App.tsx`에서 `ThreePaperTurnTransition`을 사용한다.
- 인트로 단계에서 캡처용 `HomeSection`을 미리 렌더하고 `html-to-image`로 캡처한다.
- Enter 후 캡처 이미지를 Three.js 텍스처로 사용해 책장 넘김 전환을 재생한다.
- 전환 후반부에는 실제 홈 DOM을 뒤에 켜고, 캔버스가 끝까지 마무리된 뒤 `home` 단계로 넘어간다.
- 소리 기능은 가져오지 않았다.

## 현재 주의점

- 새로고침 직후 바로 Enter를 누르면 프리캡처가 끝나기 전이라 전환 캔버스 생성이 늦을 수 있다.
- 인트로에서 잠시 머문 뒤 Enter를 누르면 미리 만들어둔 캡처 이미지를 사용해 더 빠르게 시작된다.
