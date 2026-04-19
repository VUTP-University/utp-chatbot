import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-in-production")
    DO_AGENT_ENDPOINT = os.getenv("DO_AGENT_ENDPOINT", "")
    DO_AGENT_ACCESS_KEY = os.getenv("DO_AGENT_ACCESS_KEY", "")

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    MAX_HISTORY_PER_SESSION = 50

    # Budget guard
    BUDGET_LIMIT_USD = float(os.getenv("BUDGET_LIMIT_USD") or 0)  # 0 = disabled
    BUDGET_WARN_THRESHOLD = float(os.getenv("BUDGET_WARN_THRESHOLD") or 0.8)
    BUDGET_CHECK_INTERVAL_MINUTES = int(os.getenv("BUDGET_CHECK_INTERVAL_MINUTES") or 60)
    DO_BILLING_API_KEY = os.getenv("DO_BILLING_API_KEY", "")


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
