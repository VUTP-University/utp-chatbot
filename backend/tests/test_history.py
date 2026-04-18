"""Tests for the history module (DB layer)."""
import pytest
from models import db, Session
from history import save_message, get_history, clear_history


def test_get_history_returns_empty_list_for_unknown_session(app):
    with app.app_context():
        result = get_history("nonexistent-session")
    assert result == []


def test_save_message_creates_session_and_messages(app):
    with app.app_context():
        save_message("sess-001", "Hello bot", "Hello user!")
        messages = get_history("sess-001")

    assert len(messages) == 2
    assert messages[0]["role"] == "user"
    assert messages[0]["content"] == "Hello bot"
    assert messages[1]["role"] == "bot"
    assert messages[1]["content"] == "Hello user!"


def test_save_message_appends_to_existing_session(app):
    with app.app_context():
        save_message("sess-002", "First question", "First answer")
        save_message("sess-002", "Second question", "Second answer")
        messages = get_history("sess-002")

    assert len(messages) == 4
    assert messages[2]["content"] == "Second question"
    assert messages[3]["content"] == "Second answer"


def test_get_history_returns_messages_in_chronological_order(app):
    with app.app_context():
        save_message("sess-003", "A", "B")
        save_message("sess-003", "C", "D")
        messages = get_history("sess-003")

    contents = [m["content"] for m in messages]
    assert contents == ["A", "B", "C", "D"]


def test_clear_history_marks_session_as_closed(app):
    with app.app_context():
        save_message("sess-004", "Hello", "World")
        clear_history("sess-004")
        session = db.session.get(Session, "sess-004")
        assert session is not None
        assert session.closed is True


def test_clear_history_preserves_messages(app):
    """Records are soft-deleted: messages remain in the DB after clearing."""
    with app.app_context():
        save_message("sess-005", "Keep me", "I am kept")
        clear_history("sess-005")
        messages = get_history("sess-005")

    assert len(messages) == 2


def test_clear_history_on_nonexistent_session_does_not_raise(app):
    with app.app_context():
        clear_history("does-not-exist")


def test_history_message_has_timestamp_field(app):
    with app.app_context():
        save_message("sess-006", "Ping", "Pong")
        messages = get_history("sess-006")

    assert "timestamp" in messages[0]
    assert messages[0]["timestamp"] is not None
