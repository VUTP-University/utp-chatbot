import logging
import threading
import time

import requests as http
from models import db, BudgetCheck

logger = logging.getLogger(__name__)

_DO_BILLING_URL = "https://api.digitalocean.com/v2/customers/my/balance"


class BudgetGuard:
    """Periodic budget watchdog that blocks AI requests when monthly spend exceeds the limit.

    Polls the DigitalOcean Billing API on a background daemon thread.
    Fails open on API errors — existing cached status is preserved.
    """

    def __init__(self):
        self._exceeded = False
        self._current_usage = 0.0
        self._lock = threading.Lock()

    @property
    def exceeded(self) -> bool:
        with self._lock:
            return self._exceeded

    @property
    def current_usage(self) -> float:
        with self._lock:
            return self._current_usage

    def check(self, app) -> None:
        """Query the DO Billing API and update the exceeded flag.

        Keeps existing status unchanged if the API is unreachable (fail open).
        Logs a warning when usage crosses BUDGET_WARN_THRESHOLD before the hard block.
        """
        limit = float(app.config.get("BUDGET_LIMIT_USD") or 0)
        warn_ratio = float(app.config.get("BUDGET_WARN_THRESHOLD") or 0.8)
        api_key = app.config.get("DO_BILLING_API_KEY") or ""

        if not limit or not api_key:
            logger.debug("Budget guard is not configured — skipping check.")
            return

        try:
            resp = http.get(
                _DO_BILLING_URL,
                headers={"Authorization": f"Bearer {api_key}"},
                timeout=10,
            )
            resp.raise_for_status()
            usage = float(resp.json().get("month_to_date_usage") or 0)
        except Exception as exc:
            logger.warning("Budget check failed — keeping existing status. Error: %s", exc)
            self._persist(limit=limit, usage=None, exceeded=self._exceeded, api_reachable=False)
            return  # fail open: do not change the current flag

        with self._lock:
            self._current_usage = usage
            self._exceeded = usage >= limit

        self._persist(limit=limit, usage=usage, exceeded=self._exceeded, api_reachable=True)

        ratio = usage / limit
        if self._exceeded:
            logger.error("Budget EXCEEDED: $%.2f / $%.2f limit.", usage, limit)
        elif ratio >= warn_ratio:
            logger.warning(
                "Budget warning: $%.2f / $%.2f (%.0f%% of limit).",
                usage, limit, ratio * 100,
            )
        else:
            logger.info("Budget OK: $%.2f / $%.2f.", usage, limit)

    def _persist(self, limit: float, usage: float | None, exceeded: bool, api_reachable: bool) -> None:
        """Write a BudgetCheck row. Silently swallows DB errors to never disrupt the guard."""
        try:
            db.session.add(BudgetCheck(
                usage_usd=usage,
                limit_usd=limit,
                exceeded=exceeded,
                api_reachable=api_reachable,
            ))
            db.session.commit()
            db.session.expire_all()
        except Exception as exc:
            db.session.rollback()
            logger.warning("Failed to persist budget check to DB: %s", exc)

    def start_scheduler(self, app, interval_minutes: int) -> None:
        """Run an immediate check then keep polling every interval_minutes on a daemon thread."""
        with app.app_context():
            self.check(app)

        def _loop():
            while True:
                time.sleep(interval_minutes * 60)
                with app.app_context():
                    self.check(app)

        thread = threading.Thread(target=_loop, daemon=True, name="budget-guard")
        thread.start()
        logger.info(
            "Budget scheduler started — interval %d min, limit $%.2f.",
            interval_minutes,
            float(app.config.get("BUDGET_LIMIT_USD") or 0),
        )


# Module-level singleton — imported by routes and app factory
budget_guard = BudgetGuard()
