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
        // Base styles
        'z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'dark:bg-slate-900/95 dark:border-slate-700',
        'shadow-sm transition-shadow duration-200',
        
        // Position variants
        {
          'sticky top-0': position === 'sticky',
          'fixed top-0': position === 'fixed',
          'relative': position === 'static'
        },
        
        // Height variants
        {
          'h-14': variant === 'default',
          'h-12': variant === 'compact',
          'h-10': variant === 'minimal'
        },
        
        className
      )}
    >
      <div className={cn(
        'flex items-center justify-between px-4 sm:px-6 lg:px-8',
        {
          'h-14': variant === 'default',
          'h-12': variant === 'compact',
          'h-10': variant === 'minimal'
        }
      )}>
        {children}
      </div>
    </header>
  )
}
