from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.timezone import get_current_est_time


app = FastAPI(title="Workout, Nutrition, and Sleep Logs API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict[str, object]:
    return {
        "status": "ok",
        "server_time_est": get_current_est_time(),
    }
