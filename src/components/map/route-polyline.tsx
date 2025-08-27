'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import untuk mencegah SSR error
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false })

interface RoutePolylineProps {
  waypoints: [number, number][]
  color?: string
  weight?: number
  opacity?: number
}

interface RouteData {
  coordinates: [number, number][]
  distance: number
  duration: number
}

export function RoutePolyline({ 
  waypoints, 
  color = '#3b82f6', 
  weight = 4, 
  opacity = 0.8 
}: RoutePolylineProps) {
  const [routeData, setRouteData] = useState<RouteData | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Ensure component only renders on client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || waypoints.length < 2) return

    const fetchRoute = async () => {
      setLoading(true)
      console.log('🗺️ Fetching route for waypoints:', waypoints)
      
      try {
        // Format koordinat untuk OSRM API (longitude,latitude)
        const coordinates = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(';')
        const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
        
        console.log('🚗 OSRM URL:', url)
        
        // Gunakan OSRM Demo Server (gratis untuk development)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('📡 OSRM Response:', data)
        
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0]
          const routeCoordinates = route.geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
          )
          
          console.log(`✅ Route found: ${routeCoordinates.length} points, ${(route.distance/1000).toFixed(1)}km, ${(route.duration/60).toFixed(0)}min`)
          
          setRouteData({
            coordinates: routeCoordinates,
            distance: route.distance,
            duration: route.duration
          })
        } else {
          throw new Error('No routes found')
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.warn('⏰ Routing request timeout, using direct line')
        } else {
          console.warn('⚠️ Routing service unavailable, using direct line:', error)
        }
        // Fallback ke garis lurus jika routing gagal
        setRouteData({
          coordinates: waypoints,
          distance: 0,
          duration: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRoute()
  }, [mounted, waypoints])

  // Don't render anything until mounted on client
  if (!mounted) {
    return null
  }

  if (!routeData) {
    // Tampilkan garis lurus sementara sambil loading dengan animasi
    return (
      <Polyline
        positions={waypoints}
        pathOptions={{
          color: loading ? '#94a3b8' : color,
          weight: weight,
          opacity: loading ? 0.5 : opacity,
          dashArray: loading ? '5, 10' : '2, 8',
          lineCap: 'round'
        }}
        className={loading ? 'animate-pulse' : ''}
      />
    )
  }

  return (
    <>
      {/* Background line untuk effect shadow */}
      <Polyline
        positions={routeData.coordinates}
        pathOptions={{
          color: '#000000',
          weight: weight + 2,
          opacity: 0.3
        }}
      />
      
      {/* Main route line */}
      <Polyline
        positions={routeData.coordinates}
        pathOptions={{
          color: color,
          weight: weight,
          opacity: opacity,
          lineCap: 'round',
          lineJoin: 'round'
        }}
      />
      
      {/* Animated overlay untuk menunjukkan arah */}
      <Polyline
        positions={routeData.coordinates}
        pathOptions={{
          color: '#ffffff',
          weight: 1,
          opacity: 0.8,
          dashArray: '10, 20',
          dashOffset: '0'
        }}
        className="animate-pulse"
      />
    </>
  )
}
