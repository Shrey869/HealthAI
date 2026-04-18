"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense, useEffect, useState } from "react"
import {
  ArrowLeft,
  MapPin,
  AlertTriangle,
  FileText,
  Stethoscope,
  Loader2,
  Pill,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { SymptomEngineResponse, Condition, OTCRecommendation } from "@/lib/validations"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface DiagnosisData extends SymptomEngineResponse {
  id?: string | null
  symptoms?: string[]
}

// ─────────────────────────────────────────────
// Severity Badge Component
// ─────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: string }) {
  const config: Record<string, { bg: string; text: string; ring: string; icon: string; label: string }> = {
    Mild: {
      bg: "bg-emerald-500/15",
      text: "text-emerald-400",
      ring: "ring-emerald-500/30",
      icon: "🟢",
      label: "Home care recommended",
    },
    Moderate: {
      bg: "bg-amber-500/15",
      text: "text-amber-400",
      ring: "ring-amber-500/30",
      icon: "🟡",
      label: "Monitor symptoms closely",
    },
    Severe: {
      bg: "bg-red-500/15",
      text: "text-red-400",
      ring: "ring-red-500/30",
      icon: "🔴",
      label: "Doctor consultation required",
    },
  }

  const c = config[severity] || config.Mild

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "flex items-center gap-4 p-5 rounded-2xl ring-1",
        c.bg,
        c.ring
      )}
    >
      <span className="text-4xl">{c.icon}</span>
      <div>
        <p className={cn("text-2xl font-black tracking-tight", c.text)}>
          {severity}
        </p>
        <p className={cn("text-sm font-medium opacity-80", c.text)}>
          {c.label}
        </p>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// Condition Card Component
// ─────────────────────────────────────────────

function ConditionCard({ condition, index }: { condition: Condition; index: number }) {
  const severityColor: Record<string, string> = {
    Mild: "border-emerald-500/30 bg-emerald-500/5",
    Moderate: "border-amber-500/30 bg-amber-500/5",
    Severe: "border-red-500/30 bg-red-500/5",
  }

  const severityText: Record<string, string> = {
    Mild: "text-emerald-400",
    Moderate: "text-amber-400",
    Severe: "text-red-400",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="perspective-1000"
    >
      <Card className={cn(
        "overflow-hidden glass shadow-3d border transition-all",
        severityColor[condition.severity] || "border-white/20"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                <Stethoscope className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg leading-snug">{condition.condition}</CardTitle>
            </div>
            <span className={cn(
              "text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full whitespace-nowrap",
              severityColor[condition.severity],
              severityText[condition.severity]
            )}>
              {condition.severity}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {condition.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// Medicine Card Component
// ─────────────────────────────────────────────

function MedicineCard({ rec, index }: { rec: OTCRecommendation; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.08 }}
      whileHover={{ y: -3, scale: 1.01 }}
    >
      <div className="p-4 rounded-xl glass border border-primary/15 bg-primary/5 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 shrink-0 mt-0.5">
            <Pill className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm">{rec.medicine}</p>
            <p className="text-xs text-primary/80 font-medium mt-0.5">{rec.purpose}</p>
            <div className="mt-2 flex items-start gap-2 bg-background/50 rounded-lg px-3 py-2 border border-border/50">
              <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {rec.dose_guidance}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// Main Diagnosis Content
// ─────────────────────────────────────────────

function DiagnosisContent() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<DiagnosisData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem("diagnosisResult")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setData(parsed as DiagnosisData)
      } catch (e) {
        console.error("Failed to parse diagnosis:", e)
      }
    }
    setLoading(false)
  }, [searchParams])

  if (loading) {
    return <DiagnosisLoading />
  }

  if (!data || !data.conditions || data.conditions.length === 0) {
    return (
      <div className="container mx-auto px-4 max-w-4xl text-center py-20">
        <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">No diagnosis results found</h2>
        <p className="text-muted-foreground mb-6">Please run a symptom check first to see results.</p>
        <Button asChild>
          <Link href="/symptoms">Go to Symptom Checker</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl perspective-1000">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild className="rounded-xl glass border-white/20">
            <Link href="/symptoms">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
              Health Assessment
            </h1>
            <p className="text-muted-foreground text-lg">AI-powered symptom analysis</p>
          </div>
        </div>

        {/* ── Section 1: Analyzed Symptoms ── */}
        {data.symptoms && data.symptoms.length > 0 && (
          <Card className="mb-6 glass shadow-3d border-white/20">
            <CardHeader className="pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Reported Symptoms</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {data.symptoms.map((symptom, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      className="inline-flex items-center text-sm glass bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20"
                    >
                      {symptom}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Section 2: Severity Badge ── */}
        <div className="mb-6">
          <SeverityBadge severity={data.severity} />
        </div>

        {/* ── Section 3: Possible Conditions ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Possible Conditions</h2>
          </div>
          <div className="grid gap-4">
            {data.conditions.map((condition, index) => (
              <ConditionCard key={index} condition={condition} index={index} />
            ))}
          </div>
        </div>

        {/* ── Section 4: OTC Guidance ── */}
        {data.recommendations && data.recommendations.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Pill className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Safe OTC Relief Guidance</h2>
            </div>

            {/* Not a prescription banner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4"
            >
              <Info className="h-4 w-4 shrink-0" />
              <p className="text-xs font-medium">
                These are general OTC relief suggestions, <strong>not prescriptions</strong>. Always verify with a pharmacist or doctor.
              </p>
            </motion.div>

            {/* Dosage note for children / seniors */}
            {data.dosage_note && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4"
              >
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="text-xs font-medium">{data.dosage_note}</p>
              </motion.div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {data.recommendations.map((rec, index) => (
                <MedicineCard key={index} rec={rec} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* ── Section 5: Safety Warnings ── */}
        {data.safety_warnings && data.safety_warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="h-5 w-5 text-red-400" />
              <h2 className="text-lg font-semibold text-red-400">Safety Warnings</h2>
            </div>
            <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/25 space-y-3">
              {data.safety_warnings.map((warning, index) => (
                <div key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300/90 leading-relaxed">{warning}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Mandatory Disclaimer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-start gap-3 p-6 rounded-2xl glass bg-amber-500/10 border border-amber-500/20 mb-8 shadow-lg shadow-amber-500/5"
        >
          <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-1">
              Medical Disclaimer
            </p>
            <p className="text-sm text-amber-500/80 leading-relaxed">
              {data.disclaimer || "This is not a medical diagnosis. It provides general health guidance only. Always consult a qualified healthcare professional for medical advice."}
            </p>
          </div>
        </motion.div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Button asChild size="lg" className="flex-1 h-12">
            <Link href="/pharmacies">
              <MapPin className="mr-2 h-5 w-5" />
              Find Nearby Medical Stores
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1 h-12">
            <Link href="/symptoms">
              Check Different Symptoms
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Loading Skeleton
// ─────────────────────────────────────────────

function DiagnosisLoading() {
  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <Skeleton className="h-24 w-full mb-6 rounded-2xl" />
      <Skeleton className="h-20 w-full mb-6 rounded-2xl" />
      <div className="space-y-4 mb-8">
        <Skeleton className="h-36 w-full rounded-xl" />
        <Skeleton className="h-36 w-full rounded-xl" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 mb-8">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
      <Skeleton className="h-32 w-full rounded-2xl mb-8" />
    </div>
  )
}

// ─────────────────────────────────────────────
// Page Export
// ─────────────────────────────────────────────

export default function DiagnosisPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-8 md:py-12">
        <Suspense fallback={<DiagnosisLoading />}>
          <DiagnosisContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
