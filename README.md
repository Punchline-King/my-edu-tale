# EduTale

**EduTale** is an AI-powered educational storytelling platform that turns a child's profile, mood, and learning stage into an interactive 5-scene storybook with narration and quizzes.

This repository is organized as a full-stack product with a Next.js frontend and a FastAPI backend integrated with OpenAI and Supabase.

## Executive Summary

EduTale is designed to make early math learning more engaging through personalized narratives.
The system generates story text, scene illustrations, audio narration, and learning checkpoints (quizzes), then serves them through a responsive reading experience.

## Portfolio Value

This project demonstrates practical, production-oriented engineering in:

- End-to-end AI product development (prompting, orchestration, UI delivery)
- Full-stack architecture (Next.js + FastAPI + Supabase)
- Asynchronous media generation workflows
- API-first frontend/backend integration
- State-driven UX for story playback and quiz flow

## Key Features

- Personalized story generation from child profile + emotion + stage code
- 5-scene story structure with embedded quizzes
- AI-generated illustrations and TTS narration per scene
- Story persistence and retrieval via Supabase
- Mobile-friendly reading and playback experience

## Architecture Overview

```text
[Next.js Frontend]
        |
        | HTTP (REST)
        v
[FastAPI Backend]
   |          |
   |          +--> OpenAI (story, image, TTS generation)
   |
   +--------------> Supabase (curriculum, story data, asset storage)
```

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zustand |
| Backend | Python 3.10+, FastAPI, Pydantic, OpenAI SDK, HTTPX |
| Data & Storage | Supabase (PostgreSQL + Storage) |
| Tooling | ESLint, npm, Uvicorn |

## Repository Structure

```text
EduTale/
├─ frontend/          # Next.js application
├─ backend/           # FastAPI API service
├─ docs/              # Additional documentation (optional)
└─ README.md          # Project overview (this file)
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Python 3.10+
- OpenAI API key
- Supabase project

### 1) Configure Frontend Environment

```bash
cd frontend
cp .env.local.example .env.local
```

Required variables in `frontend/.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL` (default: `http://127.0.0.1:8000`)

### 2) Configure Backend Environment

Create `backend/.env`:

```env
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_API=your_supabase_service_role_or_api_key
```

### 3) Run Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi "uvicorn[standard]" pydantic openai python-dotenv supabase httpx
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Backend docs: `http://127.0.0.1:8000/docs`

### 4) Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Open: `http://localhost:3000`

## API Overview

- `POST /generate` - Generate a personalized story with scenes, media, and quizzes
- `GET /curriculums` - Get available curriculum stage metadata
- `GET /stories/{story_id}` - Retrieve a previously generated story

## Engineering Notes

- Current CORS in backend is configured for local frontend development.
- API keys should be managed via secure secret storage in production.
- Dependency pinning (`requirements.txt` or `pyproject.toml`) is recommended for release stability.
- Monitoring and retry policies should be added for production-grade resiliency.

## Documentation Map

- `/Users/sungmin/Desktop/Project/EduTale/README.md` - Product overview and quick start
- `/Users/sungmin/Desktop/Project/EduTale/frontend/README.md` - Frontend development guide
- `/Users/sungmin/Desktop/Project/EduTale/backend/README.md` - Backend API and operations guide
- `/Users/sungmin/Desktop/Project/EduTale/backend/BackEnd.md` - Detailed backend design notes
