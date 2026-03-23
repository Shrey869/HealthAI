import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ShieldCheck } from "lucide-react"

export default function HipaaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-6">
            <ShieldCheck className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold mb-6">HIPAA Compliance Guarantee</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            HealthAI meets strict international data protection standards, including full adherence to the Health Insurance Portability and Accountability Act (HIPAA).
          </p>
          <div className="text-left space-y-4 bg-muted/30 p-8 rounded-xl border border-border">
            <p>✓ <strong>Encrypted Data:</strong> All ePHI (Electronic Protected Health Information) is secured with AES-256 bit encryption.</p>
            <p>✓ <strong>Access Control:</strong> Strict authentication boundaries ensure only you can view your diagnostic records and saved pharmacies.</p>
            <p>✓ <strong>Audit Controls:</strong> Access to the underlying dataset is routinely monitored to block outside intrusion.</p>
            <p>✓ <strong>Data Deletion:</strong> You retain the complete right to purge your HealthAI logs at any given time.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
