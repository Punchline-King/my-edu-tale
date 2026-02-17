# 📚 Edu-Tale Backend

Edu-Tale의 백엔드 서비스입니다. **FastAPI**를 기반으로 하며, **Supabase**(DB/Storage)와 **OpenAI**(GPT-4o, DALL-E 3)를 연동하여 아이들을 위한 맞춤형 멀티미디어 동화책을 실시간으로 생성합니다.

---

## 🛠 기술 스택 (Tech Stack)

| 구분 | 기술 | 설명 |
|---|---|---|
| **Framework** | FastAPI | Python 3.10+ 기반의 고성능 비동기 웹 프레임워크 |
| **Server** | Uvicorn | ASGI 웹 서버 구현체 |
| **Database** | Supabase (PostgreSQL) | 관계형 데이터 저장 및 쿼리 |
| **Storage** | Supabase Storage | 이미지 및 오디오 파일 영구 저장 |
| **AI (Text)** | GPT-4o | 스토리 기획, 대사 작성, 퀴즈 생성 (Structured Outputs 사용) |
| **AI (Image)** | DALL-E 3 | 동화 삽화 생성 (1024x1024) |
| **AI (Audio)** | TTS | 네레이션 음성 합성 |

---

## 📂 폴더 구조 (Directory Structure)x

```bash
backend/
├── main.py          # 🚀 엔트리포인트 (API 라우터 및 전체 워크플로우 오케스트레이션)
├── ai_service.py    # 🤖 OpenAI API 연동 모듈 (GPT, DALL-E, TTS 로직)
├── db_service.py    # 💾 Supabase 연동 모듈 (DB CRUD, Storage 업로드)
├── schemas.py       # 📦 Pydantic 데이터 모델 (Request/Response 스키마 정의)
└── README.md        # 📄 백엔드 문서
```

---

## ⚡️ 상세 워크플로우 (Detailed Workflow)

사용자가 동화 생성을 요청하면(`POST /api/generate`), 백엔드는 **"비동기 병렬 처리 공장(Async Parallel Factory)"** 시스템을 가동하여 약 15~20초 내에 텍스트, 그림, 음성이 포함된 동화책을 완성합니다.

### 1️⃣ 주문 접수 (Request)
- **파일**: `main.py`
- 프론트엔드로부터 아이의 정보(이름, 나이, 관심사, 기분)와 학습 진도 코드(`stage_code`)를 받습니다.
- `schemas.GenerateRequest` 모델을 통해 데이터 유효성을 검증합니다.

### 2️⃣ 재료 준비 (DB Fetch)
- **파일**: `db_service.py` (`get_curriculum`)
- 요청받은 `stage_code`(예: `MATH-001`)를 키값으로 `curriculums` 테이블을 조회합니다.
- 해당 진도에 맞는 **학습 지문(Source Text)**과 제목을 가져옵니다.

### 3️⃣ 대본 작성 (Story Generation)
- **파일**: `ai_service.py` (`generate_story_draft`)
- **GPT-4o**에게 '동화 작가' 페르소나를 부여하고, 아이의 정보와 학습 지문을 입력합니다.
- **Structured Outputs** 기능을 사용하여 `schemas.StoryDraft` 형태의 JSON 데이터를 강제로 생성합니다.
  - 총 5개의 씬(Scene) 생성
  - 각 씬마다 네레이션, 영어 이미지 프롬프트 생성
  - 학습 효과를 위해 3번, 5번 씬에는 반드시 **퀴즈(Quiz)** 포함
- *결과물: 텍스트로만 구성된 동화 대본 초안*

### 4️⃣ 비동기 공장 가동 (Async Media Factory) 🏭
- **파일**: `ai_service.py` (`generate_all_media_parallel`)
- 이 단계가 전체 성능의 핵심입니다. 그림과 음성을 순차적으로 만들지 않고 **동시에(Parallel)** 생성합니다.
- Python의 `asyncio.gather`를 사용하여 총 10개의 AI 작업을 동시에 실행합니다.

| 작업 | 개수 | 모델 | 설명 |
|---|---|---|---|
| **이미지 생성** | 5개 | DALL-E 3 | 각 씬의 `image_prompt`를 기반으로 삽화 생성 |
| **음성 생성** | 5개 | TTS-1 | 각 씬의 `text`를 'Nova' 목소리로 변환 |

> **💡 성능 비교**
> - 순차 처리 시: (4초 × 5장) + (1초 × 5개) ≈ **25초 소요**
> - 병렬 처리 시: 가장 오래 걸리는 작업(약 4~5초)에 맞춰 완료 ≈ **5초 소요** ⚡️

### 5️⃣ 에셋 영구 저장 (Storage Upload)
- **파일**: `db_service.py` (`upload_to_supabase`, `save_image_from_url`)
- **이미지**: DALL-E가 준 URL은 2시간 뒤 만료되므로, 서버가 이미지를 다운로드하여 Supabase Storage(`edu-tale-assets`)에 재업로드합니다.
- **음성**: 생성된 MP3 바이너리 데이터를 즉시 Supabase Storage에 업로드합니다.
- 업로드 후, 누구나 접근 가능한 **Public URL**을 획득합니다.

### 6️⃣ 최종 조립 및 DB 저장 (Assembly & Save)
- **파일**: `main.py`
- 대본(Text)에 생성된 미디어 링크(Image URL, Audio URL)를 매핑하여 최종 결과물을 조립합니다.
- `db_service.save_final_story`를 호출하여 `stories` 테이블에 저장합니다. (히스토리 기능용)
- 프론트엔드에 최종 JSON 데이터를 반환합니다.

---

## 🚀 설치 및 실행 가이드 (Setup & Run)

### 1. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 API 키를 입력하세요.

```env
OPENAI_API_KEY=sk-proj-...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_API=eyJ...
```

### 2. 패키지 설치
Python 3.10 이상의 환경에서 필요한 라이브러리를 설치합니다.

```bash
pip install fastapi uvicorn openai supabase python-dotenv pydantic httpx
```

### 3. 서버 실행
개발 모드(코드 변경 시 자동 재시작)로 서버를 실행합니다.

```bash
uvicorn main:app --reload
```

- 서버 주소: `http://127.0.0.1:8000`
- API 문서(Swagger): `http://127.0.0.1:8000/docs`

---

## 📡 API 데이터 예시

### Request (`POST /api/generate`)
```json
{
  "child_name": "성민",
  "age": 7,
  "personality": "공룡을 좋아함",
  "emotion": "심심함",
  "stage_code": "MATH-001"
}
```

### Response
```json
{
  "story_id": "550e8400-e29b-...",
  "title": "성민이와 공룡 친구들의 숫자 놀이",
  "scenes": [
    {
      "scene_no": 1,
      "text": "옛날 옛적, 공룡 마을에...",
      "image_url": "https://supabase.../image1.png",
      "audio_url": "https://supabase.../audio1.mp3",
      "quiz": null
    },
    {
      "scene_no": 3,
      "text": "티라노가 물었어요. 사과가 2개 있는데 1개를 더 주면 몇 개일까?",
      "image_url": "...",
      "audio_url": "...",
      "quiz": {
        "type": "choice",
        "question": "2 더하기 1은 무엇일까요?",
        "answer": "3",
        "correct_msg": "와! 정말 똑똑하구나!",
        "wrong_msg": "다시 한 번 생각해보자."
      }
    }
  ]
}
```
