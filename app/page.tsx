"use client"

import Link from "next/link"
import { Brain, ShieldCheck, Stethoscope, ArrowRight, Activity, Heart, Zap, Store, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"

const features = [
  {
    icon: Brain,
    title: "AI Symptom Analysis",
    description: "Advanced machine learning algorithms analyze your symptoms to provide accurate health insights.",
  },
  {
    icon: ShieldCheck,
    title: "Risk Detection",
    description: "Identify potential health risks early with our comprehensive risk assessment system.",
  },
  {
    icon: Store,
    title: "Find Medical Stores",
    description: "Locate nearby pharmacies to pick up recommended treatments easily.",
  },
  {
    icon: FileText,
    title: "AI Report Analyzer",
    description: "Upload medical reports to extract values, detect abnormalities, and get AI explanations.",
  },
]

const stats = [
  { value: "98%", label: "Accuracy Rate" },
  { value: "50K+", label: "Users Helped" },
  { value: "1000+", label: "Pharmacies Listed" },
  { value: "24/7", label: "Available" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden perspective-1000">
          <div className="container mx-auto px-4 py-20 md:py-32 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 glass text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-3d">
                <Zap className="h-4 w-4 fill-primary" />
                AI-Powered Healthcare Assistant
              </div>

              <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-balance bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto] animate-gradient">
                AI Health Assistant
              </h1>

              <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto">
                Analyze symptoms and get instant treatment and medicine recommendations. Find nearby pharmacies easily with 3D mapping support.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mt-10">
                <Button asChild size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95">
                  <Link href="/symptoms">
                    Start Symptom Check
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base glass hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
                  <Link href="/pharmacies">
                    Find Medical Stores
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base glass hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
                  <Link href="/report-analyzer">
                    Analyze Reports
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Hero Illustration */}
            <motion.div 
              initial={{ opacity: 0, rotateX: 20, scale: 0.9 }}
              animate={{ opacity: 1, rotateX: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mt-16 relative transform-3d"
            >
              <div className="max-w-4xl mx-auto">
                <div className="relative glass rounded-3xl shadow-3d border border-white/20 overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-12 bg-white/5 flex items-center px-4 gap-2 border-b border-white/10">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="pt-12 p-8 md:p-12 bg-gradient-to-br from-primary/5 via-transparent to-primary/5">
                    <div className="flex items-center gap-4 mb-6">
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20"
                      >
                        <Activity className="h-7 w-7 text-primary-foreground" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Interactive Diagnostics</h3>
                        <p className="text-sm text-muted-foreground">Neural Analysis Engine v2.0</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { icon: Heart, label: "Stability", value: "Normal", color: "text-rose-500" },
                        { icon: Activity, label: "Active Logs", value: "24h Sync", color: "text-emerald-500" },
                        { icon: Brain, label: "Confidence", value: "98.4%", color: "text-blue-500" }
                      ].map((item, i) => (
                        <motion.div 
                          key={i}
                          whileHover={{ y: -5, scale: 1.02 }}
                          className="glass rounded-2xl p-6 border border-white/10 shadow-3d"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <item.icon className={`h-5 w-5 ${item.color}`} />
                            <span className="text-sm font-semibold text-foreground/80">{item.label}</span>
                          </div>
                          <p className="text-3xl font-black text-foreground">{item.value}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-border bg-muted/30">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                Everything you need for better health decisions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground text-pretty">
                Our AI-powered platform combines cutting-edge technology with medical expertise to help you understand your health better.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-6">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                Ready to take control of your health?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground text-pretty">
                Start your free symptom analysis today and get personalized health insights in minutes.
              </p>
              <Button asChild size="lg" className="mt-8 h-12 px-8 text-base">
                <Link href="/symptoms">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
