import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, handleApiError, ApiError } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new ApiError(401, "You must be signed in to view diagnoses")
    }

    const diagnoses = await prisma.diagnosis.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    return successResponse(diagnoses)
  } catch (error) {
    return handleApiError(error)
  }
}
