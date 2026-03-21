# EduTale Frontend

EduTale 사용자 웹앱입니다. 아이 정보 입력, 진도 선택, 스토리 생성/재생/퀴즈 풀이 흐름을 담당합니다.

## 기술 스택

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Supabase Auth (`@supabase/ssr`, `@supabase/supabase-js`)
- Zustand (클라이언트 상태 관리)

## 사전 준비

- Node.js 20+
- npm 10+
- 실행 중인 Backend API (`http://127.0.0.1:8000` 기본)

## 시작하기

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

개발 서버: `http://localhost:3000`

## 환경 변수

`frontend/.env.local`에 설정합니다.

| 변수명 | 필수 | 설명 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase 익명 키 |
| `NEXT_PUBLIC_API_URL` | Yes | Backend API 주소 (예: `http://127.0.0.1:8000`) |

## 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run start`: 빌드 결과 실행
- `npm run lint`: ESLint 검사

## 디렉터리 구조

```text
frontend/
├─ src/app/                 # 라우트 페이지
├─ src/components/          # UI/스토리 플레이어 컴포넌트
├─ src/services/            # 백엔드 API 통신 로직
├─ src/lib/                 # Supabase, 타입, 유틸
├─ src/store/               # 상태 관리
├─ public/                  # 정적 파일
└─ .env.local.example       # 환경 변수 예시
```

## 백엔드 연동 포인트

`src/services/apiService.ts`가 다음 API와 통신합니다.

- `POST /generate`
- `GET /stories/{story_id}`
- (헬스체크 성격) `HEAD /docs`

## 품질 가이드

- PR 전 최소 `npm run lint` 실행
- 환경변수 누락 시 Supabase는 placeholder로 동작하지만, 실제 인증/저장은 실패할 수 있음
- 사용자 플로우 변경 시 모바일/태블릿/데스크톱 반응형 확인 권장

## 문제 해결

- `백엔드 서버에 연결할 수 없습니다`:
  - `NEXT_PUBLIC_API_URL` 확인
  - Backend 프로세스 실행 여부 확인
- Supabase 인증 관련 오류:
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 값 재확인
