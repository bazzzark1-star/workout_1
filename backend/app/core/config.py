"""Application configuration loaded from environment variables."""

import os
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[3]
DATABASE_PATH = Path(os.getenv("WORKOUT_DATABASE_PATH", PROJECT_ROOT / "workout_logs.db"))
APP_TITLE = os.getenv("WORKOUT_APP_TITLE", "Workout, Nutrition, and Sleep Logs API")
