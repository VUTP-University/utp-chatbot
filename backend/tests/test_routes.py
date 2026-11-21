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
        json={"session_id": "a44d7b12-4f09-4f60-89ae-b9a700891617"},
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
            json={"message": "Hello", "session_id": "8592acb8-fc71-4975-b305-6cf18c416660"},
        )

    assert response.status_code == 200
    data = response.get_json()
    assert data["answer"] == "Hello from the bot!"
    assert data["session_id"] == "8592acb8-fc71-4975-b305-6cf18c416660"


def test_chat_saves_messages_to_history(client):
    with patch("routes.chat.ask_agent") as mock_agent:
        mock_agent.return_value = {"answer": "The answer is 42."}
        client.post(
            "/api/chat",
            json={"message": "What is the answer?", "session_id": "5a829f03-9349-46cc-a21b-0ae5b68e1c5a"},
        )

    response = client.get("/api/history/5a829f03-9349-46cc-a21b-0ae5b68e1c5a")
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
            json={"message": "Hello", "session_id": "5dd536b7-7e12-46fd-ab34-938b22cbdc1c"},
        )
    assert response.status_code == 502
    assert "error" in response.get_json()


# ── /api/history ───────────────────────────────────────────────────────────────

def test_history_empty_for_new_session(client):
    response = client.get("/api/history/8c0cea58-a61b-4af3-a5a7-3f33de8e4edc")
    assert response.status_code == 200
    data = response.get_json()
    assert data["messages"] == []
    assert data["session_id"] == "8c0cea58-a61b-4af3-a5a7-3f33de8e4edc"


def test_clear_history_via_delete(client):
    with patch("routes.chat.ask_agent") as mock_agent:
        mock_agent.return_value = {"answer": "Hi!"}
        client.post("/api/chat", json={"message": "Hey", "session_id": "e49ed1d9-37ce-49b1-9a40-6402a7246223"})

    response = client.delete("/api/history/e49ed1d9-37ce-49b1-9a40-6402a7246223")
    assert response.status_code == 200
    data = response.get_json()
    assert data["session_id"] == "e49ed1d9-37ce-49b1-9a40-6402a7246223"


def test_clear_history_via_post(client):
    """POST /api/history/<id> is used by navigator.sendBeacon on page unload."""
    with patch("routes.chat.ask_agent") as mock_agent:
        mock_agent.return_value = {"answer": "Hi!"}
        client.post("/api/chat", json={"message": "Hey", "session_id": "0ba9dc02-a5ec-4a3d-b8c0-758c75c7276c"})

    response = client.post("/api/history/0ba9dc02-a5ec-4a3d-b8c0-758c75c7276c")
    assert response.status_code == 200
    assert response.get_json()["session_id"] == "0ba9dc02-a5ec-4a3d-b8c0-758c75c7276c"


# ── Validation & session lifecycle ───────────────────────────────────────────

VALID_ID = "0b7c6a1e-2f4d-4c8b-9a3e-5d6f7a8b9c0d"


def test_chat_rejects_non_uuid_session_id(client):
    with patch("routes.chat.ask_agent") as mock_agent:
        response = client.post("/api/chat", json={"message": "Hi", "session_id": "x" * 100})
    assert response.status_code == 400
    assert "uuid" in response.get_json()["error"].lower()
    mock_agent.assert_not_called()


def test_chat_rejects_message_over_max_length(client):
    with patch("routes.chat.ask_agent") as mock_agent:
        response = client.post("/api/chat", json={"message": "a" * 2001, "session_id": VALID_ID})
    assert response.status_code == 400
    mock_agent.assert_not_called()


def test_chat_rejects_closed_session(client):
    with patch("routes.chat.ask_agent") as mock_agent:
        mock_agent.return_value = {"answer": "Hi!"}
        client.post("/api/chat", json={"message": "Hey", "session_id": VALID_ID})
        client.delete(f"/api/history/{VALID_ID}")
        mock_agent.reset_mock()

        response = client.post("/api/chat", json={"message": "Again", "session_id": VALID_ID})

    assert response.status_code == 409
    assert response.get_json()["error"] == "session_closed"
    mock_agent.assert_not_called()


def test_chat_returns_500_when_agent_not_configured(client):
    with patch("routes.chat.ask_agent", side_effect=ValueError("not configured")):
        response = client.post("/api/chat", json={"message": "Hello", "session_id": VALID_ID})
    assert response.status_code == 500


def test_history_rejects_non_uuid_session_id(client):
    assert client.get("/api/history/not-a-uuid").status_code == 400
    assert client.delete("/api/history/not-a-uuid").status_code == 400
