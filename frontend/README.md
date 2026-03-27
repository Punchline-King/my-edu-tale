# EduTale Frontend

**EduTale Frontend** is the user-facing web application that delivers personalized story generation, reading playback, and quiz interactions for early math learning.

Built with Next.js App Router, this client coordinates user onboarding flows, story viewing UX, audio controls, and backend integration.

## Executive Summary

The frontend is designed to provide a child-friendly but production-structured experience across desktop and mobile devices.
It consumes generated story assets from the backend and renders them through an interactive book-reading interface.

## Portfolio Value

This frontend highlights practical product engineering in:

- Modern React architecture with Next.js App Router
- Real-world API integration and typed service boundaries
- Responsive UI behavior for storybook-style reading
- State management for playback, quiz, and user progression
- Maintainable component segmentation for feature growth

## Feature Scope

- Child profile and stage-based story flow entry
- Story page rendering with scene-by-scene navigation
- Audio playback controls and replay behavior
- Quiz modal interactions and completion flow
- Auth/session integration with Supabase

## Tech Stack

| Area | Technologies |
| --- | --- |
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| State | Zustand |
| Auth/Data Client | Supabase (`@supabase/ssr`, `@supabase/supabase-js`) |
| Tooling | ESLint, npm |

## Project Structure

```text
frontend/
├─ src/app/                     # App Router pages and routes
├─ src/components/              # UI and story player components
├─ src/services/                # Backend API service layer
├─ src/lib/                     # Shared utilities and Supabase client
├─ src/store/                   # Client state stores
├─ public/                      # Static assets
└─ .env.local.example           # Environment template
```

## Interface Contract (Backend)

Primary integration points used by `src/services/apiService.ts`:

- `POST /generate`
- `GET /stories/{story_id}`
- `HEAD /docs` (availability check)

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Running backend API (default: `http://127.0.0.1:8000`)

### 1) Install and Configure

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

Required variables in `frontend/.env.local`:

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL |

### 2) Run Development Server

```bash
npm run dev
```

Open: `http://localhost:3000`

## Available Scripts

- `npm run dev` - Run local development server
- `npm run build` - Build for production
- `npm run start` - Start production build
- `npm run lint` - Run ESLint checks

## Operational Notes

- Missing Supabase variables may allow placeholder initialization, but real auth/storage operations will fail.
- Before merging, run at least `npm run lint` and validate key user flows on mobile and desktop breakpoints.
- Keep frontend-backend API contracts synchronized when changing response schema.

## Troubleshooting

- Backend connection errors:
  - Verify backend process is running.
  - Confirm `NEXT_PUBLIC_API_URL` matches backend host/port.
- Supabase auth/data errors:
  - Re-check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
