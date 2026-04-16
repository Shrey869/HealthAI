import { aiResponseSchema, type AIResponse } from "@/lib/validations"

const SYSTEM_PROMPT = `You are a medical AI assistant tailored for users in India. Given a list of symptoms, analyze them and provide possible conditions along with a practical treatment plan.

IMPORTANT RULES:
1. You are NOT a doctor. Always remind users to consult a healthcare professional.
2. Recommend SPECIFIC MEDICINES commonly available in Indian pharmacies (e.g., Dolo-650 instead of Paracetamol, Combiflam, Cheston Cold, Digene, etc.).
3. Provide exact dosages (e.g., 500mg) and realistic intake plans SPECIFICALLY TAILORED FOR THE PATIENT'S AGE GROUP. A child requires vastly different dosage constraints than an adult or senior.
4. Include practical preventative measures (e.g., "Avoid junk food", "Drink warm water", "Walk daily").
5. Return ONLY valid JSON, no markdown, no code fences.

Return your response in this exact JSON format:
{
  "conditions": [
    {
      "condition": "Condition Name",
      "probability": 85,
      "riskLevel": "low",
      "description": "Detailed description of the condition and how it relates to the symptoms provided. Include general health advice.",
      "preventativeMeasures": [
        "Drink 3 liters of warm water daily",
        "Avoid eating heavy or spicy junk foods"
      ],
      "recommendedMedicines": [
        {
          "name": "Dolo 650 (Paracetamol)",
          "dosage": "650mg",
          "intakePlan": "1 tablet in the morning and 1 at night after meals for 3 days"
        }
      ]
    }
  ]
}

Return 1-3 conditions, ordered by probability (highest first). Make the medicine recommendations practical, over-the-counter (OTC) where possible in India, and safe.`

export async function analyzeSymptoms(symptoms: string[], ageGroup: string = "Adult"): Promise<AIResponse> {
  try {
    const apiKey = process.env.GROK_API_KEY || ""
    
    if (!apiKey) {
      throw new Error("GROK_API_KEY is missing from environment variables")
    }

    const prompt = `${SYSTEM_PROMPT}

Patient age group: ${ageGroup}
Patient symptoms: ${symptoms.join(", ")}

Analyze these symptoms and return the JSON response specifically factoring in the patient's age group for dosages:`

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "grok-2-latest",
        messages: [
          { role: "system", content: "You are a helpful medical diagnostic assistant. Always reply with valid JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      })
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`xAI API Error: ${res.status} - ${errorText}`)
    }

    const data = await res.json()
    const text = data.choices[0].message.content

    // Clean up potential markdown formatting from AI
    const cleanedText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim()

    const parsed = JSON.parse(cleanedText)
    const validated = aiResponseSchema.parse(parsed)

    return validated
  } catch (error) {
    console.error("AI analysis error:", error)

    // Return fallback response if AI fails
    return {
      conditions: [
        {
          condition: "General Health Concern",
          probability: 70,
          riskLevel: "medium",
          description: `Based on your symptoms (${symptoms.join(", ")}), we recommend consulting a healthcare professional for a proper diagnosis. Our AI analysis encountered an issue, but your symptoms should be evaluated by a doctor.`,
          preventativeMeasures: [
            "Rest at home and monitor your temperature",
            "Stay hydrated with clear fluids",
            "Consult a local clinic if symptoms worsen"
          ],
          recommendedMedicines: [
            {
              "name": "Consult a Doctor",
              "dosage": "N/A",
              "intakePlan": "Please visit a medical professional for a prescribed treatment plan."
            }
          ]
        },
      ],
    }
  }
}
