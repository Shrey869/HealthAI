"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { MapPin, Star, Building2, MapPinIcon } from "lucide-react"

// Fix Leaflet's default icon path issues in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png"
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"

const defaultIcon = new L.Icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

// A custom pulsing blue dot for the user's location
const userIcon = new L.DivIcon({
  className: 'bg-transparent border-none',
  html: `
    <div class="relative flex items-center justify-center w-8 h-8">
      <div class="absolute inline-flex w-full h-full rounded-full opacity-50 animate-ping bg-blue-500"></div>
      <div class="relative inline-flex w-4 h-4 rounded-full border-2 border-white bg-blue-600 shadow-sm"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

interface PharmacyMarker {
  id: string
  name: string
  type: string
  hospital: string
  rating: number
  lat: number
  lng: number
  available: boolean
}

interface OsmMapViewProps {
  pharmacies: PharmacyMarker[]
  userLocation: { lat: number; lng: number } | null
  className?: string
}

// Component to dynamically update map bounds when pharmacies change
function MapController({ pharmacies, userLocation }: { pharmacies: PharmacyMarker[], userLocation: { lat: number, lng: number } | null }) {
  const map = useMap()

  useEffect(() => {
    if (pharmacies.length > 0) {
      const bounds = L.latLngBounds(pharmacies.map(p => [p.lat, p.lng]))
      if (userLocation) {
        bounds.extend([userLocation.lat, userLocation.lng])
      }
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
    } else if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 13)
    }
  }, [map, pharmacies, userLocation])

  return null
}

export default function OsmMapView({ pharmacies, userLocation, className = "" }: OsmMapViewProps) {
  const [mounted, setMounted] = useState(false)
  const [activePharmacy, setActivePharmacy] = useState<PharmacyMarker | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`w-full h-[600px] rounded-xl overflow-hidden shadow-lg border border-border bg-muted flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground animate-pulse">Loading Map...</p>
      </div>
    )
  }

  // Default to center of US if no location
  const center = userLocation || { lat: 39.8283, lng: -98.5795 }

  return (
    <div className={`w-full h-[600px] rounded-xl overflow-hidden shadow-lg border border-border relative z-0 ${className}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={userLocation ? 13 : 4}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController pharmacies={pharmacies} userLocation={userLocation} />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="text-sm font-medium">You are here</div>
            </Popup>
          </Marker>
        )}

        {pharmacies.map((pharmacy) => (
          <Marker
            key={pharmacy.id}
            position={[pharmacy.lat, pharmacy.lng]}
            icon={defaultIcon}
            eventHandlers={{
              click: () => setActivePharmacy(pharmacy),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-1 min-w-[200px]">
                <h3 className="font-semibold text-base mb-1">{pharmacy.name}</h3>
                <p className="text-primary text-sm font-medium mb-2">{pharmacy.type}</p>

                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MapPinIcon className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="leading-snug">{pharmacy.hospital}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-foreground">{pharmacy.rating.toFixed(1)}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                    <div className={`h-2 w-2 rounded-full ${pharmacy.available ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={pharmacy.available ? 'text-green-600 font-medium' : 'text-red-500'}>
                      {pharmacy.available ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
