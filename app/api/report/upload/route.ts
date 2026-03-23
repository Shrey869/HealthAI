import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Parse incoming form data from the frontend (field name: "report")
    const formData = await request.formData()
    const uploadedFile = formData.get("report") as Blob | null

    if (!uploadedFile) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // FastAPI expects the field name to be "file", not "report"
    const aiFormData = new FormData()
    aiFormData.append("file", uploadedFile, (uploadedFile as File).name ?? "report.pdf")

    const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000/analyze-report"

    const response = await fetch(AI_SERVICE_URL, {
      method: "POST",
      body: aiFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("AI service error:", errorText)
      return NextResponse.json(
        { error: "Failed to analyze report", details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Report upload error:", error)
    return NextResponse.json(
      { error: "Failed to connect to AI service. Please ensure it is running.", details: error.message },
      { status: 500 }
    )
  }
}
