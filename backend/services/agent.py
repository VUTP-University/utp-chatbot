import requests
from flask import current_app
from history import get_history


def ask_agent(user_message: str, session_id: str = None) -> dict:
    """Send the conversation to the DigitalOcean AI Agent and return its answer.

    Raises ValueError when the agent is not configured.
    """
    cfg = current_app.config
    base_url = (cfg.get("DO_AGENT_URL") or "").rstrip("/")
    api_key = cfg.get("DO_AGENT_KEY") or ""
    if not base_url or not api_key:
        raise ValueError("DO_AGENT_URL and DO_AGENT_KEY must be set")

    # Build recent conversation history in OpenAI messages format
    limit = cfg.get("MAX_HISTORY_PER_SESSION", 20)
    prior = get_history(session_id, limit=limit) if session_id else []
    messages = [
        {"role": "user" if msg["role"] == "user" else "assistant", "content": msg["content"]}
        for msg in prior
    ]
    messages.append({"role": "user", "content": user_message})

    resp = requests.post(
        f"{base_url}/api/v1/chat/completions",
        json={"messages": messages},
        headers={"Authorization": f"Bearer {api_key}"},
        timeout=(cfg.get("AGENT_CONNECT_TIMEOUT", 5), cfg.get("AGENT_READ_TIMEOUT", 60)),
    )
    resp.raise_for_status()
    data = resp.json()
    answer = data["choices"][0]["message"]["content"]
    return {"answer": answer}
