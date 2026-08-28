# Workout Log API

## Start the backend

From the project root (`D:\Mark's pc files\exercises`), run:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
```

Open the API at http://127.0.0.1:8000 and the interactive docs at http://127.0.0.1:8000/docs.

Health check:

```powershell
Invoke-WebRequest http://127.0.0.1:8000/health -UseBasicParsing
```
