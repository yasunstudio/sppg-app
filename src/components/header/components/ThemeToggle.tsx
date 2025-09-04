"use client"

/**
 * 🏗️ ThemeToggle - Theme switcher component
 * @fileoverview Dropdown for switching between light, dark, and system themes
 */

import React from 'react'
import { Moon, Sun, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { NoSSR } from '@/components/ui/no-ssr'
import { cn } from '../utils'
import type { ThemeToggleProps } from '../types/header.types'
import { useHeaderTheme } from '../hooks'
import { THEME_OPTIONS, ARIA_LABELS } from '../constants'

/**
 * Theme toggle dropdown component
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  variant = "button"
}) => {
  const { theme, setTheme } = useHeaderTheme()

  if (variant === "inline") {
    // Simple inline toggle for compact layouts
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn('h-9 w-9', className)}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label={ARIA_LABELS.THEME_TOGGLE}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">{ARIA_LABELS.THEME_TOGGLE}</span>
      </Button>
    )
  }

  return (
    <NoSSR 
      fallback={
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Sun className="h-4 w-4" />
          <span className="sr-only">{ARIA_LABELS.THEME_TOGGLE}</span>
        </Button>
      }
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              'h-9 w-9 hover:bg-muted/50 dark:hover:bg-slate-700',
              className
            )}
            aria-label={ARIA_LABELS.THEME_TOGGLE}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{ARIA_LABELS.THEME_TOGGLE}</span>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-48 dark:bg-slate-800 dark:border-slate-600"
        >
          <DropdownMenuLabel className="dark:text-slate-100">
            Tema Tampilan
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="dark:border-slate-600" />
          
          {THEME_OPTIONS.map((option) => {
            const IconComponent = option.icon
            const isActive = theme === option.value
            
            return (
              <DropdownMenuItem 
                key={option.value}
                onClick={() => setTheme(option.value)} 
                className="flex items-center cursor-pointer hover:bg-muted/50 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <IconComponent className="mr-2 h-4 w-4" />
                <span className="flex-1">{option.label}</span>
                {isActive && (
                  <span className="ml-auto text-blue-600 dark:text-blue-400 font-medium">
                    ✓
                  </span>
                )}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </NoSSR>
  )
}
