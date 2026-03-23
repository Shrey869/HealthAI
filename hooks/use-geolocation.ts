"use client"

import { useState, useEffect } from "react"

interface GeolocationState {
  location: { lat: number; lng: number } | null
  error: string | null
  loading: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        location: null,
        error: "Geolocation is not supported by your browser",
        loading: false,
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
          loading: false,
        })
      },
      (error) => {
        setState({
          location: null,
          error: error.message,
          loading: false,
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    )
  }, [])

  return state
}
