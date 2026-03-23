<div align="center">

# 🩺 HealthAI — AI-Powered Healthcare Assistant

**Your intelligent health companion: Diagnose symptoms, analyze lab reports, and locate nearby medical stores — all in one place.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Python](https://img.shields.io/badge/Python-FastAPI-green?logo=python)](https://fastapi.tiangolo.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

[Live Demo](#) · [Features](#-features) · [Tech Stack](#-tech-stack) · [Setup](#-getting-started)

</div>

---

## 🚨 The Problem We're Solving

Every day in India:
- **~65% of rural patients** self-medicate without proper guidance due to lack of accessible doctors.
- People upload blood reports but **don't know what the values mean** — is Hemoglobin 8.2 normal? Is Troponin 0.18 dangerous?
- Patients waste hours **searching for open pharmacies** nearby during emergencies.
- Healthcare information is **fragmented, jargon-heavy, and inaccessible** to the average person.

**HealthAI solves all of this with a single, intelligent platform.**

---

## ✨ Features

### 🧠 1. AI Symptom Checker
- Select your symptoms from a rich database
- Choose your age group for tailored dosage recommendations
- Get **AI-powered diagnosis** with probable conditions, risk levels, and over-the-counter medicine suggestions available at local Indian pharmacies (e.g., Dolo-650, Combiflam, Digene)
- Powered by the **Grok AI** language model

### 📄 2. AI Medical Report Analyzer
- Upload any **PDF or image** of a medical report (blood test, heart panel, uric acid report, etc.)
- Automatically **extracts medical values** from the document using PyMuPDF
- Compares extracted values against standard clinical reference ranges
- Detects **LOW / NORMAL / HIGH** status for each parameter
- Generates a **personalized AI health summary** with actionable advice
- Supports: CBC, Lipid Profile, Liver Function, Kidney Function, Cardiac Markers (Troponin, BNP, CK-MB), Uric Acid, Thyroid, Diabetes Panel, and more

### 🗺️ 3. Medical Store Locator
- **Detects your live GPS location** via browser geolocation
- Searches OpenStreetMap for real pharmacies, chemist shops, and medical stores within **5 km or 10 km** of your location
- Shows whether each store is currently **Open or Closed** based on live opening hours data
- Displays stores on an **interactive Leaflet map** with directions

### 💊 4. Medicines Database
- Search and browse a comprehensive database of medicines
- View generic names, uses, and availability

### 📊 5. Personal Health Dashboard
- Track your saved pharmacies and past diagnosis history
- Secure authentication with **NextAuth.js**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Vanilla CSS, Framer Motion, Glassmorphism 3D UI |
| **AI (Symptoms)** | Grok API (xAI) |
| **AI (Reports)** | Python FastAPI microservice + PyMuPDF |
| **Map & Geolocation** | OpenStreetMap, Overpass API, Leaflet.js |
| **Database** | Prisma ORM + MongoDB Atlas |
| **Auth** | NextAuth.js v5 |
| **Charts** | Chart.js + React-Chartjs-2 |

---

## 🏗️ Architecture

```
Browser (Next.js Frontend, port 3000)
    │
    ├── /api/symptoms/analyze  ──► Grok AI API (xAI)
    ├── /api/pharmacies        ──► OpenStreetMap Overpass API
    ├── /api/report/upload     ──► Python FastAPI (port 8000)
    │                                   └── PyMuPDF (text extraction)
    │                                   └── Regex parser → ranges.json
    └── /api/*                 ──► Prisma → MongoDB Atlas
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB Atlas (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/Shrey869/HealthAI.git
cd HealthAI
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
# Fill in your API keys in .env
```

### 4. Set up the Python AI service
```bash
cd ai-service
python -m venv venv

# Windows
.\venv\Scripts\pip install -r requirements.txt

# macOS/Linux
./venv/bin/pip install -r requirements.txt
```

### 5. Run the application (3 terminals)

**Terminal 1 — Next.js frontend:**
```bash
npm run dev
```

**Terminal 2 — Python AI service:**
```bash
cd ai-service

# Windows
.\venv\Scripts\python app.py

# macOS/Linux
./venv/bin/python app.py
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in the following:

| Variable | Description |
|---|---|
| `DATABASE_URL` | MongoDB connection string |
| `NEXTAUTH_SECRET` | Random secret for auth sessions |
| `NEXTAUTH_URL` | App URL (http://localhost:3000 for local) |
| `GROK_API_KEY` | API key from [console.x.ai](https://console.x.ai) |
| `GOOGLE_CLIENT_ID` | (Optional) For Google OAuth login |
| `GOOGLE_CLIENT_SECRET` | (Optional) For Google OAuth login |

---

## 🌍 Real-World Impact

| Problem | HealthAI Solution |
|---|---|
| Can't interpret blood report values | AI Report Analyzer explains every parameter in plain language |
| Don't know which pharmacy is open at night | Live Open/Closed status with GPS-based distance |
| Rural users self-medicating | AI symptom checker with India-specific OTC medicine names |
| Heart attack risk undetected | Troponin, BNP, CK-MB detection with critical alerts |
| No access to doctors for basic queries | 24/7 AI-powered health guidance |

---

## 📸 Screenshots

> The application features a modern **glassmorphism 3D UI** with smooth animations, dark mode support, and a fully responsive design.

---

## 👨‍💻 Team

Built with ❤️ for **[Hackathon Name]** by **Shreyansh Saxena**

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <strong>⭐ If you find this useful, please star the repo!</strong>
</div>
