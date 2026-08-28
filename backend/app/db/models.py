from datetime import date, datetime

from pydantic import BaseModel, Field


class WorkoutLog(BaseModel):
	performed_at: datetime
	exercise: str = Field(min_length=1, max_length=100)
	sets: int = Field(ge=1)
	reps: int = Field(ge=1)
	weight_kg: float | None = Field(default=None, ge=0)
	notes: str | None = Field(default=None, max_length=1000)


class NutritionLog(BaseModel):
	logged_at: datetime
	meal: str = Field(min_length=1, max_length=100)
	calories: int = Field(ge=0)
	protein_g: float | None = Field(default=None, ge=0)
	carbs_g: float | None = Field(default=None, ge=0)
	fat_g: float | None = Field(default=None, ge=0)
	notes: str | None = Field(default=None, max_length=1000)


class SleepLog(BaseModel):
	sleep_date: date
	bedtime: datetime
	wake_time: datetime
	duration_hours: float = Field(gt=0, le=24)
	quality: int | None = Field(default=None, ge=1, le=5)
	notes: str | None = Field(default=None, max_length=1000)
