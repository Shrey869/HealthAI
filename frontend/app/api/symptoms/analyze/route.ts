import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { symptomAnalysisSchema } from "@/lib/validations"
import { successResponse, handleApiError } from "@/lib/api-utils"

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    const body = await request.json()
    const { symptoms, ageGroup } = symptomAnalysisSchema.parse(body)

    // Forward to Express → FastAPI symptom engine
    const res = await fetch(`${BACKEND_URL}/api/symptoms/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms, ageGroup }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      throw new Error(`Symptom engine error: ${res.status} — ${errBody}`)
    }

    const engineResult = await res.json()

    // Store diagnosis if user is authenticated
    let diagnosisId: string | null = null
    if (session?.user?.id) {
      const diagnosis = await prisma.diagnosis.create({
        data: {
          userId: session.user.id,
          symptoms,
          conditions: engineResult as any,
        },
      })
      diagnosisId = diagnosis.id
    }

    return successResponse({
      id: diagnosisId,
      symptoms,
      ...engineResult,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
