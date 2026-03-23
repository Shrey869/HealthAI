"use client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Activity, ShieldCheck, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 md:py-24 perspective-1000">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto glass shadow-3d rounded-3xl p-8 md:p-16 border-white/20 transform-3d"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20">
              <Activity className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Our Mission</h1>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-xl text-foreground font-medium leading-relaxed">
                HealthAI is dedicated to revolutionizing the way you find medical care and treatment.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We use advanced artificial intelligence to accurately analyze symptoms, recommend tailored medicine intake plans, and seamlessly connect you to the nearest medical stores. 
              </p>
              <div className="flex gap-4 pt-4">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <ShieldCheck className="h-5 w-5" /> Precision
                </div>
                <div className="flex items-center gap-2 text-rose-500 font-semibold">
                  <Heart className="h-5 w-5" /> Care
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square glass rounded-3xl border-white/10 shadow-3d overflow-hidden flex items-center justify-center p-8 bg-gradient-to-br from-primary/20 to-transparent">
                 <motion.div 
                   animate={{ rotateY: [0, 360] }}
                   transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                   className="w-full h-full glass rounded-2xl flex items-center justify-center border-white/20"
                 >
                   <Activity className="h-32 w-32 text-primary opacity-50" />
                 </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
