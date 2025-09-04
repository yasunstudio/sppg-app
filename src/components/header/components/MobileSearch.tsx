"use client"

/**
 * 🏗️ MobileSearch - Mobile search overlay
 * @fileoverview Mobile search functionality with overlay
 */

import React from 'react'
import { cn } from '../utils'
import { SearchBar } from './SearchBar'
import { useHeader } from '../hooks'

/**
 * Mobile search overlay component
 */
export const MobileSearch: React.FC = () => {
  const { mobileSearchOpen } = useHeader()

  if (!mobileSearchOpen) return null

  return (
    <div className="sm:hidden pb-3 pt-2 px-4 sm:px-6">
      <SearchBar 
        showMobileSearch={true}
        className="w-full"
      />
    </div>
  )
}
