export interface OsmPlaceResult {
  place_id: string
  name: string
  formatted_address?: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  amenity?: string
  healthcare?: string
  opening_hours?: string
}

// Since OSM Overpass is powerful but complex, we use a structured Overpass QL query.
// This queries for nodes tagged as amenity=pharmacy
export async function searchPlacesOSM(
  query: string,
  lat?: number,
  lng?: number,
  radiusStr?: string
): Promise<OsmPlaceResult[]> {
  
  // Use Overpass API (public read-only instance)
  const OVERPASS_URL = "https://overpass-api.de/api/interpreter"
  
  let radius = 10000 // 10km Default
  if (radiusStr) radius = parseInt(radiusStr)

  // Default coordinate is New Delhi if not provided so we pull a lot of results
  const centerLat = lat || 28.6139
  const centerLng = lng || 77.2090

  // Build the Overpass Query Language (QL) string
  // We search for nodes/ways that are healthcare-related within a radius around the coordinate.
  // We also try to filter by the user's text query using regex on the name tag.
  
  let nameRegex = ""
  if (query && query.toLowerCase() !== "pharmacy" && query.toLowerCase() !== "medical store" && query.toLowerCase() !== "store") {
    // Escape and format query for regex (case insensitive)
    nameRegex = `~"${query.replace(/[^a-zA-Z0-9 ]/g, "").split(" ").join("|")}"`;
  }

  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["amenity"~"^(pharmacy|hospital|clinic)$"]${nameRegex ? `["name"${nameRegex},i]` : ""}(around:${radius},${centerLat},${centerLng});
      way["amenity"~"^(pharmacy|hospital|clinic)$"]${nameRegex ? `["name"${nameRegex},i]` : ""}(around:${radius},${centerLat},${centerLng});
      node["healthcare"~"^(pharmacy|hospital|clinic)$"]${nameRegex ? `["name"${nameRegex},i]` : ""}(around:${radius},${centerLat},${centerLng});
      way["healthcare"~"^(pharmacy|hospital|clinic)$"]${nameRegex ? `["name"${nameRegex},i]` : ""}(around:${radius},${centerLat},${centerLng});
      node["shop"~"^(chemist|medical_supply)$"]${nameRegex ? `["name"${nameRegex},i]` : ""}(around:${radius},${centerLat},${centerLng});
      way["shop"~"^(chemist|medical_supply)$"]${nameRegex ? `["name"${nameRegex},i]` : ""}(around:${radius},${centerLat},${centerLng});
    );
    out center 150;
  `

  try {
    const response = await fetch(OVERPASS_URL, {
      method: "POST",
      body: `data=${encodeURIComponent(overpassQuery)}`,
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "HealthAI/1.0 (Contact: admin@example.com)"
      }
    })

    if (!response.ok) {
      console.error("Overpass API failed:", response.status, response.statusText)
      return []
    }

    const data = await response.json()
    
    // Convert OSM elements to our Place format
    if (!data.elements || !Array.isArray(data.elements)) {
      console.warn("Overpass API returned no elements:", data)
      return []
    }

    const results: OsmPlaceResult[] = data.elements
      .filter((el: any) => el.tags && el.tags.name) // MUST have a name
      .map((el: any) => {
        // Ways have a center coordinate, Nodes have lat/lon directly
        const elementLat = Number(el.lat || el.center?.lat || 0)
        const elementLng = Number(el.lon || el.center?.lon || 0)
        
        let address = "Unknown Address"
        if (el.tags["addr:street"] && el.tags["addr:city"]) {
          address = `${el.tags["addr:street"]}, ${el.tags["addr:city"]}`
        } else if (el.tags["addr:city"]) {
          address = el.tags["addr:city"]
        }

        return {
          place_id: el.id.toString(),
          name: el.tags.name,
          formatted_address: address,
          amenity: el.tags.amenity || el.tags.healthcare || "Healthcare",
          opening_hours: el.tags.opening_hours,
          geometry: {
            location: {
              lat: elementLat,
              lng: elementLng,
            }
          }
        }
      })

    return results
  } catch (error) {
    console.error("OSM Places Error:", error)
    return []
  }
}
