import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
          <p className="text-lg text-muted-foreground text-center mb-10">
            Have questions about HealthAI? Need to report an issue or suggest a feature? Reach out to our team below.
          </p>

          <div className="space-y-6 bg-muted/30 p-8 rounded-xl border border-border">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <Textarea id="message" placeholder="How can we help?" rows={5} />
            </div>
            <Button className="w-full">Send Message</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
