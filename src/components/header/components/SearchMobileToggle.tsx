"use client"

/**
 * 🏗️ SearchMobileToggle - Mobile search toggle button
 * @fileoverview Toggle button for mobile search functionality
 */

import React from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '../utils'
import { useHeader } from '../hooks'
import { ARIA_LABELS } from '../constants'

interface SearchMobileToggleProps {
  className?: string
}

/**
 * Mobile search toggle button component
 */
export const SearchMobileToggle: React.FC<SearchMobileToggleProps> = ({
  className
}) => {
  const { toggleMobileSearch } = useHeader()

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={cn('h-9 w-9', className)}
      onClick={toggleMobileSearch}
      aria-label={ARIA_LABELS.SEARCH_BUTTON}
    >
      <Search className="h-4 w-4" />
      <span className="sr-only">{ARIA_LABELS.SEARCH_BUTTON}</span>
    </Button>
  )
}
