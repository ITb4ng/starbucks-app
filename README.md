# ☕ Starbucks App Renewal

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Mobile%20First-Renewal-2E8B57" alt="Mobile First Renewal" />
  <img src="https://img.shields.io/badge/Branch-dev-6A5ACD" alt="dev branch" />
</p>

<p align="center">
  <strong>스타벅스 스타일 웹 프로젝트의 모바일 중심 UX 리뉴얼 브랜치</strong>
  <br />
  이 브랜치는 기존 결과물을 유지한 채,
  <strong>모바일 접근성 우선 구조</strong>와
  <strong>실사용자 행동 흐름 기반 UX 개선</strong>을 중심으로 작업합니다.
</p>

<p align="center">
  <strong>
    브랜드 중심 화면 재현을 넘어서,<br />
    모바일 웹에서 앱으로 자연스럽게 이어질 수 있는 선택 기반 UX를 주요 개선 포인트로 다룹니다.
  </strong>
</p>

---

## 목차

- [브랜치 목적](#branch-purpose)
- [리뉴얼 목표](#renewal-goals)
- [핵심 개선 방향](#key-directions)
- [우선 작업 항목](#priority-tasks)
- [브랜치 작업 방식](#workflow)
- [예상 feature 브랜치](#feature-branches)
- [기술 기준](#tech-rules)
- [정리](#summary)

---

<a id="branch-purpose"></a>
## 브랜치 목적

`dev` 브랜치는 이 프로젝트의 **통합 개발 기준 브랜치**입니다.

기존 `master` 브랜치가  
초기 제작 흐름, 직접 개선한 이력, 현재 공개 기준을 보존하는 브랜치라면,  
`dev` 브랜치는 앞으로의 실제 리뉴얼 작업을 진행하는 기준 브랜치입니다.

즉, 이 브랜치는 아래 목적을 가집니다.

- 모바일 접근성 우선 구조로 프로젝트 재정의
- 브랜드 중심 UI 재현에서 실사용 UX 중심 구조로 전환
- 기능 단위 브랜치 작업을 통합하는 기준선 역할
- Before / After 비교가 가능한 리뉴얼 결과물 축적

---

<a id="renewal-goals"></a>
## 리뉴얼 목표

이 리뉴얼의 핵심 목표는 단순히 “더 예쁘게” 만드는 것이 아닙니다.

### 목표 요약

- **모바일 우선 구조로 재설계**
- **행동형 CTA 중심 UX 강화**
- **웹에서 앱으로 이어지는 선택 기반 흐름 도입**
- **반응형 레이아웃 재정비**
- **기존 결과물과 리뉴얼 결과물 분리 관리**

---

<a id="key-directions"></a>
## 핵심 개선 방향

### 1. 모바일 접근성 우선 구조

기존 데스크톱 중심 화면 구성에서 벗어나  
모바일 사용자가 더 빠르게 원하는 행동에 도달할 수 있도록 구조를 재설계합니다.

예상 개선 포인트:

- 터치 영역 확대
- 정보 밀도 정리
- 버튼 우선순위 재배치
- 가독성 중심 레이아웃 개선

---

### 2. Hero 영역 CTA 재구성

기존의 `자세히 보기` 중심 흐름보다  
모바일에서는 아래와 같은 행동형 CTA를 우선적으로 검토합니다.

- 내 주변 매장 찾기
- 앱에서 주문하기
- 리저브 매장 찾기

즉, 브랜드 소개형 CTA보다  
**실제 행동으로 이어지는 CTA를 앞세우는 방향**으로 구조를 재정비합니다.

---

### 3. Web-to-App CTA UX 도입

스타벅스와 같이 웹과 앱을 함께 운영하는 서비스 구조에서는  
모바일 웹에서 앱으로 자연스럽게 이어지는 흐름이 중요합니다.

따라서 이 리뉴얼에서는 아래와 같은 UX를 주요 개선 포인트로 다룹니다.

- 앱에서 열기
- 웹에서 계속하기
- iOS / Android 환경별 스토어 유도
- 사용자 선택 기반 CTA 제어
- 행동형 CTA와 연계한 모바일 전환 UX 개선

핵심은 강제 이동이 아니라,  
**사용자가 상황에 맞게 더 적절한 경로를 선택할 수 있도록 유도하는 것**입니다.

---

### 4. 반응형 레이아웃 재정비

이 작업은 단순한 화면 축소가 아니라,  
모바일과 데스크톱에서 서로 다른 정보 우선순위를 고려한 구조 재설계입니다.

즉, “같은 레이아웃을 줄이는 것”보다  
**화면 크기에 따라 구조 자체를 다시 생각하는 것**에 가깝습니다.

---

<a id="priority-tasks"></a>
## 우선 작업 항목

### 1차 우선순위

- [ ] 헤더 모바일 내비게이션 구조 정리
- [ ] Hero 영역 CTA 우선순위 재구성
- [ ] 모바일 기준 섹션 순서 재배치
- [ ] 반응형 breakpoint 기준 재정비
- [ ] Web-to-App CTA 기본 흐름 설계

### 2차 우선순위

- [ ] 매장 찾기 중심 CTA 강화
- [ ] 앱 전환 UX 구체화
- [ ] 모바일 시각적 계층 구조 개선
- [ ] 공통 버튼/간격/타이포 기준 정리

### 3차 우선순위

- [ ] Before / After 비교 자료 정리
- [ ] README 및 docs 문서 보강
- [ ] 배포 구조 분리
- [ ] 리뉴얼 결과 검수 및 안정화

---

<a id="workflow"></a>
## 브랜치 작업 방식

이 브랜치는 직접 모든 작업을 쌓는 공간이 아니라,  
기능 단위 브랜치를 병합하는 기준 브랜치로 운영합니다.

### 작업 흐름

- `feature/*` 브랜치 생성
- 기능 단위 작업 진행
- 작업 완료 후 `dev`로 병합
- 충분히 안정화된 시점에 `master` 반영 검토

---

<a id="feature-branches"></a>
## 예상 feature 브랜치

- `feature/header-responsive`
- `feature/mobile-hero-cta`
- `feature/store-finder-priority`
- `feature/web-to-app-cta`
- `feature/responsive-layout-rebuild`

필요에 따라 작업 범위를 더 잘게 나누어 브랜치를 추가할 수 있습니다.

---

<a id="tech-rules"></a>
## 기술 기준

이 프로젝트는 프레임워크 도입보다  
기본적인 퍼블리싱 역량과 DOM 제어 능력을 다시 정리하는 방향에 집중합니다.

### 기술 스택

- HTML5
- CSS3
- JavaScript

### 작업 원칙

- 시맨틱 마크업 우선
- 모바일 우선 반응형 설계
- 행동형 CTA 우선 구조
- 과도한 기능 추가보다 명확한 UX 개선 우선
- README와 문서화를 통한 작업 의도 기록

---

<a id="summary"></a>
## 정리

`dev` 브랜치는 스타벅스 스타일 웹 프로젝트를  
**모바일 접근성 우선 UX 리뉴얼 프로젝트**로 전환하기 위한 기준 브랜치입니다.

이 브랜치에서는 기존 결과물을 무조건 덮어쓰기보다,  
기존 작업의 의미를 보존하면서도  
실제 서비스 사용자 경험을 바탕으로 더 나은 구조와 흐름을 만드는 데 집중합니다.

즉, 이 브랜치는 단순한 수정 브랜치가 아니라  
**이 프로젝트의 다음 단계 기준점**입니다.