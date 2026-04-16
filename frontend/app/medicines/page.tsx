import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pill, AlertTriangle, ShieldCheck } from "lucide-react"

export default async function MedicinesPage() {
  const medicines = await prisma.medicine.findMany()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Central Medicine Database</h1>
            <p className="text-muted-foreground text-lg">
              Explore our verified catalog of various medicines, checking recommended dosages and common side effects. Always consult a real doctor before beginning a new prescription.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicines.map((med: any) => (
              <Card key={med.id} className="border-border/50 hover:shadow-lg transition-all h-full flex flex-col">
                <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Pill className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{med.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 flex-1 flex flex-col gap-4">
                  <p className="text-sm text-foreground leading-relaxed">{med.description}</p>
                  
                  <div className="space-y-3 mt-auto">
                    <div className="bg-primary/5 rounded-md p-3">
                      <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> Adult Dosage
                      </p>
                      <p className="text-sm font-medium text-foreground">{med.dosageAdult}</p>
                    </div>

                    <div className="bg-blue-500/5 rounded-md p-3">
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> Child Dosage
                      </p>
                      <p className="text-sm font-medium text-foreground">{med.dosageChild}</p>
                    </div>

                    <div className="bg-amber-500/5 rounded-md p-3">
                      <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Side Effects
                      </p>
                      <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                        {med.sideEffects.map((sideEffect: string, i: number) => (
                          <li key={i}>{sideEffect}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
