"use client"

/**
 * 🏗️ useHeader Hook - Main composition hook
 * @fileoverview Main hook that combines all header functionality
 */

import { useState, useCallback, useMemo } from 'react'
import type { UseHeaderReturn, HeaderConfig } from '../types/header.types'
import { usePageTitle } from './usePageTitle'
import { useHeaderSearch } from './useHeaderSearch'
import { useHeaderTheme } from './useHeaderTheme'
import { useHeaderNotifications } from './useHeaderNotifications'
import { useHeaderUser } from './useHeaderUser'

/**
 * Default header configuration
 */
const DEFAULT_CONFIG: HeaderConfig = {
  showSearch: true,
  showNotifications: true,
  showThemeToggle: true,
  showUserMenu: true,
  showMobileMenu: true,
  searchPlaceholder: "Cari pengguna, sekolah, atau data..."
}

/**
 * Main composition hook for header functionality
 */
export const useHeader = (config: Partial<HeaderConfig> = {}): UseHeaderReturn => {
  // Merge default config with provided config
  const headerConfig = useMemo(() => ({
    ...DEFAULT_CONFIG,
    ...config
  }), [config])

  // Mobile search state
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  
  // Compose all header hooks
  const pageTitle = usePageTitle()
  const search = useHeaderSearch()
  const theme = useHeaderTheme()
  const notifications = useHeaderNotifications()
  const user = useHeaderUser()

  // Mobile search handlers
  const toggleMobileSearch = useCallback(() => {
    setMobileSearchOpen(prev => !prev)
  }, [])

  // Mobile sidebar handler
  const handleMobileSidebarToggle = useCallback(() => {
    // This will be passed down from the layout component
    console.log('Mobile sidebar toggle requested')
  }, [])

  // Search handler
  const handleSearch = useCallback((query: string) => {
    search.handleSearch(query)
    // Close mobile search after searching
    if (mobileSearchOpen) {
      setMobileSearchOpen(false)
    }
  }, [search, mobileSearchOpen])

  return {
    // State
    mobileSearchOpen,
    searchQuery: search.query,
    
    // Handlers
    toggleMobileSearch,
    handleSearch,
    handleMobileSidebarToggle,
    
    // Data
    pageTitle: pageTitle.title,
    notificationCount: notifications.count,
    user: user.user,
    
    // Config
    config: headerConfig
  }
}
