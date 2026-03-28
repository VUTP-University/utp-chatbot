import logging
from flask import Blueprint, request, jsonify
from services.agent import ask_agent
from history import save_message, get_history, clear_history

chat_bp = Blueprint("chat", __name__)
logger = logging.getLogger(__name__)


@chat_bp.route("/chat", methods=["POST"])
def chat():
    """
    Send a message to the UTP chatbot.

    Request body:
        {
            "message": "What are the admission requirements?",
            "session_id": "uuid-generated-by-frontend"
        }

    Response:
        {
            "answer": "The admission requirements are ...",
            "session_id": "uuid-generated-by-frontend"
        }
    """
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
    except ValueError as e:
        logger.error("Agent config error: %s", e)
        return jsonify({"error": "Chatbot is not configured correctly. Contact the administrator."}), 500
    except Exception as e:
        logger.error("Agent call failed: %s", e)
        return jsonify({"error": "Failed to reach the chatbot service. Please try again."}), 502

    save_message(session_id, message, response["answer"])

    return jsonify({
        "answer": response["answer"],
        "session_id": session_id,
    })


@chat_bp.route("/history/<session_id>", methods=["GET"])
def history(session_id):
    """
    Get the chat history for a session.

    Response:
        {
            "session_id": "...",
            "messages": [
                {"role": "user", "content": "...", "timestamp": "..."},
                {"role": "bot",  "content": "...", "timestamp": "..."},
                ...
            ]
        }
    """
    messages = get_history(session_id)
    return jsonify({
        "session_id": session_id,
        "messages": messages,
    })


@chat_bp.route("/history/<session_id>", methods=["DELETE"])
def clear(session_id):
    """Clear the chat history for a session (new chat button)."""
    clear_history(session_id)
    return jsonify({"message": "History cleared", "session_id": session_id})


@chat_bp.route("/health", methods=["GET"])
def health():
    """Health check endpoint — useful for deployment monitoring."""
    return jsonify({"status": "ok"})