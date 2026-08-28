import sqlite3
from collections.abc import Generator
from contextlib import contextmanager

from app.core.config import DATABASE_PATH


@contextmanager
def get_connection() -> Generator[sqlite3.Connection, None, None]:
	DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
	connection = sqlite3.connect(DATABASE_PATH)
	connection.row_factory = sqlite3.Row
	try:
		yield connection
		connection.commit()
	finally:
		connection.close()


def initialize_database() -> None:
	with get_connection() as connection:
		connection.executescript(
			"""
			CREATE TABLE IF NOT EXISTS workout_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				performed_at TEXT NOT NULL,
				exercise TEXT NOT NULL,
				sets INTEGER NOT NULL,
				reps INTEGER NOT NULL,
				weight_kg REAL,
				notes TEXT
			);
			CREATE TABLE IF NOT EXISTS nutrition_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				logged_at TEXT NOT NULL,
				meal TEXT NOT NULL,
				calories INTEGER NOT NULL,
				protein_g REAL,
				carbs_g REAL,
				fat_g REAL,
				notes TEXT
			);
			CREATE TABLE IF NOT EXISTS sleep_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				sleep_date TEXT NOT NULL,
				bedtime TEXT NOT NULL,
				wake_time TEXT NOT NULL,
				duration_hours REAL NOT NULL,
				quality INTEGER,
				notes TEXT
			);
			"""
		)
