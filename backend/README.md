# EduTale Backend

**EduTale Backend** is the API orchestration layer that generates personalized stories and media assets using OpenAI services and stores final outputs in Supabase.

It receives child context and curriculum stage input, builds structured story output, and returns scene-level content consumable by the frontend.

## Executive Summary

The backend is implemented as a FastAPI service with a clear split between API routing, AI generation services, and data/storage services.
It manages story generation lifecycle end-to-end: curriculum lookup, narrative generation, media generation, persistence, and retrieval.

## Portfolio Value

This backend demonstrates production-relevant backend capabilities in:

- API orchestration for AI-driven content pipelines
- Structured schema validation with Pydantic
- Async workflows for parallel media generation
- External service integration (OpenAI + Supabase)
- Clear service-layer decomposition (`main`, `ai_service`, `db_service`)

## Core Responsibilities

- `POST /generate`
  - Load curriculum by stage code
  - Generate structured story and quiz content
  - Generate image/audio media
  - Upload assets and persist final story payload
- `GET /curriculums`
  - Return curriculum metadata for stage selection
- `GET /stories/{story_id}`
  - Return stored story details

## Tech Stack

| Area | Technologies |
| --- | --- |
| Framework | FastAPI, Uvicorn |
| Language | Python 3.10+ |
| Validation | Pydantic |
| AI Integration | OpenAI Python SDK |
| Data/Storage | Supabase Python SDK |
| Networking | HTTPX |

## Service Structure

```text
backend/
├─ main.py              # API entrypoint and request orchestration
├─ ai_service.py        # OpenAI story/image/audio generation
├─ db_service.py        # Supabase DB and storage operations
├─ schemas.py           # Request/response and story schemas
├─ README.md            # Backend operations guide
└─ BackEnd.md           # Detailed architecture notes
```

## API Surface

- `POST /generate`
- `GET /curriculums`
- `GET /stories/{story_id}`

Local Swagger UI: `http://127.0.0.1:8000/docs`

## Getting Started

### Prerequisites

- Python 3.10+
- OpenAI API key
- Supabase project with required tables/storage bucket

### 1) Environment Setup

Create `backend/.env`:

```env
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_API=your_supabase_service_role_or_api_key
```

### 2) Install and Run

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi "uvicorn[standard]" pydantic openai python-dotenv supabase httpx
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

## Request Example

```bash
curl -X POST http://127.0.0.1:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "child_name": "Minjun",
    "age": 6,
    "personality": "curious",
    "emotion": "happy",
    "stage_code": "STAGE_01",
    "user_id": "user-uuid"
  }'
```

## Operational Notes

- CORS is currently configured for local frontend development (`http://localhost:3000`).
- Production deployments should enforce strict origin allowlists and secure key management.
- Add dependency locking (`requirements.txt` or `pyproject.toml`) for reproducible builds.
- Add health checks, retry policies, and monitoring for production reliability.

## Related Docs

- `backend/BackEnd.md` provides detailed internal data flow and module-level explanations.
