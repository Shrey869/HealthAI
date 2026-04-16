import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-3xl mx-auto prose dark:prose-invert">
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last Updated: October 2026</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Data We Collect</h2>
          <p className="mb-4">We collect information you provide directly to us, such as when you create an account, track your symptoms, or save your preferred local medical stores. We use advanced artificial intelligence, but your chat logs are anonymized to protect your identity.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Information</h2>
          <p className="mb-4">We utilize your symptom logs strictly to generate accurate, localized treatment and dosage plans. We do not sell your personal health records to third-party data brokers.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Security</h2>
          <p className="mb-4">HealthAI takes your privacy incredibly seriously. Information transmission is encrypted in transit and at rest in our secure database systems.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
