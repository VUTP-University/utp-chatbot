from datetime import datetime, timezone
from decimal import Decimal
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Session(db.Model):
    """Represents a chat session between a user and the chatbot.
    
    Each session can have multiple messages, and is identified by a unique UUID.
    
    Attributes:
    - id: A unique identifier for the session (UUID).
    - created_at: The timestamp when the session was created.
    - last_active: The timestamp of the last activity in the session (updated on each message
        creation).
    - messages: A relationship to the Message model, representing all messages in this session.
    

    Methods:
    - __repr__: Returns a string representation of the session for debugging purposes.
    """


    __tablename__ = "sessions"

    id = db.Column(db.String(36), primary_key=True)  # UUID from frontend
    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    last_active = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    closed = db.Column(db.Boolean, nullable=False, default=False)

    messages = db.relationship("Message", backref="session", cascade="all, delete-orphan", lazy=True)
    
    def __repr__(self):
        return f"<Session id={self.id} created_at={self.created_at} last_active={self.last_active}>"
    


class Message(db.Model):
    """Represents a single message in a chat session, either from the user or the chatbot.
    Each message is associated with a session via a foreign key relationship.
    
    Attributes:
    - id: A unique identifier for the message (integer).
    - session_id: The ID of the session this message belongs to.
    - role: The role of the message sender ('user' or 'bot').
    - content: The content of the message.
    - created_at: The timestamp when the message was created.

    Methods:
    - __repr__: Returns a string representation of the message for debugging purposes.
    """
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(36), db.ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    role = db.Column(db.String(10), nullable=False)  # 'user' or 'bot'
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    
    def __repr__(self):
        return f"<Message id={self.id} session_id={self.session_id} role={self.role} created_at={self.created_at}>"


class BudgetCheck(db.Model):
    """Records the result of every periodic DigitalOcean billing API poll.

    Attributes:
    - id: Auto-increment primary key.
    - checked_at: UTC timestamp of when the check ran.
    - usage_usd: Month-to-date spend reported by the DO Billing API.
    - limit_usd: The configured budget limit at the time of the check.
    - exceeded: Whether usage_usd >= limit_usd.
    - api_reachable: False when the DO Billing API was unreachable; usage_usd is NULL in that case.
    """

    __tablename__ = "budget_checks"

    id = db.Column(db.Integer, primary_key=True)
    checked_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    usage_usd = db.Column(db.Numeric(10, 4), nullable=True)   # NULL when API unreachable
    limit_usd = db.Column(db.Numeric(10, 4), nullable=False)
    exceeded = db.Column(db.Boolean, nullable=False)
    api_reachable = db.Column(db.Boolean, nullable=False, default=True)

    def __repr__(self):
        return (
            f"<BudgetCheck id={self.id} checked_at={self.checked_at} "
            f"usage={self.usage_usd} limit={self.limit_usd} exceeded={self.exceeded}>"
        )
