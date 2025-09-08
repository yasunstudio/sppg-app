"use client"

/**
 * 🏗️ SidebarToggle - Sidebar collapse/expand toggle component
 * @fileoverview Centralized toggle button for sidebar collapse/expand functionality
 */

import React from 'react'
import { cn } from '../utils'
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

interface SidebarToggleProps {
  isCollapsed: boolean
  onToggle: () => void
  className?: string
  variant?: 'default' | 'icon-only' | 'with-text'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Sidebar toggle button component
 * Centralized component to avoid duplication between header and sidebar
 */
export const SidebarToggle: React.FC<SidebarToggleProps> = ({
  isCollapsed,
  onToggle,
  className,
  variant = 'default',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex items-center justify-center rounded-xl transition-all duration-200 flex-shrink-0",
        "hover:bg-accent/70 hover:text-accent-foreground hover:shadow-md hover:scale-105",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
        "active:scale-95 border border-border/40 bg-card/50 backdrop-blur-sm",
        "text-muted-foreground hover:text-foreground",
        sizeClasses[size],
        className
      )}
      title={isCollapsed ? 'Buka Sidebar (Expand)' : 'Tutup Sidebar (Collapse)'}
      aria-label={isCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
    >
      {variant === 'icon-only' ? (
        <Menu className={cn("transition-all duration-200", iconSizes[size])} />
      ) : variant === 'with-text' ? (
        <>
          {isCollapsed ? (
            <PanelLeftOpen className={cn("transition-all duration-200", iconSizes[size])} />
          ) : (
            <PanelLeftClose className={cn("transition-all duration-200", iconSizes[size])} />
          )}
          {!isCollapsed && (
            <span className="ml-2 text-sm font-medium hidden sm:inline">
              Collapse
            </span>
          )}
        </>
      ) : (
        // Default: Show appropriate icon based on collapsed state
        isCollapsed ? (
          <PanelLeftOpen className={cn("transition-all duration-200", iconSizes[size])} />
        ) : (
          <PanelLeftClose className={cn("transition-all duration-200", iconSizes[size])} />
        )
      )}
    </button>
  )
}
