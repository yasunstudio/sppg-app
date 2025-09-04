"use client"

/**
 * 🏗️ useHeaderTheme Hook - Theme management
 * @fileoverview Hook for managing theme functionality
 */

import { useCallback, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import type { UseHeaderThemeReturn, ThemeMode } from '../types/header.types'

/**
 * Hook for managing theme functionality
 */
export const useHeaderTheme = (): UseHeaderThemeReturn => {
  const { theme, setTheme: setNextTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure hook is mounted (for SSR)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Set theme with validation
  const setTheme = useCallback((newTheme: string) => {
    const validThemes: ThemeMode[] = ['light', 'dark', 'system']
    if (validThemes.includes(newTheme as ThemeMode)) {
      setNextTheme(newTheme)
    }
  }, [setNextTheme])

  // Toggle between light and dark theme
  const toggleTheme = useCallback(() => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('light')
    } else {
      // If system theme, toggle to opposite of current system theme
      const currentSystemTheme = systemTheme || 'light'
      setTheme(currentSystemTheme === 'light' ? 'dark' : 'light')
    }
  }, [theme, systemTheme, setTheme])

  // Computed states
  const isDark = mounted ? theme === 'dark' || (theme === 'system' && systemTheme === 'dark') : false
  const isSystem = mounted ? theme === 'system' : false

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark,
    isSystem
  }
}
