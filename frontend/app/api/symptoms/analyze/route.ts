import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { symptomAnalysisSchema } from "@/lib/validations"
import { successResponse, handleApiError } from "@/lib/api-utils"
import { analyzeSymptoms } from "@/lib/symptom-engine"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    const body = await request.json()
    const { symptoms, ageGroup } = symptomAnalysisSchema.parse(body)

    // Run TS engine locally
    const engineResult = analyzeSymptoms(symptoms, ageGroup)

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
