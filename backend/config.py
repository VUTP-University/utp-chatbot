import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-in-production")
    DO_AGENT_ENDPOINT = os.getenv("DO_AGENT_ENDPOINT", "")
    DO_AGENT_ACCESS_KEY = os.getenv("DO_AGENT_ACCESS_KEY", "")

    # How many messages to keep per session (in-memory)
    MAX_HISTORY_PER_SESSION = 50


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


config_map = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
}


def get_config():
    env = os.getenv("FLASK_ENV", "development")
    return config_map.get(env, DevelopmentConfig)
