# HealthAI — AI Service (Python FastAPI)

A FastAPI service that accepts medical report files, runs OCR + analysis, and returns structured results.

## Stack
- Python 3.10+
- FastAPI + Uvicorn
- PyMuPDF / custom analyzer

## Setup & Run Locally

```bash
cd ai-service

# Create & activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

uvicorn app:app --reload --port 8000
# Service runs on http://localhost:8000
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/analyze-report` | Upload a PDF/image for medical analysis |

## Deploy (Railway / Render)

1. Connect your GitHub repo
2. Set **Root Directory** → `ai-service`
3. Set **Start Command** → `uvicorn app:app --host 0.0.0.0 --port 8000`
4. Runtime: **Python 3.10+**

## Running Tests

```bash
pytest test_analyzer.py
```
