"""Tests for the budget guard — BudgetGuard.check(), DB persistence, and route blocking."""
from unittest.mock import patch, MagicMock
import pytest
from models import db, BudgetCheck
from budget import budget_guard


# ── Fixtures ───────────────────────────────────────────────────────────────────

@pytest.fixture()
def budget_app(app):
    """Enable budget checking for the duration of one test."""
    app.config.update({
        "BUDGET_LIMIT_USD": 20.0,
        "BUDGET_WARN_THRESHOLD": 0.8,
        "DO_BILLING_API_KEY": "test-billing-key",
    })
    yield app
    # Restore defaults and reset singleton state between tests
    app.config["BUDGET_LIMIT_USD"] = 0
    with budget_guard._lock:
        budget_guard._exceeded = False
        budget_guard._current_usage = 0.0


@pytest.fixture()
def budget_client(budget_app):
    return budget_app.test_client()


def _billing_response(usage: float):
    """Return a mock requests.Response for the DO Billing API."""
    mock = MagicMock()
    mock.json.return_value = {"month_to_date_usage": str(usage)}
    mock.raise_for_status = MagicMock()
    return mock


# ── BudgetGuard.check() — flag logic ──────────────────────────────────────────

def test_check_not_exceeded_when_under_limit(budget_app):
    with patch("budget.http.get", return_value=_billing_response(10.0)):
        budget_guard.check(budget_app)

    assert budget_guard.exceeded is False
    assert budget_guard.current_usage == 10.0


def test_check_exceeded_when_over_limit(budget_app):
    with patch("budget.http.get", return_value=_billing_response(25.0)):
        budget_guard.check(budget_app)

    assert budget_guard.exceeded is True
    assert budget_guard.current_usage == 25.0


def test_check_exceeded_when_exactly_at_limit(budget_app):
    with patch("budget.http.get", return_value=_billing_response(20.0)):
        budget_guard.check(budget_app)

    assert budget_guard.exceeded is True


def test_check_resets_flag_when_usage_drops_below_limit(budget_app):
    # Simulate a prior exceeded state (e.g. new billing cycle just started)
    with budget_guard._lock:
        budget_guard._exceeded = True

    with patch("budget.http.get", return_value=_billing_response(5.0)):
        budget_guard.check(budget_app)

    assert budget_guard.exceeded is False


def test_check_keeps_existing_flag_when_api_unreachable(budget_app):
    with budget_guard._lock:
        budget_guard._exceeded = True

    with patch("budget.http.get", side_effect=Exception("connection refused")):
        budget_guard.check(budget_app)

    assert budget_guard.exceeded is True  # unchanged — fail open


def test_check_skips_entirely_when_limit_is_zero(app):
    with patch("budget.http.get") as mock_get:
        budget_guard.check(app)  # app has BUDGET_LIMIT_USD=0
    mock_get.assert_not_called()


def test_check_skips_when_billing_api_key_missing(budget_app):
    budget_app.config["DO_BILLING_API_KEY"] = ""
    with patch("budget.http.get") as mock_get:
        budget_guard.check(budget_app)
    mock_get.assert_not_called()
    budget_app.config["DO_BILLING_API_KEY"] = "test-billing-key"


# ── BudgetGuard._persist() — DB records ───────────────────────────────────────

def test_check_saves_record_when_under_limit(budget_app):
    with patch("budget.http.get", return_value=_billing_response(12.5)):
        budget_guard.check(budget_app)

    record = BudgetCheck.query.order_by(BudgetCheck.id.desc()).first()
    assert record is not None
    assert float(record.usage_usd) == 12.5
    assert float(record.limit_usd) == 20.0
    assert record.exceeded is False
    assert record.api_reachable is True


def test_check_saves_record_when_exceeded(budget_app):
    with patch("budget.http.get", return_value=_billing_response(22.0)):
        budget_guard.check(budget_app)

    record = BudgetCheck.query.order_by(BudgetCheck.id.desc()).first()
    assert record.exceeded is True
    assert record.api_reachable is True


def test_check_saves_unreachable_record_when_api_fails(budget_app):
    with patch("budget.http.get", side_effect=Exception("timeout")):
        budget_guard.check(budget_app)

    record = BudgetCheck.query.order_by(BudgetCheck.id.desc()).first()
    assert record is not None
    assert record.api_reachable is False
    assert record.usage_usd is None


def test_multiple_checks_create_multiple_records(budget_app):
    with patch("budget.http.get", return_value=_billing_response(5.0)):
        budget_guard.check(budget_app)
        budget_guard.check(budget_app)
        budget_guard.check(budget_app)

    count = BudgetCheck.query.count()
    assert count == 3


# ── Routes: budget flag affects health and chat ────────────────────────────────

def test_health_returns_budget_exceeded_when_flag_is_set(budget_client):
    with budget_guard._lock:
        budget_guard._exceeded = True

    response = budget_client.get("/api/health")
    assert response.status_code == 200
    assert response.get_json() == {"status": "budget_exceeded"}


def test_health_returns_ok_when_flag_is_clear(budget_client):
    with budget_guard._lock:
        budget_guard._exceeded = False

    response = budget_client.get("/api/health")
    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}


def test_chat_returns_503_when_budget_exceeded(budget_client):
    with budget_guard._lock:
        budget_guard._exceeded = True

    response = budget_client.post(
        "/api/chat",
        json={"message": "Hello", "session_id": "budget-block-session"},
    )
    assert response.status_code == 503
    data = response.get_json()
    assert data["error"] == "service_unavailable"
    assert data["reason"] == "monthly_budget_exceeded"


def test_chat_proceeds_normally_when_budget_not_exceeded(budget_client):
    with budget_guard._lock:
        budget_guard._exceeded = False

    with patch("routes.chat.ask_agent") as mock_agent:
        mock_agent.return_value = {"answer": "Hello!"}
        response = budget_client.post(
            "/api/chat",
            json={"message": "Hello", "session_id": "budget-ok-session"},
        )

    assert response.status_code == 200
    assert response.get_json()["answer"] == "Hello!"
