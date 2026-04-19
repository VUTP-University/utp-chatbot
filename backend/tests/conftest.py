import pytest
from app import create_app
from models import db as _db


@pytest.fixture(scope="session")
def app():
    """Create a test Flask app with an in-memory SQLite database."""
    application = create_app(test_config={
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "DO_AGENT_ENDPOINT": "http://mock-agent",
        "DO_AGENT_ACCESS_KEY": "test-key",
        "BUDGET_LIMIT_USD": 0,  # disable budget scheduler during tests
    })

    with application.app_context():
        _db.create_all()
        yield application
        _db.drop_all()


@pytest.fixture()
def client(app):
    """Return a test client for the app."""
    return app.test_client()


@pytest.fixture(autouse=True)
def clean_db(app):
    """Wipe all table rows between tests to keep them isolated."""
    yield
    with app.app_context():
        for table in reversed(_db.metadata.sorted_tables):
            _db.session.execute(table.delete())
        _db.session.commit()
