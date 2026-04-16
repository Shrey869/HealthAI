"use client"
import { FileQuestion, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-6">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-foreground mb-2">Page not found</h2>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/symptoms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Symptom Checker
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
