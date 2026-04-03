# ВУТП ChatBot

An AI-powered chatbot for the University of Telecommunications and Post (ВУТП / UTP), built to help students and applicants get instant answers about programs, admissions, fees, and campus life.

## About

The chatbot is powered by a DigitalOcean AI Agent connected to the university's knowledge base. It supports both **English** and **Bulgarian** and requires no registration to use.

**Stack:**
- **Frontend** — React + Vite, Tailwind CSS v4, i18next
- **Backend** — Python, Flask, Flask-CORS
- **AI** — DigitalOcean AI Agent (OpenAI-compatible API)

---

## Prerequisites

- Python 3.11+
- Node.js 18+
- npm 9+
- A DigitalOcean AI Agent (URL + API key)

---

## Project structure

```
utp-chatbot/
├── backend/     # Flask API
└── frontend/    # React + Vite app
```

---

## Backend setup

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate      # macOS/Linux
venv\Scripts\activate         # Windows
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```env
DO_AGENT_URL=https://your-agent-id.agents.do-ai.run
DO_AGENT_KEY=your_api_key_here

FLASK_ENV=development
```

Run the server:

```bash
python run.py
```

The API will be available at `http://localhost:5000`.

### API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | Send a message, get a response |
| `GET` | `/api/history/<session_id>` | Get chat history for a session |
| `DELETE` | `/api/history/<session_id>` | Clear session history |
| `GET` | `/api/health` | Health check |

---

## Frontend setup

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`. API requests to `/api/*` are proxied to the backend at `http://localhost:5000`.

Build for production:

```bash
npm run build
```

---

## Environment variables

| Variable | Description |
|----------|-------------|
| `DO_AGENT_URL` | Base URL of your DigitalOcean AI Agent |
| `DO_AGENT_KEY` | API key for the AI Agent |
| `FLASK_ENV` | `development` or `production` |

---

## License

GNU General Public License v3.0 (GPL-3.0)
