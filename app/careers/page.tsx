import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Careers at HealthAI</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Join our team of passionate engineers, data scientists, and healthcare professionals working together to build the future of AI-driven personalized health.
          </p>
          <div className="p-8 bg-muted/30 rounded-xl border border-border">
            <h3 className="text-xl font-semibold mb-2">No Open Roles</h3>
            <p className="text-muted-foreground mb-6">We currently don't have any open positions, but we are always looking for great talent.</p>
            <Button>Send us your resume</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
