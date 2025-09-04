"use client"

/**
 * 🏗️ MobileMenuToggle - Mobile menu toggle button
 * @fileoverview Toggle button for mobile sidebar menu
 */

import React from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '../utils'
import type { MobileMenuToggleProps } from '../types/header.types'
import { ARIA_LABELS } from '../constants'

/**
 * Mobile menu toggle button component
 */
export const MobileMenuToggle: React.FC<MobileMenuToggleProps> = ({
  isOpen = false,
  onToggle,
  className
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('h-9 w-9', className)}
      onClick={onToggle}
      aria-label={ARIA_LABELS.MOBILE_MENU_TOGGLE}
    >
      {isOpen ? (
        <X className="h-4 w-4" />
      ) : (
        <Menu className="h-4 w-4" />
      )}
      <span className="sr-only">{ARIA_LABELS.MOBILE_MENU_TOGGLE}</span>
    </Button>
  )
}
