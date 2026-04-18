import { SymptomEngineResponse } from "./validations";

// ─────────────────────────────────────────────
// Symptom → Condition Knowledge Base
// ─────────────────────────────────────────────

const CONDITION_RULES = [
  // ── Cardiovascular (SEVERE) ──────────────────
  {
    condition: "Possible Cardiac Event",
    triggers: [["chest-pain", "palpitations"], ["chest-pain", "shortness-breath"], ["chest-pain", "dizziness"], ["chest-pain", "fainting"]],
    min_match: 2,
    severity: "Severe",
    description: "Chest pain combined with palpitations, shortness of breath, or dizziness may indicate a serious cardiac condition. Seek emergency medical attention immediately.",
    recommendations: [
      { medicine: "Aspirin (Disprin)", purpose: "Blood thinner during suspected cardiac event", dose_guidance: "300mg chewed immediately — ONLY if not allergic. Seek emergency care." }
    ],
  },
  // ── Respiratory Infection ────────────────────
  {
    condition: "Upper Respiratory Tract Infection (URTI)",
    triggers: [["cough-dry", "fever", "sore-throat"], ["cough-wet", "fever", "sore-throat"], ["cough-dry", "sore-throat", "runny-nose"], ["cough-wet", "runny-nose", "fever"], ["fever", "sore-throat", "stuffy-nose"]],
    min_match: 2,
    severity: "Moderate",
    description: "A contagious infection of the upper airways — nose, throat, and sinuses. It usually resolves with rest and symptomatic treatment within 7–10 days.",
    recommendations: [
      { medicine: "Paracetamol (Dolo-650)", purpose: "Fever & pain relief", dose_guidance: "500–650mg every 6–8 hours (max 3000mg/day for adults)" },
      { medicine: "Cetirizine (Cetzine)", purpose: "Runny nose & sneezing", dose_guidance: "10mg once daily at bedtime" },
      { medicine: "Throat lozenges (Strepsils)", purpose: "Sore throat relief", dose_guidance: "1 lozenge every 2–3 hours as needed" },
    ],
  },
  // ── Influenza (Flu) ─────────────────────────
  {
    condition: "Influenza (Flu)",
    triggers: [["fever", "muscle-aches", "fatigue"], ["fever", "muscle-aches", "chills"], ["fever", "chills", "headache", "fatigue"], ["fever", "muscle-aches", "cough-dry"]],
    min_match: 2,
    severity: "Moderate",
    description: "A viral infection attacking the respiratory system, characterised by sudden onset of high fever, body aches, and extreme fatigue. Usually self-limiting in 5–7 days.",
    recommendations: [
      { medicine: "Paracetamol (Dolo-650)", purpose: "Fever & body pain relief", dose_guidance: "500–650mg every 6–8 hours (max 3000mg/day for adults)" },
      { medicine: "ORS Sachets (Electral)", purpose: "Prevent dehydration", dose_guidance: "1 sachet dissolved in 1L water, sip throughout the day" },
    ],
  },
  // ── Viral Fever (General) ───────────────────
  {
    condition: "Viral Fever",
    triggers: [["fever", "headache"], ["fever", "fatigue"], ["fever", "chills"], ["fever", "loss-appetite"]],
    min_match: 1,
    severity: "Mild",
    description: "A common self-limiting viral illness causing fever, headache, and general malaise. Most cases resolve within 3–5 days with rest and hydration.",
    recommendations: [
      { medicine: "Paracetamol (Dolo-650)", purpose: "Fever & pain relief", dose_guidance: "500–650mg every 6–8 hours (max 3000mg/day for adults)" },
    ],
  },
  // ── Gastroenteritis ─────────────────────────
  {
    condition: "Gastroenteritis (Stomach Flu)",
    triggers: [["nausea", "vomiting", "diarrhea"], ["nausea", "stomach-pain", "diarrhea"], ["vomiting", "diarrhea", "fever"], ["nausea", "vomiting", "stomach-pain"]],
    min_match: 2,
    severity: "Moderate",
    description: "Inflammation of the stomach and intestines, usually caused by a viral or bacterial infection. Dehydration is the primary concern — fluid replacement is critical.",
    recommendations: [
      { medicine: "ORS Sachets (Electral)", purpose: "Rehydration", dose_guidance: "1 sachet in 1L water after each loose stool" },
      { medicine: "Ondansetron (Emeset-4)", purpose: "Anti-nausea / vomiting", dose_guidance: "4mg tablet before meals, max 3 times/day" },
      { medicine: "Zinc tablets", purpose: "Reduces duration of diarrhea", dose_guidance: "20mg once daily for 10–14 days (adults)" },
    ],
  },
  // ── Acid Reflux / GERD ──────────────────────
  {
    condition: "Acid Reflux / GERD",
    triggers: [["heartburn", "stomach-pain"], ["heartburn", "nausea"], ["heartburn", "bloating"], ["stomach-pain", "bloating", "nausea"]],
    min_match: 1,
    severity: "Mild",
    description: "Gastroesophageal reflux causes a burning sensation in the chest and upper abdomen, often worsened by spicy food, lying down after meals, or stress.",
    recommendations: [
      { medicine: "Antacid (Digene Gel / Gelusil)", purpose: "Neutralizes stomach acid", dose_guidance: "2 teaspoons or 1–2 tablets after meals and at bedtime" },
      { medicine: "Pantoprazole (Pan-40)", purpose: "Reduces acid production", dose_guidance: "40mg once daily before breakfast for 2 weeks" },
    ],
  },
  // ── Tension Headache / Migraine ─────────────
  {
    condition: "Tension Headache / Migraine",
    triggers: [["headache", "light-sensitivity"], ["headache", "nausea"], ["headache", "neck-pain"], ["headache", "blurry-vision"]],
    min_match: 1,
    severity: "Mild",
    description: "A common type of headache often triggered by stress, dehydration, poor posture, or lack of sleep. Migraines may include visual disturbances and nausea.",
    recommendations: [
      { medicine: "Ibuprofen (Brufen 400)", purpose: "Pain & inflammation relief", dose_guidance: "400mg every 6–8 hours with food (max 1200mg/day)" },
      { medicine: "Paracetamol (Dolo-650)", purpose: "Mild pain relief", dose_guidance: "500–650mg every 6–8 hours" },
    ],
  },
  // ── Allergic Reaction ───────────────────────
  {
    condition: "Allergic Reaction",
    triggers: [["skin-rash", "itching"], ["hives", "itching"], ["runny-nose", "itching", "skin-rash"], ["skin-rash", "swelling"]],
    min_match: 1,
    severity: "Mild",
    description: "An immune system response to an allergen (food, pollen, insect bites, medication). Presents as rash, hives, itching, or swelling.",
    recommendations: [
      { medicine: "Cetirizine (Cetzine 10mg)", purpose: "Anti-histamine for itch & rash", dose_guidance: "10mg once daily at bedtime" },
      { medicine: "Calamine Lotion", purpose: "Topical itch relief", dose_guidance: "Apply to affected skin 2–3 times daily" },
    ],
  },
  // ── Urinary Tract Infection ──────────────────
  {
    condition: "Possible Urinary Tract Infection (UTI)",
    triggers: [["painful-urination", "frequent-urination"], ["painful-urination", "fever"], ["frequent-urination", "pelvic-pain"], ["blood-in-urine", "painful-urination"]],
    min_match: 2,
    severity: "Moderate",
    description: "An infection in the urinary system — bladder, urethra, or kidneys. Common symptoms include burning urination and increased frequency. Antibiotics are usually required.",
    recommendations: [
      { medicine: "Plenty of Water", purpose: "Flush out bacteria naturally", dose_guidance: "Drink at least 3–4 litres of water per day" },
      { medicine: "Cranberry Juice / Tablets", purpose: "May help prevent bacterial adhesion", dose_guidance: "200ml unsweetened cranberry juice twice daily" },
    ],
  },
  // ── Joint / Musculoskeletal Pain ─────────────
  {
    condition: "Musculoskeletal Pain / Strain",
    triggers: [["joint-pain", "muscle-aches"], ["back-pain", "muscle-aches"], ["joint-swelling", "joint-pain"], ["neck-pain", "muscle-aches"]],
    min_match: 1,
    severity: "Mild",
    description: "Pain in muscles, joints, or bones — commonly due to overuse, poor posture, or minor injury. Usually resolves with rest and OTC pain relief.",
    recommendations: [
      { medicine: "Ibuprofen (Combiflam)", purpose: "Pain & inflammation", dose_guidance: "1 tablet (400mg ibuprofen + 325mg paracetamol) every 8 hours after food" },
      { medicine: "Diclofenac Gel (Volini / Moov)", purpose: "Topical pain relief", dose_guidance: "Apply to affected area 3–4 times daily, gently massage" },
    ],
  },
  // ── Anxiety / Mental Health ──────────────────
  {
    condition: "Anxiety / Stress-Related Symptoms",
    triggers: [["anxiety", "insomnia"], ["anxiety", "palpitations"], ["anxiety", "dizziness"], ["insomnia", "fatigue", "headache"]],
    min_match: 2,
    severity: "Moderate",
    description: "Excessive worry, panic attacks, or sleep disturbances that affect daily functioning. While common, persistent symptoms warrant professional mental health support.",
    recommendations: [
      { medicine: "Chamomile Tea", purpose: "Natural calming agent", dose_guidance: "1–2 cups in the evening before bed" },
      { medicine: "Melatonin (3mg)", purpose: "Short-term sleep support", dose_guidance: "3mg 30 minutes before bedtime for up to 2 weeks" },
    ],
  },
  // ── COVID-like illness ──────────────────────
  {
    condition: "COVID-19 / Respiratory Viral Illness",
    triggers: [["fever", "cough-dry", "loss-taste-smell"], ["fever", "shortness-breath", "fatigue"], ["cough-dry", "loss-taste-smell", "fatigue"], ["fever", "cough-dry", "fatigue", "muscle-aches"]],
    min_match: 3,
    severity: "Severe",
    description: "Symptoms strongly resemble COVID-19 or a severe respiratory viral illness. Immediate isolation and testing is recommended. Seek medical care if breathing difficulties worsen.",
    recommendations: [
      { medicine: "Paracetamol (Dolo-650)", purpose: "Fever & body pain", dose_guidance: "650mg every 6–8 hours" },
      { medicine: "Steam Inhalation", purpose: "Congestion relief", dose_guidance: "10–15 minutes, 2–3 times daily with plain hot water" },
    ],
  },
  // ── Conjunctivitis / Eye ─────────────────────
  {
    condition: "Conjunctivitis (Pink Eye)",
    triggers: [["eye-pain", "light-sensitivity"], ["eye-pain", "headache"]],
    min_match: 2,
    severity: "Mild",
    description: "Inflammation or infection of the transparent membrane lining the eyelid and eyeball. Common causes include viral/bacterial infection or allergies.",
    recommendations: [
      { medicine: "Artificial Tears (Refresh Tears)", purpose: "Lubrication & comfort", dose_guidance: "1–2 drops in affected eye every 4–6 hours" },
    ],
  },
];

// ─────────────────────────────────────────────
// Emergency / Risk Keywords
// ─────────────────────────────────────────────

const EMERGENCY_SYMPTOMS: Record<string, string> = {
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
};

const GENERAL_WARNINGS = [
  "Consult a doctor immediately if fever persists for more than 3 days.",
  "Seek medical help if symptoms worsen or new symptoms appear.",
  "If you experience difficulty breathing at any point, call emergency services.",
];

// ─────────────────────────────────────────────
// Severity Classification
// ─────────────────────────────────────────────

const SEVERITY_ORDER: Record<string, number> = { "Mild": 0, "Moderate": 1, "Severe": 2 };

function classifySeverity(symptomIds: string[], matchedConditions: any[]): "Mild" | "Moderate" | "Severe" {
  let severity: "Mild" | "Moderate" | "Severe" = "Mild";

  for (const cond of matchedConditions) {
    if ((SEVERITY_ORDER[cond.severity] || 0) > (SEVERITY_ORDER[severity] || 0)) {
      severity = cond.severity as "Mild" | "Moderate" | "Severe";
    }
  }

  for (const sid of symptomIds) {
    if (EMERGENCY_SYMPTOMS[sid]) {
      severity = "Severe";
      break;
    }
  }

  if (symptomIds.length >= 4 && severity === "Mild") {
    severity = "Moderate";
  }

  return severity;
}

// ─────────────────────────────────────────────
// Core Engine
// ─────────────────────────────────────────────

export function analyzeSymptoms(symptomIds: string[], ageGroup: string = "Adult"): SymptomEngineResponse {
  const symptomSet = new Set(symptomIds.map(s => s.toLowerCase().trim()));
  let matched: any[] = [];
  const seenConditions = new Set<string>();

  for (const rule of CONDITION_RULES) {
    let bestOverlap = 0;
    for (const triggerCombo of rule.triggers) {
      const overlap = triggerCombo.filter(t => symptomSet.has(t)).length;
      bestOverlap = Math.max(bestOverlap, overlap);
    }

    if (bestOverlap >= rule.min_match && !seenConditions.has(rule.condition)) {
      matched.push({
        condition: rule.condition,
        severity: rule.severity,
        description: rule.description,
        match_score: bestOverlap,
        recommendations: rule.recommendations,
      });
      seenConditions.add(rule.condition);
    }
  }

  matched.sort((a, b) => {
    if (b.match_score !== a.match_score) {
      return b.match_score - a.match_score;
    }
    return (SEVERITY_ORDER[b.severity] || 0) - (SEVERITY_ORDER[a.severity] || 0);
  });

  matched = matched.slice(0, 4);

  if (matched.length === 0) {
    matched = [{
      condition: "General Health Concern",
      severity: "Mild",
      description: `Based on your reported symptoms (${symptomIds.join(', ')}), no specific condition was strongly indicated by our rule engine. This does not mean there is no issue — please consult a healthcare professional for a proper evaluation.`,
      match_score: 0,
      recommendations: [],
    }];
  }

  const overallSeverity = classifySeverity(Array.from(symptomSet), matched);

  const allRecs: any[] = [];
  const seenMeds = new Set<string>();
  for (const cond of matched) {
    for (const rec of cond.recommendations || []) {
      if (!seenMeds.has(rec.medicine)) {
        allRecs.push(rec);
        seenMeds.add(rec.medicine);
      }
    }
  }

  const ageLc = ageGroup.toLowerCase();
  let dosageNote = null;
  if (ageLc.includes("infant") || ageLc.includes("child")) {
    dosageNote = "CHILDREN: Dosages shown are for adults. For children, use HALF the adult dose or consult a paediatrician before administering any medication.";
  } else if (ageLc.includes("senior")) {
    dosageNote = "SENIORS: Patients above 65 may need adjusted dosages. Consult a doctor, especially if on other medications.";
  }

  const safetyWarnings: string[] = [];
  for (const sid of symptomSet) {
    if (EMERGENCY_SYMPTOMS[sid]) {
      safetyWarnings.push(EMERGENCY_SYMPTOMS[sid]);
    }
  }
  safetyWarnings.push(...GENERAL_WARNINGS);

  const conditionsOut = matched.map(c => ({
    condition: c.condition,
    severity: c.severity,
    description: c.description,
  }));

  return {
    conditions: conditionsOut,
    severity: overallSeverity,
    recommendations: allRecs,
    safety_warnings: safetyWarnings,
    dosage_note: dosageNote,
    disclaimer: "This is not a medical diagnosis. It provides general health guidance only. Always consult a qualified healthcare professional for medical advice.",
  };
}
