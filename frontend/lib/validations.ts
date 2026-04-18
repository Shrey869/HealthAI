import { z } from "zod"

// Auth validations
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

// Symptom analysis validation
export const symptomAnalysisSchema = z.object({
  symptoms: z.array(z.string()).min(1, "At least one symptom is required"),
  ageGroup: z.string().optional().default("Adult"),
})

// Pharmacy/Store query validation
export const searchSchema = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radius: z.coerce.number().optional().default(10),
})

// ── New Symptom Engine response schemas ──────

export const otcRecommendationSchema = z.object({
  medicine: z.string(),
  purpose: z.string(),
  dose_guidance: z.string(),
})

export const conditionSchema = z.object({
  condition: z.string(),
  severity: z.string(),
  description: z.string(),
})

export const symptomEngineResponseSchema = z.object({
  conditions: z.array(conditionSchema).min(1),
  severity: z.enum(["Mild", "Moderate", "Severe"]),
  recommendations: z.array(otcRecommendationSchema),
  safety_warnings: z.array(z.string()),
  dosage_note: z.string().nullable().optional(),
  disclaimer: z.string(),
})

// Legacy AI response schemas (kept for backward compat with old data)
export const aiConditionSchema = z.object({
  condition: z.string(),
  probability: z.number().min(0).max(100),
  riskLevel: z.enum(["low", "medium", "high"]),
  description: z.string(),
  preventativeMeasures: z.array(z.string()),
  recommendedMedicines: z.array(
    z.object({
      name: z.string(),
      dosage: z.string(),
      intakePlan: z.string()
    })
  )
})

export const aiResponseSchema = z.object({
  conditions: z.array(aiConditionSchema).min(1),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type SymptomAnalysisInput = z.infer<typeof symptomAnalysisSchema>
export type OTCRecommendation = z.infer<typeof otcRecommendationSchema>
export type Condition = z.infer<typeof conditionSchema>
export type SymptomEngineResponse = z.infer<typeof symptomEngineResponseSchema>
export type AICondition = z.infer<typeof aiConditionSchema>
export type AIResponse = z.infer<typeof aiResponseSchema>

