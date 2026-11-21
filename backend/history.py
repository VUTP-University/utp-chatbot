from datetime import datetime, timezone
from models import db, Session, Message


def _get_or_create_session(session_id: str) -> Session:
    session = db.session.get(Session, session_id)
    if not session:
        session = Session(id=session_id)
        db.session.add(session)
        db.session.flush()
    else:
        session.last_active = datetime.now(timezone.utc)
    return session


def save_message(session_id: str, user_message: str, bot_answer: str) -> None:
    _get_or_create_session(session_id)

    db.session.add(Message(session_id=session_id, role="user", content=user_message))
    db.session.add(Message(session_id=session_id, role="bot",  content=bot_answer))
    db.session.commit()


def get_history(session_id: str, limit: int | None = None) -> list:
    """Return messages in chronological order.

    When ``limit`` is given, only the most recent ``limit`` messages are returned.
    """
    query = Message.query.filter_by(session_id=session_id)
    if limit is not None:
        recent = query.order_by(Message.created_at.desc(), Message.id.desc()).limit(limit).all()
        messages = list(reversed(recent))
    else:
        messages = query.order_by(Message.created_at.asc(), Message.id.asc()).all()
    return [
        {"role": m.role, "content": m.content, "timestamp": m.created_at.isoformat()}
        for m in messages
    ]


def is_session_closed(session_id: str) -> bool:
    session = db.session.get(Session, session_id)
    return bool(session and session.closed)


def clear_history(session_id: str) -> None:
    """Mark the session as closed. Records are kept in the DB for history."""
    session = db.session.get(Session, session_id)
    if session:
        session.closed = True
        db.session.commit()
