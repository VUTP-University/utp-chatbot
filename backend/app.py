from flask import Flask
from flask_cors import CORS
from config import get_config
from models import db


def create_app():
    app = Flask(__name__)
    app.config.from_object(get_config())

    CORS(app)
    db.init_app(app)

    with app.app_context():
        db.create_all()

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        if exception:
            db.session.rollback()
        db.session.remove()

    from routes.chat import chat_bp
    app.register_blueprint(chat_bp, url_prefix="/api")

    return app
