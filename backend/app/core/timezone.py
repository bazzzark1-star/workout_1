from datetime import datetime, timezone
from zoneinfo import ZoneInfo


EST_TIMEZONE = ZoneInfo("America/New_York")


def convert_to_est(dt: datetime) -> datetime:
    """Convert a datetime to America/New_York, treating naive values as UTC."""
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)

    return dt.astimezone(EST_TIMEZONE)


def get_current_est_time() -> datetime:
    """Return the current time in America/New_York."""
    return datetime.now(EST_TIMEZONE)
