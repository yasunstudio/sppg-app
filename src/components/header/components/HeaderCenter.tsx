"use client"

/**
 * 🏗️ HeaderCenter - Center section component
 * @fileoverview Center section containing search functionality
 */

import React from 'react'
import { cn } from '../utils'
import type { HeaderCenterProps } from '../types/header.types'
import { SearchBar } from '.'

/**
 * Center section of header (search functionality)
 */
export const HeaderCenter: React.FC<HeaderCenterProps> = ({
  children,
  className,
  showSearch = true,
  searchPlaceholder
}) => {
  return (
    <div className={cn(
      'hidden lg:flex flex-1 max-w-md mx-4',
      className
    )}>
      {showSearch && (
        <SearchBar 
          placeholder={searchPlaceholder}
          className="w-full"
        />
      )}
      {children}
    </div>
  )
}
