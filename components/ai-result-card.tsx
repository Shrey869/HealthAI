import { Brain, ChevronRight, CheckCircle2, Pill } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RiskBadge } from "@/components/risk-badge"
import { motion } from "framer-motion"

export interface DiagnosisResult {
  id: string
  condition: string
  probability: number
  riskLevel: "low" | "medium" | "high"
  description: string
  preventativeMeasures?: string[]
  recommendedMedicines?: {
    name: string
    dosage: string
    intakePlan: string
  }[]
}

interface AIResultCardProps {
  result: DiagnosisResult
  isMain?: boolean
}

export function AIResultCard({ result, isMain = false }: AIResultCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01, rotateX: 2, rotateY: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="perspective-1000"
    >
      <Card className={`overflow-hidden transition-all glass shadow-3d border-white/20 ${isMain ? "border-primary/50 shadow-primary/10" : ""}`}>
      <CardHeader className={`${isMain ? "bg-primary/5" : "bg-muted/30"} pb-4`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isMain ? "bg-primary" : "bg-muted"}`}>
              <Brain className={`h-5 w-5 ${isMain ? "text-primary-foreground" : "text-muted-foreground"}`} />
            </div>
            <div>
              <CardTitle className="text-lg">{result.condition}</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {result.probability}% match
              </p>
            </div>
          </div>
          <RiskBadge level={result.riskLevel} />
        </div>
      </CardHeader>
      <CardContent className="pt-4 pb-6">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">AI Analysis</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.description}
            </p>
          </div>

          {result.recommendedMedicines && result.recommendedMedicines.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2 text-primary mb-3">
                <Pill className="h-4 w-4" /> Recommended Treatment Plan
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {result.recommendedMedicines.map((med, index) => (
                  <div key={index} className="bg-primary/5 border border-primary/10 p-3 rounded-lg dark:bg-primary/10">
                    <p className="font-semibold text-foreground text-sm flex items-center justify-between">
                      {med.name}
                      <span className="text-xs font-mono bg-background px-2 py-0.5 rounded-full border border-border">
                        {med.dosage}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-snug">
                      {med.intakePlan}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.preventativeMeasures && result.preventativeMeasures.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Preventative Measures</h4>
              <ul className="space-y-2">
                {result.preventativeMeasures.map((measure, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>{measure}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    </motion.div>
  )
}
