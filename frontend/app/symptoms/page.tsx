"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mic, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SymptomSelector } from "@/components/symptom-selector"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function SymptomsPage() {
  const router = useRouter()
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [ageGroup, setAgeGroup] = useState<string>("Adult")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const ageGroups = ["Infant (0-2)", "Child (3-12)", "Teen (13-17)", "Adult (18-64)", "Senior (65+)"]

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) return

    setIsAnalyzing(true)

    try {
      const res = await fetch("/api/symptoms/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: selectedSymptoms, ageGroup }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed")
      }

      // Store full engine result in sessionStorage and navigate
      sessionStorage.setItem("diagnosisResult", JSON.stringify(data.data))
      router.push(`/diagnosis?id=${data.data.id || "latest"}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to analyze symptoms. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Voice input is not supported in your browser")
      return
    }

    setIsListening(!isListening)

    if (!isListening) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase()
        // Match spoken words to symptom IDs
        const symptomMap: Record<string, string> = {
          fever: "fever",
          headache: "headache",
          cough: "cough",
          fatigue: "fatigue",
          "sore throat": "sore-throat",
          "body aches": "body-aches",
          nausea: "nausea",
          dizziness: "dizziness",
          "chest pain": "chest-pain",
          vomiting: "vomiting",
          diarrhea: "diarrhea",
          rash: "skin-rash",
          chills: "chills",
        }

        const matched: string[] = []
        Object.entries(symptomMap).forEach(([word, id]) => {
          if (transcript.includes(word)) {
            matched.push(id)
          }
        })

        if (matched.length > 0) {
          setSelectedSymptoms((prev) => [...new Set([...prev, ...matched])])
          toast.success(`Detected: ${matched.join(", ")}`)
        } else {
          toast.info(`Heard: "${transcript}" — no matching symptoms found`)
        }
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
        toast.error("Voice input failed. Please try again.")
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-8 md:py-12 perspective-1000">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 max-w-3xl"
        >
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-4xl md:text-6xl font-black text-foreground tracking-tight"
            >
              Symptom Checker <span className="text-primary italic">Pro</span>
            </motion.h1>
            <p className="mt-4 text-muted-foreground text-xl">
              Precision AI diagnostics for rapid relief
            </p>
          </div>

          <Card className="glass shadow-3d border-white/20 transform-3d">
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Describe your condition</CardTitle>
                  <CardDescription className="text-base text-muted-foreground/80">
                    Select symptoms or use AI voice analysis
                  </CardDescription>
                </div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant={isListening ? "default" : "outline"}
                    size="icon"
                    onClick={handleVoiceInput}
                    className={cn("h-12 w-12 rounded-xl glass shadow-lg", isListening ? "animate-pulse ring-2 ring-primary bg-primary/20" : "")}
                  >
                    <Mic className={cn("h-5 w-5", isListening ? "text-primary" : "text-muted-foreground")} />
                    <span className="sr-only">Voice input</span>
                  </Button>
                </motion.div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex flex-col space-y-3">
                <label className="text-sm font-medium leading-none">
                  Patient Age Group
                </label>
                <div className="flex flex-wrap gap-2">
                  {ageGroups.map((group) => (
                    <Button
                      key={group}
                      type="button"
                      variant={ageGroup === group ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAgeGroup(group)}
                      className="rounded-full"
                    >
                      {group}
                    </Button>
                  ))}
                </div>
              </div>

              <SymptomSelector
                selectedSymptoms={selectedSymptoms}
                onSymptomsChange={setSelectedSymptoms}
              />

              {selectedSymptoms.length === 0 && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50 text-muted-foreground">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p className="text-sm">Please select at least one symptom to continue</p>
                </div>
              )}

              <Button
                onClick={handleAnalyze}
                disabled={selectedSymptoms.length === 0 || isAnalyzing}
                className="w-full h-12 text-base"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    Analyze Symptoms
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                This tool provides general health information and is not a substitute for professional medical advice.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
