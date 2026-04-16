# HealthAI

A full-stack AI-powered healthcare web application. The repository is organized as a **monorepo** with three independently deployable services.

```
HealthAI/
├── frontend/       ← Next.js 15 app  (Vercel)
├── backend/        ← Express.js API  (Railway / Render)
└── ai-service/     ← Python FastAPI  (Railway / Render)
```

---

## 🖥 Frontend — Next.js

> **Deploy target: Vercel**
> Set **Root Directory** to `frontend` in Vercel project settings.

```bash
cd frontend
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
```

Key env vars (create `frontend/.env`):
```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GEMINI_API_KEY=
```

---

## ⚙️ Backend — Express.js

> **Deploy target: Railway or Render**
> Set Root Directory to `backend`.

```bash
cd backend
npm install
npm start         # http://localhost:5000
```

See [`backend/README.md`](./backend/README.md) for full details.

---

## 🤖 AI Service — Python FastAPI

> **Deploy target: Railway or Render**
> Set Root Directory to `ai-service`.

```bash
cd ai-service
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000   # http://localhost:8000
```

See [`ai-service/README.md`](./ai-service/README.md) for full details.

---

## Running Everything Locally

Open 3 terminals:

| Terminal | Command |
|----------|---------|
| 1 | `cd frontend && npm run dev` |
| 2 | `cd backend && npm start` |
| 3 | `cd ai-service && uvicorn app:app --reload --port 8000` |
