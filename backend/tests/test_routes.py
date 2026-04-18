"""Tests for the chat API routes."""
import json
from unittest.mock import patch


# ── /api/health ────────────────────────────────────────────────────────────────

def test_health_returns_ok(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}


# ── /api/chat ──────────────────────────────────────────────────────────────────

def test_chat_requires_json_body(client):
    response = client.post("/api/chat")
    assert response.status_code == 400
    assert "error" in response.get_json()


def test_chat_requires_message_field(client):
    response = client.post(
        "/api/chat",
        json={"session_id": "test-session-1"},
    )
    assert response.status_code == 400
    data = response.get_json()
    assert "message" in data["error"].lower()


def test_chat_requires_session_id_field(client):
    response = client.post(
        "/api/chat",
        json={"message": "Hello"},
    )
    assert response.status_code == 400
    data = response.get_json()
    assert "session_id" in data["error"].lower()


def test_chat_returns_answer_on_success(client):
    with patch("routes.chat.ask_agent") as mock_agent:
        mock_agent.return_value = {"answer": "Hello from the bot!"}
        response = client.post(
            "/api/chat",
            json={"message": "Hello", "session_id": "test-session-2"},
        )

    assert response.status_code == 200
    data = response.get_json()
    assert data["answer"] == "Hello from the bot!"
    assert data["session_id"] == "test-session-2"


def test_chat_saves_messages_to_history(client):
    with patch("routes.chat.ask_agent") as mock_agent:
        mock_agent.return_value = {"answer": "The answer is 42."}
        client.post(
            "/api/chat",
            json={"message": "What is the answer?", "session_id": "test-session-3"},
        )

    response = client.get("/api/history/test-session-3")
    assert response.status_code == 200
    messages = response.get_json()["messages"]
    assert len(messages) == 2
    assert messages[0]["role"] == "user"
    assert messages[0]["content"] == "What is the answer?"
    assert messages[1]["role"] == "bot"
    assert messages[1]["content"] == "The answer is 42."


def test_chat_returns_502_when_agent_fails(client):
    with patch("routes.chat.ask_agent", side_effect=Exception("connection refused")):
        response = client.post(
            "/api/chat",
            json={"message": "Hello", "session_id": "test-session-4"},
        )
    assert response.status_code == 502
    assert "error" in response.get_json()


# ── /api/history ───────────────────────────────────────────────────────────────

def test_history_empty_for_new_session(client):
    response = client.get("/api/history/unknown-session-99")
    assert response.status_code == 200
    data = response.get_json()
    assert data["messages"] == []
    assert data["session_id"] == "unknown-session-99"


def test_clear_history_via_delete(client):
    with patch("routes.chat.ask_agent") as mock_agent:
        mock_agent.return_value = {"answer": "Hi!"}
        client.post("/api/chat", json={"message": "Hey", "session_id": "del-session"})

    response = client.delete("/api/history/del-session")
    assert response.status_code == 200
    data = response.get_json()
    assert data["session_id"] == "del-session"


def test_clear_history_via_post(client):
    """POST /api/history/<id> is used by navigator.sendBeacon on page unload."""
    with patch("routes.chat.ask_agent") as mock_agent:
        mock_agent.return_value = {"answer": "Hi!"}
        client.post("/api/chat", json={"message": "Hey", "session_id": "beacon-session"})

    response = client.post("/api/history/beacon-session")
    assert response.status_code == 200
    assert response.get_json()["session_id"] == "beacon-session"
