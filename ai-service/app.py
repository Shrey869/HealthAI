from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import shutil
import os
from analyzer import analyze_medical_report
from symptom_analyzer import analyze_symptoms

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request model for symptom analysis ───────
class SymptomRequest(BaseModel):
    symptoms: List[str]
    ageGroup: Optional[str] = "Adult"


# ── Medical Report Upload Endpoint ───────────
@app.post("/analyze-report")
async def analyze_report(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    # Store locally for a moment
    file_location = f"temp_{file.filename}"
    try:
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
        
        # Analyze it
        result = analyze_medical_report(file_location)
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(file_location):
            os.remove(file_location)


# ── Symptom Analysis Endpoint ────────────────
@app.post("/analyze-symptoms")
async def analyze_symptoms_endpoint(request: SymptomRequest):
    try:
        result = analyze_symptoms(request.symptoms, request.ageGroup or "Adult")
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
