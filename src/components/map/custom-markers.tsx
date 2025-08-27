'use client'

import { useState, useEffect } from 'react'

// Lazy load Leaflet untuk mencegah SSR error
let L: any = null

// Initialize Leaflet di client-side
const initLeaflet = async () => {
  if (typeof window !== 'undefined' && !L) {
    L = (await import('leaflet')).default
  }
  return L
}

// Custom marker icons untuk sekolah
export const createSchoolIcon = async (type: 'default' | 'start' | 'end' | 'route', routeNumber?: number) => {
  const leaflet = await initLeaflet()
  if (!leaflet) return null
  const iconColors = {
    default: '#3b82f6', // blue
    start: '#10b981',   // green  
    end: '#ef4444',     // red
    route: '#8b5cf6'    // purple
  }

  const iconSizes = {
    default: [32, 32],
    start: [40, 40],
    end: [40, 40], 
    route: [36, 36]
  }

  const color = iconColors[type]
  const [width, height] = iconSizes[type]

  // SVG icon untuk sekolah dengan design yang lebih baik
  const schoolSvg = `
    <svg width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow circle -->
      <circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.2)" transform="translate(1,1)"/>
      
      <!-- Main circle background -->
      <circle cx="12" cy="12" r="11" fill="white" stroke="${color}" stroke-width="2"/>
      
      <!-- School building icon -->
      <g transform="scale(0.8) translate(2.4,2.4)">
        <!-- Building base -->
        <rect x="4" y="8" width="16" height="10" fill="${color}" rx="1"/>
        
        <!-- Roof -->
        <path d="M2 9L12 3L22 9L20 8L12 4L4 8Z" fill="${color}"/>
        
        <!-- Windows -->
        <rect x="6" y="10" width="2" height="2" fill="white" rx="0.5"/>
        <rect x="10" y="10" width="2" height="2" fill="white" rx="0.5"/>
        <rect x="14" y="10" width="2" height="2" fill="white" rx="0.5"/>
        <rect x="18" y="10" width="2" height="2" fill="white" rx="0.5"/>
        
        <!-- Door -->
        <rect x="10" y="13" width="4" height="5" fill="white" rx="1"/>
        <circle cx="12.5" cy="15.5" r="0.3" fill="${color}"/>
      </g>
      
      ${type === 'start' ? `
        <!-- Start flag -->
        <circle cx="20" cy="4" r="3" fill="#10b981" stroke="white" stroke-width="1"/>
        <text x="20" y="6" text-anchor="middle" fill="white" font-size="8" font-weight="bold">S</text>
      ` : ''}
      
      ${type === 'end' ? `
        <!-- End flag -->
        <circle cx="20" cy="4" r="3" fill="#ef4444" stroke="white" stroke-width="1"/>
        <text x="20" y="6" text-anchor="middle" fill="white" font-size="8" font-weight="bold">E</text>
      ` : ''}
      
      ${type === 'route' ? `
        <!-- Route number circle -->
        <circle cx="18" cy="6" r="3" fill="${color}" stroke="white" stroke-width="1"/>
        <text x="18" y="8" text-anchor="middle" fill="white" font-size="6" font-weight="bold">${routeNumber || '•'}</text>
      ` : ''}
    </svg>
  `

  return leaflet.divIcon({
    html: schoolSvg,
    className: 'custom-marker-icon',
    iconSize: [width, height],
    iconAnchor: [width / 2, height],
    popupAnchor: [0, -height + 5]
  })
}

// Icon untuk depot/pusat distribusi
export const createDepotIcon = async () => {
  const leaflet = await initLeaflet()
  if (!leaflet) return null
  const depotSvg = `
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.3)" transform="translate(1,1)"/>
      
      <!-- Main background -->
      <circle cx="12" cy="12" r="11" fill="white" stroke="#f59e0b" stroke-width="3"/>
      
      <!-- Warehouse/Depot icon -->
      <path d="M21 8L12 3L3 8V18C3 18.55 3.45 19 4 19H20C20.55 19 21 18.55 21 18V8Z" 
            fill="#f59e0b" transform="scale(0.7) translate(3,2)"/>
      
      <!-- Truck icon in corner -->
      <path d="M3 17H6L7 19H9L8 17H12V15H3V17Z" fill="#f59e0b" transform="scale(0.4) translate(24,18)"/>
    </svg>
  `

  return leaflet.divIcon({
    html: depotSvg,
    className: 'custom-depot-icon',
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -39]
  })
}
