import logging
from flask import Blueprint, request, jsonify
from models import db
from services.agent import ask_agent
from history import save_message, get_history, clear_history

chat_bp = Blueprint("chat", __name__)
logger = logging.getLogger(__name__)


@chat_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    message = (data.get("message") or "").strip()
    session_id = (data.get("session_id") or "").strip()

    if not message:
        return jsonify({"error": "message is required"}), 400

    if not session_id:
        return jsonify({"error": "session_id is required"}), 400

    logger.info("Chat request | session=%s | message_len=%d", session_id, len(message))

    try:
        response = ask_agent(message, session_id)
        save_message(session_id, message, response["answer"])
        return jsonify({"answer": response["answer"], "session_id": session_id})
    except ValueError as e:
        db.session.rollback()
        logger.error("Agent config error: %s", e)
        return jsonify({"error": "Chatbot is not configured correctly. Contact the administrator."}), 500
    except Exception as e:
        db.session.rollback()
        logger.error("Agent call failed: %s", e)
        return jsonify({"error": "Failed to reach the chatbot service. Please try again."}), 502


@chat_bp.route("/history/<session_id>", methods=["GET"])
def history(session_id):
    messages = get_history(session_id)
    return jsonify({"session_id": session_id, "messages": messages})


@chat_bp.route("/history/<session_id>", methods=["DELETE", "POST"])
def clear(session_id):
    clear_history(session_id)
    return jsonify({"message": "History cleared", "session_id": session_id})


@chat_bp.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})
