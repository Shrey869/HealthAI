import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-3xl mx-auto prose dark:prose-invert">
          <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last Updated: October 2026</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing or using HealthAI, you agree to be bound by these operational terms.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Medical Disclaimer</h2>
          <p className="mb-4"><strong>Please read carefully:</strong> HealthAI is NOT a substitute for professional medical guidance, diagnosis, or hospital treatment. Always consult a qualified physician or healthcare provider regarding a medical condition. Do not disregard professional medical advice or delay in seeking it because of something you have read on this application.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Responsibilities</h2>
          <p className="mb-4">You agree to ensure the accuracy of the symptoms submitted into the checker and to consult your primary care doctor before blindly taking any medicines sourced through the map API.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
