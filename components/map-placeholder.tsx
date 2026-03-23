import { MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface MapPlaceholderProps {
  className?: string
}

export function MapPlaceholder({ className }: MapPlaceholderProps) {
  return (
    <Card className={`overflow-hidden border-border/50 ${className}`}>
      <CardContent className="p-0">
        <div className="relative h-64 md:h-80 bg-muted/30 flex items-center justify-center">
          {/* Map grid background */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Map markers */}
          <div className="absolute top-1/4 left-1/3">
            <div className="relative">
              <div className="absolute -inset-2 bg-primary/20 rounded-full animate-ping" />
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <MapPin className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 right-1/4">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow">
              <MapPin className="h-3 w-3" />
            </div>
          </div>

          <div className="absolute bottom-1/3 left-1/2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow">
              <MapPin className="h-3 w-3" />
            </div>
          </div>

          <div className="absolute top-2/3 right-1/3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow">
              <MapPin className="h-3 w-3" />
            </div>
          </div>

          {/* Center content */}
          <div className="relative z-10 text-center p-4 bg-background/80 backdrop-blur rounded-xl border border-border shadow-lg">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">Interactive Map</p>
            <p className="text-xs text-muted-foreground mt-1">Showing medical stores near you</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
