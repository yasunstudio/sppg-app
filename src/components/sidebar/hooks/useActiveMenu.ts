"use client"

import { useMemo } from "react"
import type { MenuType } from "../types/sidebar.types"

export const useActiveMenu = (pathname: string) => {
  // Centralized active menu detection
  const getActiveMenuType = (path: string): MenuType | null => {
    if (path.startsWith("/dashboard/production") || 
        path.startsWith("/dashboard/production-plans")) {
      return 'production'
    }
    if (path.startsWith("/dashboard/menu-planning")) {
      return 'menuPlanning'
    }
    if (path.startsWith("/dashboard/distributions") || 
        path.startsWith("/dashboard/distribution")) {
      return 'distribution'
    }
    if (path.startsWith("/dashboard/monitoring") || 
        path.startsWith("/dashboard/performance")) {
      return 'monitoring'
    }
    if (path.startsWith("/dashboard/quality") || 
        path.startsWith("/dashboard/quality-checks") ||
        path.startsWith("/dashboard/quality-checkpoints") ||
        path.startsWith("/dashboard/quality-standards")) {
      return 'quality'
    }
    if (path.startsWith("/dashboard/schools") || 
        path.startsWith("/dashboard/students") ||
        path.startsWith("/dashboard/classes") ||
        path.startsWith("/dashboard/raw-materials") ||
        path.startsWith("/dashboard/items") ||
        path.startsWith("/dashboard/suppliers") ||
        path.startsWith("/dashboard/vehicles") ||
        path.startsWith("/dashboard/drivers") ||
        path.startsWith("/dashboard/recipes") ||
        path.startsWith("/dashboard/quality-standards")) {
      return 'dataMaster'
    }
    if (path.startsWith("/dashboard/purchase-orders") || 
        path.startsWith("/dashboard/inventory") ||
        path.startsWith("/dashboard/resource-usage")) {
      return 'procurement'
    }
    if (path.startsWith("/dashboard/users") || 
        path.startsWith("/dashboard/roles") ||
        path.startsWith("/dashboard/user-roles") ||
        path.startsWith("/dashboard/system-config") ||
        path.startsWith("/dashboard/audit-logs") ||
        path.startsWith("/dashboard/admin")) {
      return 'system'
    }
    return null
  }

  // Memoize active menu detection for performance
  const activeMenuType = useMemo(() => {
    return getActiveMenuType(pathname)
  }, [pathname])

  // Check if there's any active menu
  const hasActiveMenu = activeMenuType !== null

  // Check if specific menu type has active submenu
  const hasActiveSubmenu = (menuType: MenuType): boolean => {
    return activeMenuType === menuType
  }

  // Check if path matches a specific pattern
  const matchesPath = (pathPattern: string): boolean => {
    return pathname.startsWith(pathPattern)
  }

  // Get breadcrumb info for current path
  const getBreadcrumbInfo = () => {
    if (!activeMenuType) return null
    
    const menuLabels: Record<MenuType, string> = {
      production: 'Produksi',
      menuPlanning: 'Perencanaan Menu',
      distribution: 'Distribusi',
      monitoring: 'Monitoring & Laporan',
      quality: 'Manajemen Kualitas',
      dataMaster: 'Data Master',
      procurement: 'Pengadaan & Inventori',
      system: 'Manajemen Sistem'
    }

    return {
      menuType: activeMenuType,
      menuLabel: menuLabels[activeMenuType],
      currentPath: pathname
    }
  }

  // Professional active menu prevention logic
  const canCollapseMenu = (menuType: MenuType, forceValue?: boolean): boolean => {
    // Professional Rule: Never collapse active menu unless explicitly forced
    if (activeMenuType === menuType && forceValue === undefined) {
      return false
    }
    return true
  }

  return {
    // Core detection
    activeMenuType,
    hasActiveMenu,
    
    // Helpers
    hasActiveSubmenu,
    matchesPath,
    canCollapseMenu,
    getBreadcrumbInfo,
    
    // Utils
    getActiveMenuType
  }
}
