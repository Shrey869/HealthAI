import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { symptomAnalysisSchema } from "@/lib/validations"
import { analyzeSymptoms } from "@/lib/ai"
import { successResponse, handleApiError, ApiError } from "@/lib/api-utils"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    const body = await request.json()
    const { symptoms, ageGroup } = symptomAnalysisSchema.parse(body)

    // Call AI for analysis
    const aiResult = await analyzeSymptoms(symptoms, ageGroup)

    // Store diagnosis if user is authenticated
    let diagnosisId: string | null = null
    if (session?.user?.id) {
      const diagnosis = await prisma.diagnosis.create({
        data: {
          userId: session.user.id,
          symptoms,
          conditions: aiResult.conditions as any,
        },
      })
      diagnosisId = diagnosis.id
    }

    return successResponse({
      id: diagnosisId,
      symptoms,
      conditions: aiResult.conditions,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
