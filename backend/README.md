# EduTale Backend

EduTale의 동화 생성 API 서버입니다. 사용자 입력(아이 정보/감정/진도 코드)을 받아 OpenAI와 Supabase를 연동해 동화 데이터를 생성하고 저장합니다.

## 기술 스택

- Python 3.10+
- FastAPI + Uvicorn
- Pydantic
- OpenAI Python SDK
- Supabase Python SDK
- HTTPX

## 주요 기능

- `POST /generate`
  - 커리큘럼 조회
  - GPT 기반 동화/퀴즈 생성
  - 이미지(T2I), 오디오(TTS) 생성
  - Supabase Storage 업로드 및 DB 저장
- `GET /curriculums`
  - 진도 선택용 커리큘럼 목록 조회
- `GET /stories/{story_id}`
  - 생성된 동화 상세 조회

## 프로젝트 구조

```text
backend/
├─ main.py          # FastAPI 엔트리포인트, 라우팅/오케스트레이션
├─ ai_service.py    # OpenAI 호출 (대본/이미지/오디오)
├─ db_service.py    # Supabase DB/Storage 연동
├─ schemas.py       # 요청/응답 데이터 스키마
├─ README.md        # 실행/운영 가이드
└─ BackEnd.md       # 상세 설계 설명 문서
```

## 사전 준비

- Python 3.10 이상
- OpenAI API Key
- Supabase 프로젝트 (DB + Storage 버킷)

## 설치 및 실행

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi "uvicorn[standard]" pydantic openai python-dotenv supabase httpx
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

API 문서: `http://127.0.0.1:8000/docs`

## 환경 변수

`backend/.env` 파일을 사용합니다.

| 변수명 | 필수 | 설명 |
| --- | --- | --- |
| `OPENAI_API_KEY` | Yes | OpenAI API 키 |
| `SUPABASE_URL` | Yes | Supabase 프로젝트 URL |
| `SUPABASE_API` | Yes | Supabase API 키 |

## 요청 예시

```bash
curl -X POST http://127.0.0.1:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "child_name": "민준",
    "age": 6,
    "personality": "호기심 많음",
    "emotion": "기쁨",
    "stage_code": "STAGE_01",
    "user_id": "user-uuid"
  }'
```

## 운영 시 주의사항

- 현재 CORS는 `http://localhost:3000`만 허용 (`main.py`)
- 프로덕션에서는 환경별 도메인 분리 및 allowlist 최소화 필요
- 키 관리: `.env` 대신 시크릿 매니저 사용 권장
- 비동기 생성 실패 시 재시도/서킷브레이커 정책 추가 권장

## 향후 개선 권장

- `requirements.txt` 또는 `pyproject.toml`로 의존성 고정
- 헬스체크 엔드포인트(`/health`) 추가
- 테스트 코드(`pytest`) 및 CI 파이프라인 구축

상세 설계/데이터 흐름 문서는 `backend/BackEnd.md`를 참고하세요.
