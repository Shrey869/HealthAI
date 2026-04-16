"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense, useEffect, useState } from "react"
import { ArrowLeft, MapPin, AlertTriangle, FileText, Stethoscope, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AIResultCard, type DiagnosisResult } from "@/components/ai-result-card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

function DiagnosisContent() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<DiagnosisResult[] | null>(null)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Try to get results from sessionStorage
    const stored = sessionStorage.getItem("diagnosisResult")
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setSymptoms(data.symptoms || [])
        setResults(
          (data.conditions || []).map((c: any, i: number) => ({
            id: String(i + 1),
            condition: c.condition,
            probability: c.probability,
            riskLevel: c.riskLevel,
            description: c.description,
            preventativeMeasures: c.preventativeMeasures || [],
            recommendedMedicines: c.recommendedMedicines || [],
          }))
        )
      } catch (e) {
        console.error("Failed to parse diagnosis:", e)
      }
    }
    setLoading(false)
  }, [searchParams])

  if (loading) {
    return <DiagnosisLoading />
  }

  if (!results || results.length === 0) {
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
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild className="rounded-xl glass border-white/20">
            <Link href="/symptoms">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">Diagnosis Results</h1>
            <p className="text-muted-foreground text-lg">AI-powered medical analysis</p>
          </div>
        </div>

      {/* Analyzed Symptoms Summary */}
        <Card className="mb-8 glass shadow-3d border-white/20 transform-3d">
          <CardHeader className="pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Analyzed Symptoms</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {symptoms.map((symptom, index) => (
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

      {/* Warning Notice */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-start gap-3 p-6 rounded-2xl glass bg-amber-500/10 border border-amber-500/20 mb-8 transform-3d shadow-lg shadow-amber-500/5"
      >
        <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-1">Medical Disclaimer</p>
          <p className="text-sm text-amber-500/80 leading-relaxed">
            This AI analysis is for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.
          </p>
        </div>
      </motion.div>

      {/* Diagnosis Results */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Stethoscope className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Possible Conditions</h2>
        </div>
        
        {results.map((result, index) => (
          <AIResultCard key={result.id} result={result} isMain={index === 0} />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
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
      <Skeleton className="h-24 w-full mb-8 rounded-lg" />
      <Skeleton className="h-16 w-full mb-8 rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </div>
  )
}

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
