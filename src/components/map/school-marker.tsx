'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { createSchoolIcon } from './custom-markers'

// Dynamic import for Leaflet components
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

interface SchoolMarkerProps {
  position: [number, number]
  school: {
    id: string
    name: string
    address: string
  }
  routeOrder?: number
  plannedPortions: number
  actualPortions?: number
  isFirst?: boolean
  isLast?: boolean
}

export function SchoolMarker({ 
  position, 
  school, 
  routeOrder, 
  plannedPortions, 
  actualPortions,
  isFirst = false,
  isLast = false 
}: SchoolMarkerProps) {
  const [icon, setIcon] = useState<any>(null)

  useEffect(() => {
    const loadIcon = async () => {
      let iconType: 'default' | 'start' | 'end' | 'route' = 'default'
      
      if (routeOrder !== undefined) {
        if (isFirst) iconType = 'start'
        else if (isLast) iconType = 'end'
        else iconType = 'route'
      }
      
      const createdIcon = await createSchoolIcon(iconType, routeOrder)
      setIcon(createdIcon)
    }
    
    loadIcon()
  }, [routeOrder, isFirst, isLast])

  if (!icon) return null

  return (
    <Marker position={position} icon={icon}>
      <Popup>
        <div className="p-3 min-w-[200px]">
          <div className="flex items-center mb-2">
            <h3 className="font-semibold text-base">{school.name}</h3>
            {isFirst && (
              <Badge variant="outline" className="ml-2 text-green-600 border-green-600">
                START
              </Badge>
            )}
            {isLast && (
              <Badge variant="outline" className="ml-2 text-red-600 border-red-600">
                END
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{school.address}</p>
          <div className="space-y-1 text-sm">
            {routeOrder !== undefined && (
              <div className="flex justify-between">
                <span className="font-medium">Urutan:</span> 
                <span className="text-blue-600 font-semibold">#{routeOrder}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium">Porsi Rencana:</span> 
              <span className="text-green-600 font-semibold">{plannedPortions}</span>
            </div>
            {actualPortions && (
              <div className="flex justify-between">
                <span className="font-medium">Porsi Aktual:</span> 
                <span className="text-orange-600 font-semibold">{actualPortions}</span>
              </div>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  )
}
