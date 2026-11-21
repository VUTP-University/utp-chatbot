"""Tests for the DigitalOcean agent client (services/agent.py)."""
from unittest.mock import patch, MagicMock

import pytest

from history import save_message
from services.agent import ask_agent

SESSION = "6f1c1a52-6d1e-4f43-9a55-1d6a8e1b2c3d"


def _agent_response(answer="Hi!"):
    mock = MagicMock()
    mock.json.return_value = {"choices": [{"message": {"content": answer}}]}
    mock.raise_for_status = MagicMock()
    return mock


def test_returns_answer_from_agent(app):
    with app.app_context(), patch("services.agent.requests.post", return_value=_agent_response("42")) as post:
        result = ask_agent("What is the answer?", SESSION)

    assert result == {"answer": "42"}
    url = post.call_args.args[0]
    assert url == "http://mock-agent/api/v1/chat/completions"
    assert post.call_args.kwargs["headers"]["Authorization"] == "Bearer test-key"


def test_sets_request_timeout(app):
    with app.app_context(), patch("services.agent.requests.post", return_value=_agent_response()) as post:
        ask_agent("Hello", SESSION)

    timeout = post.call_args.kwargs["timeout"]
    assert timeout is not None
    assert all(t > 0 for t in timeout)


def test_sends_prior_history_as_openai_messages(app):
    with app.app_context():
        save_message(SESSION, "Q1", "A1")
        with patch("services.agent.requests.post", return_value=_agent_response()) as post:
            ask_agent("Q2", SESSION)

    sent = post.call_args.kwargs["json"]["messages"]
    assert sent == [
        {"role": "user", "content": "Q1"},
        {"role": "assistant", "content": "A1"},
        {"role": "user", "content": "Q2"},
    ]


def test_limits_history_to_most_recent_messages(app):
    app.config["MAX_HISTORY_PER_SESSION"] = 4
    try:
        with app.app_context():
            for i in range(5):
                save_message(SESSION, f"Q{i}", f"A{i}")
            with patch("services.agent.requests.post", return_value=_agent_response()) as post:
                ask_agent("latest", SESSION)
    finally:
        app.config["MAX_HISTORY_PER_SESSION"] = 20

    contents = [m["content"] for m in post.call_args.kwargs["json"]["messages"]]
    assert contents == ["Q3", "A3", "Q4", "A4", "latest"]


@pytest.mark.parametrize("key", ["DO_AGENT_URL", "DO_AGENT_KEY"])
def test_raises_value_error_when_not_configured(app, key):
    original = app.config[key]
    app.config[key] = ""
    try:
        with app.app_context(), patch("services.agent.requests.post") as post:
            with pytest.raises(ValueError):
                ask_agent("Hello", SESSION)
        post.assert_not_called()
    finally:
        app.config[key] = original
