from flask import Flask
from flask_cors import CORS
from config import get_config
 
 
def create_app():
    app = Flask(__name__)
    app.config.from_object(get_config())
 
    # Allow requests from any origin (public chatbot)
    CORS(app)
 
    # Register blueprints
    from routes.chat import chat_bp
    app.register_blueprint(chat_bp, url_prefix="/api")
 
    return app