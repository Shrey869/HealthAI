import { Star, MapPin, Building2, Navigation, Heart, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

export interface Pharmacy {
  id: string
  name: string
  type: string
  rating: number
  reviews: number
  hospital: string
  distance: string
  image?: string
  available: boolean
  lat?: number
  lng?: number
}

interface PharmacyCardProps {
  pharmacy: Pharmacy
  onSave?: () => void
}

export function PharmacyCard({ pharmacy, onSave }: PharmacyCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02, rotateY: 5 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="perspective-1000"
    >
      <Card className="overflow-hidden glass shadow-3d border-white/10 hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <motion.div whileHover={{ scale: 1.1, rotate: 10 }}>
            <Avatar className="h-16 w-16 rounded-xl shadow-lg shadow-primary/10">
              <AvatarImage src={pharmacy.image} alt={pharmacy.name} className="object-cover" />
              <AvatarFallback className="rounded-xl bg-primary text-primary-foreground text-lg font-semibold flex items-center justify-center">
                <Store className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground truncate">{pharmacy.name}</h3>
                <p className="text-sm text-primary font-medium">{pharmacy.type}</p>
              </div>
              <div className="flex items-center gap-1">
                {pharmacy.available ? (
                  <span className="shrink-0 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                    Open
                  </span>
                ) : (
                  <span className="shrink-0 text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full">
                    Closed
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 mt-2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-foreground">{pharmacy.rating}</span>
              <span className="text-sm text-muted-foreground">({pharmacy.reviews} reviews)</span>
            </div>

            <div className="flex flex-col gap-1 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 shrink-0" />
                <span className="truncate">{pharmacy.hospital}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{pharmacy.distance}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-4 pt-4 border-t border-border">
          <Button variant="outline" className="flex-1" size="sm" onClick={onSave}>
            <Heart className="h-4 w-4 mr-2" />
            Save
          </Button>
          {pharmacy.lat && pharmacy.lng ? (
            <Button className="flex-1" size="sm" asChild>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lng}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </a>
            </Button>
          ) : (
            <Button className="flex-1" size="sm" asChild>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${pharmacy.name} ${pharmacy.hospital !== 'Unknown Address' ? pharmacy.hospital : ''}`.trim())}`}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
    </motion.div>
  )
}
