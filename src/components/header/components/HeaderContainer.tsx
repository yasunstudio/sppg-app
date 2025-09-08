"use client"

/**
 * 🏗️ HeaderContainer - Main container component
 * @fileoverview Main container wrapper for header content
 */

import React from 'react'
import { cn } from '../utils'
import type { HeaderSectionProps } from '../types/header.types'

interface HeaderContainerProps extends HeaderSectionProps {
  variant?: 'default' | 'compact' | 'minimal'
  position?: 'sticky' | 'fixed' | 'static'
}

/**
 * Main header container component
 */
export const HeaderContainer: React.FC<HeaderContainerProps> = ({
  children,
  className,
  variant = 'default',
  position = 'sticky'
}) => {
  return (
    <header 
      className={cn(
        // Base styles - Header should be sticky, not scroll with content
        'sticky top-0 z-40 w-full border-b border-border/30',
        'bg-gradient-to-r from-background/95 via-background/98 to-background/95',
        'backdrop-blur-lg supports-[backdrop-filter]:bg-background/60',
        'dark:from-slate-900/95 dark:via-slate-900/98 dark:to-slate-900/95',
        'dark:border-slate-700/50',
        'shadow-lg shadow-black/5 dark:shadow-black/20',
        'transition-all duration-300',
        
        // Position variants
        {
          'sticky top-0': position === 'sticky',
          'relative': position === 'static',
          'fixed top-0': position === 'fixed'
        },
        
        // Height variants
        {
          'h-16': variant === 'default',
          'h-14': variant === 'compact',
          'h-12': variant === 'minimal'
        },
        
        className
      )}
    >
      <div className={cn(
        'flex items-center justify-between relative m-0 w-full',
        {
          'h-16 pl-0 pr-4 sm:pr-6': variant === 'default',
          'h-14 pl-0 pr-4 sm:pr-6': variant === 'compact', 
          'h-12 pl-0 pr-4 sm:pr-6': variant === 'minimal'
        }
      )}>
        {/* Subtle gradient accent bar */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        {children}
      </div>
    </header>
  )
}
