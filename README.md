# EduTale

AI 기반 맞춤형 수학 동화 웹서비스입니다. 아이의 정보와 감정, 학습 진도를 입력하면 5개 장면의 동화/이미지/오디오/퀴즈를 생성해 학습과 독서를 함께 진행할 수 있습니다.

## 프로젝트 개요

- Frontend(`frontend`): Next.js 기반 사용자 웹앱
- Backend(`backend`): FastAPI 기반 스토리 생성 API
- 외부 연동: OpenAI(GPT, 이미지, TTS), Supabase(Auth/DB/Storage)

## 기술 스택

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zustand
- Backend: Python 3.10+, FastAPI, Pydantic, OpenAI SDK, Supabase SDK
- Infra: Supabase(Database + Storage)

## 저장소 구조

```text
EduTale/
├─ frontend/          # Next.js 앱
├─ backend/           # FastAPI API 서버
├─ docs/              # 추가 문서(현재 비어 있음)
└─ README.md          # 루트 가이드
```

## 빠른 시작

### 1) Frontend 환경 변수 설정

```bash
cd frontend
cp .env.local.example .env.local
```

`.env.local` 값 예시:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL` (기본: `http://127.0.0.1:8000`)

### 2) Backend 환경 변수 설정

`backend/.env` 파일 생성:

```env
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_API=your_supabase_service_role_or_api_key
```

### 3) Backend 실행

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi "uvicorn[standard]" pydantic openai python-dotenv supabase httpx
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 4) Frontend 실행

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## 주요 API

- `POST /generate`: 맞춤 동화 생성
- `GET /curriculums`: 진도 목록 조회
- `GET /stories/{story_id}`: 생성된 동화 상세 조회

FastAPI 문서: `http://127.0.0.1:8000/docs`

## 개발 워크플로우

- 프론트 개발 서버: `cd frontend && npm run dev`
- 프론트 린트: `cd frontend && npm run lint`
- 백엔드 개발 서버: `cd backend && uvicorn main:app --reload`

## 운영 전 체크리스트

- CORS 허용 도메인(`backend/main.py`)을 운영 도메인으로 제한
- API 키를 `.env` 대신 시크릿 매니저로 관리
- 로그/에러 모니터링 도구(Sentry 등) 연결
- 백엔드 의존성 고정(`requirements.txt` 또는 `pyproject.toml`) 도입

## 문서 규칙

- 루트 `README.md`: 전체 아키텍처와 빠른 시작
- `frontend/README.md`: FE 개발/배포 가이드
- `backend/README.md`: API/실행/운영 가이드
