# conftest.py
import pytest
from supermercado.app import app as flask_app

@pytest.fixture(scope="session")
def app():
    flask_app.config.update(TESTING=True, SECRET_KEY="test-secret-key")
    return flask_app

@pytest.fixture()
def client(app):
    return app.test_client()
    