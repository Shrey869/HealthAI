"""
AI Symptom → Condition & Safe OTC Guidance Engine
──────────────────────────────────────────────────
Rule-based clinical decision support module.

NOTE: This is NOT a diagnostic tool and does NOT replace medical professionals.
  It provides general health guidance only.
"""

from __future__ import annotations
from typing import List, Dict, Any


# ─────────────────────────────────────────────
# Symptom → Condition Knowledge Base
# ─────────────────────────────────────────────

CONDITION_RULES: List[Dict[str, Any]] = [
    # ── Cardiovascular (SEVERE) ──────────────────
    {
        "condition": "Possible Cardiac Event",
        "triggers": [["chest-pain", "palpitations"], ["chest-pain", "shortness-breath"], ["chest-pain", "dizziness"], ["chest-pain", "fainting"]],
        "min_match": 2,
        "severity": "Severe",
        "description": "Chest pain combined with palpitations, shortness of breath, or dizziness may indicate a serious cardiac condition. Seek emergency medical attention immediately.",
        "recommendations": [
            {"medicine": "Aspirin (Disprin)", "purpose": "Blood thinner during suspected cardiac event", "dose_guidance": "300mg chewed immediately — ONLY if not allergic. Seek emergency care."}
        ],
    },
    # ── Respiratory Infection ────────────────────
    {
        "condition": "Upper Respiratory Tract Infection (URTI)",
        "triggers": [["cough-dry", "fever", "sore-throat"], ["cough-wet", "fever", "sore-throat"], ["cough-dry", "sore-throat", "runny-nose"], ["cough-wet", "runny-nose", "fever"], ["fever", "sore-throat", "stuffy-nose"]],
        "min_match": 2,
        "severity": "Moderate",
        "description": "A contagious infection of the upper airways — nose, throat, and sinuses. It usually resolves with rest and symptomatic treatment within 7–10 days.",
        "recommendations": [
            {"medicine": "Paracetamol (Dolo-650)", "purpose": "Fever & pain relief", "dose_guidance": "500–650mg every 6–8 hours (max 3000mg/day for adults)"},
            {"medicine": "Cetirizine (Cetzine)", "purpose": "Runny nose & sneezing", "dose_guidance": "10mg once daily at bedtime"},
            {"medicine": "Throat lozenges (Strepsils)", "purpose": "Sore throat relief", "dose_guidance": "1 lozenge every 2–3 hours as needed"},
        ],
    },
    # ── Influenza (Flu) ─────────────────────────
    {
        "condition": "Influenza (Flu)",
        "triggers": [["fever", "muscle-aches", "fatigue"], ["fever", "muscle-aches", "chills"], ["fever", "chills", "headache", "fatigue"], ["fever", "muscle-aches", "cough-dry"]],
        "min_match": 2,
        "severity": "Moderate",
        "description": "A viral infection attacking the respiratory system, characterised by sudden onset of high fever, body aches, and extreme fatigue. Usually self-limiting in 5–7 days.",
        "recommendations": [
            {"medicine": "Paracetamol (Dolo-650)", "purpose": "Fever & body pain relief", "dose_guidance": "500–650mg every 6–8 hours (max 3000mg/day for adults)"},
            {"medicine": "ORS Sachets (Electral)", "purpose": "Prevent dehydration", "dose_guidance": "1 sachet dissolved in 1L water, sip throughout the day"},
        ],
    },
    # ── Viral Fever (General) ───────────────────
    {
        "condition": "Viral Fever",
        "triggers": [["fever", "headache"], ["fever", "fatigue"], ["fever", "chills"], ["fever", "loss-appetite"]],
        "min_match": 1,
        "severity": "Mild",
        "description": "A common self-limiting viral illness causing fever, headache, and general malaise. Most cases resolve within 3–5 days with rest and hydration.",
        "recommendations": [
            {"medicine": "Paracetamol (Dolo-650)", "purpose": "Fever & pain relief", "dose_guidance": "500–650mg every 6–8 hours (max 3000mg/day for adults)"},
        ],
    },
    # ── Gastroenteritis ─────────────────────────
    {
        "condition": "Gastroenteritis (Stomach Flu)",
        "triggers": [["nausea", "vomiting", "diarrhea"], ["nausea", "stomach-pain", "diarrhea"], ["vomiting", "diarrhea", "fever"], ["nausea", "vomiting", "stomach-pain"]],
        "min_match": 2,
        "severity": "Moderate",
        "description": "Inflammation of the stomach and intestines, usually caused by a viral or bacterial infection. Dehydration is the primary concern — fluid replacement is critical.",
        "recommendations": [
            {"medicine": "ORS Sachets (Electral)", "purpose": "Rehydration", "dose_guidance": "1 sachet in 1L water after each loose stool"},
            {"medicine": "Ondansetron (Emeset-4)", "purpose": "Anti-nausea / vomiting", "dose_guidance": "4mg tablet before meals, max 3 times/day"},
            {"medicine": "Zinc tablets", "purpose": "Reduces duration of diarrhea", "dose_guidance": "20mg once daily for 10–14 days (adults)"},
        ],
    },
    # ── Acid Reflux / GERD ──────────────────────
    {
        "condition": "Acid Reflux / GERD",
        "triggers": [["heartburn", "stomach-pain"], ["heartburn", "nausea"], ["heartburn", "bloating"], ["stomach-pain", "bloating", "nausea"]],
        "min_match": 1,
        "severity": "Mild",
        "description": "Gastroesophageal reflux causes a burning sensation in the chest and upper abdomen, often worsened by spicy food, lying down after meals, or stress.",
        "recommendations": [
            {"medicine": "Antacid (Digene Gel / Gelusil)", "purpose": "Neutralizes stomach acid", "dose_guidance": "2 teaspoons or 1–2 tablets after meals and at bedtime"},
            {"medicine": "Pantoprazole (Pan-40)", "purpose": "Reduces acid production", "dose_guidance": "40mg once daily before breakfast for 2 weeks"},
        ],
    },
    # ── Tension Headache / Migraine ─────────────
    {
        "condition": "Tension Headache / Migraine",
        "triggers": [["headache", "light-sensitivity"], ["headache", "nausea"], ["headache", "neck-pain"], ["headache", "blurry-vision"]],
        "min_match": 1,
        "severity": "Mild",
        "description": "A common type of headache often triggered by stress, dehydration, poor posture, or lack of sleep. Migraines may include visual disturbances and nausea.",
        "recommendations": [
            {"medicine": "Ibuprofen (Brufen 400)", "purpose": "Pain & inflammation relief", "dose_guidance": "400mg every 6–8 hours with food (max 1200mg/day)"},
            {"medicine": "Paracetamol (Dolo-650)", "purpose": "Mild pain relief", "dose_guidance": "500–650mg every 6–8 hours"},
        ],
    },
    # ── Allergic Reaction ───────────────────────
    {
        "condition": "Allergic Reaction",
        "triggers": [["skin-rash", "itching"], ["hives", "itching"], ["runny-nose", "itching", "skin-rash"], ["skin-rash", "swelling"]],
        "min_match": 1,
        "severity": "Mild",
        "description": "An immune system response to an allergen (food, pollen, insect bites, medication). Presents as rash, hives, itching, or swelling.",
        "recommendations": [
            {"medicine": "Cetirizine (Cetzine 10mg)", "purpose": "Anti-histamine for itch & rash", "dose_guidance": "10mg once daily at bedtime"},
            {"medicine": "Calamine Lotion", "purpose": "Topical itch relief", "dose_guidance": "Apply to affected skin 2–3 times daily"},
        ],
    },
    # ── Urinary Tract Infection ──────────────────
    {
        "condition": "Possible Urinary Tract Infection (UTI)",
        "triggers": [["painful-urination", "frequent-urination"], ["painful-urination", "fever"], ["frequent-urination", "pelvic-pain"], ["blood-in-urine", "painful-urination"]],
        "min_match": 2,
        "severity": "Moderate",
        "description": "An infection in the urinary system — bladder, urethra, or kidneys. Common symptoms include burning urination and increased frequency. Antibiotics are usually required.",
        "recommendations": [
            {"medicine": "Plenty of Water", "purpose": "Flush out bacteria naturally", "dose_guidance": "Drink at least 3–4 litres of water per day"},
            {"medicine": "Cranberry Juice / Tablets", "purpose": "May help prevent bacterial adhesion", "dose_guidance": "200ml unsweetened cranberry juice twice daily"},
        ],
    },
    # ── Joint / Musculoskeletal Pain ─────────────
    {
        "condition": "Musculoskeletal Pain / Strain",
        "triggers": [["joint-pain", "muscle-aches"], ["back-pain", "muscle-aches"], ["joint-swelling", "joint-pain"], ["neck-pain", "muscle-aches"]],
        "min_match": 1,
        "severity": "Mild",
        "description": "Pain in muscles, joints, or bones — commonly due to overuse, poor posture, or minor injury. Usually resolves with rest and OTC pain relief.",
        "recommendations": [
            {"medicine": "Ibuprofen (Combiflam)", "purpose": "Pain & inflammation", "dose_guidance": "1 tablet (400mg ibuprofen + 325mg paracetamol) every 8 hours after food"},
            {"medicine": "Diclofenac Gel (Volini / Moov)", "purpose": "Topical pain relief", "dose_guidance": "Apply to affected area 3–4 times daily, gently massage"},
        ],
    },
    # ── Anxiety / Mental Health ──────────────────
    {
        "condition": "Anxiety / Stress-Related Symptoms",
        "triggers": [["anxiety", "insomnia"], ["anxiety", "palpitations"], ["anxiety", "dizziness"], ["insomnia", "fatigue", "headache"]],
        "min_match": 2,
        "severity": "Moderate",
        "description": "Excessive worry, panic attacks, or sleep disturbances that affect daily functioning. While common, persistent symptoms warrant professional mental health support.",
        "recommendations": [
            {"medicine": "Chamomile Tea", "purpose": "Natural calming agent", "dose_guidance": "1–2 cups in the evening before bed"},
            {"medicine": "Melatonin (3mg)", "purpose": "Short-term sleep support", "dose_guidance": "3mg 30 minutes before bedtime for up to 2 weeks"},
        ],
    },
    # ── COVID-like illness ──────────────────────
    {
        "condition": "COVID-19 / Respiratory Viral Illness",
        "triggers": [["fever", "cough-dry", "loss-taste-smell"], ["fever", "shortness-breath", "fatigue"], ["cough-dry", "loss-taste-smell", "fatigue"], ["fever", "cough-dry", "fatigue", "muscle-aches"]],
        "min_match": 3,
        "severity": "Severe",
        "description": "Symptoms strongly resemble COVID-19 or a severe respiratory viral illness. Immediate isolation and testing is recommended. Seek medical care if breathing difficulties worsen.",
        "recommendations": [
            {"medicine": "Paracetamol (Dolo-650)", "purpose": "Fever & body pain", "dose_guidance": "650mg every 6–8 hours"},
            {"medicine": "Steam Inhalation", "purpose": "Congestion relief", "dose_guidance": "10–15 minutes, 2–3 times daily with plain hot water"},
        ],
    },
    # ── Conjunctivitis / Eye ─────────────────────
    {
        "condition": "Conjunctivitis (Pink Eye)",
        "triggers": [["eye-pain", "light-sensitivity"], ["eye-pain", "headache"]],
        "min_match": 2,
        "severity": "Mild",
        "description": "Inflammation or infection of the transparent membrane lining the eyelid and eyeball. Common causes include viral/bacterial infection or allergies.",
        "recommendations": [
            {"medicine": "Artificial Tears (Refresh Tears)", "purpose": "Lubrication & comfort", "dose_guidance": "1–2 drops in affected eye every 4–6 hours"},
        ],
    },
]


# ─────────────────────────────────────────────
# Emergency / Risk Keywords
# ─────────────────────────────────────────────

EMERGENCY_SYMPTOMS = {
    "chest-pain": "WARNING: Chest pain can indicate a heart attack. Seek IMMEDIATE emergency care if pain is crushing, radiating to arm/jaw, or accompanied by breathlessness.",
    "shortness-breath": "WARNING: Severe breathing difficulty may indicate a life-threatening condition. Call emergency services if you cannot breathe normally.",
    "coughing-blood": "WARNING: Coughing up blood (hemoptysis) requires urgent medical evaluation. Do not delay seeking care.",
    "blood-in-stool": "WARNING: Blood in stool can indicate internal bleeding. See a doctor within 24 hours.",
    "blood-in-urine": "WARNING: Blood in urine (hematuria) requires medical investigation. Schedule a doctor visit promptly.",
    "seizures": "WARNING: Seizures require immediate medical attention. Call emergency services if this is a first-time occurrence.",
    "fainting": "WARNING: Fainting (syncope) could indicate a cardiac or neurological issue. Consult a doctor promptly.",
    "difficulty-speaking": "WARNING: Sudden difficulty speaking may indicate a stroke. Call emergency services IMMEDIATELY (remember FAST: Face drooping, Arm weakness, Speech difficulty, Time to call).",
    "confusion": "WARNING: Sudden confusion or memory loss may indicate a stroke or serious neurological event. Seek emergency care.",
    "jaundice": "WARNING: Yellowing of skin/eyes indicates possible liver dysfunction. See a doctor within 24 hours.",
}

GENERAL_WARNINGS = [
    "Consult a doctor immediately if fever persists for more than 3 days.",
    "Seek medical help if symptoms worsen or new symptoms appear.",
    "If you experience difficulty breathing at any point, call emergency services.",
]


# ─────────────────────────────────────────────
# Severity Classification
# ─────────────────────────────────────────────

SEVERITY_ORDER = {"Mild": 0, "Moderate": 1, "Severe": 2}


def _classify_severity(symptom_ids: List[str], matched_conditions: List[dict]) -> str:
    """
    Final severity is the MAX of:
      1. Highest severity among matched conditions
      2. Bump to Severe if any emergency symptom is present
      3. Bump to Moderate if ≥ 4 symptoms reported
    """
    severity = "Mild"

    for cond in matched_conditions:
        if SEVERITY_ORDER.get(cond["severity"], 0) > SEVERITY_ORDER.get(severity, 0):
            severity = cond["severity"]

    # Emergency keyword escalation
    for sid in symptom_ids:
        if sid in EMERGENCY_SYMPTOMS:
            severity = "Severe"
            break

    # Volume escalation
    if len(symptom_ids) >= 4 and severity == "Mild":
        severity = "Moderate"

    return severity


# ─────────────────────────────────────────────
# Core Engine
# ─────────────────────────────────────────────

def analyze_symptoms(symptom_ids: List[str], age_group: str = "Adult") -> dict:
    """
    Main entry point.

    Parameters
    ----------
    symptom_ids : list[str]
        IDs from the symptom selector (e.g. ["fever", "headache", "cough-dry"])
    age_group : str
        One of "Infant (0-2)", "Child (3-12)", "Teen (13-17)", "Adult (18-64)", "Senior (65+)"

    Returns
    -------
    dict with keys: conditions, severity, recommendations, safety_warnings, disclaimer
    """
    symptom_set = set(s.lower().strip() for s in symptom_ids)
    matched: List[dict] = []
    seen_conditions: set = set()

    # Score each rule
    for rule in CONDITION_RULES:
        best_overlap = 0
        for trigger_combo in rule["triggers"]:
            overlap = len(symptom_set.intersection(set(trigger_combo)))
            best_overlap = max(best_overlap, overlap)

        if best_overlap >= rule["min_match"] and rule["condition"] not in seen_conditions:
            matched.append({
                "condition": rule["condition"],
                "severity": rule["severity"],
                "description": rule["description"],
                "match_score": best_overlap,
                "recommendations": rule["recommendations"],
            })
            seen_conditions.add(rule["condition"])

    # Sort by match score descending, then severity descending
    matched.sort(key=lambda c: (c["match_score"], SEVERITY_ORDER.get(c["severity"], 0)), reverse=True)

    # Keep top 4 conditions max
    matched = matched[:4]

    # Fallback if nothing matched
    if not matched:
        matched = [{
            "condition": "General Health Concern",
            "severity": "Mild",
            "description": f"Based on your reported symptoms ({', '.join(symptom_ids)}), no specific condition was strongly indicated by our rule engine. This does not mean there is no issue — please consult a healthcare professional for a proper evaluation.",
            "match_score": 0,
            "recommendations": [],
        }]

    # Overall severity
    overall_severity = _classify_severity(list(symptom_set), matched)

    # Aggregate unique recommendations
    all_recs: List[dict] = []
    seen_meds: set = set()
    for cond in matched:
        for rec in cond.get("recommendations", []):
            if rec["medicine"] not in seen_meds:
                all_recs.append(rec)
                seen_meds.add(rec["medicine"])

    # Dosage adjustment note for non-adult
    age_lc = age_group.lower()
    dosage_note = None
    if "infant" in age_lc or "child" in age_lc:
        dosage_note = "CHILDREN: Dosages shown are for adults. For children, use HALF the adult dose or consult a paediatrician before administering any medication."
    elif "senior" in age_lc:
        dosage_note = "SENIORS: Patients above 65 may need adjusted dosages. Consult a doctor, especially if on other medications."

    # Safety warnings
    safety_warnings: List[str] = []
    for sid in symptom_set:
        if sid in EMERGENCY_SYMPTOMS:
            safety_warnings.append(EMERGENCY_SYMPTOMS[sid])
    safety_warnings.extend(GENERAL_WARNINGS)

    # Build conditions list for response (strip internal fields)
    conditions_out = []
    for c in matched:
        conditions_out.append({
            "condition": c["condition"],
            "severity": c["severity"],
            "description": c["description"],
        })

    return {
        "conditions": conditions_out,
        "severity": overall_severity,
        "recommendations": all_recs,
        "safety_warnings": safety_warnings,
        "dosage_note": dosage_note,
        "disclaimer": "This is not a medical diagnosis. It provides general health guidance only. Always consult a qualified healthcare professional for medical advice.",
    }
