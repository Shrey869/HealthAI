import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, handleApiError, ApiError } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new ApiError(401, "You must be signed in")
    }

    const userId = session.user.id

    // Get diagnosis count
    const totalDiagnoses = await prisma.diagnosis.count({
      where: { userId },
    })

    // Get saved pharmacies count
    const savedPharmaciesCount = await prisma.savedPharmacy.count({
      where: { userId },
    })

    // Get recent diagnoses
    const recentDiagnoses = await prisma.diagnosis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    // Get saved pharmacies with details
    const savedPharmacies = await prisma.savedPharmacy.findMany({
      where: { userId },
      include: { pharmacy: true },
      take: 5,
    })

    // Calculate simple health insights from diagnosis history
    const allDiagnoses = await prisma.diagnosis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    // Count diagnoses by month for the chart
    const monthlyDiagnoses: Record<string, number> = {}
    allDiagnoses.forEach((d) => {
      const month = d.createdAt.toLocaleString("default", { month: "short" })
      monthlyDiagnoses[month] = (monthlyDiagnoses[month] || 0) + 1
    })

    return successResponse({
      stats: {
        totalDiagnoses,
        savedPharmaciesCount,
        healthScore: Math.min(95, 70 + totalDiagnoses * 2), // Simple score based on usage
      },
      recentDiagnoses,
      savedPharmacies: savedPharmacies.map((sp) => sp.pharmacy),
      monthlyDiagnoses,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
