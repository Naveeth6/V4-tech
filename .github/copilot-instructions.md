## Repo orientation — quick skimmable facts

- Architecture: monorepo-like layout with a Python FastAPI backend in `backend/` and a Create React App frontend in `frontend/`.
- Backend is an async FastAPI service (`backend/server.py`) using Motor (`motor.AsyncIOMotorClient`) to talk to MongoDB. Environment variables are loaded from `backend/.env` (at least `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`).
- Frontend is a standard CRA app under `frontend/` (note: there is also a nested `frontend/frontend/` copy); UI components live in `frontend/src/components/ui/`.

## How to run (developer commands)

- Backend (from `backend/`):

  1. Create a virtualenv and install: `python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt`.
  2. Ensure `backend/.env` contains `MONGO_URL` and `DB_NAME` (example exists in `backend/.env`).
  3. Run the server: `uvicorn server:app --reload --host 0.0.0.0 --port 8000`.

- Frontend (from `frontend/`):

  1. Install: `npm install`.
  2. Dev server: `npm start` (CRA default on http://localhost:3000).

## Key integration points & data flows

- Frontend talks to backend API prefixed with `/api` (see `api_router` in `backend/server.py`).
- Auth: backend creates/validates sessions by calling the external OAuth session endpoint `https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data` in `create_session`. Session cookie name is `session_token` and server sets `httponly`, `secure`, and `samesite=none`.
- Database collections referenced include: `users`, `user_sessions`, `customer_details`, `reviews`, `complaints`, `contact_messages` — see `server.py` for usages and query patterns.

## Project-specific conventions & patterns

- Pydantic v2 usage: models use `model_config = ConfigDict(extra="ignore")` and serialization uses `model_dump()`/`model_dump()` patterns. When storing datetimes they are converted to ISO strings before insertion and converted back on read (see `created_at` handling).
- IDs: most domain models use `uuid` or a generated `complaint_id` (`CMP{8 chars}`) — preserve these formats when creating fixtures or synthetic data.
- Async everywhere: use `async`/`await` for DB and HTTP calls (motor + httpx). Avoid blocking I/O on the backend.
- CORS: configured via `CORS_ORIGINS` env var (defaults to `*`) in `backend/.env`; middleware is added in `server.py`.

## Code locations to inspect for changes or examples

- Backend endpoints and domain logic: `backend/server.py` (single-file app — most behavior lives here).
- Backend deps & dev tooling: `backend/requirements.txt` (includes uvicorn, fastapi, motor, python-dotenv, httpx, black, flake8, mypy, pytest).
- Frontend app entry & components: `frontend/src/index.js`, `frontend/src/App.js`, and `frontend/src/components/ui/*` for reusable UI components.

## Tests & linters

- Backend tests use pytest (package present). Run from `backend/`: `pytest`.
- Formatting/linting: repo lists `black`, `flake8`, `mypy` in backend requirements. Run them from `backend/` against Python files.
- Frontend tests use CRA: `npm test` in `frontend/`.

## Small gotchas for edit/PR authors and AI agents

- Keep async patterns intact — converting async DB calls to blocking calls will break behavior.
- When creating/updating DB docs, timestamps are stored as ISO strings; follow the same pattern to avoid deserialization bugs.
- External auth dependency: `create_session` relies on an external demo endpoint — for offline work, mock this call or stub responses when writing tests.
- There is a duplicate `frontend/README.md` under `frontend/frontend/`; prefer the top-level `frontend/` path for commands unless you know the nested copy is intended.

If anything above is unclear or you'd like more specifics (example requests, example cURL to a particular endpoint, or a sample `.env` with safe placeholders), tell me which area to expand and I'll update this file. 
