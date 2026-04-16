# HealthAI — Backend (Express.js)

An Express.js REST server that proxies file uploads to the Python AI service.

## Stack
- Node.js + Express
- Multer (file uploads)
- Axios (calls to AI service)

## Setup & Run Locally

```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

## Environment Variables

Create a `.env` file inside `backend/` if needed:

```env
PORT=5000
AI_SERVICE_URL=http://localhost:8000
```

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/report/analyze` | Upload a medical report for AI analysis |

## Deploy (Railway / Render)

1. Connect your GitHub repo
2. Set **Root Directory** → `backend`
3. Set **Start Command** → `node server.js`
4. Add environment variables above
