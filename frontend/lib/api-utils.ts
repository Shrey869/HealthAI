import { NextResponse } from "next/server"
import { ZodError } from "zod"

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export function successResponse(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error)

  if (error instanceof ApiError) {
    return errorResponse(error.message, error.statusCode)
  }

  if (error instanceof ZodError) {
    const messages = error.errors.map((e) => e.message).join(", ")
    return errorResponse(messages, 400)
  }

  if (error instanceof Error) {
    return errorResponse(error.message, 500)
  }

  return errorResponse("An unexpected error occurred", 500)
}

// Haversine formula to calculate distance between two coordinates in km
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
