from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import APP_TITLE
from app.core.timezone import get_current_est_time
from app.db.database import get_connection, initialize_database
from app.db.models import NutritionLog, SleepLog, WorkoutLog


app = FastAPI(title=APP_TITLE)

app.add_middleware(
	CORSMiddleware,
	allow_origins=["http://localhost", "*"],
	allow_credentials=False,
	allow_methods=["*"],
	allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
	initialize_database()


@app.get("/health")
def health_check() -> dict[str, object]:
	return {"status": "ok", "server_time_est": get_current_est_time()}


@app.post("/logs/workouts", response_model=WorkoutLog, status_code=status.HTTP_201_CREATED)
def create_workout_log(log: WorkoutLog) -> WorkoutLog:
	with get_connection() as connection:
		connection.execute(
			"INSERT INTO workout_logs (performed_at, exercise, sets, reps, weight_kg, notes) "
			"VALUES (?, ?, ?, ?, ?, ?)",
			(log.performed_at.isoformat(), log.exercise, log.sets, log.reps, log.weight_kg, log.notes),
		)
	return log


@app.get("/logs/workouts", response_model=list[WorkoutLog])
def list_workout_logs() -> list[WorkoutLog]:
	with get_connection() as connection:
		rows = connection.execute("SELECT * FROM workout_logs ORDER BY performed_at DESC").fetchall()
	return [WorkoutLog.model_validate(dict(row)) for row in rows]


@app.post("/logs/nutrition", response_model=NutritionLog, status_code=status.HTTP_201_CREATED)
def create_nutrition_log(log: NutritionLog) -> NutritionLog:
	with get_connection() as connection:
		connection.execute(
			"INSERT INTO nutrition_logs (logged_at, meal, calories, protein_g, carbs_g, fat_g, notes) "
			"VALUES (?, ?, ?, ?, ?, ?, ?)",
			(log.logged_at.isoformat(), log.meal, log.calories, log.protein_g, log.carbs_g, log.fat_g, log.notes),
		)
	return log


@app.get("/logs/nutrition", response_model=list[NutritionLog])
def list_nutrition_logs() -> list[NutritionLog]:
	with get_connection() as connection:
		rows = connection.execute("SELECT * FROM nutrition_logs ORDER BY logged_at DESC").fetchall()
	return [NutritionLog.model_validate(dict(row)) for row in rows]


@app.post("/logs/sleep", response_model=SleepLog, status_code=status.HTTP_201_CREATED)
def create_sleep_log(log: SleepLog) -> SleepLog:
	with get_connection() as connection:
		connection.execute(
			"INSERT INTO sleep_logs (sleep_date, bedtime, wake_time, duration_hours, quality, notes) "
			"VALUES (?, ?, ?, ?, ?, ?)",
			(log.sleep_date.isoformat(), log.bedtime.isoformat(), log.wake_time.isoformat(), log.duration_hours, log.quality, log.notes),
		)
	return log


@app.get("/logs/sleep", response_model=list[SleepLog])
def list_sleep_logs() -> list[SleepLog]:
	with get_connection() as connection:
		rows = connection.execute("SELECT * FROM sleep_logs ORDER BY sleep_date DESC").fetchall()
	return [SleepLog.model_validate(dict(row)) for row in rows]
