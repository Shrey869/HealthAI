import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, handleApiError, ApiError } from "@/lib/api-utils"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new ApiError(401, "You must be signed in to save medical stores")
    }

    const { id: pharmacyId } = await params

    // Check if store exists in our DB
    let store = await prisma.pharmacy.findUnique({ where: { id: pharmacyId } })
    
    // If not in DB, it's a new OSM Place ID coming from the frontend map.
    if (!store) {
      const body = await request.json().catch(() => null)
      if (!body || !body.name) {
        throw new ApiError(404, "Medical Store not found in DB and no details provided to save")
      }
      
      // Cache the OSM Place into our Document store
      store = await prisma.pharmacy.create({
        data: {
          id: pharmacyId,
          name: body.name,
          type: body.type || "Medical Store",
          hospital: body.hospital || "Unknown Localization",
          rating: body.rating || 0.0,
          reviews: body.reviews || 0,
          lat: body.lat || 0,
          lng: body.lng || 0,
          address: body.hospital || "Unknown Address",
          phone: "Unknown",
          available: body.available ?? true,
        }
      })
    }

    // Check if already saved
    const existing = await prisma.savedPharmacy.findUnique({
      where: {
        userId_pharmacyId: {
          userId: session.user.id,
          pharmacyId,
        },
      },
    })

    if (existing) {
      throw new ApiError(409, "Medical Store already saved")
    }

    await prisma.savedPharmacy.create({
      data: {
        userId: session.user.id,
        pharmacyId,
      },
    })

    return successResponse({ saved: true }, 201)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new ApiError(401, "You must be signed in")
    }

    const { id: pharmacyId } = await params

    await prisma.savedPharmacy.deleteMany({
      where: {
        userId: session.user.id,
        pharmacyId,
      },
    })

    return successResponse({ saved: false })
  } catch (error) {
    return handleApiError(error)
  }
}
