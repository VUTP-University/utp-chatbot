# Development guide

Technical documentation for running and developing UTP Assistant locally. For a description of the project itself, see the [README](README.md).

## Stack

- **Frontend:** React + Vite, Tailwind CSS v4, i18next (Bulgarian / English)
- **Backend:** Python, Flask, Flask-SQLAlchemy, PostgreSQL
- **AI:** DigitalOcean AI Agent (OpenAI-compatible API) connected to a knowledge base

## Prerequisites

- Python 3.11+
- Node.js 20+ and npm
- Docker (for the local PostgreSQL database)
- A DigitalOcean AI Agent (URL + API key)

## Project structure

```
utp-chatbot/
├── backend/     # Flask API, database models, budget guard, tests
└── frontend/    # React + Vite app
```

## Backend

```bash
cd backend
```

Create and activate a virtual environment, then install dependencies:

```bash
python -m venv venv
source venv/bin/activate      # macOS/Linux
venv\Scripts\activate         # Windows
pip install -r requirements.txt
```

Create `backend/.env` from the template and fill in your values:

```bash
cp .env.local .env
```

Start the local PostgreSQL database:

```bash
docker compose up -d
```

Run the API:

```bash
python run.py
```

The API is available at `http://localhost:5000`.

### API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | Send a message (`message`, `session_id` as UUID), get a response |
| `GET` | `/api/history/<session_id>` | Get chat history for a session |
| `DELETE` / `POST` | `/api/history/<session_id>` | Close the session (`POST` is used by `navigator.sendBeacon` on page unload) |
| `GET` | `/api/health` | Health check (`ok` or `budget_exceeded`) |

### Tests

```bash
DATABASE_URL="sqlite:///:memory:" DO_AGENT_URL=http://mock-agent DO_AGENT_KEY=test-key \
  SECRET_KEY=ci FLASK_ENV=development pytest tests/ -q
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The app is available at `http://localhost:5173`. Requests to `/api/*` are proxied to the backend at `http://localhost:5000`.

```bash
npm run lint     # ESLint
npm run build    # production build in dist/
```

## Environment variables

Set in `backend/.env`. See `backend/.env.local` for a template.

| Variable | Description |
|----------|-------------|
| `DO_AGENT_URL` | Base URL of the DigitalOcean AI Agent |
| `DO_AGENT_KEY` | API key for the AI Agent |
| `DATABASE_URL` | PostgreSQL connection string |
| `POSTGRES_DB` / `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_PORT` | Used by `docker-compose.yml` for the local database |
| `SECRET_KEY` | Flask secret key |
| `FLASK_ENV` | `development` or `production` |
| `MAX_HISTORY_PER_SESSION` | Optional. Max prior messages sent to the agent as context (default `20`) |
| `AGENT_CONNECT_TIMEOUT` / `AGENT_READ_TIMEOUT` | Optional. Agent request timeouts in seconds (defaults `5` / `60`) |
| `BUDGET_LIMIT_USD` | Optional. Monthly DigitalOcean spend limit; chat is blocked when exceeded (`0` disables) |
| `BUDGET_WARN_THRESHOLD` | Optional. Fraction of the limit that triggers a warning in the logs (default `0.8`) |
| `BUDGET_CHECK_INTERVAL_MINUTES` | Optional. How often the billing API is polled (default `60`) |
| `DO_BILLING_API_KEY` | DigitalOcean API key used by the budget guard |

## Continuous integration

Pull requests to `master` run backend tests (pytest), frontend lint and build, and checks that block `print(` in Python and `console.log(` in JavaScript.
