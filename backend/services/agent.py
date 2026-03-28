import os
import requests
from history import get_history

DO_AGENT_BASE_URL = os.getenv("DO_AGENT_URL", "").rstrip("/")
DO_AGENT_KEY = os.getenv("DO_AGENT_KEY")

_CHAT_ENDPOINT = f"{DO_AGENT_BASE_URL}/api/v1/chat/completions"


def ask_agent(user_message: str, session_id: str = None) -> dict:
    # Build full conversation history in OpenAI messages format
    prior = get_history(session_id) if session_id else []
    messages = []
    for msg in prior:
        role = "user" if msg["role"] == "user" else "assistant"
        messages.append({"role": role, "content": msg["content"]})
    messages.append({"role": "user", "content": user_message})

    resp = requests.post(
        _CHAT_ENDPOINT,
        json={"messages": messages},
        headers={"Authorization": f"Bearer {DO_AGENT_KEY}"},
    )
    resp.raise_for_status()
    data = resp.json()
    answer = data["choices"][0]["message"]["content"]
    return {"answer": answer}
