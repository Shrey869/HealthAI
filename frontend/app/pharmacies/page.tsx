"use client"

import { useState, useEffect } from "react"
import { Search, SlidersHorizontal, MapPin, List, Grid, Loader2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PharmacyCard, type Pharmacy } from "@/components/pharmacy-card"
import dynamic from "next/dynamic"
import { useGeolocation } from "@/hooks/use-geolocation"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Leaflet relies on `window`, so it must be dynamically imported without SSR
const OsmMapView = dynamic(() => import("@/components/osm-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg border border-border bg-muted flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
    </div>
  ),
})

const storeTypes = [
  "All Types",
  "Pharmacy",
  "24/7 Medical Store",
  "Clinic Dispensary",
  "Wholesale Pharmacy",
]

export default function PharmaciesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("All Types")
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")
  const [showMap, setShowMap] = useState(true)
  const [radius, setRadius] = useState("15")
  const [pharmacies, setPharmacies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { location: userLocation, loading: geoLoading } = useGeolocation()

  // Fetch pharmacies from API
  useEffect(() => {
    const fetchPharmacies = async () => {
      if (geoLoading) return;

      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.set("search", searchQuery)
        if (selectedType !== "All Types") params.set("type", selectedType)
        if (userLocation) {
          params.set("lat", String(userLocation.lat))
          params.set("lng", String(userLocation.lng))
          // Search for medical stores within chosen radius
          params.set("radius", radius)
        }

        const res = await fetch(`/api/pharmacies?${params.toString()}`)
        const data = await res.json()

        if (data.success) {
          setPharmacies(data.data)
        } else {
          throw new Error(data.error)
        }
      } catch (error) {
        console.error("Failed to fetch pharmacies:", error)
        toast.error("Failed to load medical stores. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    // Debounce search
    const timer = setTimeout(fetchPharmacies, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, selectedType, userLocation, radius, geoLoading])

  const handleSavePharmacy = async (pharmacy: any) => {
    try {
      const res = await fetch(`/api/pharmacies/${pharmacy.id}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pharmacy)
      })
      const data = await res.json()

      if (res.ok) {
        toast.success("Medical store saved to your favorites!")
      } else if (res.status === 401) {
        toast.error("Please sign in to save stores")
      } else {
        toast.info(data.error || "Could not save store")
      }
    } catch {
      toast.error("Failed to save store")
    }
  }

  // Format pharmacies for display
  const displayPharmacies: Pharmacy[] = pharmacies.map((p: any) => ({
    id: p.id,
    name: p.name,
    type: p.type,
    rating: p.rating,
    reviews: p.reviews,
    hospital: p.hospital,
    distance: (p.distance !== undefined && p.distance !== null) ? `${p.distance.toFixed(1)} km` : "N/A",
    available: p.available,
  }))

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-8 md:py-12 perspective-1000">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4"
        >
          {/* Header */}
          <div className="mb-10 text-center md:text-left">
            <motion.h1 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-4xl md:text-6xl font-black text-foreground tracking-tight"
            >
              Medical <span className="text-primary italic">Store</span> Locator
            </motion.h1>
            <p className="mt-3 text-muted-foreground text-lg max-w-2xl">
              Precision geolocation for pharmacies and critical medical hubs in your vicinity.
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-10 glass shadow-3d border-white/20 transform-3d">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search medical stores, brands, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full md:w-48">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Store Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {storeTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={radius} onValueChange={setRadius}>
                  <SelectTrigger className="w-full md:w-32">
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 km</SelectItem>
                    <SelectItem value="10">10 km</SelectItem>
                    <SelectItem value="15">15 km</SelectItem>
                    <SelectItem value="25">25 km</SelectItem>
                    <SelectItem value="50">50 km</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button
                    variant={showMap ? "default" : "outline"}
                    size="icon"
                    onClick={() => setShowMap(!showMap)}
                    className="shrink-0"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="shrink-0"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="shrink-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Map */}
            {showMap && (
              <div className="lg:w-1/2">
                <OsmMapView
                  pharmacies={pharmacies.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    type: p.type,
                    hospital: p.hospital,
                    rating: p.rating,
                    lat: p.lat,
                    lng: p.lng,
                    available: p.available,
                  }))}
                  userLocation={userLocation}
                  className="sticky top-24"
                />
              </div>
            )}

            {/* Pharmacies List */}
            <div className={showMap ? "lg:w-1/2" : "w-full"}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  {loading ? "Loading..." : `${displayPharmacies.length} stores found`}
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className={`grid gap-4 ${
                    viewMode === "grid" && !showMap 
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                      : "grid-cols-1"
                  }`}>
                    {displayPharmacies.map(pharmacy => (
                      <PharmacyCard
                        key={pharmacy.id}
                        pharmacy={pharmacy}
                        onSave={() => handleSavePharmacy(pharmacy)}
                      />
                    ))}
                  </div>

                  {displayPharmacies.length === 0 && (
                    <Card className="border-border/50">
                      <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">No stores found matching your criteria</p>
                        <Button
                          variant="link"
                          onClick={() => {
                            setSearchQuery("")
                            setSelectedType("All Types")
                          }}
                        >
                          Clear filters
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
