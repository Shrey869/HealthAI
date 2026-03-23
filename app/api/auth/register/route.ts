import { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations"
import { successResponse, handleApiError, ApiError } from "@/lib/api-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new ApiError(409, "An account with this email already exists")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    })

    return successResponse(
      { id: user.id, name: user.name, email: user.email },
      201
    )
  } catch (error) {
    return handleApiError(error)
  }
}
