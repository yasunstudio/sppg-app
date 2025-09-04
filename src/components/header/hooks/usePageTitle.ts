"use client"

/**
 * 🏗️ usePageTitle Hook - Page title management
 * @fileoverview Hook for managing dynamic page titles and breadcrumbs
 */

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import type { UsePageTitleReturn, BreadcrumbItem } from '../types/header.types'
import { generatePageTitle, generateBreadcrumbs } from '../utils'

/**
 * Hook for managing page titles and breadcrumbs
 */
export const usePageTitle = (): UsePageTitleReturn => {
  const pathname = usePathname()
  const [customTitle, setCustomTitleState] = useState<string | null>(null)
  const [customBreadcrumbs, setCustomBreadcrumbs] = useState<BreadcrumbItem[] | null>(null)

  // Generate title based on pathname or custom title
  const title = customTitle || generatePageTitle(pathname)
  
  // Generate breadcrumbs based on pathname or custom breadcrumbs
  const breadcrumbs = customBreadcrumbs || generateBreadcrumbs(pathname)

  // Set custom title
  const setCustomTitle = useCallback((newTitle: string) => {
    setCustomTitleState(newTitle)
  }, [])

  // Reset to auto-generated title
  const resetTitle = useCallback(() => {
    setCustomTitleState(null)
    setCustomBreadcrumbs(null)
  }, [])

  // Set custom breadcrumbs
  const setBreadcrumbs = useCallback((newBreadcrumbs: BreadcrumbItem[]) => {
    setCustomBreadcrumbs(newBreadcrumbs)
  }, [])

  // Reset custom states when pathname changes
  useEffect(() => {
    setCustomTitleState(null)
    setCustomBreadcrumbs(null)
  }, [pathname])

  // Update document title
  useEffect(() => {
    document.title = title === 'SPPG System' ? title : `${title} - SPPG System`
  }, [title])

  return {
    title,
    breadcrumbs,
    setCustomTitle,
    resetTitle
  }
}
