import { describe, it, expect } from "vitest"
import {
  registerSchema,
  loginSchema,
  symptomAnalysisSchema,
  searchSchema,
  aiResponseSchema,
} from "@/lib/validations"

describe("registerSchema", () => {
  it("validates a correct registration input", () => {
    const input = { name: "John Doe", email: "john@example.com", password: "password123" }
    const result = registerSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it("rejects short name", () => {
    const input = { name: "J", email: "john@example.com", password: "password123" }
    const result = registerSchema.safeParse(input)
    expect(result.success).toBe(false)
  })

  it("rejects invalid email", () => {
    const input = { name: "John Doe", email: "not-an-email", password: "password123" }
    const result = registerSchema.safeParse(input)
    expect(result.success).toBe(false)
  })

  it("rejects short password", () => {
    const input = { name: "John Doe", email: "john@example.com", password: "12345" }
    const result = registerSchema.safeParse(input)
    expect(result.success).toBe(false)
  })
})

describe("loginSchema", () => {
  it("validates correct login input", () => {
    const input = { email: "john@example.com", password: "password123" }
    const result = loginSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it("rejects empty password", () => {
    const input = { email: "john@example.com", password: "" }
    const result = loginSchema.safeParse(input)
    expect(result.success).toBe(false)
  })
})

describe("symptomAnalysisSchema", () => {
  it("validates with symptoms", () => {
    const input = { symptoms: ["fever", "headache"] }
    const result = symptomAnalysisSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it("rejects empty symptoms array", () => {
    const input = { symptoms: [] }
    const result = symptomAnalysisSchema.safeParse(input)
    expect(result.success).toBe(false)
  })

  it("rejects missing symptoms", () => {
    const input = {}
    const result = symptomAnalysisSchema.safeParse(input)
    expect(result.success).toBe(false)
  })
})

describe("searchSchema", () => {
  it("validates empty query (all defaults)", () => {
    const input = {}
    const result = searchSchema.safeParse(input)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.radius).toBe(10)
    }
  })

  it("validates with all parameters", () => {
    const input = { search: "apollo", type: "Pharmacy", lat: 28.6, lng: 77.2, radius: 5 }
    const result = searchSchema.safeParse(input)
    expect(result.success).toBe(true)
  })
})

describe("aiResponseSchema", () => {
  it("validates a correct AI response", () => {
    const input = {
      conditions: [
        {
          condition: "Common Cold",
          probability: 85,
          riskLevel: "low",
          description: "A common viral infection",
          preventativeMeasures: ["Rest", "Hydration"],
          recommendedMedicines: [
            { name: "Dolo 650", dosage: "650mg", intakePlan: "1 tablet after meal" }
          ],
        },
      ],
    }
    const result = aiResponseSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it("rejects invalid risk level", () => {
    const input = {
      conditions: [
        {
          condition: "Test",
          probability: 50,
          riskLevel: "critical",
          description: "Test description",
          preventativeMeasures: [],
          recommendedMedicines: [],
        },
      ],
    }
    const result = aiResponseSchema.safeParse(input)
    expect(result.success).toBe(false)
  })

  it("rejects probability over 100", () => {
    const input = {
      conditions: [
        {
          condition: "Test",
          probability: 150,
          riskLevel: "low",
          description: "Test description",
          preventativeMeasures: [],
          recommendedMedicines: [],
        },
      ],
    }
    const result = aiResponseSchema.safeParse(input)
    expect(result.success).toBe(false)
  })

  it("rejects empty conditions array", () => {
    const input = { conditions: [] }
    const result = aiResponseSchema.safeParse(input)
    expect(result.success).toBe(false)
  })
})
