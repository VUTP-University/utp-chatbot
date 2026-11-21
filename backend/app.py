import os

from flask import Flask
from flask_cors import CORS
from config import get_config
from models import db


def _is_reloader_parent(app) -> bool:
    """True in the Werkzeug reloader's watcher process, which never serves requests.

    In debug mode the dev server runs the app twice: a parent that watches files
    and a child (WERKZEUG_RUN_MAIN=true) that serves. Only the child should poll.
    """
    return app.debug and os.environ.get("WERKZEUG_RUN_MAIN") != "true"


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_object(get_config())
    if test_config:
        app.config.update(test_config)

    CORS(app)
    db.init_app(app)

    with app.app_context():
        db.create_all()

    if app.config.get("BUDGET_LIMIT_USD") and not _is_reloader_parent(app):
        from budget import budget_guard
        interval = app.config.get("BUDGET_CHECK_INTERVAL_MINUTES", 60)
        budget_guard.start_scheduler(app, interval)

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        if exception:
            db.session.rollback()
        db.session.remove()

    from routes.chat import chat_bp
    app.register_blueprint(chat_bp, url_prefix="/api")

    return app
