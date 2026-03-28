from datetime import datetime
from collections import defaultdict
from flask import current_app

# In-memory store: { session_id: [ {role, content, timestamp}, ... ] }
# This resets when the server restarts — good enough for now.
# Replace with a database (SQLite/PostgreSQL) when you need persistence.
_history: dict[str, list] = defaultdict(list)


def save_message(session_id: str, user_message: str, bot_answer: str) -> None:
    """Append a user + bot message pair to the session history."""
    max_messages = current_app.config.get("MAX_HISTORY_PER_SESSION", 50)

    _history[session_id].append({
        "role": "user",
        "content": user_message,
        "timestamp": datetime.utcnow().isoformat(),
    })
    _history[session_id].append({
        "role": "bot",
        "content": bot_answer,
        "timestamp": datetime.utcnow().isoformat(),
    })

    # Trim oldest messages if we exceed the limit
    if len(_history[session_id]) > max_messages * 2:
        _history[session_id] = _history[session_id][-(max_messages * 2):]


def get_history(session_id: str) -> list:
    """Return all messages for a session."""
    return _history.get(session_id, [])


def clear_history(session_id: str) -> None:
    """Clear history for a session (e.g. when user clicks 'New chat')."""
    if session_id in _history:
        del _history[session_id]